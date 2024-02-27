import { client } from '@/utils/client'
import { Uom } from '@/types/uom'
import { ListResponse } from '@/types/http'

export const getCategories = async (deps: string | object) => {
  const response = await client.url('/categories').query(deps).get()
  return response as ListResponse<Uom>
}

// export const createPartner = async (newPartner: NewPartner) => {
//   const response = await client.url('/uoms').post(newPartner);
//   return response as Partner;
// };
