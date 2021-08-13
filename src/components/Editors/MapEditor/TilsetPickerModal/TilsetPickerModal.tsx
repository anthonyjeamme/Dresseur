import React from "react"
import { useState } from "react"
import { useEffect } from "react"

import Modal, { TModalHook } from "../../../Common/Modal/Modal"
import { getTilesetList } from "../../TilesetList/TilesetList.queries"

import "./TilsetPickerModal.scss"

const TilsetPickerModal = ({
  existingTilesetDependencies,
  handleSelect,
  ...modalProps
}: {
  existingTilesetDependencies: string[]
  handleSelect: (id) => void
} & TModalHook) => {
  const [tilesets, setTilesets] = useState([])

  useEffect(() => {
    if (modalProps.isOpen) {
      getTilesetList().then(setTilesets)
    }
  }, [modalProps.isOpen])

  return (
    <Modal {...modalProps} className="TilsetPickerModal">
      <div className="list">
        {tilesets.map(({ id, name }) => (
          <div
            role="button"
            className="tileset-item"
            key={id}
            onClick={() => {
              handleSelect(id)
              modalProps.close()
            }}
          >
            {name}
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default TilsetPickerModal
