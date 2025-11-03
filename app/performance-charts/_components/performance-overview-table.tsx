'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';

interface PerformanceData {
  name: string;
  jonglieren: number;
  yoyo: number;
  springseil: number;
  prellwand: number;
}

interface PerformanceOverviewTableProps {
  data: PerformanceData[];
}

export default function PerformanceOverviewTable({ data }: PerformanceOverviewTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false }
  ]);

  const columns: ColumnDef<PerformanceData>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <button
          className="flex items-center justify-left font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'jonglieren',
      header: ({ column }) => (
        <button
          className="flex items-center justify-left font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Jonglieren
        </button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue('jonglieren')}</div>
      ),
    },
    {
      accessorKey: 'yoyo',
      header: ({ column }) => (
        <button
          className="flex items-center justify-left font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Yo-Yo IR1
        </button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue('yoyo')}</div>
      ),
    },
    {
      accessorKey: 'springseil',
      header: ({ column }) => (
        <button
          className="flex items-center justify-left font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Springseil
        </button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue('springseil')}</div>
      ),
    },
    {
      accessorKey: 'prellwand',
      header: ({ column }) => (
        <button
          className="flex items-center justify-left font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Prellwand
        </button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue('prellwand')}</div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full overflow-auto">
      <Table className="border border-border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="border-r border-border last:border-r-0">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="border-b border-border"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border-r border-border last:border-r-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center border-r border-border">
                Keine Daten verfügbar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
