import React from "react"
import { useRef } from "react"

import "./MobileButtons.scss"

/*
 * TODO NEED TO BE REFACTORED
 */

const MobileButtons = ({}) => {
  const inputRef = useRef<HTMLInputElement>()

  return (
    <div className="MobileButtons" id="mobile-buttons">
      <input ref={inputRef} type="hidden" id="mobile-buttons-current" />
      <div>
        <button
          id="up"
          onTouchStart={() => {
            inputRef.current.value = "up"
          }}
          onTouchEnd={() => {
            inputRef.current.value = null
          }}
        >
          <i className="mdi mdi-arrow-up-bold" />
        </button>
      </div>
      <div>
        <button
          id="left"
          onTouchStart={() => {
            inputRef.current.value = "left"
          }}
          onTouchEnd={() => {
            inputRef.current.value = null
          }}
        >
          <i className="mdi mdi-arrow-left-bold" />
        </button>
        <button
          id="down"
          onTouchStart={() => {
            inputRef.current.value = "down"
          }}
          onTouchEnd={() => {
            inputRef.current.value = null
          }}
        >
          <i className="mdi mdi-arrow-down-bold" />
        </button>
        <button
          id="right"
          onTouchStart={() => {
            inputRef.current.value = "right"
          }}
          onTouchEnd={() => {
            inputRef.current.value = null
          }}
        >
          <i className="mdi mdi-arrow-right-bold" />
        </button>
      </div>
    </div>
  )
}

export default MobileButtons
