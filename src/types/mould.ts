import { TItem } from './item'

export type TMould = TItem & {
  specs?: {
    location?: string
    dimension?: string
    numberOfMoulds?: number
  }
}
export type TNewMould = Omit<TMould, 'id' | 'uomId' | 'name'> & {
  mouldMakerId?: number
}
