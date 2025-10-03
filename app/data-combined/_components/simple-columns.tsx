'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SimpleNormativeDataRow } from '../_types/simple-interfaces';

export const simpleColumns: ColumnDef<SimpleNormativeDataRow>[] = [
  {
    accessorKey: 'metric',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Messwert
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metric = row.getValue('metric') as string;
      return <div className="text-left font-medium">{metric}</div>;
    },
  },
  {
    accessorKey: 'age',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Alter
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const age = row.getValue('age') as string;
      return <div className="text-center font-mono font-medium">{age}</div>;
    },
  },
  {
    accessorKey: 'lowest',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Bester Wert
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const lowest = row.getValue('lowest') as number;
      const unit = row.original.unit;
      return (
        <div className="text-right font-mono font-medium text-green-600">
          {lowest} {unit}
        </div>
      );
    },
  },
  {
    accessorKey: 'highest',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Schwächster Wert
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const highest = row.getValue('highest') as number;
      const unit = row.original.unit;
      return (
        <div className="text-right font-mono font-medium text-red-600">
          {highest} {unit}
        </div>
      );
    },
  },
];
