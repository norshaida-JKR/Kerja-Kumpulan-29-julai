import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = await FileBlob.load(
  "EQUIPMENT MASTERLIST AND CALIBRATION RECORDS- MASTER SHJ.xlsx",
);
const workbook = await SpreadsheetFile.importXlsx(source);
const result = await workbook.inspect({
  kind: "workbook,sheet,table,region",
  maxChars: 12000,
  tableMaxRows: 10,
  tableMaxCols: 20,
  tableMaxCellChars: 100,
});

console.log(result.ndjson);
