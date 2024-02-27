import { partnersQueryOptions } from '@/apis/query-options'
import { CreatableSelect } from '@/components/select'
import { PackageAndLabel } from '@/types/package-and-label'
import { Partner } from '@/types/partner'
import {
  Card,
  CloseButton,
  ComboboxChevron,
  NumberInput,
  SimpleGrid,
  Stack,
  TextInput,
  Group,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldValues,
  UseFieldArrayRemove,
  UseFormStateReturn,
} from 'react-hook-form'

interface newMouldsubFormProps {
  control: Control<PackageAndLabel>
  field: FieldArrayWithId<PackageAndLabel, 'newMoulds', 'id'>
  i: number
  remove: UseFieldArrayRemove
}
export const SubMouldForm = (props: newMouldsubFormProps) => {
  const { control, field, i, remove } = props

  const [searchPartnerDraft, setSearchPartnerDraft] = useState('')
  const [debouncedSearchPartnerDraft] = useDebouncedValue(
    searchPartnerDraft,
    300,
  )
  const partnersQuery = useSuspenseQuery(
    partnersQueryOptions({
      deps: { page: 1, searchValue: debouncedSearchPartnerDraft },
      noMeta: true,
    }),
  )
  const partners = partnersQuery.data as Partner[]
  const partnerOptions = useMemo(() => {
    return partners
      ? partners.map((item: Partner) => ({
          label: String(item.name),
          value: String(item.id),
        }))
      : []
  }, [partners])
  const onSearchPartner = (value: string) => {
    setSearchPartnerDraft(value)
  }
  const partnerSelectLoading = partnersQuery.isFetching

  //Mould maker
  const [searchMouldMakerDraft, setSearchMouldMakerDraft] = useState('')
  const [debouncedSearchMouldMakerDraft] = useDebouncedValue(
    searchMouldMakerDraft,
    300,
  )
  const mouldMakersQuery = useSuspenseQuery(
    partnersQueryOptions({
      deps: { page: 1, searchValue: debouncedSearchMouldMakerDraft },
      noMeta: true,
    }),
  )
  const mouldMakers = mouldMakersQuery.data as Partner[]
  const mouldMakerOptions = useMemo(() => {
    return mouldMakers
      ? mouldMakers.map((item: Partner) => ({
          label: String(item.name),
          value: String(item.id),
        }))
      : []
  }, [mouldMakers])
  const onSearchMouldMaker = (value: string) => {
    setSearchMouldMakerDraft(value)
  }
  const mouldMakerSelectLoading = mouldMakersQuery.isFetching

  return (
    <Card withBorder radius="md" key={`new-mould-${i}`} shadow="xs">
      <Group justify="flex-end">
        <CloseButton onClick={() => remove(i)} m={0} p={0} size="sm" />
      </Group>
      <Stack gap="sm">
        <SimpleGrid
          cols={{ base: 1, md: 3 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing="md"
        >
          <Controller
            key={`partnerId-${field.id}`}
            name={`newMoulds.${i}.partnerId`}
            control={control}
            render={({
              field,
              formState: { errors },
            }: {
              field: FieldValues
              formState: UseFormStateReturn<PackageAndLabel>
            }) => (
              <CreatableSelect
                {...field}
                error={errors.newMoulds?.[i]?.partnerId?.message}
                size="sm"
                radius="md"
                label="Khách hàng"
                withAsterisk
                data={partnerOptions}
                searchable
                creatable
                onSearchChange={onSearchPartner}
                isLoadingOptions={partnerSelectLoading}
                rightSection={<ComboboxChevron />}
                rightSectionPointerEvents="none"
              />
            )}
          />
          <Group grow>
            <Controller
              key={`firstItemCode-${field.id}`}
              name={`newMoulds.${i}.firstItemCode`}
              control={control}
              render={({
                field,
                formState: { errors },
              }: {
                field: FieldValues
                formState: UseFormStateReturn<PackageAndLabel>
              }) => (
                <TextInput
                  {...field}
                  error={errors.newMoulds?.[i]?.firstItemCode?.message}
                  size="sm"
                  radius="md"
                  label="Mã trục #1"
                  disabled
                />
              )}
            />
            <Controller
              key={`secondItemCode-${field.id}`}
              name={`newMoulds.${i}.secondItemCode`}
              control={control}
              render={({
                field,
                formState: { errors },
              }: {
                field: FieldValues
                formState: UseFormStateReturn<PackageAndLabel>
              }) => (
                <TextInput
                  {...field}
                  error={errors.newMoulds?.[i]?.firstItemCode?.message}
                  size="sm"
                  radius="md"
                  label="Mã trục #2"
                />
              )}
            />
          </Group>
          <Controller
            key={`new-mould-specs-mouldMakerId-${i}`}
            name={`newMoulds.${i}.specs.mouldMakerId`}
            control={control}
            render={({
              field,
              formState: { errors },
            }: {
              field: FieldValues
              formState: UseFormStateReturn<PackageAndLabel>
            }) => (
              <CreatableSelect
                size="sm"
                radius="md"
                {...field}
                label="Nhà trục"
                withAsterisk
                error={errors.newMoulds?.[i]?.specs?.mouldMakerId?.message}
                data={mouldMakerOptions}
                searchable
                creatable
                onSearchChange={onSearchMouldMaker}
                isLoadingOptions={mouldMakerSelectLoading}
                rightSection={<ComboboxChevron />}
                rightSectionPointerEvents="none"
              />
            )}
          />
        </SimpleGrid>
        <SimpleGrid
          cols={{ base: 1, md: 3 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing="md"
        >
          <Controller
            key={`new-mould-specs-dimension-${i}`}
            name={`newMoulds.${i}.specs.dimension`}
            control={control}
            render={({
              field,
              formState: { errors },
            }: {
              field: FieldValues
              formState: UseFormStateReturn<PackageAndLabel>
            }) => (
              <TextInput
                {...field}
                error={errors.newMoulds?.[i]?.specs?.dimension?.message}
                radius="md"
                label="Kích thước trục"
                size="sm"
              />
            )}
          />
          <Controller
            key={`new-mould-specs-numberOfMoulds-${i}`}
            name={`newMoulds.${i}.specs.numberOfMoulds`}
            control={control}
            render={({
              field,
              formState: { errors },
            }: {
              field: FieldValues
              formState: UseFormStateReturn<PackageAndLabel>
            }) => (
              <NumberInput
                {...field}
                error={errors.newMoulds?.[i]?.specs?.numberOfMoulds?.message}
                radius="md"
                label="Số cây trục trong bộ"
                size="sm"
              />
            )}
          />
          <Controller
            key={`new-mould-specs-location-${i}`}
            name={`newMoulds.${i}.specs.location`}
            control={control}
            render={({
              field,
              formState: { errors },
            }: {
              field: FieldValues
              formState: UseFormStateReturn<PackageAndLabel>
            }) => (
              <TextInput
                {...field}
                error={errors.newMoulds?.[i]?.specs?.location?.message}
                radius="md"
                label="Vị trí trục"
                size="sm"
              />
            )}
          />
        </SimpleGrid>
      </Stack>
    </Card>
  )
}
