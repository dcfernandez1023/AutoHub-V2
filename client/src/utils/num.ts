export const safeNum = (n: any) => {
  return isFinite(n) ? (n as number) : 0;
};

export const roundDecimal = (n: number, numDecimals: number = 2): number => {
  const multiplier: number = Math.pow(10, numDecimals);
  return Math.round(n * multiplier) / multiplier;
};
