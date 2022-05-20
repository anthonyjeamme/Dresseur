import React, { useState } from 'react'

import { TMapEditorSidebarComponent } from './MapEditorSidebar.types'

import Triggers from './Triggers/Triggers'
import TileMaps from './TileMaps/TileMaps'
import Tabs, { Tab, useTabs } from '../../../Common/Display/Tabs/Tabs'

import './MapEditorSidebar.scss'

const MapEditorSidebar: TMapEditorSidebarComponent = () => {

    const tabs = useTabs<'tilesets' | 'triggers'>('tilesets')

    return (
        <div className="MapEditorSidebar">

            <header>
                <Tabs {...tabs}>
                    <Tab value="tilesets">CARTE</Tab>
                    <Tab value="triggers">ÉVÈNEMENTS</Tab>
                </Tabs>
            </header>

            {tabs.currentTab === "tilesets" ? (
                <>
                    <div className="content" key={"tilesets"}>
                        <TileMaps />
                    </div>
                    <footer>

                        <LayerSelector handleChangeLayer={(layer) => {
                            console.log(layer)
                        }} />
                    </footer>
                </>
            ) :
                tabs.currentTab === "triggers" ? (
                    <div className="content" key={"triggers"}>
                        <Triggers />
                    </div>
                ) : null}


        </div >
    )
}

export default MapEditorSidebar

const LayerSelector = ({ handleChangeLayer }) => {

    const [currentLayer, setCurrentLayer] = useState(0)

    const layers = [2, 1, 0]

    return (
        <div className="LayerSelector">
            {layers.map(layerIndex => (
                <LayerItem
                    key={layerIndex}
                    index={layerIndex}
                    active={layerIndex === currentLayer}
                    onClick={() => {
                        setCurrentLayer(layerIndex)
                        handleChangeLayer(layerIndex)
                    }} />
            ))}
        </div>
    )
}
const LayerItem = ({ onClick, index, active = false }) => (
    <button className={`LayerItem ${active ? 'active' : ''}`} onClick={onClick}>Layer {index}</button>
)