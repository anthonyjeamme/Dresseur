import React, { useRef, useState } from "react"
import { useClickOutside } from "../../../utils/hooks/useClickOutside"

import { TEditorMenu } from "./EditorMenuBar.types"
import "./EditorMenuBar.scss"

const EditorMenuBar = ({ menu = [] }: { menu: TEditorMenu[] }) => {
  return (
    <div className="EditorMenuBar">
      {menu.map(item => (
        <EditorMenuItem
          name={item.name}
          onClick={item.onClick}
          menu={item.menu}
        />
      ))}
    </div>
  )
}

export default EditorMenuBar

const EditorMenuItem = ({ name, onClick = null, menu = null }) => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef(null)

  useClickOutside(isOpen, setIsOpen, rootRef)

  return (
    <div className="EditorMenuItem" ref={rootRef}>
      <button
        onClick={() => {
          if (menu) {
            setIsOpen(!isOpen)
          } else if (onClick) onClick()
        }}
      >
        {name}
        {menu && <img src="/editor/ui/caret_px.png" className="caret" />}
      </button>

      {menu && (
        <div className={`menu ${isOpen ? "active" : ""}`}>
          {menu.map(item => (
            <div
              role="button"
              className="item"
              onClick={() => {
                item.onClick?.()
                setIsOpen(false)
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
