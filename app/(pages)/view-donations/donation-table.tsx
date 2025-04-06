"use client"
import DataTable, {TDataTableProps, TPagination} from "@/components/data-table/data-table";
import {ColumnDef, ColumnFiltersState, FilterFn, getFilteredRowModel} from "@tanstack/react-table";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {addDays, format} from "date-fns";
import {useQuery} from "@tanstack/react-query";
import {DateRangePicker} from "@/components/date-range-picker/date-range-picker";
import {getDonationsForCreator} from "@/app/(pages)/view-donations/action";
import {useIsMobile} from "@/hooks/use-mobile";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

export type TDonation = {
    donationId: number,
    donationDate: string,
    donationAmount: number,
    donationMessage: string | null,
    creatorId: number,
    userId: number | null,
    userName?: string
}

// Custom filter function for date ranges
const dateRangeFilter: FilterFn<TDonation> = (row, columnId, value: [Date, Date]) => {
    const rowDate = new Date(row.getValue(columnId) as string);
    const [start, end] = value;

    // If no dates selected, show all rows
    if (!start || !end) return true;

    // Check if date falls within range
    return rowDate >= start && rowDate <= end;
};

// Custom filter function for minimum donation amount
const amountFilter: FilterFn<TDonation> = (row, columnId, value: number) => {
    const amount = row.getValue(columnId) as number;
    return amount >= value;
};

// Global search filter that checks all searchable columns
const globalFilter: FilterFn<TDonation> = (row, columnId, value) => {
    const searchValue = String(value).toLowerCase();

    // Add columns you want to search here
    const searchableColumns = ['donationMessage', 'donor'];

    for (const column of searchableColumns) {
        const cellValue = row.getValue(column) as string | null;
        if (cellValue && String(cellValue).toLowerCase().includes(searchValue)) {
            return true;
        }
    }

    // Also check donation amount
    const amount = row.getValue('donationAmount') as number;
    if (amount && String(amount).includes(searchValue)) {
        return true;
    }

    return false;
};

export function DonationTable({creatorId}: { creatorId: number }) {
    const [pagination, setPagination] = useState<TPagination>({pageIndex: 0, pageSize: 10});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [dateRange, setDateRange] = useState({
        from: addDays(new Date(), -30),
        to: new Date(),
    });
    const [minAmount, setMinAmount] = useState<number | ''>('');
    const isMobile = useIsMobile();

    // Use prefetched data from the server
    const {data: donations = [], isLoading} = useQuery({
        queryKey: ['donations', creatorId],
        queryFn: () => getDonationsForCreator(creatorId)
        // placeholderData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => ({
        //     donationId: id,
        //     donationDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
        //     donationAmount: Math.floor(Math.random() * 10000) + 100,
        //     donationMessage: id % 3 === 0 ? null : `Thank you for your amazing content! #${id}`,
        //     creatorId: 1,
        //     userId: id % 2 === 0 ? id + 100 : null,
        //     userName: "asdsada"
        // }))
    });

    // Apply filters when they change
    const applyFilters = () => {
        const newFilters = [...columnFilters];

        // Update or add date filter
        if (dateRange.from && dateRange.to) {
            const dateFilterIndex = newFilters.findIndex(f => f.id === 'donationDate');
            if (dateFilterIndex >= 0) {
                newFilters[dateFilterIndex] = {
                    id: 'donationDate',
                    value: [dateRange.from, dateRange.to]
                };
            } else {
                newFilters.push({
                    id: 'donationDate',
                    value: [dateRange.from, dateRange.to]
                });
            }
        }

        // Update or add amount filter
        if (minAmount !== '') {
            const amountFilterIndex = newFilters.findIndex(f => f.id === 'donationAmount');
            if (amountFilterIndex >= 0) {
                newFilters[amountFilterIndex] = {
                    id: 'donationAmount',
                    value: minAmount
                };
            } else {
                newFilters.push({
                    id: 'donationAmount',
                    value: minAmount
                });
            }
        }

        setColumnFilters(newFilters);
    };

    const clearFilters = () => {
        setColumnFilters([]);
        setGlobalFilterValue('');
        setDateRange({
            from: addDays(new Date(), -30),
            to: new Date(),
        });
        setMinAmount('');
    }

    const columnDefinitions: ColumnDef<TDonation>[] = [
        {
            id: 'sn',
            header: 'S. No.',
            cell: ({row}) => (
                <p className="pl-3">
                    {row.index + 1}
                </p>
            ),
        },
        {
            header: "Amount",
            accessorKey: "donationAmount",
            cell: ({row}) => (
                <p>
                    Rs.{row.original.donationAmount}
                </p>
            ),
            filterFn: amountFilter
        },
        {
            header: "Date",
            accessorKey: "donationDate",
            cell: ({row}) => format(new Date(row.original.donationDate), 'MMM dd, yyyy'),
            filterFn: dateRangeFilter
        },
        {
            header: "Message",
            accessorKey: "donationMessage",
            cell: ({row}) => row.original.donationMessage || "-"
        },
        {
            header: "Supporter",
            accessorKey: "userName",
            cell: ({row}) => row.original.userName || "Anonymous"
        },
        {
            header: "View",
            cell: ({row}) => (
                <Button className={"bg-blue-500 text-white p-2 rounded-md"} onClick={() => {
                    alert(`Donation ID: ${row.original.donationId}`)
                }}>
                    View
                </Button>
            )
        }
    ];

    const props: TDataTableProps<TDonation> = {
        columnDefinitions: columnDefinitions,
        data: donations as TDonation[],
        pagination: pagination,
        setPagination: setPagination,
        filters: {
            columnFilters,
            setColumnFilters,
            globalFilter: globalFilterValue,
            setGlobalFilter: setGlobalFilterValue
        },
        filterFns: {
            dateRange: dateRangeFilter,
            amount: amountFilter,
            global: globalFilter
        },
        getFilteredRowModel: getFilteredRowModel(),
        isLoading
    };

    return (
        <div className="space-y-6">
            {!isMobile ?
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-1/3">
                        <label className="text-sm font-medium mb-1 block">Search</label>
                        <Input
                            placeholder="Search donations..."
                            value={globalFilterValue}
                            onChange={(e) => setGlobalFilterValue(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="w-full md:w-1/3">
                        <label className="text-sm font-medium mb-1 block">Date Range</label>
                        <DateRangePicker
                            date={dateRange}
                            onSelect={(range) => {
                                setDateRange(range);
                            }}
                        />
                    </div>

                    <div className="w-full md:w-1/4">
                        <label className="text-sm font-medium mb-1 block">Min Amount</label>
                        <Input
                            type="number"
                            placeholder="Minimum amount"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <Button onClick={applyFilters} className="bg-primary">
                        Apply Filters
                    </Button>

                    <Button onClick={clearFilters} variant="secondary">
                        Clear Filters
                    </Button>
                </div> :
                <Popover>
                    <PopoverTrigger asChild>
                        <Button>
                            Filters
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={"space-y-6"}>
                        <div className="w-full">
                            <label className="text-sm font-medium mb-1 block">Search</label>
                            <Input
                                placeholder="Search donations..."
                                value={globalFilterValue}
                                onChange={(e) => setGlobalFilterValue(e.target.value)}
                                className="w-full"
                            />
                        </div>
p
                        <div className="w-full">
                            <label className="text-sm font-medium mb-1 block">Date Range</label>
                            <DateRangePicker
                                date={dateRange}
                                onSelect={(range) => {
                                    setDateRange(range);
                                }}
                            />
                        </div>

                        <div className="w-full ">
                            <label className="text-sm font-medium mb-1 block">Min Amount</label>
                            <Input
                                type="number"
                                placeholder="Minimum amount"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <Button onClick={applyFilters} className="bg-primary">
                            Apply Filters
                        </Button>
                        <Button onClick={clearFilters} variant={"secondary"}>
                            Clear Filters
                        </Button>
                    </PopoverContent>
                </Popover>
            }

            <DataTable props={props}/>
        </div>
    );
}