export const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = document.createElement("img")

    image.onload = () => {
      resolve(image)
    }
    image.onerror = () => {
      reject(null)
    }
    image.src = url
  })
