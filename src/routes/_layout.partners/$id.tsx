import { createFileRoute, getRouteApi } from "@tanstack/react-router"
import { valibotResolver } from "mantine-form-valibot-resolver"
import {
	Text,
	Stack,
	TextInput,
	Textarea,
	Select,
	Group,
	OptionsFilter,
	ComboboxItem,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import {
	Partner,
	PartnerEditInput,
	PartnerInputSchema,
} from "@/validators/partner"
import { updatePartner } from "@/apis/partner"
import { singlePartnerQueryOption } from "@/apis/partner"
import { Show } from "@/components/crud/show"
import countries from "i18n-iso-countries"
import viLocale from "i18n-iso-countries/langs/vi.json"
import { allCountries } from "country-region-data"
import { useState } from "react"
import { queryClient } from "@/utils/queryClient"

countries.registerLocale(viLocale)

export const Route = createFileRoute("/_layout/partners/$id")({
	component: EditPartner,
})

const routeApi = getRouteApi("/_layout/partners/$id")

function EditPartner() {
	const { id } = routeApi.useParams()
	const [cityOptions, setCityOptions] = useState<ComboboxItem[]>([])
	const { data } = useSuspenseQuery(singlePartnerQueryOption({ id }))

	const form = useForm<PartnerEditInput>({
		validate: valibotResolver(PartnerInputSchema),
		initialValues: data,
	})

	const { mutate } = useMutation({
		mutationFn: updatePartner,
		onSuccess: (data: Partner) => {
			toast.success(`${data.name} đã được cập nhật thành công`)
			queryClient.invalidateQueries({ queryKey: ["partners", id] })
			form.resetDirty()
		},
	})
	form.watch("country", ({ value }) => {
		if (value === "VN") {
			const options = allCountries
				.find((c) => c[1] === value)?.[2]
				.map((city) => ({
					label: city[0],
					value: city[1],
				})) as ComboboxItem[]
			setCityOptions(options)
		} else {
			setCityOptions([])
			form.setFieldValue("city", "")
		}
	})

	const countriesFilter: OptionsFilter = ({ options, search }) => {
		const spllitedNormalizedSearch = search
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.trim()
			.split(" ")
		return (options as ComboboxItem[]).filter((option) => {
			const words = option.label.toLowerCase().trim().split(" ")
			return spllitedNormalizedSearch.every((searchWord) =>
				words.some((word: string) =>
					word
						.toLowerCase()
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.trim()
						.includes(searchWord),
				),
			)
		})
	}

	const citiesFilter: OptionsFilter = ({ options, search }) => {
		const spllitedNormalizedSearch = search
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.trim()
			.split(" ")
		return (options as ComboboxItem[]).filter((option) => {
			const words = option.label.toLowerCase().trim().split(" ")
			return spllitedNormalizedSearch.every((searchWord) =>
				words.some((word: string) =>
					word
						.toLowerCase()
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.trim()
						.includes(searchWord),
				),
			)
		})
	}
	const submitHandler = (data: PartnerEditInput) => {
		mutate({ partnerId: id, data })
	}

	return (
		<form onSubmit={form.onSubmit(submitHandler)}>
			<Show title="Đối tác" isDirty={form.isDirty()} reset={form.reset}>
				<Stack gap="sm" px={{ base: "lg", md: "lg" }} pt="md">
					<Stack gap="0">
						<Text size="sm" fw={500}>
							Mã đối tác
						</Text>
						<Text size="sm">{data.id}</Text>
					</Stack>
					<TextInput
						label="Tên"
						radius="md"
						withAsterisk
						{...form.getInputProps("name")}
					/>
					<TextInput
						label="Email"
						radius="md"
						{...form.getInputProps("email")}
					/>
					<TextInput
						label="Số điện thoại"
						radius="md"
						{...form.getInputProps("phone")}
					/>
					<TextInput
						label="Địa chỉ"
						radius="md"
						{...form.getInputProps("address")}
					/>
					<Group grow>
						<Select
							{...form.getInputProps("country")}
							label="Quốc gia"
							withAsterisk
							radius="md"
							searchable
							data={allCountries
								.sort((a) =>
									a[0] === "Vietnam" || a[0] === "Cambodia" ? -1 : 1,
								)
								.map((country) => ({
									label: countries.getName(country[1], "vi") || "",
									value: country[1],
								}))}
							filter={countriesFilter}
						/>
						<Select
							{...form.getInputProps("city")}
							searchable
							label="Tỉnh/Thành phố"
							radius="md"
							data={cityOptions}
							disabled={form.getValues().country !== "VN"}
							filter={citiesFilter}
						/>
					</Group>
					<Textarea
						{...form.getInputProps("notes")}
						label="Ghi chú"
						radius="md"
						minRows={2}
						autosize
					/>
				</Stack>
			</Show>
		</form>
	)
}
