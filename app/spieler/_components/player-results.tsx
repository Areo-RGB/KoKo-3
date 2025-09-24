'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCurrentResultsForPlayer } from '../_lib/data';

interface PlayerResultsProps {
  name: string;
}

export default function PlayerResults({ name }: PlayerResultsProps) {
  const results = getCurrentResultsForPlayer(name);

  const rows = [
    {
      test: 'Yo-Yo Intermittent Recovery Test Level 1',
      value:
        results.yoyo.value !== null
          ? `${results.yoyo.value} ${results.yoyo.unit}`
          : '-',
      date: results.yoyo.date ?? '-',
    },
    {
      test: 'Jonglieren',
      value:
        results.jonglieren.value !== null
          ? `${results.jonglieren.value} ${results.jonglieren.unit}`
          : '-',
      date: results.jonglieren.date ?? '-',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test</TableHead>
                <TableHead className="text-right">Ergebnis</TableHead>
                <TableHead className="text-right">Datum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.test}>
                  <TableCell>{r.test}</TableCell>
                  <TableCell className="text-right">{r.value}</TableCell>
                  <TableCell className="text-right">{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
