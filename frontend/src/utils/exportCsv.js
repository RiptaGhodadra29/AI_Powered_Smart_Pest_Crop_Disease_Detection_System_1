/*
  Dependency-free CSV export.
  Builds a CSV from an array of row objects and triggers a browser download.
  Values are quoted and internal quotes escaped so commas/newlines are safe.
*/

const escapeCell = (value) => {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
};

export function exportToCsv(filename, rows, columns) {
  if (!rows || rows.length === 0) return;

  // columns: [{ key, label }]; defaults to the keys of the first row.
  const cols =
    columns ||
    Object.keys(rows[0]).map((key) => ({ key, label: key }));

  const header = cols.map((c) => escapeCell(c.label)).join(",");
  const body = rows
    .map((row) => cols.map((c) => escapeCell(row[c.key])).join(","))
    .join("\n");

  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
