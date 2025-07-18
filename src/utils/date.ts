function dateFormat(dateString: string): string {
  return dateString.replace("T", " ").slice(0, 16);
}

function utcToKstString(utcStr: string): string {
  const date = new Date(utcStr);
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const year = kst.getFullYear();
  const month = String(kst.getMonth() + 1).padStart(2, "0");
  const day = String(kst.getDate()).padStart(2, "0");
  const hour = String(kst.getHours()).padStart(2, "0");
  const min = String(kst.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${min}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export { dateFormat, utcToKstString, formatDate };
