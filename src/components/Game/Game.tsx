import React, { useEffect, useRef } from "react"

import uniqid from "uniqid"

import { useGraphicEngine } from "../../gameEngine/graphicEngine/useGraphicEngine"
import { usePhysicsEngine } from "../../gameEngine/physicsEngine/usePhysicsEngine"
import useIsMounted from "../../utils/useIsMounted"

import GameRenderer from "./GameRenderer/GameRenderer"

import { GameContextProvider, useGameContext } from "./GameContext/GameContext"

import { useUserInteractions } from "../../gameEngine/io/useUserInteractions"

import "./Game.scss"

const Game = () => {
  const loopIdRef = useRef(null)

  const gameContext = useGameContext()

  const userInteractions = useUserInteractions()
  const graphicEngine = useGraphicEngine()
  const physicsEngine = usePhysicsEngine(userInteractions)

  const isMounted = useIsMounted()

  const changeZone = async change => {
    try {
      gameContext.playerState.get().movementDisabled = true
      await gameContext.overlayEffect.play("fadein", 200)
      await change()
      await gameContext.overlayEffect.play("fadeout", 200)
      gameContext.playerState.get().movementDisabled = false
    } catch (err) {
      console.log(err)
    }
  }

  const load = async () => {
    await gameContext.gameResources.loadMap("05DGp5hRkJZvaMp4MCoT")
    await gameContext.gameResources.loadSector({ x: 0, y: 0 })
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const handleInteraction = () => {
      changeZone(async () => {
        if (
          gameContext.gameResources.getCurrentMapId() === "05DGp5hRkJZvaMp4MCoT"
        ) {
          await gameContext.gameResources.loadMap("05DGp5hRkJZvaMp4MCoU")
          await gameContext.gameResources.loadSector({ x: 0, y: 0 })
          gameContext.setPlayerPositionTo("05DGp5hRkJZvaMp4MCoU", {
            x: 32,
            y: 32,
          })
        } else {
          await gameContext.gameResources.loadMap("05DGp5hRkJZvaMp4MCoT")
          await gameContext.gameResources.loadSector({ x: 0, y: 0 })
          gameContext.setPlayerPositionTo("05DGp5hRkJZvaMp4MCoU", {
            x: 32,
            y: 32,
          })
        }
      })
    }

    userInteractions.addEventListener("interact", handleInteraction)

    return () => {
      userInteractions.removeEventListener("interact", handleInteraction)
    }
  }, [])

  useEffect(() => {
    loopIdRef.current = uniqid()
    gameLoop(loopIdRef.current)
  }, [])

  const gameLoop = async (loopId: string) => {
    if (!isMounted()) return
    if (loopIdRef.current !== loopId) {
      return
    }

    graphicEngine.render()
    physicsEngine.executeLoop()

    window.requestAnimationFrame(() => {
      gameLoop(loopId)
    })
  }

  return (
    <div className="Game">
      <GameRenderer graphicEngine={graphicEngine} />
    </div>
  )
}

const GameContainer = () => (
  <GameContextProvider>
    <Game />
  </GameContextProvider>
)

export default GameContainer
