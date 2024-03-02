import { client } from '@/utils/client'

export const getCategories = async (deps: string | object) => {
  const { data: response } = await client.get('/categories', { params: deps })
  return response
}

// export const createPartner = async (newPartner: NewPartner) => {
//   const response = await client.url('/uoms').post(newPartner);
//   return response as Partner;
// };
