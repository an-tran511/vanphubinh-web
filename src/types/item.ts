import { TPartner } from './partner'

export type TItem = {
  id: string
  name: string
  uomId: number
  secondaryUomId?: number
  purchaseUomId?: number
  partnerId?: number
  categoryId?: number
  firstItemCode?: string
  secondItemCode?: string
  suppliers?: TPartner[]
  partner?: TPartner
  note?: string
}
