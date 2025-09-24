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
  return (
    <div className="mt-4">
      <div className="bg-card rounded-md border">
        <div className="p-2 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">
                  {title} ({unit})
                </TableHead>
                <TableHead className="text-right">Datum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-right">
                    {Number(row[valueKey] ?? 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.date ?? '-'}
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
