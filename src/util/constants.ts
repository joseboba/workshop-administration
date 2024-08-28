export class Constants {
  static maxLengthError = (name: string, length: number) => {
    return `${name} debe ser de máximo ${length} cáracteres`;
  };

  static requiredError = (name: string) => {
    return `${name} es requerido`;
  };
}
