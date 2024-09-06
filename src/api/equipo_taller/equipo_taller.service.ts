import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEquipoTallerDto } from './dto/create-equipo_taller.dto';
import { UpdateEquipoTallerDto } from './dto/update-equipo_taller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { EquipoTaller } from './entities/equipo_taller.entity';
import { MarcaEquipoService } from '../marca_equipo/marca_equipo.service';
import { MecanicoService } from '../mecanico/mecanico.service';
import { EquipoTallerPaginationDto } from './dto/equipo-taller-pagination.dto';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, convertToLikeParameter, transformToAscOrDesc } from '../../util';

@Injectable()
export class EquipoTallerService {
  constructor(
    @InjectRepository(EquipoTaller)
    private readonly equipoTallerRepository: Repository<EquipoTaller>,
    private readonly marcaEquipoService: MarcaEquipoService,
    private readonly mecanicoService: MecanicoService,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(
    createEquipoTallerDto: CreateEquipoTallerDto,
  ): Promise<EquipoTaller> {
    let queryRunner: QueryRunner;
    let response: EquipoTaller;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const marcaEquipo = await this.marcaEquipoService.findOne(
        createEquipoTallerDto.meqCodigo,
      );
      const mecanico = await this.mecanicoService.findOne(
        createEquipoTallerDto.mecCodigo,
      );
      const entity = EquipoTaller.fromCreateDto(createEquipoTallerDto);
      entity.marcaEquipo = marcaEquipo;
      entity.mecanico = mecanico;
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
    equipoTallerPaginationFilters: EquipoTallerPaginationDto,
  ): Promise<PaginationResponseDto<EquipoTaller>> {
    const {
      size = 10,
      page = 0,
      sort = 'etaNombre,asc',
      search = '',
    } = equipoTallerPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
      descripcion: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or lower(eta.eta_nombre) like :nombre) or
      (:descripcion = '' or lower(eta.eta_descripcion) like :descripcion)
    `;

    const queryBuilder = await this.equipoTallerRepository
      .createQueryBuilder('eta')
      .innerJoinAndSelect('eta.marcaEquipo', 'meq')
      .innerJoinAndSelect('eta.mecanico', 'mec');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `eta.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<EquipoTaller>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(etaCodigo: number): Promise<EquipoTaller> {
    const equipoTaller = await this.equipoTallerRepository.findOne({
      relations: ['marcaEquipo', 'mecanico'],
      where: { etaCodigo },
    });
    if (!equipoTaller) {
      throw new BadRequestException(
        `No existe equipo taller con el código ${etaCodigo}`,
      );
    }

    return equipoTaller;
  }

  async update(
    etaCodigo: number,
    updateEquipoTallerDto: UpdateEquipoTallerDto,
  ) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(etaCodigo);
      updateEquipoTallerDto.etaCodigo = etaCodigo;
      const marcaEquipo = await this.marcaEquipoService.findOne(
        updateEquipoTallerDto.meqCodigo,
      );
      const mecanico = await this.mecanicoService.findOne(
        updateEquipoTallerDto.mecCodigo,
      );
      const entity = EquipoTaller.fromUpdateDto(updateEquipoTallerDto);
      entity.marcaEquipo = marcaEquipo;
      entity.mecanico = mecanico;
      await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(etaCodigo: number) {
    const equipoTaller = await this.findOne(etaCodigo);
    await this.equipoTallerRepository.remove(equipoTaller);
  }
}
