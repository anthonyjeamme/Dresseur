import { isBrowser } from "../../../components/Game/Game"

export class Tile {
  image = null
  imageSrc = null
  json = null
  isLoaded = false

  constructor(imageSrc, json) {
    if (!isBrowser()) return

    this.image = document.createElement("img")
    this.imageSrc = imageSrc
    this.json = json
  }

  load() {
    return new Promise(res => {
      this.image.src = this.imageSrc
      const onLoad = () => {
        res(null)
        this.isLoaded = true
        this.image.removeEventListener("load", onLoad)
      }
      this.image.addEventListener("load", onLoad)
    })
  }
}
