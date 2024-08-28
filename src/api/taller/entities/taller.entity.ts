import { UpdateTallerDto } from '../dto/update-taller.dto';
import { CreateTallerDto } from '../dto/create-taller.dto';

export class Taller {
  public static fromUpdateDto(
    updateDto: UpdateTallerDto,
  ): Taller {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(
    createDto: CreateTallerDto,
  ): Taller {
    return this.parseDto(createDto);
  }

  private static parseDto(source): Taller {
    const marcaVehiculo = new Taller();
    Object.assign(marcaVehiculo, source);
    return marcaVehiculo;
  }
}
