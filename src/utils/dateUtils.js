export default function convertISOToYMD(iso) {
  const date = new Date(iso);
  const dateFormat =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");
  return dateFormat;
}
