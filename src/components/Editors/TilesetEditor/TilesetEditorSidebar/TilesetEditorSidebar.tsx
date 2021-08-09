import React, { useEffect, useRef, useState } from "react"
import { drawTile } from "../../../../gameEngine/graphicEngine/graphicEngine"
import { Tile } from "../../../../gameEngine/Objects/Tile/Tile"
import { TileSet } from "../../../../gameEngine/Objects/TileSet/TileSet"
import useIsMounted from "../../../../utils/useIsMounted"
import useRefresh from "../../../utils/hooks/useRefresh"
import { useTileSetEditorContext } from "../TilesetEditor"

import "./TilesetEditorSidebar.scss"

const TilesetEditorSidebar = ({
  tileset,
  handleEditTile,
  selectedTile,
  setSelectedTile,
}: {
  tileset: TileSet
  handleEditTile: (id: string) => void
  selectedTile: string
  setSelectedTile: (id: string) => void
}) => {
  const [refresh] = useRefresh()

  return (
    <div className="TilesetEditorSidebar">
      {selectedTile && (
        <div>
          <div>props de la tile</div>
          <div>
            <input
              type="checkbox"
              checked={tileset.tiles[selectedTile].walkable}
              onClick={() => {
                tileset.tiles[selectedTile].walkable =
                  !tileset.tiles[selectedTile].walkable

                refresh()
              }}
            />{" "}
            Walkable
          </div>
          <div>
            <input
              type="checkbox"
              checked={tileset.tiles[selectedTile].over}
              onClick={() => {
                tileset.tiles[selectedTile].over =
                  !tileset.tiles[selectedTile].over
                refresh()
              }}
            />{" "}
            over
          </div>
        </div>
      )}

      <div className="tiles">
        {Object.keys(tileset.tiles)

          .sort((id1, id2) =>
            tileset.tiles[id1].frames.length == 0
              ? -1
              : tileset.tiles[id2].frames.length === 0
              ? 1
              : tileset.tiles[id1].frames[0].coords[0] -
                tileset.tiles[id2].frames[0].coords[0]
          )
          .sort((id1, id2) =>
            tileset.tiles[id1].frames.length == 0
              ? -1
              : tileset.tiles[id2].frames.length === 0
              ? 1
              : tileset.tiles[id1].frames[0].coords[1] -
                tileset.tiles[id2].frames[0].coords[1]
          )
          .map(id => (
            <TileItem
              active={selectedTile === id}
              id={id}
              key={id}
              tile={tileset.tiles[id]}
              handleClick={() => {
                if (selectedTile === id) {
                  handleEditTile(null)
                  setSelectedTile(null)
                } else {
                  handleEditTile(id)
                  setSelectedTile(id)
                }
              }}
              tileset={tileset}
            />
          ))}
      </div>
    </div>
  )
}

const TileItem = ({
  active,
  tile,
  id,
  handleClick,
  tileset,
}: {
  active: boolean
  tile: Tile
  id: string
  handleClick: () => void
  tileset: TileSet
}) => {
  const canvasRef = useRef<HTMLCanvasElement>()

  const { img } = useTileSetEditorContext()

  const isMounted = useIsMounted()

  useEffect(() => {
    loop()
  }, [tile])

  const loop = () => {
    if (!isMounted()) return

    try {
      const frame =
        Math.round(new Date().getTime() / tile.animation.frameDuration) %
        tile.frames.length

      const ctx = canvasRef.current.getContext("2d")

      if (tile.frames.length > 0) {
        const [x, y, height, width] = tile.frames[frame].coords
        ctx.clearRect(0, 0, 32, 32)
        ctx.drawImage(img, x, y, height, width, 0, 0, 32, 32)
      }
    } catch (err) {
      console.log("ERROR", err)
    }

    window.requestAnimationFrame(loop)
  }

  return (
    <div
      className={`TileItem ${active ? "active" : ""}`}
      role="button"
      onClick={handleClick}
    >
      <canvas ref={canvasRef} height={32} width={32} />
    </div>
  )
}

export default TilesetEditorSidebar
