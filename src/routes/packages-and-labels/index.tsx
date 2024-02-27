import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DataTable } from 'mantine-datatable'
import { List } from '@/components/crud/list'
import { ActionIcon, Box, Group, TextInput } from '@mantine/core'
import { z } from 'zod'
import classes from '@/components/table/Table.module.css'
import { useState } from 'react'
import { packagesAndLabelsQueryOptions } from '@/apis/query-options'
import { Eye, Trash } from '@phosphor-icons/react'
import { PackageAndLabel } from '@/types/package-and-label'
import { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

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
  const navigate = useNavigate({ from: '/packages-and-labels/' })
  const { page, searchValue } = useSearch()
  const [searchValueDraft, setSearchValueDraft] = useState(searchValue ?? '')

  const packagesQuery = useSuspenseQuery(
    packagesAndLabelsQueryOptions({
      page,
      searchValue: searchValue,
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
      accessor: 'specs.numberOFColors',
      title: 'Độ dày',
    },

    {
      accessor: 'partner.name',
      title: 'Khách hàng',
    },
    {
      accessor: 'actions',
      title: 'Thao tác',
      render: (item: PackageAndLabel) => {
        return (
          <Group>
            <ActionIcon
              aria-label="Settings"
              size="sm"
              variant="light"
              onClick={() =>
                navigate({ to: `/packages-and-labels/${item.id}` })
              }
            >
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
        search: (old: any) => {
          return {
            ...old,
            page: page,
          }
        },
      })
    },
    isLoading,
  }

  useEffect(() => {
    if (pagination.page > pagination.lastPage) {
      navigate({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        search: (old: any) => {
          return {
            ...old,
            page: 1,
          }
        },
      })
    }
  }, [navigate, pagination.lastPage, pagination.page])

  const handleSearch = (searchValue: string) => {
    navigate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: (old: any) => {
        return {
          ...old,
          searchValue: searchValue,
          page: 1,
        }
      },
    })
  }

  const debounced = useDebouncedCallback(handleSearch, 500)

  return (
    <List title="Bao bì & nhãn mác" pagination={pagination}>
      <Box py="md" px="lg" bg="white">
        <Group>
          <TextInput
            visibleFrom="md"
            radius="md"
            placeholder="Tìm kiếm"
            value={searchValueDraft}
            onChange={(event) => {
              setSearchValueDraft(event.currentTarget.value)
              debounced(event.target.value)
            }}
          />
          <TextInput
            size="xs"
            hiddenFrom="md"
            radius="md"
            placeholder="Tìm kiếm"
            value={searchValueDraft}
            onChange={(event) => {
              setSearchValueDraft(event.currentTarget.value)
              debounced(event.target.value)
            }}
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
        withTableBorder={false}
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
