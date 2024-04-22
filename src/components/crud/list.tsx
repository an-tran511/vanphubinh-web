import {
	Group,
	Stack,
	Card,
	Box,
	Button,
	Title,
	Pagination,
	Text,
	TextInput,
	em,
} from "@mantine/core"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { ReactNode } from "react"
import { useMediaQuery } from "@mantine/hooks"

interface ListProps {
	children: ReactNode
	title: string
	onCreateHandler: () => void
	pagination?: {
		isLoading: boolean
		total: number
		page: number
		lastPage: number
		onPageChange: (page: number) => void
	}
	onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
	searchValue?: string
}

export const List = (props: ListProps) => {
	const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

	const {
		title,
		children,
		onCreateHandler,
		pagination,
		onSearch,
		searchValue,
	} = props
	const {
		page,
		onPageChange,
		lastPage = 0,
		isLoading,
		total,
	} = pagination ?? {}

	return (
		<Stack h={{ base: "calc(100vh - 60px)", md: "100vh" }} gap="0">
			<Box
				px={{ base: "lg", md: "lg" }}
				py="md"
				style={{
					borderBottom: "1px solid var(--mantine-color-gray-3)",
				}}
			>
				<Group justify="space-between">
					<Group gap="xs">
						<Button
							size={isMobile ? "xs" : "sm"}
							variant="filled"
							justify="space-between"
							onClick={onCreateHandler}
							radius="md"
						>
							Mới
						</Button>
						<Title order={5}>{title}</Title>
					</Group>
					<TextInput
						leftSection={<MagnifyingGlass />}
						visibleFrom="md"
						radius="md"
						placeholder="Tìm kiếm"
						value={searchValue || ""}
						onChange={(event) => {
							onSearch(event)
						}}
					/>
				</Group>
			</Box>
			<Card py="0" px="0" h="100%" mah="100%" radius={0}>
				{children}
			</Card>
			{page && onPageChange && (
				<Box
					px={{ base: "md", md: "lg" }}
					style={{
						borderTop: "1px solid var(--mantine-color-gray-3)",
					}}
				>
					<Group justify="space-between" py="xs" visibleFrom="md">
						<Text size="sm" c="dimmed">
							Hiện{" "}
							<b>
								{(page - 1) * 30 + 1} - {page === lastPage ? total : page * 30}
							</b>{" "}
							trong tổng <b>{total}</b>
						</Text>
						<Pagination
							size="sm"
							disabled={isLoading}
							value={page}
							onChange={onPageChange}
							total={lastPage}
							withEdges
							radius="xl"
						/>
					</Group>
					<Group
						justify="space-between"
						py={{ base: "xs", md: "sm" }}
						hiddenFrom="md"
					>
						<Text c="dimmed" size="xs">
							<b>
								{(page - 1) * 30 + 1} - {page === lastPage ? total : page * 30}
							</b>{" "}
							/ <b>{total}</b>
						</Text>
						<Pagination.Root
							total={lastPage}
							disabled={isLoading}
							size="xs"
							onChange={onPageChange}
							radius="xl"
						>
							<Group gap={7} justify="center">
								<Pagination.Previous />
								<Text size="xs">
									{page} / {lastPage}
								</Text>
								<Pagination.Next />
							</Group>
						</Pagination.Root>
					</Group>
				</Box>
			)}
		</Stack>
	)
}
