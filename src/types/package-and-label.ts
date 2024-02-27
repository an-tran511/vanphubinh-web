import { Item } from './item'
import { Mould, NewMould } from './mould'

export type PackageAndLabel = Item & {
  specs?: {
    dimension?: string
    spreadDimension?: string
    thickness?: number
    numberOfColors?: number
    serialNumber?: number
  }
  moulds: Mould[]
  newMoulds: NewMould[]
}
