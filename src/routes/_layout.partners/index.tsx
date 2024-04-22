import { ActionIcon, Group, Drawer } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import {
	createFileRoute,
	getRouteApi,
	useNavigate,
} from "@tanstack/react-router"
import { DataTable } from "mantine-datatable"
import { useState } from "react"
import { useDebouncedCallback } from "@mantine/hooks"
import { fallback, number, object, parse, string, optional } from "valibot"
import classes from "@/components/table/Table.module.css"
import { List } from "@/components/crud/list"
import { partnersQueryOptions } from "@/apis/partner"
import { PartnerCreate } from "./-components/create"
import { CursorClick, Eye } from "@phosphor-icons/react"
import { Partner } from "@/validators/partner"
import { DataTableColumnTextAlign } from "mantine-datatable"

const partnersSearchSchema = object({
	page: fallback(number(), 1),
	searchValue: optional(fallback(string(), "")),
	filterBy: optional(fallback(string(), "")),
	// sort: z.enum(['newest', 'oldest', 'price']).catch('newest'),
})

export const Route = createFileRoute("/_layout/partners/")({
	component: ListComponent,
	validateSearch: (search) => parse(partnersSearchSchema, search),
	preSearchFilters: [
		(search) => ({
			...search,
			page: search.page ?? 1,
			filterBy: (!!search.filterBy && search.filterBy) || undefined,
			searchValue: (!!search.searchValue && search.searchValue) || undefined,
		}),
	],
	loaderDeps: (search) => search.search,
	loader: ({ context: { queryClient }, deps }) =>
		queryClient.ensureQueryData(partnersQueryOptions({ deps })),
})

const routeApi = getRouteApi("/_layout/partners/")

function ListComponent() {
	const navigate = useNavigate({ from: Route.fullPath })
	const [opened, { open, close }] = useDisclosure(false)

	const { page, searchValue, filterBy } = routeApi.useSearch()
	const [searchValueDraft, setSearchValueDraft] = useState(searchValue ?? "")

	const { data, isFetching } = useQuery(
		partnersQueryOptions({
			deps: { page, searchValue, filterBy },
		}),
	)

	const meta = data?.meta
	const partners = data?.data
	const columns = [
		{
			accessor: "id",
			title: "Mã đối tác",
			textAlign: "right" as DataTableColumnTextAlign,
			width: "0%",
		},
		{
			accessor: "name",
			title: "Tên đối tác",
			noWrap: true,
		},
		{
			accessor: "phone",
			title: "Số điện thoại",
		},
		{
			accessor: "email",
			title: "Email",
		},
		{
			accessor: "address",
			title: "Địa chỉ",
		},
		{
			accessor: "notes",
			title: "Ghi chú",
		},
		{
			accessor: "actions",
			title: <CursorClick />,
			width: "8%",
			render: (partner: Partner) => (
				<Group>
					<ActionIcon
						size="sm"
						variant="light"
						onClick={() => navigate({ to: `/partners/${partner.id}` })}
					>
						<Eye size={12} weight="bold" />
					</ActionIcon>
				</Group>
			),
		},
	]

	const handleSearch = (searchValue: string) => {
		navigate({
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			search: (old: any) => ({
				...old,
				searchValue: (!!searchValue && searchValue) || undefined,
				page: 1,
			}),
		})
	}

	const pagination = {
		page: meta?.page ?? 1,
		lastPage: meta?.lastPage ?? 1,
		total: meta?.total ?? 0,
		onPageChange: (nextPage: number) => {
			navigate({
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				search: (old: any) => {
					return {
						...old,
						page: nextPage,
						// searchValue: searchValueDraft || undefined,
						// filterBy: filterDraft || undefined,
					}
				},
			})
		},
		isLoading: isFetching as boolean,
	}

	const debounced = useDebouncedCallback(handleSearch, 500)

	return (
		<List
			title="Đối tác"
			onCreateHandler={open}
			pagination={pagination}
			onSearch={(event) => {
				setSearchValueDraft(event.target.value)
				debounced(event.target.value)
			}}
			searchValue={searchValueDraft}
		>
			<DataTable
				withTableBorder={false}
				minHeight={180}
				classNames={{
					header: classes.header,
					table: classes.table,
				}}
				scrollAreaProps={{
					style: {
						overflowY: "auto",
					},
				}}
				fetching={isFetching}
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
				<PartnerCreate onClose={close} />
			</Drawer>
		</List>
	)
}
