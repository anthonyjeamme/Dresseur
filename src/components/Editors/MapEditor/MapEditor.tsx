import React from "react"

import "./MapEditor.scss"
import MapEditorRenderer from "./MapEditorRenderer/MapEditorRenderer"
import MapEditorSidebar from "./MapEditorSidebar/MapEditorSidebar"

const MapEditor = ({ }) => {

	return <div className="MapEditor">
		<MapEditorRenderer />
		<MapEditorSidebar />
	</div>
}

export default MapEditor
