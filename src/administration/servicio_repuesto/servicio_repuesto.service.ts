import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServicioRepuestoDto } from './dto/create-servicio_repuesto.dto';
import { UpdateServicioRepuestoDto } from './dto/update-servicio_repuesto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ServicioRepuesto } from './entities/servicio_repuesto.entity';
import { ServicioService } from '../servicio/servicio.service';
import { RepuestoService } from '../repuesto/repuesto.service';
import { ServicioRepuestoPaginationFiltersDto } from './dto/servicio-repuesto-pagination-filters.dto';
import { PaginationResponseDto } from '../../commons';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { Repuesto } from '../repuesto/entities/repuesto.entity';

@Injectable()
export class ServicioRepuestoService {
  constructor(
    @InjectRepository(ServicioRepuesto)
    private readonly servicioRepuestoRepository: Repository<ServicioRepuesto>,
    @InjectRepository(Repuesto)
    private readonly repuestoRepository: Repository<Repuesto>,
    private readonly servicioService: ServicioService,
    private readonly repuestoService: RepuestoService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createServicioRepuestoDto: CreateServicioRepuestoDto,
  ): Promise<ServicioRepuesto> {
    let queryRunner: QueryRunner;
    let response: ServicioRepuesto;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const servicio = await this.servicioService.findOne(
        createServicioRepuestoDto.srvCodigo,
      );
      const repuesto = await this.repuestoService.findOne(
        createServicioRepuestoDto.repCodigo,
      );
      const entity = ServicioRepuesto.fromCreateDto(createServicioRepuestoDto);
      entity.servicio = servicio;
      entity.repuesto = repuesto;
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
    servicioRepuestoPaginationFilter: ServicioRepuestoPaginationFiltersDto,
  ): Promise<PaginationResponseDto<ServicioRepuesto>> {
    const {
      size = 10,
      page = 0,
      sort = 'srrCantidad,asc',
      servicio = '',
      repuesto = '',
    } = servicioRepuestoPaginationFilter;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      servicio: convertToLikeParameter(servicio),
      repuesto: convertToLikeParameter(repuesto),
    };

    const filters = `
      (:servicio = '' or lower(srv.srv_nombre) like :servicio) and
      (:repuesto = '' or lower(rep.rep_nombre) like :repuesto)
    `;

    const queryBuilder = await this.servicioRepuestoRepository
      .createQueryBuilder('srr')
      .innerJoinAndSelect('srr.servicio', 'srv')
      .innerJoinAndSelect('srr.repuesto', 'rep');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `srr.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<ServicioRepuesto>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(srrCodigo: number) {
    const servicioRepuesto = await this.servicioRepuestoRepository.findOne({
      relations: ['servicio', 'repuesto'],
      where: { srrCodigo },
    });
    if (!servicioRepuesto) {
      throw new BadRequestException(
        `No existe servicio repuesto con el codigo ${srrCodigo}`,
      );
    }

    return servicioRepuesto;
  }

  async findByService(srvCodigo: number) {
    return this.repuestoRepository.find();
  }

  async update(
    srrCodigo: number,
    updateServicioRepuestoDto: UpdateServicioRepuestoDto,
  ) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(srrCodigo);
      updateServicioRepuestoDto.srrCodigo = srrCodigo;
      const servicio = await this.servicioService.findOne(
        updateServicioRepuestoDto.srvCodigo,
      );
      const repuesto = await this.repuestoService.findOne(
        updateServicioRepuestoDto.repCodigo,
      );
      const servicioRepuesto = ServicioRepuesto.fromUpdateDto(
        updateServicioRepuestoDto,
      );
      servicioRepuesto.servicio = servicio;
      servicioRepuesto.repuesto = repuesto;
      await queryRunner.manager.save(servicioRepuesto);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(srrCodigo: number) {
    const servicioRepuesto = await this.findOne(srrCodigo);
    await this.servicioRepuestoRepository.remove(servicioRepuesto);
  }

  async servicioPorRepuesto(repuesto: Repuesto) {
    const servicioRepuesto = await this.servicioRepuestoRepository.findOneBy({
      repuesto,
    });

    if (!servicioRepuesto) {
      throw new BadRequestException(
        `El servicio no tiene habilitado el repuesto ${repuesto.repNombre}`,
      );
    }
  }
}
