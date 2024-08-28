import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHerramientaDto } from './dto/create-herramienta.dto';
import { UpdateHerramientaDto } from './dto/update-herramienta.dto';
import { HerramientaPaginationFiltersDto } from './dto/herramienta-pagination-filters.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ClienteService } from '../cliente/cliente.service';
import { MarcaVehiculoService } from '../marca_vehiculo/marca_vehiculo.service';
import { TipoVehiculoService } from '../tipo_vehiculo/tipo_vehiculo.service';
import { Herramienta } from './entities/herramienta.entity';
import { MecanicoService } from '../mecanico/mecanico.service';
import { MarcaHerramientaService } from '../marca_herramienta/marca_herramienta.service';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, convertToLikeParameter, transformToAscOrDesc } from '../../util';
import { MarcaHerramienta } from '../marca_herramienta/entities/marca_herramienta.entity';

@Injectable()
export class HerramientaService {
  constructor(
    @InjectRepository(Herramienta)
    private readonly herramientaRepository: Repository<Herramienta>,
    private readonly mecanicoService: MecanicoService,
    private readonly marcaHerramientaService: MarcaHerramientaService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createHerramientaDto: CreateHerramientaDto,
  ): Promise<Herramienta> {
    let queryRunner: QueryRunner;
    let response: Herramienta;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const mecanico = await this.mecanicoService.findOne(
        createHerramientaDto.mecCodigo,
      );
      const marcaHerramienta = await this.marcaHerramientaService.findOne(
        createHerramientaDto.mheCodigo,
      );
      const entity = Herramienta.fromCreateDto(createHerramientaDto);
      entity.mecanico = mecanico;
      entity.marcaHerramienta = marcaHerramienta;
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

  async findAll(herramientaPaginationFilter: HerramientaPaginationFiltersDto): Promise<PaginationResponseDto<Herramienta>> {
    const {
      size = 10,
      page = 0,
      sort = 'herNombre,asc',
      search = '',
    } = herramientaPaginationFilter;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
      descripcion: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or lower(her.her_nombre) like :nombre) and
      (:descripcion = '' or lower(her.her_descripcion) like :descripcion)
    `;

    const queryBuilder = await this.herramientaRepository
      .createQueryBuilder('her')
      .innerJoinAndSelect('her.mecanico', 'mec')
      .innerJoinAndSelect('her.marcaHerramienta', 'mhe');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `her.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<Herramienta>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(herCodigo: number): Promise<Herramienta> {
    const vehiculo = await this.herramientaRepository.findOne({
      relations: ['mecanico', 'marcaHerramienta'],
      where: { herCodigo },
    });
    if (!vehiculo) {
      throw new BadRequestException(
        `No existe herramienta con el codigo ${herCodigo}`,
      );
    }

    return vehiculo;
  }

  async update(herCodigo: number, updateHerramientaDto: UpdateHerramientaDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(herCodigo);
      const mecanico = await this.mecanicoService.findOne(
        updateHerramientaDto.mecCodigo,
      );
      const marcaHerramienta = await this.marcaHerramientaService.findOne(
        updateHerramientaDto.mheCodigo,
      );
      const herramienta = Herramienta.fromUpdateDto(updateHerramientaDto);
      herramienta.mecanico = mecanico;
      herramienta.marcaHerramienta = marcaHerramienta;
      await queryRunner.manager.save(herramienta);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(herCodigo: number) {
    const herramienta = await this.findOne(herCodigo);
    await this.herramientaRepository.remove(herramienta);
  }
}
