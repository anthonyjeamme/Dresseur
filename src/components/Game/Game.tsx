import React, { useEffect, useRef } from "react"

import uniqid from "uniqid"

import { useGraphicEngine } from "../../gameEngine/graphicEngine/useGraphicEngine"
import { usePhysicsEngine } from "../../gameEngine/physicsEngine/usePhysicsEngine"
import useIsMounted from "../../utils/useIsMounted"

import GameRenderer from "./GameRenderer/GameRenderer"

import { GameContextProvider, useGameContext } from "./GameContext/GameContext"

import { useUserInteractions } from "../../gameEngine/io/useUserInteractions"

import { useResourceLoader } from "../../gameEngine/loader/loader"
import "./Game.scss"

const Game = () => {
  const loopIdRef = useRef(null)

  const gameContext = useGameContext()

  const userInteractions = useUserInteractions()
  const graphicEngine = useGraphicEngine()
  const physicsEngine = usePhysicsEngine(userInteractions)

  const gameResources = useResourceLoader()

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
    await gameResources.loadMap("05DGp5hRkJZvaMp4MCoT")
    await gameResources.loadSector({ x: 0, y: 0 })
    await gameResources.loadSector({ x: 10, y: 10 })
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const handleInteraction = () => {
      changeZone(async () => {
        await gameResources.loadMap("aaaaaa")

        if (gameContext.playerState.get().location.position.x > 32 * 32 * 5) {
          gameContext.setPlayerPositionTo("aaaaaa", {
            x: 32,
            y: 32,
          })
        } else {
          gameContext.setPlayerPositionTo("aaaaaa", {
            x: 10 * 32 * 32 + 64,
            y: 10 * 32 * 32 + 64,
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

    graphicEngine.render(gameResources)
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
