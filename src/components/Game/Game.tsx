import React, { useEffect, useRef } from "react"

import uniqid from "uniqid"

import { useGraphicEngine } from "../../gameEngine/graphicEngine/useGraphicEngine"
import { usePhysicsEngine } from "../../gameEngine/physicsEngine/usePhysicsEngine"
import useIsMounted from "../../utils/useIsMounted"

import GameRenderer from "./GameRenderer/GameRenderer"

import { GameContextProvider, useGameContext } from "./GameContext/GameContext"
import { timeout } from "../utils/time"

import "./Game.scss"

const Game = () => {
  const loopIdRef = useRef(null)

  const gameContext = useGameContext()

  const graphicEngine = useGraphicEngine()
  const physicsEngine = usePhysicsEngine()

  const isMounted = useIsMounted()

  const transferEffect = async (promise: Promise<any>) => {
    await gameContext.overlayEffect.play("close")
    await promise
    await gameContext.overlayEffect.play("open")
  }

  useEffect(() => {
    const handleKeyPress = e => {
      if (e.key === "o") {
      } else if (e.key === "c") {
        transferEffect(timeout(1000)).catch(err => {
          console.log(err)
        })
      }
    }

    window.addEventListener("keypress", handleKeyPress)

    return () => {
      window.removeEventListener("keypress", handleKeyPress)
    }
  }, [])

  useEffect(() => {
    loopIdRef.current = uniqid()
    gameLoop(loopIdRef.current)
  }, [])

  const gameLoop = (loopId: string) => {
    if (!isMounted()) return
    if (loopIdRef.current !== loopId) return

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
