import { useEffect, useRef } from "react"

export const useKeys = () => {

    const keyMapRef = useRef({})

    useEffect(() => {

        const handleKeyDown = (e) => {
            console.log(e.key)
            keyMapRef.current[e.key] = true
        }

        const handleKeyUp = (e) => {
            console.log('up', e.key)
            keyMapRef.current[e.key] = false
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    return {
        getKey: (key: string) => keyMapRef.current[key]
    }
}