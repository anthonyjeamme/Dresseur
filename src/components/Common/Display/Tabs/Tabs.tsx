import React, { useState } from 'react'

import { TTabsComponent, TTabsHooks } from './Tabs.types'

import './Tabs.scss'

const tabsContext = React.createContext<TTabsHooks>(null)

export function useTabs<T = any>(defaultCurrentTab: T = null) {

    const [currentTab, setCurrentTab] = useState<T>(defaultCurrentTab)

    return {
        currentTab, setCurrentTab
    } as TTabsHooks<T>
}

const Tabs: TTabsComponent = ({ children, currentTab, setCurrentTab }) => {

    return (
        <tabsContext.Provider value={{ currentTab, setCurrentTab }}>

            <div className="Tabs">
                {children}
            </div>
        </tabsContext.Provider >
    )
}

export default Tabs

export const Tab = ({ children, value }) => {

    const tabContext = React.useContext(tabsContext)

    return (
        (
            <div
                role="button"
                tabIndex={0}
                onClick={() => {
                    tabContext.setCurrentTab(value)
                }}
                className={`Tab ${tabContext.currentTab === value ? 'active' : ''}`}
            >
                {children}
            </div>
        )
    )
}