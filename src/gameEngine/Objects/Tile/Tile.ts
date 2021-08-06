export class Tile {
  image = document.createElement("img")
  imageSrc = null
  json = null
  isLoaded = false

  constructor(imageSrc, json) {
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
