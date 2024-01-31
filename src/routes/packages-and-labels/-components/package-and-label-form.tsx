import {
  categoriesQueryOptions,
  partnersQueryOptions,
  uomsQueryOptions,
} from '@/apis/query-options'
import { TUom } from '@/types/uom'
import { CreatableSelect } from '@/components/select'
import { TPackageAndLabel } from '@/types/package-and-label'
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
} from '@mantine/core'
import { useDebouncedValue, useFocusTrap } from '@mantine/hooks'
import { Field } from 'houseform'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import accClasses from '@/components/accordion/Accordion.module.css'
import { Cylinder, Info } from '@phosphor-icons/react'
import { TPartner } from '@/types/partner'
import { useSuspenseQuery } from '@tanstack/react-query'

interface PackageAndLabelFormProps {
  data?: TPackageAndLabel
}
export const PackageAndLabelForm = (props: PackageAndLabelFormProps) => {
  const { data } = props

  const [searchPartnerDraft, setSearchPartnerDraft] = useState('')
  const [debouncedSearchPartnerDraft] = useDebouncedValue(
    searchPartnerDraft,
    300,
  )

  const [searchUomDraft, setSearchUomDraft] = useState('')
  const [debouncedSearchUomDraft] = useDebouncedValue(searchUomDraft, 300)

  const [searchCatDraft, setSearchCatDraft] = useState('')
  const [debouncedSearchCatDraft] = useDebouncedValue(searchCatDraft, 300)
  //Uoms query
  const uomsQuery = useSuspenseQuery(
    uomsQueryOptions({
      deps: { page: 1, searchValue: debouncedSearchUomDraft },
      noMeta: true,
    }),
  )
  const uoms = uomsQuery.data as TUom[]
  const uomOptions = useMemo(() => {
    return uoms
      ? uoms.map((item: TUom) => ({
          label: String(item.name),
          value: String(item.id),
        }))
      : []
  }, [uoms])
  const onSearchUom = (value: string) => {
    setSearchUomDraft(value)
  }
  const uomSelectLoading = uomsQuery.isFetching

  //Cats query
  const catsQuery = useSuspenseQuery(
    categoriesQueryOptions({
      deps: { page: 1, searchValue: debouncedSearchCatDraft },
      noMeta: true,
    }),
  )
  const cats = catsQuery.data as TUom[]
  const catOptions = useMemo(() => {
    return cats
      ? cats.map((item: TUom) => ({
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
  const partners = partnersQuery.data as TPartner[]
  const partnerOptions = useMemo(() => {
    return partners
      ? partners.map((item: TPartner) => ({
          label: String(item.name),
          value: String(item.id),
        }))
      : []
  }, [partners])
  const onSearchPartner = (value: string) => {
    setSearchPartnerDraft(value)
  }
  const partnerSelectLoading = partnersQuery.isFetching
  const focusTrapRef = useFocusTrap()

  return (
    <Card shadow="0" radius="0" px="xl">
      <Field
        name="name"
        initialValue={data && data.name}
        onChangeValidate={z.string().min(1, { message: 'Trường bắt buộc' })}
      >
        {({ value, setValue, onBlur, errors }) => (
          <Textarea
            autosize
            ref={focusTrapRef}
            minRows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            required
            aria-required
            error={errors?.[0]}
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
      </Field>
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
                    <Field
                      name="uomId"
                      initialValue={data && String(data.uomId)}
                      onChangeValidate={z
                        .string()
                        .min(1, { message: 'Trường bắt buộc' })
                        .transform((val) => Number(val))}
                    >
                      {({ value, setValue, onBlur, errors }) => (
                        <CreatableSelect
                          radius="md"
                          size="sm"
                          required
                          value={value}
                          label="Đơn vị chính"
                          data={uomOptions}
                          onChange={(value) => {
                            setValue(value || '')
                          }}
                          onBlur={onBlur}
                          shouldClientFilter={true}
                          searchable
                          creatable
                          isLoadingOptions={uomSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                          error={errors?.[0]}
                        />
                      )}
                    </Field>
                    <Field
                      name="secondaryUomId"
                      initialValue={data && String(data.secondaryUomId)}
                    >
                      {({ value, setValue, onBlur }) => (
                        <CreatableSelect
                          size="sm"
                          radius="md"
                          value={value}
                          label="Đơn vị thứ hai"
                          data={uomOptions}
                          onChange={(value) => {
                            setValue(value || '')
                          }}
                          onBlur={onBlur}
                          searchable
                          shouldClientFilter={true}
                          creatable
                          isLoadingOptions={uomSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    </Field>
                    <Field
                      name="purchaseUomId"
                      initialValue={data && String(data.purchaseUomId)}
                    >
                      {({ value, setValue, onBlur }) => (
                        <CreatableSelect
                          size="sm"
                          radius="md"
                          value={value}
                          label="Đơn vị mua hàng"
                          data={uomOptions}
                          onChange={(value) => {
                            setValue(value || '')
                          }}
                          onBlur={onBlur}
                          searchable
                          creatable
                          onSearchChange={onSearchUom}
                          isLoadingOptions={uomSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    </Field>
                  </SimpleGrid>
                  <SimpleGrid cols={{ base: 1, md: 3 }} verticalSpacing="md">
                    <Field
                      name="partnerId"
                      initialValue={data && String(data.partnerId)}
                      onChangeValidate={z
                        .string()
                        .transform((val) => Number(val))}
                    >
                      {({ value, setValue, onBlur }) => (
                        <CreatableSelect
                          size="sm"
                          radius="md"
                          value={value}
                          label="Khách hàng"
                          data={partnerOptions}
                          onChange={(value) => {
                            setValue(value || '')
                          }}
                          onBlur={onBlur}
                          searchable
                          creatable
                          onSearchChange={onSearchPartner}
                          isLoadingOptions={partnerSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    </Field>
                    <Field
                      name="categoryId"
                      initialValue={data && String(data.categoryId)}
                    >
                      {({ value, setValue, onBlur }) => (
                        <CreatableSelect
                          size="sm"
                          radius="md"
                          value={value}
                          label="Loại hàng hoá"
                          data={catOptions}
                          onChange={(value) => {
                            setValue(value || '')
                          }}
                          onBlur={onBlur}
                          searchable
                          creatable
                          onSearchChange={onSearchCat}
                          isLoadingOptions={catSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    </Field>
                    <Field name="itemCode" initialValue={data && data.itemCode}>
                      {({ value, setValue, onBlur }) => (
                        <TextInput
                          radius="md"
                          label="Mã hàng hoá"
                          size="sm"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onBlur={onBlur}
                        />
                      )}
                    </Field>
                  </SimpleGrid>
                  {/* <Stack gap={2}>
                    <Text fw="500" size="sm">
                      Hình ảnh (tối đa 3 ảnh)
                    </Text>
                    <Group>
                      <Dropzone
                        onDrop={() => {}}
                        accept={IMAGE_MIME_TYPE}
                        h={150}
                        w={150}
                        radius="md"
                      >
                        <Text ta="center">Drop images here</Text>
                      </Dropzone>
                      <Image
                        radius="md"
                        h={150}
                        w={150}
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                      />
                      <Image
                        radius="md"
                        h={150}
                        w={150}
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                      />
                      <Image
                        radius="md"
                        h={150}
                        w={150}
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                      />
                      <Image
                        radius="md"
                        h={150}
                        w={150}
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                      />
                    </Group>
                  </Stack> */}
                  <Field name="note" initialValue={data && data.note}>
                    {({ value, setValue, onBlur, errors }) => (
                      <Textarea
                        autosize
                        minRows={2}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                        error={errors?.[0]}
                        radius="md"
                        label="Ghi chú"
                        placeholder="Ghi chú cho sản phẩm"
                      />
                    )}
                  </Field>
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
                    <Field
                      name="specs.dimension"
                      initialValue={data && data.specs.dimension}
                    >
                      {({ value, setValue, onBlur }) => (
                        <TextInput
                          label="Kích thước (rộng x cao)"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onBlur={onBlur}
                          size="sm"
                          radius="md"
                        />
                      )}
                    </Field>

                    <Field
                      name="specs.spreadDimension"
                      initialValue={data && data.specs.spreadDimension}
                    >
                      {({ value, setValue, onBlur }) => (
                        <TextInput
                          label="Kt trải (rộng x cao)"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onBlur={onBlur}
                          size="sm"
                          radius="md"
                        />
                      )}
                    </Field>
                  </SimpleGrid>
                  <SimpleGrid
                    cols={{ base: 1, md: 2 }}
                    spacing={{ base: 10, sm: 'xl' }}
                    verticalSpacing="md"
                  >
                    <Field
                      name="specs.thickness"
                      initialValue={data && data.specs.thickness}
                    >
                      {({ value, setValue, onBlur }) => (
                        <NumberInput
                          radius="md"
                          label="Độ dày"
                          size="sm"
                          value={value}
                          onChange={(val) => setValue(val as number)}
                          onBlur={onBlur}
                          hideControls
                        />
                      )}
                    </Field>
                    <Field
                      name="specs.numberOfColors"
                      initialValue={data && data.specs.numberOfColors}
                    >
                      {({ value, setValue, onBlur }) => (
                        <NumberInput
                          radius="md"
                          label="Số màu"
                          size="sm"
                          value={value}
                          onChange={(val) => setValue(val as number)}
                          onBlur={onBlur}
                          hideControls
                        />
                      )}
                    </Field>
                  </SimpleGrid>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Tabs.Panel>
        <Tabs.Panel value="mould">
          <Stack gap="sm" mt="sm">
            <SimpleGrid
              cols={{ base: 1, md: 2 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing="md"
            >
              <Field name="mould.dimension">
                {({ value, setValue, onBlur }) => (
                  <TextInput
                    radius="md"
                    label="Kích thước trục"
                    size="sm"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                  />
                )}
              </Field>
              <Field name="mould.numberOfMoulds">
                {({ value, setValue, onBlur }) => (
                  <NumberInput
                    radius="md"
                    label="Số cây trục trong bộ"
                    size="sm"
                    value={value}
                    onChange={(val) => setValue(val as number)}
                    onBlur={onBlur}
                    hideControls
                  />
                )}
              </Field>
            </SimpleGrid>
            <SimpleGrid
              cols={{ base: 1, md: 2 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing="md"
            >
              <Field name="mould.location">
                {({ value, setValue, onBlur }) => (
                  <TextInput
                    radius="md"
                    label="Vị trí trục"
                    size="sm"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                  />
                )}
              </Field>

              <Field name="mould.itemCode">
                {({ value, setValue, onBlur }) => (
                  <TextInput
                    radius="md"
                    label="Mã trục"
                    size="sm"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                  />
                )}
              </Field>
            </SimpleGrid>
            <SimpleGrid
              cols={{ base: 1, md: 2 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing="md"
            >
              <Field
                name="mould.mouldMakerId"
                initialValue={data && data.specs.thickness}
              >
                {({ value, setValue, onBlur }) => (
                  <NumberInput
                    radius="md"
                    label="Nhà trục"
                    size="sm"
                    value={value}
                    onChange={(val) => setValue(val as number)}
                    onBlur={onBlur}
                    hideControls
                  />
                )}
              </Field>
            </SimpleGrid>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Card>
  )
}
