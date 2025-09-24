import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { simpleColumns } from './_components/simple-columns';
import { SimpleDataTable } from './_components/simple-data-table';
import { getPlayerData } from './_lib/data';
import {
  getSimpleCategories,
  getSimpleNormativeData,
} from './_lib/simple-data';

export default async function CombinedDataPage() {
  // Fetch data for normwerte
  const normwerteData = await getSimpleNormativeData();
  const categories = await getSimpleCategories();

  // Fetch data for data-table-demo
  const dataTableData = await getPlayerData();

  return (
    <div className="w-full max-w-none p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Daten und Normwerte
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-relaxed">
          Umfassende Daten und Normwerte für Nachwuchssportler. Wechseln Sie
          zwischen den Tabs, um verschiedene Datensätze anzuzeigen.
        </p>
      </div>

      <Tabs defaultValue="normwerte" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="normwerte">
            Normwerte für Nachwuchssportler
          </TabsTrigger>
          <TabsTrigger value="datatable">
            Sportliche Leistungsdaten (Tabelle)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="normwerte" className="mt-0">
          <SimpleDataTable
            columns={simpleColumns}
            data={normwerteData}
            categories={categories}
          />
        </TabsContent>

        <TabsContent value="datatable" className="mt-0">
          <DataTable columns={columns} data={dataTableData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
