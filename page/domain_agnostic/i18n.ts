import { GET } from "./xhr"
import { Unpacked } from "./types"

export const NewI18n = async (lang: string, warn: boolean) => {
  const store = await GET<Record<string, { message: string }>>(`${lang}.json`)()
  return (key: string, ...symbols: (string | number)[]): string => {
    const replace = ((idx) => () => symbols[idx++] as string)(0)
    if (warn && !Reflect.has(store, key)) {
      console.error(`Missing i18n key: ${key}`)
    }
    return (store[key] || { message: key }).message.replace(/%@/g, replace)
  }
}

export type I18n = Unpacked<Unpacked<typeof NewI18n>>
