import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClienteDto, UpdateClienteDto } from './dto';
import { Cliente } from './entities/cliente.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientePaginationFiltersDto } from './dto/cliente-pagination-filters.dto';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { PaginationResponseDto } from '../../commons';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    let queryRunner: QueryRunner;
    let response: Cliente;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entity = Cliente.fromCreateDto(createClienteDto);
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
    clientePaginationFilters: ClientePaginationFiltersDto,
  ): Promise<PaginationResponseDto<Cliente>> {
    const {
      size = 10,
      page = 0,
      sort = 'cliNombres,asc',
      search = '',
      dpi = '',
      nit = '',
      telefono = '',
      correo = '',
    } = clientePaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombres: convertToLikeParameter(search),
      apellidos: convertToLikeParameter(search),
      dpi: convertToLikeParameter(dpi),
      nit: convertToLikeParameter(nit),
      telefono: convertToLikeParameter(telefono),
      correo: convertToLikeParameter(correo),
    };

    const filters = `
      (
        (:nombres = '' or LOWER(c.cli_nombres) like :nombres) OR
        (:apellidos = '' or LOWER(c.cli_apellidos) like :apellidos) 
      ) AND
      (:dpi = '' or LOWER(c.cli_dpi) like :dpi) AND
      (:nit = '' or LOWER(c.cli_nit) like :nit) AND
      (:telefono = '' or LOWER(c.cli_telefono) like :telefono) AND
      (:correo = '' or LOWER(c.cli_correo) like :correo) 
    `;

    const queryBuilder = await this.clienteRepository.createQueryBuilder('c');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `c.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<Cliente>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(cliCodigo: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({
      cliCodigo,
    });

    if (!cliente) {
      throw new BadRequestException(
        `No existe cliente con el código ${cliCodigo}`,
      );
    }

    return cliente;
  }

  async update(cliCodigo: number, updateClienteDto: UpdateClienteDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(cliCodigo);
      updateClienteDto.cliCodigo = cliCodigo;
      const cliente = Cliente.fromUpdateDto(updateClienteDto);
      await queryRunner.manager.save(cliente);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(cliCodigo: number) {
    const cliente = await this.findOne(cliCodigo);
    await this.clienteRepository.remove(cliente);
  }
}
