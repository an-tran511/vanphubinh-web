import { client } from '@/utils/client'
import { Partner } from '@/types/partner'

export const getPartners = async (deps: string | object) => {
  const { data: response } = await client.get('/partners', { params: deps })

  return response
}

export const createPartner = async ({ ...newPartner }: Partial<Partner>) => {
  const { data: response } = await client.post('/partners', {
    data: newPartner,
  })
  return response
}
