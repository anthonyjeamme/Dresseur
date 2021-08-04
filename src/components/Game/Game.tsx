import React, { useEffect, useRef } from 'react'
import { useKeys } from '../../hooks/useKeys'

import './Game.scss'

export const isBrowser = () => typeof window !== 'undefined'

const lights = [

    {
        position: { x: 650, y: 670 },
        color: [255, 255, 100],
        intensity: 0.5,
        radius: 70, innerRadius: 10
    },
    {
        position: { x: 350, y: 810 },
        color: [255, 255, 100],
        intensity: 0.5,
        radius: 70, innerRadius: 10
    },
    {
        position: { x: 955, y: 810 },
        color: [255, 255, 100],
        intensity: 0.5,
        radius: 70, innerRadius: 10
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

    const positionRef = useRef({ x: 800, y: 1000 })
    const vitesseRef = useRef({ x: 0, y: 0 })

    const timeRef = useRef({ h: 1 })
    const hourRef = useRef<HTMLDivElement>()

    const { getKey } = useKeys()

    let img = null, tileImg = null, houseImg = null, guyImg = null
        
    if(isBrowser()){

        img = document.createElement('img')
        img.src = "/images/ground.png"
        tileImg = document.createElement('img')
        tileImg.src = "/images/tile.png"
        houseImg = document.createElement('img')
        houseImg.src = "/images/house.png"
        guyImg = document.createElement('img')
        guyImg.src = "/images/guy.png"
    }


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
                vitesseRef.current.y -= 0.6
            } else if (vitesseRef.current.y < 0) {
                vitesseRef.current.y += 0.6
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
                    ctx.drawImage(img, tile.x, tile.y, TILE_SIZE/4, TILE_SIZE/4, (TILE_SIZE) * x, TILE_SIZE * y, tile.w + 10, tile.h + 1);


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

        ctx.drawImage(houseImg, 200,200, 227*4, 183*4);


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
            ctx.fillRect(light.position.x - radius - 50, light.position.y - radius- 50, radius * 2 + 100, radius * 2+100);


        }
        ctx.translate(positionRef.current.x, positionRef.current.y)

        ctx.restore()


        const frame = getKey('ArrowDown')? Math.round(new Date().getTime()/150) % 4 : Math.round(new Date().getTime()/500) % 2

        ctx.drawImage(guyImg, (getKey('ArrowDown') ? 60 : 0) + 60*frame, 0 ,60, 100, -50,-150, 60*1.5, 100*1.5);


        ctx.translate(-10, 0)
        ctx.scale(1, 0.5)
        
        var gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 70);
        // Add three color stops
        gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
        gradient.addColorStop(1, 'transparent');

        // Set the fill style and draw a rectangle
        ctx.fillStyle = gradient;
        ctx.fillRect(-100, -100, 200, 200);

        
        ctx.scale(1,2)
        ctx.translate(10, 0)


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

    useEffect(()=>{

        canvasRef.current.height = window.innerHeight
        canvasRef.current.width = window.innerWidth

        const handleWindowResize = () => {

            canvasRef.current.height = window.innerHeight
            canvasRef.current.width = window.innerWidth


        }


        window.addEventListener('resize', handleWindowResize)
        return () => {
            
        window.removeEventListener('resize', handleWindowResize)
        }


    },[])

    return <div className="Game">

    {/* <audio src="/audio/music_jeu.mp3" loop={true} autoPlay={true} /> */}

        <div className="hours" ref={hourRef}>01h00</div>

        <canvas ref={canvasRef} onContextMenu={e => { e.preventDefault() }} />

    </div>
}

export default Game