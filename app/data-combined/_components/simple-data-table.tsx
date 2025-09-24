'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  SimpleCategory,
  SimpleNormativeDataRow,
} from '../_types/simple-interfaces';

interface SimpleDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  categories: SimpleCategory[];
}

export function SimpleDataTable<TData extends SimpleNormativeDataRow, TValue>({
  columns,
  data,
  categories,
}: SimpleDataTableProps<TData, TValue>): React.ReactElement {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: 'age',
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    {
      id: 'age',
      value: 'U12',
    },
  ]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [columnVisibility, setColumnVisibility] = React.useState({});

  // Filter data based on selected category
  const filteredData = React.useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') {
      return data;
    }

    const category = categories.find((cat) => cat.name === selectedCategory);
    if (!category) return data;

    return data.filter((item) => category.metrics.includes(item.metric));
  }, [data, selectedCategory, categories]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  // Get unique metrics for filter (filtered by category if selected)
  const metrics = React.useMemo(() => {
    let availableMetrics: string[];

    if (selectedCategory && selectedCategory !== 'all') {
      const category = categories.find((cat) => cat.name === selectedCategory);
      availableMetrics = category ? category.metrics : [];
    } else {
      availableMetrics = Array.from(
        new Set(data.map((item) => item.metric)),
      ).sort();
    }

    return availableMetrics.map((metric) => ({
      value: metric,
      label: metric,
    }));
  }, [data, selectedCategory, categories]);

  // Get unique ages for filter
  const ages = React.useMemo(() => {
    const ageSet = Array.from(new Set(data.map((item) => item.age)));
    // Sort ages numerically (U9, U10, U11, etc.)
    const sortedAges = ageSet.sort((a, b) => {
      const numA = parseInt(a.replace('U', ''));
      const numB = parseInt(b.replace('U', ''));
      return numA - numB;
    });
    return sortedAges.map((age) => ({
      value: age,
      label: age,
    }));
  }, [data]);

  return (
    <div className="w-full space-y-6">
      {/* Controls Section */}
      <div className="bg-muted/30 flex flex-col gap-4 rounded-lg p-4 lg:flex-row lg:items-center">
        {/* Filter Row */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              // Reset metric filter when category changes
              if (value !== 'all') {
                table.getColumn('metric')?.setFilterValue('');
              }
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Kategorie wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Kategorien</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              (table.getColumn('age')?.getFilterValue() as string) ?? 'U12'
            }
            onValueChange={(value) =>
              table
                .getColumn('age')
                ?.setFilterValue(value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Alter wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Altersgruppen</SelectItem>
              {ages.map((age) => (
                <SelectItem key={age.value} value={age.value}>
                  {age.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              (table.getColumn('metric')?.getFilterValue() as string) ?? ''
            }
            onValueChange={(value) =>
              table
                .getColumn('metric')
                ?.setFilterValue(value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Messwert wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Messwerte</SelectItem>
              {metrics.map((metric) => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground lg:ml-auto">
          <span>{table.getFilteredRowModel().rows.length} Werte</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="overflow-x-auto p-1">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Keine Ergebnisse gefunden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} von{' '}
          {table.getFilteredRowModel().rows.length} Zeile(n) ausgewählt.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Zurück
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  );
}
