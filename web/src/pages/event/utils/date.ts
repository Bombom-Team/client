export const formatEventDateTime = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${month}월 ${day}일 ${hours}:${minutes}`;
};

export const extractKSTDate = (date: Date) => {
  const time = date.getTime();

  const utcMs = time + date.getTimezoneOffset() * 60 * 1000;
  const kstMs = utcMs + 9 * 60 * 60 * 1000;
  const kst = new Date(kstMs);

  return {
    year: kst.getUTCFullYear(),
    month: kst.getUTCMonth() + 1,
    date: kst.getUTCDate(),
  };
};
