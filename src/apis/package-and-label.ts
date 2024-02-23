import {
  TPackageAndLabel,
  TPackageAndLabelMutation,
} from '@/types/package-and-label'
import { TListResponse } from '@/types/http'
import { client } from '@/utils/client'
import { PickAsRequired } from '@tanstack/react-router'

export const createPackageAndLabel = async ({
  ...newPackage
}: Partial<TPackageAndLabel>) => {
  const response = await client.url('/packages-and-labels').post(newPackage)
  return response as TPackageAndLabel
}

export const updatePackageAndLabel = async ({
  id,
  ...packageAndLabel
}: PickAsRequired<Partial<TPackageAndLabel>, 'id'>) => {
  const response = await client
    .url(`/packages-and-labels/${id}`)
    .put(packageAndLabel)
  return response as TPackageAndLabel
}

export const getPackagesAndLabels = async (deps: string | object) => {
  const response = await client.url('/packages-and-labels').query(deps).get()
  return response as TListResponse<TPackageAndLabel>
}

export const getPackageAndLabelById = async (id: string) => {
  const response = await client.url(`/packages-and-labels/${id}`).get()
  return response as TPackageAndLabel
}
