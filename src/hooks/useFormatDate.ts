export const useFormatDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("ko-KR");
};
