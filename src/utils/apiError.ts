export const getApiErrorMessage = (error: any, fallback: string): string => {
  return error?.data?.message || fallback;
};
