import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTipoPagoDto, TipoPagoPaginationFiltersDto, UpdateTipoPagoDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoPago } from './entities/tipo_pago.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { camelToSnakeCase, convertToLikeParameter, transformToAscOrDesc } from '../../util';
import { PaginationResponseDto } from '../../commons';

@Injectable()
export class TipoPagoService {
  constructor(
    @InjectRepository(TipoPago)
    private readonly tipoPagoRepository: Repository<TipoPago>,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(createTipoPagoDto: CreateTipoPagoDto): Promise<TipoPago> {
    let queryRunner: QueryRunner;
    let response: TipoPago;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      response = await queryRunner.manager.save(
        TipoPago.fromCreateDto(createTipoPagoDto),
      );
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return response;
  }

  async findAll(
    tipoPagoPaginationFiltersDto: TipoPagoPaginationFiltersDto,
  ): Promise<PaginationResponseDto<TipoPago>> {
    const {
      size = 10,
      page = 0,
      sort = 'tpaNombre,asc',
      search = '',
    } = tipoPagoPaginationFiltersDto;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or lower(tp.tpa_nombre) like :nombre)
    `;

    const queryBuilder =
      await this.tipoPagoRepository.createQueryBuilder('tp');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `tp.${camelToSnakeCase(splitSortValues[0])}`,
        transformToAscOrDesc(splitSortValues[1]),
      )
      .limit(size)
      .offset(skip)
      .getMany();

    const totalElements = await queryBuilder
      .select('count(*)')
      .where(filters, parameters)
      .getCount();

    const totalPages = Math.ceil(totalElements / size);
    const response = new PaginationResponseDto<TipoPago>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(tpaCodigo: string): Promise<TipoPago> {
    const tipoPago = await this.tipoPagoRepository.findOneBy({ tpaCodigo });
    if (!tipoPago) {
      throw new BadRequestException(
        `No existe tipo pago con el código ${tpaCodigo}`,
      );
    }

    return tipoPago;
  }

  async update(tpaCodigo: string, updateTipoPagoDto: UpdateTipoPagoDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(tpaCodigo);
      updateTipoPagoDto.tpaCodigo = tpaCodigo;
      const tipoPago = TipoPago.fromUpdateDto(updateTipoPagoDto);
      await queryRunner.manager.save(tipoPago);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(tpaCodigo: string) {
    const tipoPago = await this.findOne(tpaCodigo);
    await this.tipoPagoRepository.remove(tipoPago);
  }
}
