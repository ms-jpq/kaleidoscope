export const NewStore = <T extends object, K extends string = string>() => {
  const store = new Proxy(localStorage, {
    get: (target, property) => {
      const value = target.getItem(property as string)
      return value === null ? undefined : JSON.parse(value)
    },
    set: (target, property, value) => {
      if (value === undefined) {
        target.removeItem(property as string)
      } else {
        target.setItem(property as string, JSON.stringify(value))
      }
      return true
    },
  })
  return store as Record<K, T>
}
