import {flexRender, Table} from "@tanstack/react-table";
import {TableBody, TableCell, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";


export interface IDataTable<T> {
    table: Table<T>,
    data: T[],
    alignCellText: 'text-center' | 'text-right' | 'text-left',
    className?: string
    rowClassName?: string
    cellClassName?: string
}

export default function DataTableBody<T, >({
                                               table,
                                               data,
                                               className,
                                               rowClassName,
                                               cellClassName,
                                               alignCellText
                                           }: IDataTable<T>) {

    return (
        // <div className={"h-[400px] w-full overflow-scroll"}>
            <TableBody className={cn("w-full", className)}>
                {
                    (Array.isArray(data) && data.length > 0) ? table.getRowModel()?.rows.map((row) => {
                        return (
                            <TableRow className={rowClassName} key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                        return (
                                            <TableCell key={cell.id} className={cn(cellClassName, alignCellText)}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>)
                                    }
                                )}
                            </TableRow>)
                    }) : null
                }
            </TableBody>
        // </div>

    )
}