'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ChartDataTableProps {
  rows: any[];
  valueKey: string;
  title: string; // for column header
  unit: string;
}

export default function ChartDataTable({
  rows,
  valueKey,
  title,
  unit,
}: ChartDataTableProps) {
  function formatDateForDisplay(date: string | null | undefined): string {
    if (!date) return '-';
    // Expecting ISO format YYYY-MM-DD; render as DD MM YY
    const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(date);
    if (!m) return date;
    const yy = m[1].slice(-2);
    const mm = m[2];
    const dd = m[3];
    return `${dd} ${mm} ${yy}`;
  }
  return (
    <div className="mt-4">
      <div className="bg-card rounded-md border">
        <div className="overflow-x-auto p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">
                  {title ? `${title} (${unit})` : unit}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any, index: number) => (
                <TableRow key={row.name}>
                  <TableCell className="text-muted-foreground text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-right">
                    {Number(row[valueKey] ?? 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
