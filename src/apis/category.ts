import { client } from '@/utils/client'
import { TUom } from 'types/uom'
import { TListResponse } from 'types/http'

export const getCategories = async (deps: string | object) => {
  const response = await client.url('/categories').query(deps).get()
  return response as TListResponse<TUom>
}

// export const createPartner = async (newPartner: NewPartner) => {
//   const response = await client.url('/uoms').post(newPartner);
//   return response as Partner;
// };
