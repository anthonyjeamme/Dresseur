import React from "react"

import "./Topbar.scss"

const Topbar = ({ handleSave }) => {
  return (
    <div className="Topbar">
      <TopbarMenu name="Files" />
      <TopbarMenu name="View" />
      <TopbarMenu
        name="Save"
        onClick={() => {
          handleSave()
        }}
      />
    </div>
  )
}

const TopbarMenu = ({ name, onClick = null }) => {
  return (
    <div
      className="TopbarMenu"
      role="button"
      onClick={() => {
        if (onClick) {
          onClick()
        }
      }}
    >
      {name}
    </div>
  )
}

export default Topbar
