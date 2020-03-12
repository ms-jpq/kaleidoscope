import { GET } from "./xhr"
import { PromiseType } from "nda/dist/typings"

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

export type I18n = PromiseType<ReturnType<typeof NewI18n>>
