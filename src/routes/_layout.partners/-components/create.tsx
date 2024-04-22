import {
	Button,
	ComboboxItem,
	Group,
	OptionsFilter,
	Stack,
	Select,
	TextInput,
	Textarea,
} from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "@mantine/form"
import { toast } from "sonner"
import {
	Partner,
	PartnerCreateInput,
	PartnerInputSchema,
} from "@/validators/partner"
import { createPartner } from "@/apis/partner"
import { allCountries } from "country-region-data"
import { useState } from "react"
import countries from "i18n-iso-countries"
import viLocale from "i18n-iso-countries/langs/vi.json"
import { valibotResolver } from "mantine-form-valibot-resolver"

countries.registerLocale(viLocale)

interface PartnerCreateProps {
	onClose: () => void
}
export function PartnerCreate(props: PartnerCreateProps) {
	const { onClose } = props
	const queryClient = useQueryClient()
	const [cityOptions, setCityOptions] = useState<ComboboxItem[]>([])

	const form = useForm<PartnerCreateInput>({
		mode: "uncontrolled",
		validate: valibotResolver(PartnerInputSchema),
		initialValues: {
			name: "",
			email: "",
			phone: "",
			address: "",
			notes: "",
			city: "",
			country: "",
		},
	})

	const { mutate, isPending } = useMutation({
		mutationFn: createPartner,
		onSuccess: (data: Partner) => {
			queryClient.invalidateQueries({ queryKey: ["partners"] })
			toast.success(`${data.name} đã được tạo thành công`)
			onClose()
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

	const submitHandler = (data: PartnerCreateInput) => {
		mutate(data)
	}

	return (
		<form onSubmit={form.onSubmit(submitHandler)}>
			<Stack>
				<TextInput
					label="Tên"
					radius="md"
					withAsterisk
					{...form.getInputProps("name")}
				/>
				<TextInput label="Email" radius="md" {...form.getInputProps("email")} />
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
							.sort((a) => (a[0] === "Vietnam" || a[0] === "Cambodia" ? -1 : 1))
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
				<Button radius="md" type="submit" loading={isPending}>
					Tạo
				</Button>
			</Stack>
		</form>
	)
}
