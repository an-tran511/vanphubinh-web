import { PackageAndLabel } from '@/types/package-and-label'
import { client } from '@/utils/client'
import { PickAsRequired } from '@tanstack/react-router'

export const createPackageAndLabel = async ({
  ...newPackage
}: Partial<PackageAndLabel>) => {
  const { data: response } = await client.post('/packages-and-labels', {
    data: newPackage,
  })
  return response
}

export const updatePackageAndLabel = async ({
  id,
  ...packageAndLabel
}: PickAsRequired<Partial<PackageAndLabel>, 'id'>) => {
  const { data: response } = await client.put(`/packages-and-labels/${id}`, {
    data: packageAndLabel,
  })
  return response
}

export const getPackagesAndLabels = async (deps: string | object) => {
  const { data: response } = await client.get('/packages-and-labels', {
    params: deps,
  })
  return response
}

export const getPackageAndLabelById = async (id: string) => {
  const { data: response } = await client.get(`/packages-and-labels/${id}`)
  return response
}
