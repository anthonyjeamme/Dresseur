import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import uniqid from "uniqid"

import { useModal } from "../../Common/Modal/Modal"
import { getTilesetList } from "./TilesetList.queries"
import TilesetCreationModal from "./TilesetCreationModal/TilesetCreationModal"

import "./TilesetList.scss"

const TilesetList = ({}) => {
  const [list, setList] = useState([])

  useEffect(() => {
    getTilesetList().then(setList)
  }, [])

  const creationModal = useModal()

  return (
    <div className="TilesetList">
      <TilesetCreationModal {...creationModal} />

      <h1>Tilesets</h1>
      <div className="list">
        <div
          className="item"
          role="button"
          onClick={() => {
            creationModal.open({ id: uniqid() })
          }}
        >
          <div className="name">Nouveau</div>
        </div>

        {list.map(tileset => (
          <Link
            className="item"
            to={`/editor/tileset?id=${tileset.id}`}
            key={tileset.id}
          >
            <div className="image-container">
              <img src={tileset.imageUrl} />
            </div>

            <div className="name">{tileset.name}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TilesetList
