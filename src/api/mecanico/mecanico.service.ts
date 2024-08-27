import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMecanicoDto, UpdateMecanicoDto } from './dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Mecanico } from './entities/mecanico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EspecialidadMecanicaService } from '../especialidad_mecanica/especialidad_mecanica.service';

@Injectable()
export class MecanicoService {

  constructor(
    @InjectRepository(Mecanico)
    private readonly mecanicoRepository: Repository<Mecanico>,
    private readonly especialidadMecanicaService: EspecialidadMecanicaService,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(createMecanicoDto: CreateMecanicoDto): Promise<Mecanico> {
    let queryRunner: QueryRunner;
    let response: Mecanico;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const especialidadMecanica = await this.especialidadMecanicaService.findOne(createMecanicoDto.emeCodigo);
      const entity = Mecanico.fromCreateDto(createMecanicoDto);
      entity.especialidadMecanica = especialidadMecanica;
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

  findAll() {
    return `This action returns all mecanico`;
  }

  async findOne(mecCodigo: number): Promise<Mecanico> {
    const mecanico = await this.mecanicoRepository.findOneBy({
      mecCodigo,
    });

    if (!mecanico) {
      throw new BadRequestException(
        `No existe mecanico con el id ${mecCodigo}`,
      );
    }

    return mecanico;
  }

  async update(mecCodigo: number, updateMecanicoDto: UpdateMecanicoDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      updateMecanicoDto.mecCodigo = mecCodigo;
      await this.findOne(mecCodigo);
      const especialidadMecanica = await this.especialidadMecanicaService.findOne(updateMecanicoDto.emeCodigo);
      const entity = Mecanico.fromUpdateDto(updateMecanicoDto);
      entity.especialidadMecanica = especialidadMecanica;
      await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(mecCodigo: number) {
    const mecanico = await this.findOne(mecCodigo);
    await this.mecanicoRepository.remove(mecanico);
  }
}
