import React, { useState } from 'react'

import uniqid from 'uniqid'

import { TTriggersComponent } from './Triggers.types'

import TriggerCreationModal from './TriggerCreationModal/TriggerCreationModal'
import { useModal } from '../../../../Common/Modal/Modal'

import { TTrigger } from '../../../../types/Trigger/Trigger.types'

import './Triggers.scss'

const Triggers: TTriggersComponent = () => {

    const creationModal = useModal()

    const [triggers, setTriggers] = useState<TTrigger[]>([])

    return (
        <div className="Triggers">
            <TriggerCreationModal {...creationModal} handleValidate={(trigger) => {

                setTriggers([
                    trigger,
                    ...triggers
                ])

            }} />

            <button className="add-button" onClick={() => { creationModal.open() }}><i className="mdi mdi-plus" /></button>

            <div className="list">

                {triggers.map(trigger => (
                    <TriggerItem
                        key={trigger.id}
                        trigger={trigger}
                        handleClickRemove={() => {
                            setTriggers(triggers.filter(({ id }) => id !== trigger.id))
                        }}
                        handleClickEdit={() => {
                            creationModal.open(trigger)
                        }}
                    />
                ))}

            </div>
        </div>
    )
}

export default Triggers


const TriggerItem = ({ trigger, handleClickRemove, handleClickEdit }:
    {
        trigger: TTrigger
        handleClickRemove: () => void
        handleClickEdit: () => void
    }) => {

    return (
        <div className="TriggerItem">
            <header>
                <div>{trigger.title}</div>
                <div className="buttons">
                    <button onClick={handleClickRemove}>
                        <i className="mdi mdi-trash-can" /></button>
                    <button onClick={handleClickEdit}><i className="mdi mdi-pencil" /></button>
                </div>
            </header>
        </div>
    )
}