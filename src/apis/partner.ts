import { client } from '@/utils/client'
import { Partner, NewPartner } from 'types/partner'
import { ListResponse } from 'types/http'

export const getPartners = async (deps: string | object) => {
  const response = await client.url('/partners').query(deps).get()
  return response as ListResponse<Partner>
}

export const createPartner = async ({ ...newPartner }: Partial<Partner>) => {
  const response = await client.url('/partners').post(newPartner)
  return response as Partner
}
