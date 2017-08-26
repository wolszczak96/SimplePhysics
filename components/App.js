import React from 'react'
import Head from 'next/head'
import { newBall, doCollide, clear, drawObj, calcAngle, solveCollision } from '../lib/functions'

let rev321 = true;

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    canvas: null,
    ctx: null,
    objects: [],
    int: null,
    width: 100,
    height: 100,
    gravity: 0
  }

  componentDidMount() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    //ctx.translate(0, canvas.height)
    //ctx.scale(1, -1)
    clear(canvas, ctx)
    setInterval(this.physicsLoop, 10)
    const int = setInterval(this.initObj, 100)
    setTimeout(() => {clearInterval(this.state.int); this.setState({int: null})}, 10000)
    window.addEventListener('resize', this.resizeCanvas)
    this.setState({
      canvas: canvas,
      ctx: ctx,
      int: int,
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.7
    })
  }

  resizeCanvas = () => {
    this.setState({
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.7
    })
  }

  clearBalls = () => {
    this.setState({objects: []})
  }

  togglePopping = () => {
    if (this.state.int) {
      clearInterval(this.state.int)
      this.setState({int: null})
    }
    else {
      const int = setInterval(this.initObj, 100)
      this.setState({int: int})
    }
  }

  toggleGravity = () => {
    if (this.state.gravity === 900) {
      this.setState({gravity: 0})
    }
    else if (this.state.gravity === 0) {
      this.setState({gravity: -900})
    }
    else {
      this.setState({gravity: 900})
    }
  }

  initObj = () => {
    const { canvas } = this.state
    const objects = this.state.objects.slice()
    let obj = newBall(canvas)
    let collision = objects.length
    let attempt = 0
    while (collision && attempt < 10) {
      for (let i in objects) {
        if (doCollide(obj, objects[i])) {
          obj = newBall(canvas)
          break
        }
        else if (parseInt(i) === objects.length-1) collision = false
      }
      attempt += 1
    }
    if (!collision) {
      objects.push(obj)
      this.setState({objects: objects})
    }
  }

  physicsLoop = () => {
    const start = new Date()

    const {canvas, ctx, objects} = this.state
    const GRAV_ACC = this.state.gravity
    const DELTA_T = 0.01

    //positional logic
    for (let i in objects) {
      const obj = objects[i]
      const x = obj.xPosition
      const y = obj.yPosition
      const d = obj.direction
      const v = obj.velocity
      const vx = Math.cos(d) * v
      const _vy = Math.sin(d) * v
      const vy = _vy - GRAV_ACC * DELTA_T
      obj.xPosition = x + vx * DELTA_T
      obj.yPosition = y + _vy * DELTA_T - GRAV_ACC * Math.pow(DELTA_T, 2) * 0.5
      obj.velocity = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2))
      obj.direction = calcAngle(vx, vy) || 0
    }

    //collision detection
    for (let i in objects) {
      const obj = objects[i]
      if (doCollide(obj, canvas)) {
        solveCollision(obj, canvas)
      }
      for(let j=parseInt(i)+1; j<objects.length; j++) {
        const collider = objects[j]
        if (doCollide(obj, collider)) {
          solveCollision(obj, collider, canvas)
          
        }
      }
    }

    const loop = new Date()
    
    clear(canvas, ctx)
    this.setState({objects: objects})
    for (let i in objects) {
      drawObj(objects[i], ctx)
    }

    const draw = new Date() - loop //DRAW TIME
    const calc = loop-start//CALCULATIONS TIME
    //console.log('objects:'+objects.length+' frame:'+dur)
  }

  render() {
    return (
      <div className='root'>
        <Head>
          <title>Simple Physics</title>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </Head>
        
        <div className='container'>
          <h1>Simple Physics Engine</h1>
          <canvas id='canvas' width={this.state.width} height={this.state.height} />
          <br/>
          <button onClick={this.initObj}>New ball</button>
          <button onClick={this.togglePopping}>{this.state.int ? 'Ball popping ON' : 'Ball popping OFF'}</button>
          <button onClick={this.toggleGravity}>{this.state.gravity === 900 ? 'Gravity UP' : this.state.gravity === 0 ? 'Gravity OFF' : 'Gravity DOWN'}</button>
          <button onClick={this.clearBalls}>Clear</button>
        </div>
        <style jsx>{`
          .root {
            text-align: center;
          }
          .container {
            display: inline-block;
          }
          #canvas {
            box-shadow: 0 0 50px 0 rgba(0,0,0,.5);
          }
          button {
            width: 150px;
            height: 40px;
            vertical-align: top;
            margin: 20px;
            cursor: pointer;
            background: #33658a;
            border: none;
            border-radius: 3px;
            box-shadow: 2px 2px 10px 1px rgba(0,0,0,.5);
          }
          button:hover {
            background: #8797b2;
          }
        `}</style>
        <style jsx global>{`
          body {
            margin: 0;
            background-color: #dbe4ee;
          }

          div {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    )
  }
}