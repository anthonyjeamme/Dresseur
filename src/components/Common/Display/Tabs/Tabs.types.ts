import React from 'react'

export type TTabsComponent = React.FC<TTabsHooks>

export type TTabsHooks<T = any> = {
    currentTab: T,
    setCurrentTab: (currentTab: T) => void,
}