export const NewI18n = (
  store: Record<string, { message: string }>,
  warn: boolean,
) => {
  return (key: string, ...symbols: (string | number)[]): string => {
    const replace = (
      (idx) => () =>
        symbols[idx++] as string
    )(0)
    if (warn && !Reflect.has(store, key)) {
      console.error(`Missing i18n key: ${key}`)
    }
    return (store[key] || { message: key }).message.replace(/%@/g, replace)
  }
}

export type I18n = ReturnType<typeof NewI18n>
