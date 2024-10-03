import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { ClienteService } from '../cliente/cliente.service';
import { MarcaVehiculoService } from '../marca_vehiculo/marca_vehiculo.service';
import { TipoVehiculoService } from '../tipo_vehiculo/tipo_vehiculo.service';
import { PaginationResponseDto } from '../../commons';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { VehiculoPaginationFiltersDto } from './dto/vehiculo-pagination-filters.dto';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    private readonly clienteService: ClienteService,
    private readonly marcaVehiculoService: MarcaVehiculoService,
    private readonly tipoVehiculoService: TipoVehiculoService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    let queryRunner: QueryRunner;
    let response: Vehiculo;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const cliente = await this.clienteService.findOne(
        createVehiculoDto.cliCodigo,
      );
      const marcaVehiculo = await this.marcaVehiculoService.findOne(
        createVehiculoDto.mveCodigo,
      );
      const tipoVehiculo = await this.tipoVehiculoService.findOne(
        createVehiculoDto.tveCodigo,
      );
      const entity = Vehiculo.fromCreateDto(createVehiculoDto);
      entity.cliente = cliente;
      entity.marcaVehiculo = marcaVehiculo;
      entity.tipoVehiculo = tipoVehiculo;
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
    vehiculoPaginationFiltersDto: VehiculoPaginationFiltersDto,
  ): Promise<PaginationResponseDto<Vehiculo>> {
    const {
      size = 10,
      page = 0,
      sort = 'vehPlaca,asc',
      placa = '',
      chasis = '',
      color = '',
      kilometraje = 0,
    } = vehiculoPaginationFiltersDto;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      placa: convertToLikeParameter(placa),
      chasis: convertToLikeParameter(chasis),
      color: convertToLikeParameter(color),
      kilometraje: convertToLikeParameter(kilometraje),
    };

    const filters = `
      (:placa = '' or lower(veh.veh_placa) like :placa) and
      (:chasis = '' or lower(veh.veh_numero_chasis) like :chasis) and
      (:color = '' or lower(veh.veh_color) like :color) and
      (:kilometraje = 0 or veh.veh_kilometraje = :kilometraje)
    `;

    const queryBuilder = await this.vehiculoRepository
      .createQueryBuilder('veh')
      .innerJoinAndSelect('veh.cliente', 'cli')
      .innerJoinAndSelect('veh.marcaVehiculo', 'mve')
      .innerJoinAndSelect('veh.tipoVehiculo', 'tve');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `veh.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<Vehiculo>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(vehPlaca: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOne({
      relations: ['cliente', 'marcaVehiculo', 'tipoVehiculo'],
      where: { vehPlaca },
    });
    if (!vehiculo) {
      throw new BadRequestException(
        `No existe vehiculo con la placa ${vehPlaca}`,
      );
    }

    return vehiculo;
  }

  async update(vehPlaca: string, updateVehiculoDto: UpdateVehiculoDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(vehPlaca);
      const cliente = await this.clienteService.findOne(
        updateVehiculoDto.cliCodigo,
      );
      const marcaVehiculo = await this.marcaVehiculoService.findOne(
        updateVehiculoDto.mveCodigo,
      );
      const tipoVehiculo = await this.tipoVehiculoService.findOne(
        updateVehiculoDto.tveCodigo,
      );
      const vehiculo = Vehiculo.fromUpdateDto(updateVehiculoDto);
      vehiculo.cliente = cliente;
      vehiculo.marcaVehiculo = marcaVehiculo;
      vehiculo.tipoVehiculo = tipoVehiculo;
      await queryRunner.manager.save(vehiculo);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(vehPlaca: string) {
    const vehiculo = await this.findOne(vehPlaca);
    await this.vehiculoRepository.remove(vehiculo);
  }
}
