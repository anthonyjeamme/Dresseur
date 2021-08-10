import React from "react"
import {
  TTile,
  TTileType,
} from "../../../../../gameEngine/Objects/Tile/Tile.types"

import "./TileParams.scss"

const TileParams = ({
  tile,
  refresh,
}: {
  tile: TTile
  refresh: () => void
}) => {
  return (
    <div className="TileParams">
      <div>
        <h2>Propriétés</h2>

        <section>
          <h3>A pied</h3>

          <div
            role="button"
            onClick={() => {
              tile.physics = {
                ...(tile.physics || {}),
                walk: {
                  ...(tile.physics?.walk || {}),
                  enabled: !tile.physics?.walk?.enabled,
                  xFactor: 1,
                  yFactor: 1,
                },
              }
              refresh()
            }}
          >
            <input type="checkbox" checked={tile.physics?.walk?.enabled} />{" "}
            Activer
          </div>
          {tile.physics?.walk?.enabled && (
            <div>
              Modificateur de vitesse
              <br />X{" "}
              <input
                defaultValue={tile.physics.walk.xFactor}
                type="number"
                step={0.1}
                min={0.1}
                style={{ width: 90, marginRight: 9 }}
                onChange={e => {
                  tile.physics.walk.xFactor = parseFloat(e.target.value)
                }}
              />
              Y{" "}
              <input
                type="number"
                step={0.1}
                min={0.1}
                style={{ width: 90 }}
                defaultValue={tile.physics.walk.yFactor}
                onChange={e => {
                  tile.physics.walk.yFactor = parseFloat(e.target.value)
                }}
              />
            </div>
          )}
        </section>

        <section>
          <h3>Type de tile</h3>

          <select
            value={tile.type}
            onChange={e => {
              tile.type = e.target.value as TTileType
              refresh()
            }}
          >
            <option value="base">Base</option>
            <option value="over">Over</option>
          </select>
        </section>

        <section>
          <h3>Animation</h3>
          Durée de la frame :{" "}
          <input
            type="number"
            defaultValue={tile.animation.frameDuration}
            step={1}
            min={20}
            onChange={e => {
              tile.animation.frameDuration = parseInt(e.target.value, 10)
            }}
          />
        </section>
      </div>
    </div>
  )
}

export default TileParams
