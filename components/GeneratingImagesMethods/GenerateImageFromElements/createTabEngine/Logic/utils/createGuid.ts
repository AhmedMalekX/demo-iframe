export const createGuid = () => {
  return Math.random().toString(36).substr(2, 9);
};
