import { flexRender, TableOptions, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table';

interface DataTableProps<TData, TValue> {
    getTableRowClass?: (row: TData) => string;
    config: TableOptions<TData>;
}

export const DataTable = <TData, TValue>({ getTableRowClass, config }: DataTableProps<TData, TValue>) => {
    const table = useReactTable(config);

    return (
        <Table className="flex-1 min-h-0 overflow-auto relative">
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id} className="sticky top-0 bg-white z-10">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            );
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className={getTableRowClass?.(row.original) ?? ''}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={config.columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
