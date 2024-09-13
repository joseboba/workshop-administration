export class Format {
  static formatNumber = (value: number): string => {
    if (value === null) {
      throw new Error('Value is required');
    }

    return Intl.NumberFormat().format(value);
  };

  static formatDecimal = (value: number): string => {
    if (value === null) {
      throw new Error('Value is required');
    }

    return Intl.NumberFormat('es-GT', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
  }

  static formatCurrency = (
    value: number | null,
    locale: string = 'es-GT',
    currency: string = 'GTQ',
  ): string => {
    if (value === null) {
      throw new Error('Value is required');
    }

    return Intl.NumberFormat(locale, {
      currencyDisplay: 'narrowSymbol',
      style: 'currency',
      currency,
    }).format(value);
  };
}
