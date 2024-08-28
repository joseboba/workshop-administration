import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServicioRepuestoDto } from './dto/create-servicio_repuesto.dto';
import { UpdateServicioRepuestoDto } from './dto/update-servicio_repuesto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ServicioRepuesto } from './entities/servicio_repuesto.entity';
import { ServicioService } from '../servicio/servicio.service';
import { RepuestoService } from '../repuesto/repuesto.service';
import { ServicioRepuestoPaginationFiltersDto } from './dto/servicio-repuesto-pagination-filters.dto';

@Injectable()
export class ServicioRepuestoService {

  constructor(
    @InjectRepository(ServicioRepuesto)
    private readonly servicioRepuestoRepository: Repository<ServicioRepuesto>,
    private readonly servicioService: ServicioService,
    private readonly repuestoService: RepuestoService,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(createServicioRepuestoDto: CreateServicioRepuestoDto): Promise<ServicioRepuesto> {
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

  async findAll(servicioRepuestoPaginationFilter: ServicioRepuestoPaginationFiltersDto) {
    return `This action returns all servicioRepuesto`;
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

  async update(srrCodigo: number, updateServicioRepuestoDto: UpdateServicioRepuestoDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(srrCodigo);
      const servicio = await this.servicioService.findOne(
        updateServicioRepuestoDto.srvCodigo,
      );
      const repuesto = await this.repuestoService.findOne(
        updateServicioRepuestoDto.repCodigo,
      );
      const servicioRepuesto = ServicioRepuesto.fromUpdateDto(updateServicioRepuestoDto);
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
}
