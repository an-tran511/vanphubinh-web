import { TPartner } from './partner'

export type TMouldMutation = {
  name: string
  uomId: number
  partnerId?: number
  categoryId?: number
  itemCode?: string
  note?: string
  specs?: {
    location?: string
    dimension?: string
    numberOfMoulds?: number
    mouldMakerId?: number
  }
}

export type TMould = {
  partner: TPartner
  id: string
  name: string
  uomId: number
  partnerId?: number
  categoryId?: number
  itemCode?: string
  note?: string
  specs?: {
    location?: string
    dimension?: string
    numberOfMoulds?: number
    mouldMakerId?: number
  }
}
