import React, { useRef, useState } from "react"

import firebase from "firebase/app"
import "firebase/storage"

import "./ImageUpload.scss"

const ImageUpload = ({
  onSelectFile,
  onError,
  filepath = null,
  accept = "image/*",
}) => {
  const inputRef = useRef<HTMLInputElement>()
  const [currentImageName, setCurrentImageName] = useState(null)

  const handleClickUpload = () => {
    inputRef.current.click()
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files.length === 0) return

    const file = e.target.files[0]
    setCurrentImageName(file.name)
    const ref = filepath || `files/${file.name}`

    try {
      const remoteFile = await firebase.storage().ref(ref).put(file)

      onSelectFile(await remoteFile.ref.getDownloadURL())
    } catch (err) {
      onError(err)
    }
  }

  return (
    <div className="ImageUpload">
      <input
        type="file"
        ref={inputRef}
        onChange={handleInputChange}
        accept={accept}
      />
      <button onClick={handleClickUpload}>
        {currentImageName || "Upload"}
      </button>
    </div>
  )
}

export default ImageUpload
