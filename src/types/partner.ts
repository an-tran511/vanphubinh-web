export type TPartnerQuery = {
  searchValue: string
  page: number
  perPage: number
}

export type TPartner = {
  id: number
  name: string
  address: string
  phone: string
  email: string
  isCustomer: boolean
  isSupplier: boolean
}

export type TNewPartner = {
  name: string
  address: string
  phone: string
  email: string
  isCustomer: boolean
  isSupplier: boolean
}
