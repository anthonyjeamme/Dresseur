export const getUrlParams = () => {
  return document.location.search
    .substr(1)
    .split("&")
    .filter(param => !!param)
    .map(param => {
      const split = [...param.split("="), null]

      return {
        [split[0]]: split[1],
      }
    })
    .reduce(
      (acc, cur) => ({
        ...acc,
        ...cur,
      }),
      {}
    )
}

export const isBrowser = () => typeof window !== "undefined"
