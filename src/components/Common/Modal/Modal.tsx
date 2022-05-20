import React, { Children, useState } from "react"

import "./Modal.scss"

const Modal: React.FC<TModalHook & { className?: string }> = ({
  children,
  isOpen,
  close,
  className = "",
}) => {
  return (
    <div
      className={`Modal ${isOpen ? "active" : ""}${className ? ` ${className}` : ""
        }`}
    >
      <div className="overlay" />
      <div className="content">{children}</div>
      <button
        className="close-button"
        onClick={() => {
          close()
        }}
      >
        <i className="mdi mdi-close" />
      </button>
    </div>
  )
}

export const useModal = (): TModalHook => {
  const [modal, setModal] = useState({
    isOpen: false,
    payload: null,
  })

  const open = payload => {
    setModal({
      isOpen: true,
      payload,
    })
  }
  const close = () => {
    setModal({
      isOpen: false,
      payload: null,
    })
  }

  return {
    open,
    close,
    ...modal,
  }
}

export type TModalHook<T = any> = {
  open: (payload?: any) => void
  close: () => void
  isOpen: boolean
  payload?: T
}

export type TModal<T = any> = TModalHook<T>

export default Modal
