import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DataTable } from 'mantine-datatable'
import { List } from '@/components/crud/list'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { Badge, Drawer, Group } from '@mantine/core'
import { PartnerCreate } from './-components/create'
import { z } from 'zod'
import classes from '@/components/table/Table.module.css'
import { useEffect, useState } from 'react'
import { partnersQueryOptions } from '@/apis/query-options'
import { TListResponse } from 'types/http'
import { TPartner } from 'types/partner'

const partnerSearchSchema = z.object({
  page: z.number().catch(1),
  searchValue: z.string().catch(''),
  // filter: z.string().catch(''),
  // sort: z.enum(['newest', 'oldest', 'price']).catch('newest'),
})

export const Route = createFileRoute('/partners/')({
  component: DashboardComponent,
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

function DashboardComponent() {
  const { useSearch } = Route
  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const { page, searchValue } = useSearch()
  const [searchValueDraft, setSearchValueDraft] = useState(searchValue ?? '')
  const [debouncedSearchValueDraft] = useDebouncedValue(searchValueDraft, 500)

  useEffect(() => {
    navigate({
      search: (old: any) => {
        return {
          ...old,
          searchValue: debouncedSearchValueDraft,
          page: page ? page : 1,
        }
      },
      replace: true,
    })
  }, [debouncedSearchValueDraft, page])

  const postsQuery = useSuspenseQuery(
    partnersQueryOptions({
      deps: { page, searchValue: debouncedSearchValueDraft },
    }),
  )
  const partnerResponse = postsQuery.data as TListResponse<TPartner>
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
      render: (record: TPartner) => {
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
        search: () => ({ page: page, searchValue: debouncedSearchValueDraft }),
      })
    },
    isLoading,
  }

  return (
    <List title="Đối tác" onCreateHandler={open} pagination={pagination}>
      {/* <Box px={{ base: 'md', md: 'lg' }} py="md" bg="white">
        <Group justify="space-between">
          <TextInput 
            variant="default"
            placeholder="Tìm kiếm"
            value={searchValueDraft}
            onChange={(event) => setSearchValueDraft(event.currentTarget.value)}
          />
          <Group gap="xs">
            <ActionIcon aria-label="Settings" variant="light" size="lg">
              <ListIcon size={16} />
            </ActionIcon>
            <ActionIcon aria-label="Settings" variant="light" size="lg" color="gray">
              <SquaresFour size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Box> */}
      <DataTable
        withTableBorder
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
