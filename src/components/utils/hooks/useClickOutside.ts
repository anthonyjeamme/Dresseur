import { useEffect } from "react"

export const useClickOutside = (isOpen, setIsOpen, rootRef) => {
  useEffect(() => {
    const clickOutsideEvent = event => {
      if (!rootRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    const closeDropdown = () => {
      setIsOpen(false)
    }
    if (isOpen) {
      window.addEventListener("mousedown", clickOutsideEvent)
      window.addEventListener("blur", closeDropdown)
      return () => {
        window.removeEventListener("mousedown", clickOutsideEvent)
        window.removeEventListener("blur", closeDropdown)
      }
    }
  }, [isOpen, setIsOpen])

  return null
}
