import { useState } from "react"

const useRefresh = (): [() => void, number] => {
  const [n, setN] = useState(0)

  return [
    () => {
      setN(n + 1)
    },
    n,
  ]
}

export default useRefresh
