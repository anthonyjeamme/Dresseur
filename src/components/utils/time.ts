export const timeout = ms => new Promise(res => setTimeout(res, ms))

export const now = () => new Date().getTime()
