import {
	Input,
	object,
	string,
	toTrimmed,
	email,
	minLength,
	union,
	literal,
	optional,
} from "valibot"

export const PartnerInputSchema = object({
	name: string([minLength(1, "Trường bắt buộc")]),
	phone: string(),
	email: union([
		string([toTrimmed(), email("Email không hợp lệ")]),
		literal(""),
	]),
	address: string(),
	notes: string(),
	country: string([minLength(2, "Trường bắt buộc")]),
	city: optional(string()),
})

export type PartnerCreateInput = Input<typeof PartnerInputSchema>
export type PartnerEditInput = Input<typeof PartnerInputSchema>
export type Partner = PartnerCreateInput & {
	id: string
}
