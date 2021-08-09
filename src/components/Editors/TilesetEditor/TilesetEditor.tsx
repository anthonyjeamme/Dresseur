import { navigate } from "gatsby"

import firebase from "firebase/app"
import "firebase/firestore"

import uniqid from "uniqid"
import React, { useEffect, useRef, useState } from "react"
import { loadTileSet, loadTileSetData } from "../../../gameEngine/loader/loader"

import { TileCoords } from "../../../gameEngine/Objects/Tile/TileCoord/TileCoord"
import { TileSet } from "../../../gameEngine/Objects/TileSet/TileSet"
import useRefresh from "../../utils/hooks/useRefresh"
import { getUrlParams } from "../../utils/navigator"
import EditorMenuBar from "../Common/EditorMenuBar/EditorMenuBar"

import "./TilesetEditor.scss"
import TilesetEditorContent from "./TilesetEditorContent/TilesetEditorContent"
import TilesetEditorSidebar from "./TilesetEditorSidebar/TilesetEditorSidebar"
import { Tile } from "../../../gameEngine/Objects/Tile/Tile"
import { loadImage } from "../../../gameEngine/loader/loader.utils"

const TilesetEditor = ({
  tileset,
  setTileset,
  handleSave,
  handleChangeImage,
}: {
  tileset: TileSet
  setTileset: (tileset: TileSet) => void
  handleSave: () => void
  handleChangeImage: (props: any) => void
}) => {
  const currentTileRef = useRef<string>(null)
  const [refresh] = useRefresh()

  const [selectedTile, setSelectedTile] = useState(null)

  useEffect(() => {
    const handleEscape = e => {
      if (e.key === "Escape") {
        currentTileRef.current = null
        setSelectedTile(null)
      }
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <div className="TilesetEditor">
      <EditorMenuBar
        menu={[
          {
            name: "File",
            menu: [
              {
                name: "Save",
                onClick: handleSave,
              },
              {
                name: "Back to tileset list",
                onClick: () => {
                  navigate("/editor/tilesets")
                },
              },
            ],
          },
        ]}
      />
      <div className="content">
        <TilesetEditorContent
          tileset={tileset}
          currentTileRef={currentTileRef}
          handleSelectTile={async (selection, push) => {
            const id = currentTileRef.current
            const { x, y, width, height } = selection
            const coords = [x, y, width, height]
            if (currentTileRef.current) {
              if (push) {
                tileset.tiles[id].frames.push({ coords })
              } else {
                tileset.tiles[id].frames = [{ coords }]
              }
            } else {
              const id = uniqid()
              const tile = {
                id,
                animation: {
                  frameDuration: 400,
                },
                frames: [
                  {
                    coords,
                  },
                ],
                over: false,
                walkable: false,
              }

              tileset.tiles[id] = tile
              currentTileRef.current = id
              setSelectedTile(id)

              refresh()
            }
          }}
        />
        <TilesetEditorSidebar
          selectedTile={selectedTile}
          setSelectedTile={setSelectedTile}
          tileset={tileset}
          handleEditTile={id => (currentTileRef.current = id)}
        />
      </div>
    </div>
  )
}

const tileSetEditorContext = React.createContext({ img: null })

export const useTileSetEditorContext = () => {
  return React.useContext(tileSetEditorContext)
}

const TilesetEditorContainer = () => {
  const tilsetRef = useRef(null)

  const [tileset, setTileset] = useState<TileSet>(null)
  const [error, setError] = useState(false)
  const [refresh] = useRefresh()
  const [img, setImg] = useState<HTMLImageElement>(null)

  useEffect(() => {
    const tilesetId = getUrlParams().id
    loadTileSetData(tilesetId)
      .then(async tileset => {
        const img = await loadImage(tileset.imageUrl)

        setImg(img)

        tilsetRef.current = tileset

        refresh()
      })
      .catch(err => {
        setError(err)
      })
  }, [])

  const handleSave = async () => {
    const tilesetId = getUrlParams().id
    try {
      await firebase
        .firestore()
        .collection("tilesets")
        .doc(tilesetId)
        .set(tilsetRef.current)
    } catch (err) {
      console.log(err)
    }
    // TODO
  }
  const handleChangeImage = () => {
    console.log("handleChangeImage")
    // TODO
  }

  if (error)
    return (
      <div>
        Une erreur est survenue durant le chargement de la tileset. Details :
        <code>{JSON.stringify(error)}</code>
      </div>
    )

  if (tilsetRef.current === null)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Chargement de la tileset
      </div>
    )

  return (
    <tileSetEditorContext.Provider value={{ img }}>
      <TilesetEditor
        tileset={tilsetRef.current}
        setTileset={tileSet => {
          tilsetRef.current = tileSet
        }}
        handleSave={handleSave}
        handleChangeImage={handleChangeImage}
      />
    </tileSetEditorContext.Provider>
  )
}

export default TilesetEditorContainer
