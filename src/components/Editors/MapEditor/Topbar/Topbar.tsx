import React from "react"

import "./Topbar.scss"

const Topbar = ({}) => {
  return (
    <div className="Topbar">
      <TopbarMenu name="Files" />
      <TopbarMenu name="View" />
    </div>
  )
}

const TopbarMenu = ({ name }) => {
  return <div className="TopbarMenu">{name}</div>
}

export default Topbar
