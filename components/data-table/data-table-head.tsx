import {TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {flexRender, Table} from "@tanstack/react-table";



export interface IDataTable<T> {
    table: Table<T>,
    alignHeadingText: 'text-center' | 'text-right' | 'text-left',
    className?: string
}
export default function DataTableHead<T, >({table, alignHeadingText, className}: IDataTable<T>) {
    return (
        <thead className={"sticky top-0 z-10"}>
            {table.getHeaderGroups().map((headerGroup) => {
                return (
                    <tr  key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            const {columnDef} = header.column
                            return (
                                <th
                                    scope="col"
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className={cn(
                                        'sticky z-20 top-0 bg-secondary text-primary max-w-fit font-medium text-md h-9',
                                        className,
                                        alignHeadingText
                                    )}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            )
                        })}
                    </tr>
                )
            })}
        </thead>
    )
}