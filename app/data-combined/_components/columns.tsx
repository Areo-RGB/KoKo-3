'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type PlayerPerformance = {
  id: string;
  name: string;
  speed20m: number;
  speed10m: number;
  agility: number;
  dribbling: number;
  ballControl: number;
  ballJuggling: number;
  overallRank: number;
  category: string;
  isRealPlayer: boolean;
  prRank: number;
};

export const columns: ColumnDef<PlayerPerformance>[] = [
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Kategorie
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.getValue('category') as string;
      return <Badge variant="outline">{category}</Badge>;
    },
  },
  {
    accessorKey: 'overallRank',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rang
        </Button>
      );
    },
    cell: ({ row }) => {
      const rank = row.getValue('overallRank') as number;
      const isRealPlayer = row.original.isRealPlayer;

      // Only show rank for real players, leave blank for benchmark players
      if (!isRealPlayer) {
        return <div className="flex items-center">-</div>;
      }

      return (
        <div className="flex items-center justify-center">
          <Badge variant="outline">#{rank}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Spielername
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return <div className="font-normal">{name}</div>;
    },
  },
  {
    accessorKey: 'isRealPlayer',
    header: 'Typ',
    cell: ({ row }) => {
      const isRealPlayer = row.getValue('isRealPlayer') as boolean;
      return (
        <Badge
          variant={isRealPlayer ? 'default' : 'secondary'}
          className={isRealPlayer ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {isRealPlayer ? 'Realer Spieler' : 'Benchmark'}
        </Badge>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'speed20m',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Schnelligkeit (20 m)
        </Button>
      );
    },
    cell: ({ row }) => {
      const speed = parseFloat(row.getValue('speed20m'));
      return <div className="text-right font-mono">{speed.toFixed(2)}s</div>;
    },
  },
  {
    accessorKey: 'speed10m',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Speed (10m)
        </Button>
      );
    },
    cell: ({ row }) => {
      const speed = parseFloat(row.getValue('speed10m'));
      return <div className="text-right font-mono">{speed.toFixed(2)}s</div>;
    },
  },
  {
    accessorKey: 'agility',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Gewandtheit
        </Button>
      );
    },
    cell: ({ row }) => {
      const agility = parseFloat(row.getValue('agility'));
      return <div className="text-right font-mono">{agility.toFixed(2)}s</div>;
    },
  },
  {
    accessorKey: 'dribbling',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Dribbling
        </Button>
      );
    },
    cell: ({ row }) => {
      const dribbling = parseFloat(row.getValue('dribbling'));
      return (
        <div className="text-right font-mono">{dribbling.toFixed(2)}s</div>
      );
    },
  },
  {
    accessorKey: 'ballControl',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ballkontrolle
        </Button>
      );
    },
    cell: ({ row }) => {
      const ballControl = parseFloat(row.getValue('ballControl'));
      return (
        <div className="text-right font-mono">{ballControl.toFixed(2)}s</div>
      );
    },
  },
  {
    accessorKey: 'ballJuggling',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Balljonglieren
        </Button>
      );
    },
    cell: ({ row }) => {
      const juggling = parseFloat(row.getValue('ballJuggling'));
      return (
        <div className="text-right font-mono">{juggling.toFixed(1)} Pkt</div>
      );
    },
  },
  {
    accessorKey: 'prRank',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Gesamt
        </Button>
      );
    },
    cell: ({ row }) => {
      const prRank = row.getValue('prRank') as number;
      const isRealPlayer = row.original.isRealPlayer;

      // Only show PR rank for real players, leave blank for benchmark players
      if (!isRealPlayer) {
        return <div className="flex items-center">-</div>;
      }

      return (
        <div className="flex items-center">
          <Badge
            variant={
              prRank >= 80 ? 'default' : prRank >= 60 ? 'secondary' : 'outline'
            }
          >
            {prRank}%
          </Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const player = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menü öffnen</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(player.id)}
            >
              Spieler‑ID kopieren
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Spielerdetails anzeigen</DropdownMenuItem>
            <DropdownMenuItem>Leistungsdaten bearbeiten</DropdownMenuItem>
            <DropdownMenuItem>Bericht erstellen</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
