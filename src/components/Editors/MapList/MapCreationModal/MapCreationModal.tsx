import React, { useState, useRef } from "react"

import Modal, { TModalHook } from "../../../Common/Modal/Modal"

import firebase from "firebase/app"
import "firebase/firestore"

import "./MapCreationModal.scss"
import { navigate } from "gatsby"

const MapCreationModal = ({ ...modalProps }: TModalHook) => {
  const nameInputRef = useRef<HTMLInputElement>()

  const [error, setError] = useState(null)

  const handleCreate = async () => {
    if (!nameInputRef.current) {
      setError("Veuillez renseigner un nom")
    }

    const sector = await firebase
      .firestore()
      .collection("sectors")
      .add({
        dependencies: {
          tileSets: [],
        },
        globalPosition: { x: 0, y: 0 },
        map: {
          objects: [],
          tileMap: Array.from(new Array(32)).map(() => ({
            cells: Array.from(new Array(32)).map(() => ({
              base: { tile: null, tileSet: null },
              over: [],
            })),
          })),
        },
        size: {
          x: 32,
          y: 32,
        },
      })

    const document = await firebase
      .firestore()
      .collection("maps")
      .add({
        name: nameInputRef.current.value,
        sectors: [
          {
            id: sector.id,
            position: {
              x: 0,
              y: 0,
            },
          },
        ],
      })

    navigate(`/editor/map?id=${document.id}`)
  }

  return (
    <Modal className="MapCreatioModal" {...modalProps}>
      <div>
        <input placeholder="Nom" ref={nameInputRef} />

        <button
          onClick={() => {
            handleCreate()
          }}
        >
          Créer
        </button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </Modal>
  )
}

export default MapCreationModal
