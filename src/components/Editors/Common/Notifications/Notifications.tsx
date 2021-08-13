import { uniqueId } from "lodash"
import React, { useState } from "react"
import { useEffect } from "react"

import "./Notifications.scss"

const Notifications = ({ list }) => {
  return (
    <div className="Notifications">
      {list.map(({ id, message }) => (
        <div className="item" key={id}>
          {message}
        </div>
      ))}
    </div>
  )
}

const notificationContext = React.createContext(null)

export const useNotificationContext = () =>
  React.useContext(notificationContext)

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(notifications =>
        notifications.filter(({ time }) => new Date().getTime() - time < 1500)
      )
    }, 300)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const push = (notification: TNotification) => {
    setNotifications(notifications => [
      ...notifications,
      {
        ...notification,
        time: new Date().getTime(),
        id: uniqueId(),
      },
    ])
  }

  return (
    <notificationContext.Provider
      value={{
        push,
      }}
    >
      <Notifications list={notifications} />

      {children}
    </notificationContext.Provider>
  )
}

export type TNotification = {
  message: string
  id?: string
  time?: number
}
