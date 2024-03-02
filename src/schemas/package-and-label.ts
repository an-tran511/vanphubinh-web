import { z } from 'zod'

export const schema = z.object({
  id: z.string().optional().or(z.literal('')),
  name: z.string().min(1, { message: 'Trường bắt buộc' }),
  uomId: z.coerce.number().gt(0, { message: 'Trường bắt buộc' }),
  partnerId: z.coerce
    .number()
    .optional()
    .transform((v) => (v ? v : '')),
  secondaryUomId: z.coerce
    .number()
    .optional()
    .transform((v) => (v ? v : '')),
  purchaseUomId: z.coerce
    .number()
    .optional()
    .transform((v) => (v ? v : '')),
  categoryId: z.coerce
    .number()
    .optional()
    .transform((v) => (v ? v : '')),
  firstItemCode: z.string().trim().optional(),
  secondItemCode: z.string().trim().optional(),
  note: z.string().trim().optional(),
  specs: z
    .object({
      dimension: z.string().trim().optional().or(z.literal('')),
      spreadDimension: z.string().trim().optional().or(z.literal('')),
      thickness: z.number().positive().optional(),
      numberOfColors: z.number().positive().optional(),
    })
    .optional(),
  images: z.array(z.any().optional()).optional(),
  newMoulds: z
    .array(
      z
        .object({
          firstItemCode: z.string().trim().optional(),
          secondItemCode: z.string().trim().optional(),
          partnerId: z.coerce.number().gt(0, { message: 'Trường bắt buộc' }),
          specs: z
            .object({
              location: z.string().trim().optional(),
              dimension: z.string().trim().optional(),
              mouldMakerId: z.coerce
                .number()
                .gt(0, { message: 'Trường bắt buộc' })
                .optional(),
              numberOfMoulds: z.number().positive().optional(),
            })
            .optional(),
        })
        .optional(),
    )
    .optional(),
})
