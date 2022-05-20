import React from 'react'

import Modal, { TModal } from '~Display/Modal/Modal'

import './MyComponent.scss'

const MyComponent: TMyComponentComponent = ({ payload, ...modalProps }) => {

    console.log({ payload })

    return (
        <Modal className={`MyComponent`} {...modalProps}>
            MyComponent
        </Modal>
    )
}

export default MyComponent

type TMyComponentComponent = {

} & TModal<any>