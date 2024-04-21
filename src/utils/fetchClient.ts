import wretch from 'wretch'
import FormDataAddon from 'wretch/addons/formData'
import QueryStringAddon from 'wretch/addons/queryString'

export const fetchClient = wretch('http://localhost:3333', { mode: 'cors' })
  .options({ credentials: 'include' })
  .errorType('json')
  .addon(FormDataAddon)
  .addon(QueryStringAddon)
