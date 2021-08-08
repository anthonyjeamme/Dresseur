import { useEffect, useRef } from "react"

export const useAudioEngine = () => {
  const soundRef = useRef<HTMLAudioElement>()

  useEffect(() => {
    soundRef.current = loadSound("/audio/music1.mp3")
    soundRef.current.play()

    return () => {
      soundRef.current.pause()
    }
  }, [])

  const changeAmbientMusic = () => {
    // TODO
  }

  return {
    changeAmbientMusic,
  }
}

const loadSound = (url): HTMLAudioElement => {
  const element = document.createElement("audio")

  element.src = url
  element.volume = 0.2
  element.loop = true

  return element
}
