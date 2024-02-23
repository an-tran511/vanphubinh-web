import { TItem } from './item'
import { TMould, TNewMould } from './mould'

export type TPackageAndLabel = TItem & {
  specs?: {
    dimension?: string
    spreadDimension?: string
    thickness?: number
    numberOfColors?: number
  }
  moulds: TMould[]
  newMoulds: TNewMould[]
}
