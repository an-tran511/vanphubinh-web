import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { PackageAndLabelQueryOptions } from '@/apis/query-options'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { Show } from '@/components/crud/show'
import { PackageAndLabelForm } from './-components/package-and-label-form'
import { PackageAndLabel } from '@/types/package-and-label'
import { toast } from 'sonner'
import { updatePackageAndLabel } from '@/apis/package-and-label'
import { useForm } from 'react-hook-form'
import { schema } from '@/schemas/package-and-label'
import { zodResolver } from '@hookform/resolvers/zod'

export const Route = createFileRoute('/packages-and-labels/$id')({
  component: DetailComponent,
  errorComponent: () => <div>error</div>,
  loader: ({ context: { queryClient }, params }) => {
    queryClient.ensureQueryData(PackageAndLabelQueryOptions(params.id))
  },
})
export function DetailComponent() {
  const { id } = useParams({ strict: false })
  const { data } = useSuspenseQuery(PackageAndLabelQueryOptions(id))
  const navigate = useNavigate({ from: '/packages-and-labels/$itemId' })
  const queryClient = useQueryClient()
  const {
    control,
    handleSubmit,
    clearErrors,
    resetField,
    formState: { isDirty },
    reset,
  } = useForm<PackageAndLabel>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: data.id,
      name: data.name,
      uomId: data.uomId,
      secondaryUomId: data.secondaryUomId,
      purchaseUomId: data.purchaseUomId,
      partnerId: data.partnerId,
      categoryId: data.categoryId,
      firstItemCode: data.firstItemCode || '',
      secondItemCode: data.secondItemCode || '',
      note: data.note || '',
      specs: {
        dimension: data?.specs?.dimension || '',
        numberOfColors: data?.specs?.numberOfColors,
        spreadDimension: data?.specs?.spreadDimension || '',
        thickness: data?.specs?.thickness,
      },
      newMoulds: [],
    },
  })

  //Mutation
  const { mutate, isPending } = useMutation({
    mutationKey: ['packages-and-labels', 'update', id],
    mutationFn: updatePackageAndLabel,
    onSuccess: () => {
      queryClient.invalidateQueries()
      navigate({ to: '/packages-and-labels/$itemId', params: { itemId: id } })
      toast.success(`Cập nhật thành công`)
    },
  })

  const onSubmit = (data: PackageAndLabel) => {
    mutate(data, {
      onSuccess: () => {
        resetField('newMoulds', {
          defaultValue: [],
        })
        reset(
          {
            id: data.id,
            name: data.name,
            uomId: data.uomId,
            secondaryUomId: data.secondaryUomId,
            purchaseUomId: data.purchaseUomId,
            partnerId: data.partnerId,
            categoryId: data.categoryId,
            firstItemCode: data.firstItemCode || '',
            secondItemCode: data.secondItemCode || '',
            note: data.note || '',
            specs: {
              dimension: data?.specs?.dimension || '',
              numberOfColors: data?.specs?.numberOfColors,
              spreadDimension: data?.specs?.spreadDimension || '',
              thickness: data?.specs?.thickness,
            },
          },
          {
            keepDirtyValues: true,
          },
        )
      },
    })
  }

  return (
    <form
      onSubmit={(e) => {
        clearErrors()
        handleSubmit(onSubmit)(e)
      }}
    >
      <Show title="Bao bì & nhãn mác" isDirty={isDirty} savingState={isPending}>
        <PackageAndLabelForm
          control={control}
          viewType="detail"
          moulds={data?.moulds}
        />
      </Show>
    </form>
  )
}
