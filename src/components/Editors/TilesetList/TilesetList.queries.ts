import firebase from "firebase/app"

import "firebase/firestore"

export const getTilesetList = async () => {
  return (await firebase.firestore().collection("tilesets").get()).docs.map(
    doc => ({
      id: doc.id,
      ...doc.data(),
    })
  )
}
