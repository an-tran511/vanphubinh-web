import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import translation from '@/locales/vi/zod.json'

// lng and resources key depend on your locale.
i18next.init({
  lng: 'vi',
  resources: {
    vi: {
      zod: translation,
    },
  },
})
z.setErrorMap(zodI18nMap)

// export configured zod instance
export { z }
