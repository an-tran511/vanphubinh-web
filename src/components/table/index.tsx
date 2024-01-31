import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Center, Stack, Table, Text } from '@mantine/core';

import classes from './Table.module.css';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isPlaceholderData?: boolean;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
      },
    },
    manualPagination: true,
  });
  return (
    <Table verticalSpacing="sm" stickyHeader h="100%">
      <Table.Thead className={classes.header}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <Table.Th key={header.id}>
                  <Text size="xs" c="black" fw={700} truncate="end">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </Text>
                </Table.Th>
              );
            })}
          </Table.Tr>
        ))}
      </Table.Thead>

      <Table.Tbody pos="relative" bg="white">
        {isLoading ? (
          <></>
        ) : table.getRowModel()?.rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              ))}
            </Table.Tr>
          ))
        ) : (
          <Table.Tr h="100%">
            <Table.Td colSpan={columns.length} h="100%">
              <Stack align="center" justify="center">
                <Center></Center>
                <Text c="dimmed">Không có dữ liệu</Text>
              </Stack>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
};
