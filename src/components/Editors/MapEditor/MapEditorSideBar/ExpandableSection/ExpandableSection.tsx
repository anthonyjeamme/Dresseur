import React, { useState } from 'react'

import './ExpandableSection.scss'

const ExpandableSection = ({ title, children }) => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="ExpandableSection">

            <header role="button" className={isOpen ? 'active' : ''} tabIndex={0} onClick={() => {
                setIsOpen(!isOpen)
            }}>
                <span>{title}</span> <i className="caret mdi mdi-arrow-up-drop-circle-outline" />
            </header>

            {isOpen && <div className="content">{children}</div>}

        </div>
    )
}

export default ExpandableSection