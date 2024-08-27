import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProveedorDto, ProveedorPaginationFilterDto, UpdateProveedorDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, convertToLikeParameter, transformToAscOrDesc } from '../../util';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    let queryRunner: QueryRunner;
    let response: Proveedor;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entity = Proveedor.fromCreateDto(createProveedorDto);
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
    proveedorPaginationFilters: ProveedorPaginationFilterDto,
  ): Promise<PaginationResponseDto<Proveedor>> {
    const {
      size = 10,
      page = 0,
      sort = 'prvNombre,asc',
      search = '',
      telefono = '',
      correo = '',
    } = proveedorPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
      nombreContacto: convertToLikeParameter(search),
      telefono: convertToLikeParameter(telefono),
      correo: convertToLikeParameter(correo),
    };

    const filters = `
      (
         (:nombre = '' or LOWER(p.prv_nombre) like :nombre) OR
         (:nombreContacto = '' or LOWER(p.prv_nombre_contacto) like :nombreContacto)
      ) AND
      (:telefono = '' OR LOWER(p.prv_telefono) like :telefono) AND
      (:correo = '' OR LOWER(p.correo) like :correo)
    `;

    const queryBuilder = await this.proveedorRepository.createQueryBuilder('p');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `p.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<Proveedor>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(prvCodigo: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOneBy({
      prvCodigo,
    });

    if (!proveedor) {
      throw new BadRequestException(
        `No existe proveedor con el id ${proveedor}`,
      );
    }

    return proveedor;
  }

  async update(prvCodigo: number, updateProveedorDto: UpdateProveedorDto) {
    let queryRunner: QueryRunner;
    let response: Proveedor;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      updateProveedorDto.prvCodigo = prvCodigo;
      const entity = Proveedor.fromUpdateDto(updateProveedorDto);
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

  async remove(prvCodigo: number) {
    const proveedor = await this.findOne(prvCodigo);
    await this.proveedorRepository.remove(proveedor);
  }
}
