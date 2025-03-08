"use client"
import {ColumnDef, ColumnFiltersState, FilterFn, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {Dispatch, SetStateAction} from "react";
import {Table} from "@/components/ui/table";
import DataTableHead from "@/components/data-table/data-table-head";
import DataTableBody from "@/components/data-table/data-table-body";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";

export type TPagination = {
    pageIndex: number
    pageSize: number
}

export type TFiltersConfig = {
    columnFilters: ColumnFiltersState,
    setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>,
    globalFilter: string,
    setGlobalFilter: Dispatch<SetStateAction<string>>
}

export type TDataTableProps<T> = {
    columnDefinitions: ColumnDef<T>[]
    data: T[]
    pagination: TPagination
    setPagination: Dispatch<SetStateAction<TPagination>>
    filters?: TFiltersConfig
    filterFns?: Record<string, FilterFn<any>>
    getFilteredRowModel?: any
    isLoading?: boolean
    cellClassName?: string
    className?: string
}

export default function DataTable<T>({props, children}: { props: TDataTableProps<T>, children?: React.ReactNode }) {
    const table = useReactTable({
        data: props.data,
        columns: props.columnDefinitions,
        manualPagination: true,
        state: {
            pagination: props.pagination,
            columnFilters: props.filters?.columnFilters,
            globalFilter: props.filters?.globalFilter
        },
        rowCount: props.data.length,
        onPaginationChange: props.setPagination,
        onColumnFiltersChange: props.filters?.setColumnFilters,
        onGlobalFilterChange: props.filters?.setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: props.getFilteredRowModel,
        filterFns: props.filterFns
    });

    if (props.isLoading) {
        return (
            <div className="w-full h-[500px] overflow-auto relative rounded-md border p-4">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    {Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={"w-full h-full overflow-auto relative rounded-md border"}>
            <Table className={cn("w-full", props.className)}>
                <DataTableHead table={table} alignHeadingText="text-center"/>
                <DataTableBody table={table} data={props.data} alignCellText={"text-center"}/>
                {children}
            </Table>
        </div>
    )
}