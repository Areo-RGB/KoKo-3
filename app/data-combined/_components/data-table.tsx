'use client';

import {
  Cell,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getPerformanceColor } from '../_lib/color';
import { PlayerPerformance } from './columns';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const exerciseMap: { [key: string]: string } = {
  speed20m: 'Schnelligkeit (20 m)',
  speed10m: 'Antritt (10 m)',
  agility: 'Gewandtheit',
  dribbling: 'Dribbling',
  ballControl: 'Ballkontrolle',
  ballJuggling: 'Balljonglieren',
};

export function DataTable<TData extends PlayerPerformance, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>): React.ReactElement {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: 'speed20m',
      desc: false, // false = ascending (best to worst for speed times)
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    {
      id: 'category',
      value: 'U12',
    },
  ]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      category: false,
      overallRank: false,
      isRealPlayer: false,
      actions: false, // Hide Category, Rank, Type, and Actions columns by default
    });
  const [showBenchmark, setShowBenchmark] = React.useState(false);
  const [showColorScale, setShowColorScale] = React.useState(false);

  // Filter data based on benchmark toggle
  const filteredData = React.useMemo(() => {
    if (showBenchmark) {
      return data;
    }
    return data.filter((item) => item.isRealPlayer);
  }, [data, showBenchmark]);

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
  });

  const getCellColorClass = (cell: Cell<TData, TValue>): string => {
    if (!showColorScale) {
      return '';
    }

    const exerciseName = exerciseMap[cell.column.id];
    if (!exerciseName) {
      return '';
    }

    const player = cell.row.original;
    const value = cell.getValue() as number;

    return getPerformanceColor(value, exerciseName, player.category);
  };

  return (
    <div className="w-full space-y-6">
      {/* Controls Section */}
      <div className="bg-muted/30 flex flex-col gap-4 rounded-lg p-4 lg:flex-row lg:items-center">
        {/* Search and Filter Row */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Filter players..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="w-64"
          />
          <Select
            value={
              (table.getColumn('category')?.getFilterValue() as string) ?? ''
            }
            onValueChange={(value) =>
              table
                .getColumn('category')
                ?.setFilterValue(value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="U11">U11</SelectItem>
              <SelectItem value="U12">U12</SelectItem>
              <SelectItem value="U13">U13</SelectItem>
              <SelectItem value="U14">U14</SelectItem>
              <SelectItem value="U15">U15</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggle Controls Row */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:ml-auto">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-benchmark"
              checked={showBenchmark}
              onCheckedChange={setShowBenchmark}
            />
            <Label
              htmlFor="show-benchmark"
              className="text-sm font-medium whitespace-nowrap"
            >
              Benchmark‑Spieler anzeigen
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-color-scale"
              checked={showColorScale}
              onCheckedChange={setShowColorScale}
            />
            <Label
              htmlFor="show-color-scale"
              className="text-sm font-medium whitespace-nowrap"
            >
              Leistungsfarbskala
            </Label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Spalten
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
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
                    <TableHead
                      key={header.id}
                      className="border-r last:border-r-0"
                    >
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`border-r last:border-r-0 ${getCellColorClass(cell)}`}
                      >
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
                    className="text-muted-foreground h-24 text-center"
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
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted-foreground text-sm">
          Zeige {table.getFilteredRowModel().rows.length} von {data.length}{' '}
          Spielern
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Zurück
          </Button>
          <div className="flex items-center space-x-1 text-sm">
            <span>Seite</span>
            <span className="font-medium">
              {table.getState().pagination.pageIndex + 1} von{' '}
              {table.getPageCount()}
            </span>
          </div>
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
