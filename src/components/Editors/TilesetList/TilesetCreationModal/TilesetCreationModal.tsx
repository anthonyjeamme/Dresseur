import React, { useEffect, useRef, useState } from "react"

import firebase from "firebase/app"
import "firebase/firestore"

import ImageUpload from "../../../Common/ImageUpload/ImageUpload"
import Modal, { TModalHook } from "../../../Common/Modal/Modal"

import "./TilesetCreationModal.scss"
import { navigate } from "gatsby"

const TilesetCreationModal = ({ payload, ...props }: TModalHook) => {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState(null)
  const [imageUrl, setImageUrl] = useState()
  const [error, setError] = useState(null)

  useEffect(() => {
    if (props.isOpen) {
      nameInputRef.current?.focus()
    } else {
      setImageUrl(null)
    }
  }, [props.isOpen])

  const handleCreateTileset = async () => {
    if (!imageUrl || !nameInputRef.current.value) {
      setError({ message: "Merci de remplir les champs" })
    }

    try {
      await firebase.firestore().collection("tilesets").doc(payload.id).set({
        imageUrl,
        name: nameInputRef.current.value,
        tiles: {},
      })

      navigate(`/editor/tileset?id=${payload.id}`)
    } catch (err) {
      console.log(err)
      setError({ message: `Erreur lors de la création du tileset` })
    }
  }

  return (
    <Modal {...props} className="TilesetCreationModal">
      <h2>Créer un nouveau tileset</h2>

      {error && (
        <div style={{ color: "red", fontSize: 10, marginTop: 6 }}>
          {error.message}
        </div>
      )}

      <div>
        Nom :<br />
        <input type="text" ref={nameInputRef} />
      </div>
      <div style={{ marginTop: 21 }}>
        image :<br />
        <ImageUpload
          accept="image/png"
          filepath={`res/tileSets/${payload?.id}/img.png`}
          key={props.isOpen.toString()}
          onSelectFile={url => {
            setImageUrl(url)
            setUploadError(null)
          }}
          onError={setUploadError}
        />
        {uploadError && (
          <div style={{ color: "red", fontSize: 10, marginTop: 6 }}>
            Une erreur est survenue durant l'upload...
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 42,
          gap: 12,
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => {
            props.close()
          }}
        >
          Annuler
        </button>

        <button onClick={handleCreateTileset}>Valider</button>
      </div>
    </Modal>
  )
}

export default TilesetCreationModal
