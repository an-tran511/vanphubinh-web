import { Partner } from './partner'

export type Item = {
  id: string
  name: string
  uomId: number
  secondaryUomId?: number
  purchaseUomId?: number
  partnerId?: number
  categoryId?: number
  firstItemCode?: string
  secondItemCode?: string
  suppliers?: Partner[]
  partner?: Partner
  note?: string
  images?: File[]
}
