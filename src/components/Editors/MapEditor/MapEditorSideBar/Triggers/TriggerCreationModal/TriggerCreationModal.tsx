import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'

import uniqid from 'uniqid'

import Modal, { TModalHook } from '../../../../../Common/Modal/Modal'
import { TTrigger } from '../../../../../types/Trigger/Trigger.types'


import './TriggerCreationModal.scss'

const TriggerCreationModal: TTriggerCreationModalComponent = ({ payload, handleValidate, ...modalProps }) => {

    const titleInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {

        if (modalProps.isOpen) {
            titleInputRef.current.focus()
        } else {
            titleInputRef.current.value = ""
        }
    }, [modalProps.isOpen])

    return (
        <Modal className={`TriggerCreationModal`} {...modalProps}>
            <div>

                <div>
                    <input ref={titleInputRef} placeholder="Nom de l'évènement" />
                </div>

                Quand<br />

                <select><option>Joueur entre dans une zone</option></select><br />
                ET <br />
                <select><option>Joueur clique sur bouton action</option></select><br />
                <button><i className="mdi mdi-plus" /></button>
            </div>
            <div>
                Alors<br />

                <select><option>Téléporter vers ...</option></select>

                <br />Map :<br />
                <select></select>
                <br />

                coordonnées : <input /> <input />
            </div>

            <button onClick={() => {

                handleValidate({
                    id: uniqid(),
                    title: titleInputRef.current.value,
                    action: null,
                    condition: null
                })

                modalProps.close()

            }}>Valider</button>

        </Modal>
    )
}

export default TriggerCreationModal

type TTriggerCreationModalComponent = (props: {
    handleValidate: (trigger: TTrigger) => void
} & TModalHook) => JSX.Element