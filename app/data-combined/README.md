# Combined Data Page (`/data-combined`)

## Overview

This page combines the functionality of both the Normative Data page and the Data Table Demo page into a single interface using tabs. Users can switch between viewing normative performance data for youth athletes and comprehensive sports performance data tables.

## Component Structure

- **`CombinedDataPage` (`page.tsx`)**: A Server Component that fetches data for both the normative data table and the sports performance data table, then renders them in a tabbed interface.
- **Tab 1 - Normative Data**: Uses the components that were originally in `/normwerte`:
  - `SimpleDataTable` Component (`app/data-combined/_components/simple-data-table.tsx`)
  - `simpleColumns` (`app/data-combined/_components/simple-columns.tsx`)
- **Tab 2 - Sports Performance Data**: Uses the components that were originally in `/data-table-demo`:
  - `DataTable` (`app/data-combined/_components/data-table.tsx`)
  - `columns` (`app/data-combined/_components/columns.tsx`)

## Data Flow

1. The `CombinedDataPage` Server Component asynchronously calls both:
   - `getSimpleNormativeData()` and `getSimpleCategories()` from `app/data-combined/_lib/simple-data.ts`
   - `getPlayerData()` from `app/data-combined/_lib/data.ts`
2. All data is processed server-side for optimal performance.
3. The processed data is passed to the respective client components within each tab.
4. Each tab maintains its own client-side state for filtering, sorting, and other interactions.

## Key Features

- **Tabbed Interface**: Clean separation of different data views with easy switching.
- **Preserved Functionality**: All features from both original pages are maintained.
- **Server-Side Data Loading**: Initial data for both views is loaded on the server for fast page loads.
- **Client-Side Interactivity**: Each tab maintains responsive client-side interactions.

## File Location

`app/data-combined/page.tsx`

## Related Components

The implementation leverages components that were originally in:

- `app/normwerte/` (now in `app/data-combined/_components` and `app/data-combined/_lib`) for normative data display
- `app/data-table-demo/` (now in `app/data-combined/_components` and `app/data-combined/_lib`) for sports performance data display

## Development Notes

- Colocation: \_components/ and \_lib/ for private route logic (non-routable).
- Static Export: Server component pre-builds data; no runtime fetches – JSON in \_data/.
- Refer to .vscode/project-structure.md for up-to-date file organization and imports.
