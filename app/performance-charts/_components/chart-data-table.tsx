'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type ChartValue = string | number | null | undefined;

interface ChartDataRow extends Record<string, ChartValue> {
  name: string;
}

interface ChartDataTableProps {
  rows: ChartDataRow[];
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
              {rows.map((row, index) => (
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
