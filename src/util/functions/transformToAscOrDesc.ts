export const transformToAscOrDesc = (str: string): 'ASC' | 'DESC' => {
  if (str.trim().toLocaleLowerCase() === 'asc') return 'ASC';
  return 'DESC';
};
