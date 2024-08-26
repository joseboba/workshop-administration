import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoServicio } from './entities/tipo_servicio.entity';
import { Repository } from 'typeorm';
import { PaginationResponseDto } from '../../commons';
import { CreateTipoServicioDto, TipoServicioPaginationFiltersDto, UpdateTipoServicioDto } from './dto';

@Injectable()
export class TipoServicioService {
  constructor(
    @InjectRepository(TipoServicio)
    private readonly tipoServicioRepository: Repository<TipoServicio>,
  ) {}

  async create(
    createTipoServicioDto: CreateTipoServicioDto,
  ): Promise<TipoServicio | string> {
    return await this.tipoServicioRepository.save(createTipoServicioDto);
  }

  async findAll(
    tipoServicioPaginationFilters: TipoServicioPaginationFiltersDto,
  ): Promise<PaginationResponseDto<TipoServicio>> {
    const {
      size: take = 10,
      page = 0,
      sort = 'tsrCodigo,asc',
    } = tipoServicioPaginationFilters;

    const skip = page * take;
    const splitSortValues = sort.split(',');
    const content = await this.tipoServicioRepository.find({
      take,
      skip,
      order: {
        [splitSortValues[0]]: splitSortValues[1].toUpperCase(),
      },
    });

    const totalElements = await this.tipoServicioRepository.count();
    const totalPages = Math.ceil(totalElements / take);

    const response = new PaginationResponseDto<TipoServicio>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  findOne(tsrCodigo: number): Promise<TipoServicio> {
    return this.tipoServicioRepository.findOneBy({ tsrCodigo });
  }

  async update(
    tsrCodigo: number,
    updateTipoServicioDto: UpdateTipoServicioDto,
  ) {
    let tipoServicio = TipoServicio.fromUpdateDto(updateTipoServicioDto);
    tipoServicio = {
      tsrCodigo,
      ...tipoServicio,
    };
    await this.tipoServicioRepository.save(tipoServicio);
  }

  async remove(tsrCodigo: number) {
    const tipoServicio = await this.findOne(tsrCodigo);
    await this.tipoServicioRepository.remove(tipoServicio);
  }
}
