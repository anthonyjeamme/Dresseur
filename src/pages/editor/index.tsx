import { Link } from "gatsby"
import React from "react"

const index = () => {
  return (
    <div style={{ maxWidth: 1000, margin: "30px auto" }}>
      <div>
        <Link to="/editor/map">Editeur de map</Link>
      </div>

      <div>
        <Link to="/editor/tilesets">Editeur de tileset</Link>
      </div>
    </div>
  )
}
export default index
