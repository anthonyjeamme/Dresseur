import React from "react"

import "./LoadingScreen.scss"

const LoadingScreen = ({ children }) => {
  return (
    <div className="LoadingScreen">
      <div>{children}</div>
    </div>
  )
}

export default LoadingScreen
