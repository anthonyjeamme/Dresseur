import React, { useEffect, useRef } from "react"

import uniqid from "uniqid"

import { useGraphicEngine } from "../../gameEngine/graphicEngine/useGraphicEngine"
import { usePhysicsEngine } from "../../gameEngine/physicsEngine/usePhysicsEngine"
import useIsMounted from "../../utils/useIsMounted"

import GameRenderer from "./GameRenderer/GameRenderer"

import { GameContextProvider, useGameContext } from "./GameContext/GameContext"
import { timeout } from "../utils/time"

import { useUserInteractions } from "../../gameEngine/io/useUserInteractions"

import "./Game.scss"
import { useResourceLoader } from "../../gameEngine/loader/loader"

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
      await gameContext.overlayEffect.play("close", 400)
      await change()
      await gameContext.overlayEffect.play("open", 400)
      gameContext.playerState.get().movementDisabled = false
    } catch (err) {
      console.log(err)
    }
  }

  const load = async () => {
    await gameResources.loadMap("05DGp5hRkJZvaMp4MCoT")
    await gameResources.loadSector({ x: 0, y: 0 })
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const handleInteraction = () => {
      changeZone(async () => {
        gameContext.setPlayerPositionTo("", {
          x: 0,
          y: 0,
        })
      })

      // transferEffect(timeout(1000))
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

    if (userInteractions.isActive("up")) {
      console.log("UP")
    }

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
