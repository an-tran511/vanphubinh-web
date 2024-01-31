import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DataTable } from 'mantine-datatable'
import { List } from '@/components/crud/list'
import { useDebouncedValue } from '@mantine/hooks'
import { ActionIcon, Box, Group, TextInput } from '@mantine/core'
import { z } from 'zod'
import classes from '@/components/table/Table.module.css'
import { useState } from 'react'
import { packagesAndLabelsQueryOptions } from '@/apis/query-options'
import { Eye, Trash } from '@phosphor-icons/react'

const packageSearchSchema = z.object({
  page: z.number().catch(1),
  searchValue: z.string().catch(''),
  // filter: z.string().catch(''),
  // sort: z.enum(['newest', 'oldest', 'price']).catch('newest'),
})

export const Route = createFileRoute('/packages-and-labels/')({
  component: ListComponent,
  validateSearch: packageSearchSchema,
  preSearchFilters: [
    (search) => ({
      ...search,
      page: search.page ?? 1,
      searchValue: search.searchValue ?? '',
    }),
  ],
  loaderDeps: ({ search: { page, searchValue } }) => ({ page, searchValue }),
  loader: ({ context: { queryClient }, deps }) => {
    queryClient.ensureQueryData(packagesAndLabelsQueryOptions(deps))
  },
})

function ListComponent() {
  const { useSearch } = Route
  const navigate = useNavigate()
  const { page, searchValue } = useSearch()
  const [searchValueDraft, setSearchValueDraft] = useState(searchValue ?? '')
  const [debouncedSearchValueDraft] = useDebouncedValue(searchValueDraft, 500)

  // useEffect(() => {
  //   navigate({
  //     search: (old) => {
  //       return {
  //         ...old,
  //         searchValue: debouncedSearchValueDraft,
  //         page: 1,
  //       };
  //     },
  //     replace: true,
  //   });
  // }, [debouncedSearchValueDraft]);

  // useEffect(() => {
  //   navigate({
  //     search: (old) => {
  //       return {
  //         ...old,
  //         page: page ?? 1,
  //       };
  //     },
  //   });
  // }, [page]);

  const packagesQuery = useSuspenseQuery(
    packagesAndLabelsQueryOptions({
      page,
      searchValue: debouncedSearchValueDraft,
    }),
  )
  const packages = packagesQuery.data.data
  const meta = packagesQuery.data.meta
  const isLoading = packagesQuery.isFetching || packagesQuery.isLoading
  const columns = [
    {
      accessor: 'id',
      title: 'Mã hàng hoá',
    },
    {
      accessor: 'name',
      title: 'Tên sản phẩm',
    },
    {
      accessor: 'specs.dimension',
      title: 'Kích thước',
    },
    {
      accessor: 'specs.dimension',
      title: 'Kích thước trải',
    },
    {
      accessor: 'specs.numberOFColors',
      title: 'Độ dày',
    },
    {
      accessor: 'specs.numberOFColors',
      title: 'Số màu',
    },
    {
      accessor: 'partner.name',
      title: 'Khách hàng',
    },
    {
      accessor: '',
      title: 'Thao tác',
      render: () => {
        return (
          <Group>
            <ActionIcon aria-label="Settings" size="sm" variant="light">
              <Eye size={14} weight="bold" />
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="red"
              size="sm"
              aria-label="Settings"
            >
              <Trash size={14} weight="bold" />
            </ActionIcon>
          </Group>
        )
      },
    },
  ]

  const pagination = {
    page: meta.currentPage,
    lastPage: meta.lastPage,
    total: meta.total,
    onPageChange: (page: number) => {
      navigate({
        search: () => ({ page: page, searchValue: debouncedSearchValueDraft }),
      })
    },
    isLoading,
  }

  return (
    <List title="Bao bì & nhãn mác" pagination={pagination}>
      <Box py="md" px="xl" bg="white">
        <Group>
          <TextInput
            visibleFrom="md"
            radius="md"
            placeholder="Tìm kiếm"
            value={searchValueDraft}
            onChange={(event) => setSearchValueDraft(event.currentTarget.value)}
          />
          <TextInput
            size="xs"
            hiddenFrom="md"
            radius="md"
            placeholder="Tìm kiếm"
            value={searchValueDraft}
            onChange={(event) => setSearchValueDraft(event.currentTarget.value)}
          />
        </Group>
      </Box>
      {/* <Modal
        radius={0}
        classNames={{
          header: modalClasses.header,
          // root: modalClasses.root,
        }}
        size="55%"
        fullScreen
        opened={opened}
        onClose={close}
        title={<Title order={4}>Thêm bao bì</Title>}
      >
        <CreateComponent />
      </Modal> */}
      <DataTable
        withTableBorder
        minHeight={180}
        classNames={{
          root: classes.root,
          header: classes.header,
          table: classes.table,
        }}
        fetching={isLoading}
        highlightOnHover
        columns={columns}
        records={packages}
        verticalSpacing="sm"
        verticalAlign="top"
        noRecordsText="Không có dữ liệu"
      />
    </List>
  )
}
