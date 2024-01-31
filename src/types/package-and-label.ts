import { TMould } from './mould'

export type TPackageAndLabel = {
  id: string
  name: string
  uomId: number
  secondaryUomId: number
  purchaseUomId: number
  partnerId: number
  categoryId: number
  itemCode: string
  note: string
  specs: {
    dimension: string
    spreadDimension: string
    thickness: number
    numberOfColors: number
  }
  moulds: TMould[]
}

export type TPackageAndLabelMutation = {
  name: string
  uomId: number
  partnerId?: number
  categoryId?: number
  itemCode?: string
  note?: string
  specs?: {
    dimension?: string
    spreadDimension?: string
    thickness?: number
    numberOfColors?: number
  }
  mould?: {
    location?: string
    dimension?: string
    mouldMakerId?: number
    itemCode?: string
    numberOfMoulds?: number
  }
}
