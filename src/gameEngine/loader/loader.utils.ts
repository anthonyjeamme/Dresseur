export const loadImage = (url: string) =>
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
