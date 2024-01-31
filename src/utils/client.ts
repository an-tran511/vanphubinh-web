import wretch from 'wretch'
import FormDataAddon from 'wretch/addons/formData'
import QueryStringAddon from 'wretch/addons/queryString'

export const client = wretch('http://localhost:3333/api', { mode: 'cors' })
  .errorType('json')
  .resolve((r) => r.json())
  .addon(FormDataAddon)
  .addon(QueryStringAddon)
