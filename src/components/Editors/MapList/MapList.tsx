import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

import firebase from "firebase/app"
import "firebase/firestore"

import LoadingScreen from "../../Common/LoadingScreen/LoadingScreen"
import Container from "../../Common/Container/Container"

import MapCreatioModal from "./MapCreationModal/MapCreationModal"
import { useModal } from "../../Common/Modal/Modal"

import "./MapList.scss"

const MapList = ({}) => {
  const [list, setList] = useState(null)

  const creationModal = useModal()

  useEffect(() => {
    firebase
      .firestore()
      .collection("maps")
      .get()
      .then(snapshot => {
        setList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      })
  }, [])

  if (list === null)
    return <LoadingScreen>Chargement de la liste des maps...</LoadingScreen>

  return (
    <div className="MapList">
      <MapCreatioModal {...creationModal} />

      <Container>
        <header>
          <Link to="/editor">Retour</Link>
        </header>

        <div
          className="game-item"
          role="button"
          onClick={() => {
            creationModal.open()
          }}
        >
          Nouveau
        </div>

        {list.map(({ id, name }) => (
          <Link to={`/editor/map?id=${id}`} className="game-item" key={id}>
            {name}
          </Link>
        ))}
      </Container>
    </div>
  )
}

export default MapList
