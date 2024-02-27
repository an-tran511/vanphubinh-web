import { PackageAndLabel } from '@/types/package-and-label'
import { ListResponse } from '@/types/http'
import { client } from '@/utils/client'
import { PickAsRequired } from '@tanstack/react-router'

export const createPackageAndLabel = async ({
  ...newPackage
}: Partial<PackageAndLabel>) => {
  const response = await client.url('/packages-and-labels').post(newPackage)
  return response as PackageAndLabel
}

export const updatePackageAndLabel = async ({
  id,
  ...packageAndLabel
}: PickAsRequired<Partial<PackageAndLabel>, 'id'>) => {
  const response = await client
    .url(`/packages-and-labels/${id}`)
    .put(packageAndLabel)
  return response as PackageAndLabel
}

export const getPackagesAndLabels = async (deps: string | object) => {
  const response = await client.url('/packages-and-labels').query(deps).get()
  return response as ListResponse<PackageAndLabel>
}

export const getPackageAndLabelById = async (id: string) => {
  const response = await client.url(`/packages-and-labels/${id}`).get()
  return response as PackageAndLabel
}
