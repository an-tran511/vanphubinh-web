import { fetchClient } from "@/utils/fetchClient"
import { ListResponse } from "./types"
import { Partner } from "@/validators/partner"
import { keepPreviousData, queryOptions } from "@tanstack/react-query"

export const getPartners = async (deps: string | object) => {
	const response = await fetchClient
		.url("/partners")
		.query(deps)
		.get()
		.json<ListResponse<Partner>>()
	return response
}

export const partnersQueryOptions = ({ deps }: { deps: string | object }) =>
	queryOptions({
		queryKey: ["partners", deps],
		queryFn: () => getPartners(deps),
		placeholderData: keepPreviousData,
		select: (data) => data,
	})

export const createPartner = async (data: object) => {
	const response = await fetchClient.url("/partners").post(data).json<Partner>()
	return response
}

export const updatePartner = async ({
	partnerId,
	data,
}: {
	partnerId: string
	data: object
}) => {
	const response = await fetchClient
		.url(`/partners/${partnerId}`)
		.put(data)
		.json<Partner>()
	return response
}

export const findPartnerById = async (partnerId: string) => {
	const response = await fetchClient
		.get(`/partners/${partnerId}`)
		.json<Partner>()
	return response
}

export const singlePartnerQueryOption = ({ id }: { id: string }) =>
	queryOptions({
		queryKey: ["partners", id],
		queryFn: () => findPartnerById(id),
	})

export const getMouldMakers = async (deps: string | object) => {
	const response = await fetchClient
		.url("/partners/mould-makers")
		.query(deps)
		.get()
		.json<ListResponse<Partner>>()
	return response
}

export const getMouldMakersOptions = async (deps: string | object) => {
	const { data } = await getMouldMakers(deps)
	return data
}
