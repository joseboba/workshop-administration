import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMarcaHerramientaDto } from './dto/create-marca_herramienta.dto';
import { UpdateMarcaHerramientaDto } from './dto/update-marca_herramienta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { MarcaHerramienta } from './entities/marca_herramienta.entity';
import { MarcaHerramientaPaginationFiltersDto } from './dto/marca-herramienta-pagination-filters.dto';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, convertToLikeParameter, transformToAscOrDesc } from '../../util';

@Injectable()
export class MarcaHerramientaService {
  constructor(
    @InjectRepository(MarcaHerramienta)
    private readonly marcaHerramientaRepository: Repository<MarcaHerramienta>,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(
    createMarcaHerramientaDto: CreateMarcaHerramientaDto,
  ): Promise<MarcaHerramienta> {
    let queryRunner: QueryRunner;
    let response: MarcaHerramienta;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      response = await queryRunner.manager.save(
        MarcaHerramienta.fromCreateDto(createMarcaHerramientaDto),
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
    marcaHerramientaPaginationFilters: MarcaHerramientaPaginationFiltersDto,
  ): Promise<PaginationResponseDto<MarcaHerramienta>> {
    const {
      size = 10,
      page = 0,
      sort = 'mheNombre,asc',
      search = '',
    } = marcaHerramientaPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or mh.mhe_nombre like :nombre)
    `;

    const queryBuilder =
      await this.marcaHerramientaRepository.createQueryBuilder('mh');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `mh.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<MarcaHerramienta>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(mheCodigo: number): Promise<MarcaHerramienta> {
    const marcaHerramienta = await this.marcaHerramientaRepository.findOneBy({
      mheCodigo,
    });
    if (!marcaHerramienta) {
      throw new BadRequestException(
        `No existe marca de herramienta con el cóigo ${mheCodigo}`,
      );
    }

    return marcaHerramienta;
  }

  async update(
    mheCodigo: number,
    updateMarcaHerramientaDto: UpdateMarcaHerramientaDto,
  ) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(mheCodigo);
      updateMarcaHerramientaDto.mheCodigo = mheCodigo;
      const tipoServicio = MarcaHerramienta.fromUpdateDto(
        updateMarcaHerramientaDto,
      );
      await queryRunner.manager.save(tipoServicio);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(mheCodigo: number) {
    const marcaHerramienta = await this.findOne(mheCodigo);
    await this.marcaHerramientaRepository.remove(marcaHerramienta);
  }
}
