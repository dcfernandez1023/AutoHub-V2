export const safeNum = (n: any) => {
  return isFinite(n) ? (n as number) : 0;
};
