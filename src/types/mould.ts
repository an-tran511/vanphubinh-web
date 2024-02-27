import { Item } from './item'

export type Mould = Item & {
  specs?: {
    location?: string
    dimension?: string
    numberOfMoulds?: number
    serialNumber?: string
    mouldMakerId?: number
  }
}
export type NewMould = Omit<Mould, 'id' | 'uomId' | 'name'>
