import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateEspecialidadMecanicaDto,
  EspecialidadMecanicaPaginationFiltersDto,
  UpdateEspecialidadMecanicaDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EspecialidadMecanica } from './entities/especialidad_mecanica.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../commons';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { Servicio } from '../servicio/entities/servicio.entity';

@Injectable()
export class EspecialidadMecanicaService {
  constructor(
    @InjectRepository(EspecialidadMecanica)
    private readonly especialidadMecanicaRepository: Repository<EspecialidadMecanica>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createEspecialidadMecanicaDto: CreateEspecialidadMecanicaDto,
  ): Promise<EspecialidadMecanica> {
    let queryRunner: QueryRunner;
    let response: EspecialidadMecanica;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entity = EspecialidadMecanica.fromCreateDto(
        createEspecialidadMecanicaDto,
      );
      response = await queryRunner.manager.save(entity);
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
    especialidadMecanicaPaginationFilters: EspecialidadMecanicaPaginationFiltersDto,
  ): Promise<PaginationResponseDto<EspecialidadMecanica>> {
    const {
      size = 10,
      page = 0,
      sort = 'emeCodigo,asc',
      search = '',
    } = especialidadMecanicaPaginationFilters;

    const skip = page * size;
    const splitSortValues = sort.split(',');

    const parameters = {
      nombre: convertToLikeParameter(search),
      descripcion: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or LOWER(em.eme_nombre) like :nombre) or
      (:descripcion = '' or LOWER(em.eme_nombre) like :descripcion)
    `;

    const queryBuilder =
      await this.especialidadMecanicaRepository.createQueryBuilder('em');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `em.${camelToSnakeCase(splitSortValues[0])}`,
        transformToAscOrDesc(splitSortValues[1]),
      )
      .limit(size)
      .offset(skip)
      .getMany();

    const totalElements = await queryBuilder
      .select('content(*)')
      .where(filters, parameters)
      .getCount();

    const totalPages = Math.ceil(totalElements / size);
    const response = new PaginationResponseDto<EspecialidadMecanica>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(emeCodigo: number) {
    const especialidadMecanica =
      await this.especialidadMecanicaRepository.findOne({
        where: {
          emeCodigo,
        },
      });

    if (!especialidadMecanica) {
      throw new BadRequestException(
        `No existe especialidad mecanica con el id ${emeCodigo}`,
      );
    }

    return especialidadMecanica;
  }

  async update(
    emeCodigo: number,
    updateEspecialidadMecanicaDto: UpdateEspecialidadMecanicaDto,
  ) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(emeCodigo);
      updateEspecialidadMecanicaDto.emeCodigo = emeCodigo;
      const especialidadMecanica = EspecialidadMecanica.fromUpdateDto(
        updateEspecialidadMecanicaDto,
      );
      await queryRunner.manager.save(especialidadMecanica);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(emeCodigo: number) {
    const especialidadMecanica = await this.findOne(emeCodigo);
    await this.especialidadMecanicaRepository.remove(especialidadMecanica);
  }
}
