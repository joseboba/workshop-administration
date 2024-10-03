import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDiasNoDisponibleDto } from './dto/create-dias_no_disponible.dto';
import { UpdateDiasNoDisponibleDto } from './dto/update-dias_no_disponible.dto';
import { DiasNoDisponiblesPaginationFiltersDto } from './dto/dias-no-disponibles-pagination-filters.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { DiasNoDisponible } from './entities/dias_no_disponible.entity';
import { PaginationResponseDto } from '../../commons';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { TallerService } from '../taller/taller.service';

@Injectable()
export class DiasNoDisponiblesService {
  constructor(
    @InjectRepository(DiasNoDisponible)
    private readonly diasNoDisponibleRepository: Repository<DiasNoDisponible>,
    private readonly tallerService: TallerService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createDiasNoDisponibleDto: CreateDiasNoDisponibleDto,
  ): Promise<DiasNoDisponible> {
    let queryRunner: QueryRunner;
    let response: DiasNoDisponible;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const taller = await this.tallerService.findOne(
        createDiasNoDisponibleDto.tllCodigo,
      );
      const entity = DiasNoDisponible.fromCreateDto(createDiasNoDisponibleDto);
      entity.taller = taller;
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
    diasNoDisponiblesPaginationFilters: DiasNoDisponiblesPaginationFiltersDto,
  ): Promise<PaginationResponseDto<DiasNoDisponible>> {
    const {
      size = 10,
      page = 0,
      sort = 'dndMotivo,asc',
      search = '',
    } = diasNoDisponiblesPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      motivo: convertToLikeParameter(search),
    };

    const filters = `
      (:motivo = '' or LOWER(dnd.dnd_motivo) like :motivo)
    `;

    const queryBuilder = await this.diasNoDisponibleRepository
      .createQueryBuilder('dnd')
      .innerJoinAndSelect('dnd.taller', 'tll');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `dnd.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<DiasNoDisponible>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(dndCodigo: number): Promise<DiasNoDisponible> {
    const diasNoDisponibles = await this.diasNoDisponibleRepository.findOne({
      relations: ['taller'],
      where: { dndCodigo },
    });
    if (!diasNoDisponibles) {
      throw new BadRequestException(
        `No existe dia no disponible con el código ${dndCodigo}`,
      );
    }

    return diasNoDisponibles;
  }

  async update(
    dndCodigo: number,
    updateDiasNoDisponibleDto: UpdateDiasNoDisponibleDto,
  ) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(dndCodigo);
      const taller = await this.tallerService.findOne(
        updateDiasNoDisponibleDto.tllCodigo,
      );
      updateDiasNoDisponibleDto.dndCodigo = dndCodigo;
      const diasNoDisponibles = DiasNoDisponible.fromUpdateDto(
        updateDiasNoDisponibleDto,
      );
      diasNoDisponibles.taller = taller;
      await queryRunner.manager.save(diasNoDisponibles);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(dndCodigo: number) {
    const diasNoDisponible = await this.findOne(dndCodigo);
    await this.diasNoDisponibleRepository.remove(diasNoDisponible);
  }
}
