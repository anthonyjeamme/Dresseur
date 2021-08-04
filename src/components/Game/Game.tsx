import React, { useEffect, useRef } from 'react'
import { useKeys } from '../../hooks/useKeys'

import './Game.scss'


const img = document.createElement('img')
img.src = "/images/ground.png"

const tileImg = document.createElement('img')
tileImg.src = "/images/tile.png"

const lights = [

    {
        position: { x: 200, y: 200 },
        color: [255, 255, 100],
        intensity: 0.15,
        radius: 200, innerRadius: 100
    },
    {
        position: { x: 200, y: 200 },
        color: [255, 0, 0],
        intensity: 0.4,
        radius: 50, innerRadius: 10
    },

]

const map = [
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'marble', 'marble', 'marble', 'marble', 'marble', 'ground', 'marble', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'marble', 'ground', 'marble', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'marble', 'ground', 'marble', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'tile', 'tile', 'tile', 'tile', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'tile', 'tile', 'tile', 'tile', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
    ['grass', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'],
]

const Game = () => {

    const canvasRef = useRef<HTMLCanvasElement>()

    const positionRef = useRef({ x: 1000, y: 600 })
    const vitesseRef = useRef({ x: 0, y: 0 })

    const timeRef = useRef({ h: 1 })
    const hourRef = useRef<HTMLDivElement>()

    const { getKey } = useKeys()

    const timeLoop = () => {
        timeRef.current.h = (timeRef.current.h + 1) % 24

        hourRef.current.innerHTML = `${timeRef.current.h}h00`
    }

    useEffect(() => {

        const interval = setInterval(gameLoop, 20)
        const hourInterval = setInterval(timeLoop, 600)
        return () => {
            clearInterval(interval)
            clearInterval(hourInterval)
        }

    }, [])

    const recomputePosition = () => {


        const nextPosition = { x: positionRef.current.x, y: positionRef.current.y }


        const MAX_SPEED = 4
        const speed = 10

        if (getKey('ArrowUp')) {
            vitesseRef.current.y = Math.max(vitesseRef.current.y - 0.4, -MAX_SPEED)
        }
        if (getKey('ArrowDown')) {
            vitesseRef.current.y = Math.min(vitesseRef.current.y + 0.4, MAX_SPEED)
        }

        if (!getKey('ArrowUp') && !getKey('ArrowDown')) {
            if (vitesseRef.current.y > -0.4 && vitesseRef.current.y < 0.4) vitesseRef.current.y = 0
            else if (vitesseRef.current.y > 0) {
                vitesseRef.current.y -= 0.4
            } else if (vitesseRef.current.y < 0) {
                vitesseRef.current.y += 0.4
            }
        }




        if (getKey('ArrowLeft')) {
            vitesseRef.current.x = Math.max(vitesseRef.current.x - 0.4, -MAX_SPEED)
        } if (getKey('ArrowRight')) {
            vitesseRef.current.x = Math.min(vitesseRef.current.x + 0.4, MAX_SPEED)
        }


        if (!getKey('ArrowLeft') && !getKey('ArrowRight')) {
            if (vitesseRef.current.x > -0.4 && vitesseRef.current.x < 0.4) vitesseRef.current.x = 0
            else if (vitesseRef.current.x > 0) {
                vitesseRef.current.x -= 0.4
            } else if (vitesseRef.current.x < 0) {
                vitesseRef.current.x += 0.4
            }
        }


        nextPosition.x = nextPosition.x + vitesseRef.current.x
        nextPosition.y = nextPosition.y + vitesseRef.current.y





        const tileCoord = {
            x: Math.floor(nextPosition.x / 64),
            y: Math.floor(nextPosition.y / 64)
        }


        if (map[tileCoord.y] && map[tileCoord.y][tileCoord.x]) {


            if (map[tileCoord.y][tileCoord.x] !== 'marble') {


                positionRef.current = nextPosition

            } else {
                vitesseRef.current = { x: 0, y: 0 }
            }

        } else {

            vitesseRef.current = { x: 0, y: 0 }
        }
    }

    const gameLoop = () => {

        recomputePosition()

        const ctx = canvasRef.current.getContext('2d')
        ctx.imageSmoothingEnabled = false
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

        const tileCoords = {
            ground: { x: 30, y: 64 + 64 + 32, w: 64, h: 64 },
            grass: { x: 30, y: 64, w: 64, h: 64 },
            marble: { x: 30, y: 64 + 64 + 32 + 96 + 32, w: 64, h: 64 },
            groundGrassLeft: {
                x: 200, y: 160, w: 32, h: 32
            },
            groundGrassTop: {
                x: 216, y: 130, w: 32, h: 32
            }
        }


        // ctx.translate(window.innerWidth, window.innerHeight)

        ctx.translate(window.innerWidth / 2, window.innerHeight / 2)

        const TILE_SIZE = 64


        ctx.translate(-positionRef.current.x, -positionRef.current.y)



        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === 'tile') {
                    ctx.drawImage(tileImg, (TILE_SIZE) * x, TILE_SIZE * y, TILE_SIZE, TILE_SIZE);
                } else {
                    const tile = tileCoords[map[y][x]]
                    ctx.drawImage(img, tile.x, tile.y, TILE_SIZE, TILE_SIZE, (TILE_SIZE - 2) * x, TILE_SIZE * y, tile.w + 1, tile.h + 1);


                    if (map[y][x] === 'ground' && map[y][x - 1] && map[y][x - 1] === 'grass') {

                        const tile = tileCoords.groundGrassLeft

                        ctx.drawImage(img, tile.x, tile.y, TILE_SIZE, 32, (TILE_SIZE - 2) * x, TILE_SIZE * y, tile.w, tile.h);
                        ctx.drawImage(img, tile.x, tile.y, TILE_SIZE, 32, (TILE_SIZE - 2) * x, TILE_SIZE * y + 32, tile.w, tile.h);
                    }

                    if (map[y][x] !== 'marble' && map[y][x - 1] && map[y][x - 1] === 'marble') {
                        ctx.fillStyle = "rgba(0,0,0,0.2)"
                        ctx.fillRect((TILE_SIZE - 2) * x, TILE_SIZE * y, 20, TILE_SIZE)
                    }

                    // ctx.fillStyle = `rgba(0,0,0,${Math.min(x * y / 1000, 1)})`
                    // ctx.fillRect((TILE_SIZE - 2) * x, TILE_SIZE * y, 62, 64)

                }
            }
        }


        // ctx.globalCompositeOperation = "lighter";



        // ctx.translate(-positionRef.current.x, -positionRef.current.y)



        // ctx.globalCompositeOperation = "darker";
        // ctx.fillStyle = `rgba(0,0,0, ${0.3})`;
        // // ctx.fillRect(0, 0, window.innerWidth / 2, window.innerHeight)


        // // var gradient = ctx.createLinearGradient(0, 0, 1000, 0);
        // // gradient.addColorStop(0, "rgba(0,0,0,0.6)");
        // // gradient.addColorStop(1, "transparent");
        // // ctx.fillStyle = gradient;
        // // ctx.fillRect(0, 0, 2000, window.innerHeight)

        // var gradient = ctx.createRadialGradient(110, 90, 30, 100, 100, 70);

        // ctx.globalCompositeOperation = "lighter";
        // // Add three color stops
        // gradient.addColorStop(0, 'rgba(255,255,200,0.2)');
        // gradient.addColorStop(1, 'transparent');

        // // Set the fill style and draw a rectangle
        // ctx.fillStyle = gradient;
        // ctx.fillRect(20, 20, 160, 160);




        ctx.translate(positionRef.current.x, positionRef.current.y)



        ctx.save()

        ctx.translate(-positionRef.current.x, -positionRef.current.y)

        ctx.globalCompositeOperation = "lighter";
        for (const light of lights) {

            const x = light.position.x
            const y = light.position.y
            const radius = light.radius

            var gradient = ctx.createRadialGradient(x, y, light.innerRadius, x, y, light.radius + Math.round(Math.random() * 20));
            gradient.addColorStop(0, `rgba(${light.color.join(',')},${light.intensity + (Math.random() / 30 - 1 / 30)})`);
            gradient.addColorStop(1, `rgba(${light.color.join(',')},${0})`);
            ctx.fillStyle = gradient;
            ctx.fillRect(light.position.x - radius, light.position.y - radius, radius * 2, radius * 2);


        }
        ctx.translate(positionRef.current.x, positionRef.current.y)

        ctx.restore()




        ctx.fillStyle = "red"
        ctx.fillRect(-20, -10, 20, 20)


        ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2)

        ctx.save()

        const getDark = () => {

            if (timeRef.current.h < 5) return 0.8
            if (timeRef.current.h < 6) return 0.6
            if (timeRef.current.h < 7) return 0.4
            if (timeRef.current.h < 8) return 0.2

            if (timeRef.current.h > 22) return 0.8
            if (timeRef.current.h > 21) return 0.6
            if (timeRef.current.h > 20) return 0.4
            if (timeRef.current.h > 19) return 0.2

            return 0
        }

        // ctx.restore()



        // ctx.globalCompositeOperation = "luminosity";
        // ctx.globalAlpha = 0.5
        // ctx.fillStyle = "#000000"
        // ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
        // ctx.fillStyle = "#ffffff"
        // ctx.fillRect(100, 100, 100, 100)
        // ctx.fillStyle = "#ffff00"
        // ctx.fillRect(200, 300, 50, 50)
        // ctx.restore()


        // ctx.save()

        // ctx.globalCompositeOperation = "luminosity";
        // ctx.fillStyle = "black"
        // ctx.globalAlpha = 0.7
        // ctx.fillRect(0, 0, 400, window.innerHeight)


        // ctx.fillStyle = "rgba(128,128,128, 1)"
        // ctx.fillRect(200, 200, 200, 200)



        // ctx.restore()




    }

    return <div className="Game">

        <div className="hours" ref={hourRef}>01h00</div>

        <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth} onContextMenu={e => { e.preventDefault() }} />

    </div>
}

export default Game