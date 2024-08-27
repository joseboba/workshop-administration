export const convertToLikeParameter = (value: any) => {
  switch (typeof value) {
    case 'string':
      if (!value.trim()) return '';
      return `%${value}%`;
    case 'number':
      if (!value) return 0;
      return `%${value}%`;
    default:
      return '';
  }
};
