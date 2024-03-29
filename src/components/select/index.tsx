import cx from 'clsx'
import { useMemo } from 'react'

import {
  Combobox,
  type ComboboxData,
  type ComboboxItem,
  ComboboxParsedItem,
  Factory,
  InputBase,
  SelectProps,
  defaultOptionsFilter,
  factory,
  getOptionsLockup,
  getParsedComboboxData,
  isOptionsGroup,
  useCombobox,
  useProps,
  Input,
  Loader,
} from '@mantine/core'
import { useUncontrolled } from '@mantine/hooks'

import classes from './Combobox.module.css'
import { validateOptions } from './validate-options'

export interface CreatableSelectProps extends SelectProps {
  creatable?: boolean
  onCreate?(query: string): ComboboxItem | string | null | undefined | void
  data: ComboboxData
  isLoadingOptions?: boolean
  shouldClientFilter?: boolean
}

function isValueChecked(
  value: string | string[] | undefined | null,
  optionValue: string,
) {
  return Array.isArray(value)
    ? value.includes(optionValue)
    : value === optionValue
}

export type SelectFactory = Factory<{
  props: CreatableSelectProps
  ref: HTMLInputElement
}>

const defaultProps: Partial<SelectProps> = {
  searchable: false,
  withCheckIcon: true,
  allowDeselect: true,
  checkIconPosition: 'left',
}

export const CreatableSelect = factory<SelectFactory>((_props, ref) => {
  const props = useProps('CreatableSelect', defaultProps, _props)
  const {
    creatable = false,
    searchValue,
    defaultSearchValue,
    value,
    defaultValue,
    data,
    searchable = true,
    shouldClientFilter = false,
    allowDeselect,
    placeholder,
    rightSection,
    leftSection,
    label,
    rightSectionPointerEvents,
    size,
    error,
    variant,
    required,
    classNames,
    disabled,
    description,
    isLoadingOptions,
    radius,
    withAsterisk,
    filter,
    onChange,
    onSearchChange,
    onCreate,
  } = props
  validateOptions([...data])

  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: null,
    onChange,
  })
  const parsedData = useMemo(() => getParsedComboboxData(data), [data])

  const optionsLockup = useMemo(
    () => getOptionsLockup(parsedData),
    [parsedData],
  )
  const selectedOption = _value ? optionsLockup[_value] : undefined
  const [search, setSearch] = useUncontrolled({
    value: searchValue,
    defaultValue: defaultSearchValue,
    finalValue: '',
    onChange: onSearchChange,
  })

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
      combobox.focusTarget()
      setSearch('')
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput()
    },
  })
  const exactOptionMatch = parsedData?.some((item) => {
    if (!isOptionsGroup(item)) {
      return item.label === search
    }
  })

  const shouldFilter = typeof search === 'string'

  const filteredData =
    shouldFilter && shouldClientFilter
      ? (filter || defaultOptionsFilter)({
          options: parsedData,
          search: search,
          limit: Infinity,
        })
      : parsedData

  const options = filteredData.map((item: ComboboxParsedItem) => {
    if (!isOptionsGroup(item)) {
      return (
        <Combobox.Option
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          data-checked={isValueChecked(_value, item.value) || undefined}
          aria-selected={isValueChecked(_value, item.value)}
          className={cx({ [classes.optionsDropdownOption]: '' })}
        >
          {item.label}
        </Combobox.Option>
      )
    }
  })
  const getLabel = () => {
    if (selectedOption) {
      return selectedOption.label
    }
    return <Input.Placeholder>{placeholder}</Input.Placeholder>
  }

  return (
    <Combobox
      store={combobox}
      withinPortal={true}
      disabled={disabled}
      onOptionSubmit={(val) => {
        const nextValue = allowDeselect
          ? optionsLockup[val].value === _value
            ? null
            : optionsLockup[val].value
          : optionsLockup[val].value
        if (creatable && val === '$create') {
          if (typeof onCreate === 'function') {
            const createdItem = onCreate(search)
            if (typeof createdItem !== 'undefined' && createdItem !== null) {
              if (typeof createdItem === 'string') {
                setValue(createdItem)
              } else {
                setValue(createdItem.value)
              }
            }
          }
        } else {
          setValue(nextValue)
        }
        combobox.closeDropdown()
      }}
    >
      <Combobox.Target targetType={'button'}>
        <InputBase
          withAsterisk={withAsterisk}
          description={description}
          classNames={classNames}
          required={required}
          multiline
          component="button"
          type="button"
          radius={radius}
          pointer
          variant={variant}
          size={size}
          label={label}
          leftSection={leftSection}
          onClick={() => combobox.openDropdown()}
          error={error}
          rightSection={rightSection}
          rightSectionPointerEvents={rightSectionPointerEvents}
        >
          {getLabel()}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown
        style={{
          boxShadow:
            'rgba(22, 23, 24, 0.35) 0px 10px 38px -10px, rgba(22, 23, 24, 0.2) 0px 10px 20px -15px',
        }}
      >
        {searchable ? (
          <Combobox.Search
            radius={radius}
            variant="filled"
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value)
            }}
            placeholder="Tìm kiếm..."
            ref={ref}
            rightSection={isLoadingOptions ? <Loader size="xs" /> : null}
          />
        ) : null}
        <Combobox.Options mah={300} style={{ overflowY: 'auto' }}>
          {options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>Không có dữ liệu</Combobox.Empty>
          )}
          {creatable && !exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">+ Tạo {search}</Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
})
