import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DataTable } from 'mantine-datatable'
import { List } from '@/components/crud/list'
import { useDisclosure } from '@mantine/hooks'
import { Badge, Box, Drawer, Group, TextInput } from '@mantine/core'
import { PartnerCreate } from './-components/create'
import { z } from 'zod'
import classes from '@/components/table/Table.module.css'
import { useEffect, useState } from 'react'
import { partnersQueryOptions } from '@/apis/query-options'
import { useDebouncedCallback } from 'use-debounce'
import { ListResponse } from '@/types/http'
import { Partner } from '@/types/partner'

const partnerSearchSchema = z.object({
  page: z.number().catch(1),
  searchValue: z.string().catch(''),
  // filter: z.string().catch(''),
  // sort: z.enum(['newest', 'oldest', 'price']).catch('newest'),
})

export const Route = createFileRoute('/partners/')({
  component: ListComponent,
  validateSearch: partnerSearchSchema,
  preSearchFilters: [
    (search) => ({
      ...search,
      page: search.page ?? 1,
      searchValue: search.searchValue ?? '',
    }),
  ],
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(partnersQueryOptions({ deps })),
})

function ListComponent() {
  const { useSearch } = Route
  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const { page, searchValue } = useSearch()
  const [searchValueDraft, setSearchValueDraft] = useState(searchValue ?? '')

  const postsQuery = useSuspenseQuery(
    partnersQueryOptions({
      deps: { page, searchValue: searchValue },
    }),
  )
  const partnerResponse = postsQuery.data as ListResponse<Partner>
  const partners = partnerResponse.data
  const meta = partnerResponse.meta
  const isLoading = postsQuery.isFetching || postsQuery.isLoading
  const columns = [
    {
      accessor: 'id',
      title: 'ID',
    },
    {
      accessor: 'name',
      title: 'Tên đối tác',
    },
    {
      accessor: 'phone',
      title: 'Số điện thoại',
    },
    {
      accessor: 'email',
      title: 'Email',
    },
    {
      accessor: 'address',
      title: 'Địa chỉ',
    },
    {
      accessor: '',
      title: 'Loại đối tác',
      render: (record: Partner) => {
        return (
          <Group gap="xs">
            {record.isCustomer ? (
              <Badge color="rgba(181, 163, 25, 1)" variant="light" size="sm">
                Khách hàng
              </Badge>
            ) : (
              <></>
            )}
            {record.isSupplier ? (
              <Badge color="dark" variant="light" size="sm">
                Nhà cung cấp
              </Badge>
            ) : (
              <></>
            )}
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
        search: () => ({ page: page, searchValue: searchValueDraft }),
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
    <List title="Đối tác" onCreateHandler={open} pagination={pagination}>
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
      <DataTable
        withTableBorder={false}
        minHeight={180}
        classNames={{
          header: classes.header,
          table: classes.table,
        }}
        fetching={isLoading}
        highlightOnHover
        columns={columns}
        records={partners}
        verticalSpacing="sm"
        verticalAlign="top"
        noRecordsText="Không có dữ liệu"
      />
      <Drawer
        opened={opened}
        onClose={close}
        title="Tạo đối tác"
        position="right"
      >
        <PartnerCreate closeModalCallback={close} />
      </Drawer>
    </List>
  )
}
