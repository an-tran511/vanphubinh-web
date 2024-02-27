import {
  categoriesQueryOptions,
  partnersQueryOptions,
  uomsQueryOptions,
} from '@/apis/query-options'
import { Uom } from '@/types/uom'
import { CreatableSelect } from '@/components/select'
import { PackageAndLabel } from '@/types/package-and-label'
import {
  SimpleGrid,
  Stack,
  TextInput,
  Text,
  Textarea,
  ComboboxChevron,
  Card,
  Tabs,
  Accordion,
  NumberInput,
  Button,
  Group,
  ActionIcon,
  Tooltip,
} from '@mantine/core'
import { useDebouncedValue, useFocusTrap } from '@mantine/hooks'
import { useMemo, useState } from 'react'
import accClasses from '@/components/accordion/Accordion.module.css'
import { ArrowRight, Cylinder, Info } from '@phosphor-icons/react'
import { Partner } from '@/types/partner'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  Controller,
  FieldValues,
  type Control,
  UseFormStateReturn,
  useFieldArray,
} from 'react-hook-form'
import { SubMouldForm } from './mould-sub-form'
import { Category } from '@/types/category'

interface PackageAndLabelFormProps {
  control: Control<PackageAndLabel>
  moulds?: PackageAndLabel['moulds']
  viewType: 'create' | 'detail'
}
export const PackageAndLabelForm = (props: PackageAndLabelFormProps) => {
  const { control, moulds, viewType } = props
  const [searchPartnerDraft, setSearchPartnerDraft] = useState('')
  const [debouncedSearchPartnerDraft] = useDebouncedValue(
    searchPartnerDraft,
    300,
  )
  const [searchCatDraft, setSearchCatDraft] = useState('')
  const [debouncedSearchCatDraft] = useDebouncedValue(searchCatDraft, 300)

  //Uoms query
  const uomsQuery = useSuspenseQuery(
    uomsQueryOptions({
      deps: { page: 1 },
      noMeta: true,
    }),
  )
  const uoms = uomsQuery.data as Uom[]
  const uomOptions = useMemo(() => {
    return uoms
      ? uoms.map((item: Uom) => ({
          label: String(item.name),
          value: String(item.id),
        }))
      : []
  }, [uoms])

  const uomSelectLoading = uomsQuery.isFetching

  //Cats query
  const catsQuery = useSuspenseQuery(
    categoriesQueryOptions({
      deps: { page: 1, searchValue: debouncedSearchCatDraft },
      noMeta: true,
    }),
  )
  const cats = catsQuery.data as Category[]
  const catOptions = useMemo(() => {
    return cats
      ? cats.map((item: Category) => ({
          label: String(item.name),
          value: String(item.id),
        }))
      : []
  }, [cats])
  const onSearchCat = (value: string) => {
    setSearchCatDraft(value)
  }
  const catSelectLoading = catsQuery.isFetching

  //Partners query
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
          label: String(item.computedName),
          value: String(item.id),
        }))
      : []
  }, [partners])
  const onSearchPartner = (value: string) => {
    setSearchPartnerDraft(value)
  }
  const partnerSelectLoading = partnersQuery.isFetching
  const focusTrapRef = useFocusTrap()

  const { fields, remove, prepend } = useFieldArray({
    control,
    name: 'newMoulds',
  })
  console.log(fields)

  return (
    <Card shadow="0" radius="0" px={{ base: 'lg', md: 'xl' }}>
      <Controller
        key="name"
        name="name"
        control={control}
        render={({
          field,
          formState: { errors },
        }: {
          field: FieldValues
          formState: UseFormStateReturn<PackageAndLabel>
        }) => (
          <Textarea
            {...field}
            error={errors?.name?.message}
            autosize
            ref={focusTrapRef}
            minRows={1}
            withAsterisk
            radius="md"
            variant="unstyled"
            label="Tên hàng hoá"
            styles={{
              input: {
                fontSize: '1.5rem',
                '&[dataError]': {
                  border: '5px solid green',
                },
              },
              wrapper: {
                '&[dataError]': {
                  border: '5px solid green',
                },
              },
            }}
          />
        )}
      />
      <Tabs defaultValue="info">
        <Tabs.List>
          <Tabs.Tab value="info" leftSection={<Info size={16} />}>
            Thông tin chung
          </Tabs.Tab>
          <Tabs.Tab value="mould" leftSection={<Cylinder size={16} />}>
            Trục
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="info">
          <Accordion
            multiple
            radius="md"
            defaultValue={['item-1', 'item-2']}
            classNames={accClasses}
            variant="default"
          >
            <Accordion.Item value="item-1">
              <Accordion.Control>
                <Text fw="500" size="sm" c="">
                  Thông tin cơ bản
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="sm">
                  <SimpleGrid cols={{ base: 1, md: 3 }} verticalSpacing="md">
                    <Controller
                      key="uomId"
                      name="uomId"
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
                          error={errors?.uomId?.message}
                          radius="md"
                          size="sm"
                          required
                          label="Đơn vị chính"
                          data={uomOptions}
                          shouldClientFilter={true}
                          searchable
                          creatable
                          isLoadingOptions={uomSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    />
                    <Controller
                      key="secondaryUomId"
                      name="secondaryUomId"
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
                          error={errors?.secondaryUomId?.message}
                          size="sm"
                          radius="md"
                          label="Đơn vị thứ hai"
                          data={uomOptions}
                          searchable
                          shouldClientFilter={true}
                          creatable
                          isLoadingOptions={uomSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    />
                    <Controller
                      key="purchaseUomId"
                      name="purchaseUomId"
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
                          error={errors?.purchaseUomId?.message}
                          size="sm"
                          radius="md"
                          label="Đơn vị mua hàng"
                          data={uomOptions}
                          searchable
                          shouldClientFilter={true}
                          creatable
                          isLoadingOptions={uomSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    />
                  </SimpleGrid>
                  <SimpleGrid cols={{ base: 1, md: 3 }} verticalSpacing="md">
                    <Controller
                      key="partnerId"
                      name="partnerId"
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
                          error={errors?.partnerId?.message}
                          size="sm"
                          radius="md"
                          label="Khách hàng"
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
                    <Controller
                      key="categoryId"
                      name="categoryId"
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
                          error={errors?.categoryId?.message}
                          size="sm"
                          radius="md"
                          label="Loại hàng hoá"
                          data={catOptions}
                          searchable
                          creatable
                          onSearchChange={onSearchCat}
                          isLoadingOptions={catSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    />
                    <Group grow>
                      <Controller
                        key="firstItemCode"
                        name="firstItemCode"
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
                            error={errors?.firstItemCode?.message}
                            radius="md"
                            label="Mã hàng hoá #1"
                            size="sm"
                            disabled={viewType === 'create'}
                          />
                        )}
                      />
                      <Controller
                        key="secondItemCode"
                        name="secondItemCode"
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
                            error={errors?.secondItemCode?.message}
                            radius="md"
                            label="Mã hàng hoá #2"
                            size="sm"
                          />
                        )}
                      />
                    </Group>
                  </SimpleGrid>
                  <Controller
                    key="note"
                    name="note"
                    control={control}
                    render={({
                      field,
                      formState: { errors },
                    }: {
                      field: FieldValues
                      formState: UseFormStateReturn<PackageAndLabel>
                    }) => (
                      <Textarea
                        {...field}
                        autosize
                        minRows={2}
                        error={errors?.note?.message}
                        radius="md"
                        label="Ghi chú"
                        placeholder="Ghi chú cho sản phẩm"
                      />
                    )}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="item-2">
              <Accordion.Control>
                <Text fw="500" size="sm">
                  Thông tin kĩ thuật
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="sm">
                  <SimpleGrid
                    cols={{ base: 1, md: 2 }}
                    spacing={{ base: 10, sm: 'xl' }}
                    verticalSpacing="md"
                  >
                    <Controller
                      key="specs.dimension"
                      name="specs.dimension"
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
                          error={errors.specs?.dimension?.message}
                          size="sm"
                          radius="md"
                          label="Kích thước (rộng x cao)"
                        />
                      )}
                    />
                    <Controller
                      key="specs.spreadDimension"
                      name="specs.spreadDimension"
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
                          error={errors.specs?.dimension?.message}
                          size="sm"
                          radius="md"
                          label="Kt trải (rộng x cao)"
                        />
                      )}
                    />
                  </SimpleGrid>
                  <SimpleGrid
                    cols={{ base: 1, md: 2 }}
                    spacing={{ base: 10, sm: 'xl' }}
                    verticalSpacing="md"
                  >
                    <Controller
                      key="specs.thickness"
                      name="specs.thickness"
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
                          error={errors.specs?.thickness?.message}
                          size="sm"
                          radius="md"
                          label="Độ dày"
                          hideControls
                        />
                      )}
                    />

                    <Controller
                      key="specs.numberOfColors"
                      name="specs.numberOfColors"
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
                          error={errors.specs?.numberOfColors?.message}
                          size="sm"
                          radius="md"
                          label="Số màu"
                          hideControls
                        />
                      )}
                    />
                  </SimpleGrid>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Tabs.Panel>

        <Tabs.Panel value="mould">
          <Stack>
            <Group mt="sm" justify="flex-end">
              <Button
                variant="outline"
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  prepend({
                    partnerId: 0,
                    specs: {
                      mouldMakerId: 0,
                    },
                  })
                }}
                size="xs"
              >
                Thêm bộ trục
              </Button>
            </Group>
            {fields.map((field, i) => (
              <SubMouldForm
                key={field.id}
                field={field}
                i={i}
                control={control}
                remove={remove}
              />
            ))}
            {moulds &&
              moulds.length > 0 &&
              moulds.map((mould, i) => (
                <Card withBorder shadow="xs" key={`mould-${i}`}>
                  <Card.Section inheritPadding withBorder py="xs">
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        #{mould.id} {mould.name}
                      </Text>
                      <Tooltip label="Đi tới trang trục">
                        <ActionIcon variant="default" aria-label="Settings">
                          <ArrowRight />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Card.Section>
                  <Stack gap="md" mt="sm">
                    <SimpleGrid
                      cols={{ base: 1, md: 3 }}
                      spacing={{ base: 10, sm: 'xl' }}
                      verticalSpacing="md"
                    >
                      <Stack gap="0">
                        <Text size="sm" fw="500">
                          Khách hàng
                        </Text>
                        <Text size="sm">{mould.partner?.name || ''}</Text>
                      </Stack>
                      <Group grow>
                        <Stack gap="0">
                          <Text size="sm" fw="500">
                            Mã trục #1
                          </Text>
                          <Text size="sm">
                            {mould.firstItemCode || <span>&mdash;</span>}
                          </Text>
                        </Stack>
                        <Stack gap="0">
                          <Text size="sm" fw="500">
                            Mã trục #2
                          </Text>
                          <Text size="sm">
                            {mould.secondItemCode || <span>&mdash;</span>}
                          </Text>
                        </Stack>
                      </Group>
                      <Stack gap="0">
                        <Text size="sm" fw="500">
                          Nhà trục
                        </Text>
                        <Text size="sm">
                          {(mould?.suppliers && mould?.suppliers[0]?.name) || (
                            <span>&mdash;</span>
                          )}
                        </Text>
                      </Stack>
                    </SimpleGrid>
                    <SimpleGrid
                      cols={{ base: 1, md: 3 }}
                      spacing={{ base: 10, sm: 'xl' }}
                      verticalSpacing="md"
                    >
                      <Stack gap="0">
                        <Text size="sm" fw="500">
                          Kích thước trục
                        </Text>
                        <Text size="sm">
                          {mould.specs?.dimension || <span>&mdash;</span>}
                        </Text>
                      </Stack>
                      <Stack gap="0">
                        <Text size="sm" fw="500">
                          Số cây trục trong bộ
                        </Text>
                        <Text size="sm">
                          {mould.specs?.numberOfMoulds || <span>&mdash;</span>}
                        </Text>
                      </Stack>
                      <Stack gap="0">
                        <Text size="sm" fw="500">
                          Vị trí trục
                        </Text>
                        <Text size="sm">
                          {mould.specs?.location || <span>&mdash;</span>}
                        </Text>
                      </Stack>
                    </SimpleGrid>
                  </Stack>
                </Card>
              ))}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Card>
  )
}
