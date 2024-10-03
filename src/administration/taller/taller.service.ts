import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Taller } from './entities/taller.entity';
import { TallerPaginationFiltersDto } from './dto/taller-pagination-filters.dto';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, convertToLikeParameter, transformToAscOrDesc } from '../../util';

@Injectable()
export class TallerService {

  constructor(
    @InjectRepository(Taller)
    private readonly tallerRepository: Repository<Taller>,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(createTallerDto: CreateTallerDto): Promise<Taller> {
    let queryRunner: QueryRunner;
    let response: Taller;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      response = await queryRunner.manager.save(
        Taller.fromCreateDto(createTallerDto),
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

  async findAll(tallerPaginationFilters: TallerPaginationFiltersDto): Promise<PaginationResponseDto<Taller>> {
    const {
      size = 10,
      page = 0,
      sort = 'tllNombre,asc',
      nombre = '',
      direccion = '',
      telefono = '',
      correo = '',
    } = tallerPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(nombre),
      direccion: convertToLikeParameter(direccion),
      telefono: convertToLikeParameter(telefono),
      correo: convertToLikeParameter(correo),
    };

    const filters = `
      (:nombre = '' or LOWER(tll.tll_nombre) like :nombre) and
      (:direccion = '' or LOWER(tll.tll_direccion) like :direccion) and
      (:telefono = '' or LOWER(tll.tll_telefono) like :telefono) and
      (:correo = '' or LOWER(tll.tll_correo) like :correo) 
    `;

    const queryBuilder =
      await this.tallerRepository.createQueryBuilder('tll');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `tll.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<Taller>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(tllCodigo: number): Promise<Taller> {
    const taller = await this.tallerRepository.findOneBy({
      tllCodigo,
    });
    if (!taller) {
      throw new BadRequestException(
        `No existe taller con el código ${tllCodigo}`,
      );
    }

    return taller;
  }

  async update(tllCodigo: number, updateTallerDto: UpdateTallerDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(tllCodigo);
      updateTallerDto.tllCodigo = tllCodigo;
      const taller = Taller.fromUpdateDto(updateTallerDto);
      await queryRunner.manager.save(taller);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(tllCodigo: number) {
    const taller = await this.findOne(tllCodigo);
    await this.tallerRepository.remove(taller);
  }
}
