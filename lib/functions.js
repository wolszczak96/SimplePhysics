const floatBetween = (a, b) => Math.random() * (b-a) + a

const integerBetween = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a

const randomColor = () => `rgb(${integerBetween(0, 255)},${integerBetween(0, 255)},${integerBetween(0, 255)})`

const newBall = (canvas) => {
  const MIN_INIT_VEL = 50
  const MAX_INIT_VEL = 700
  const MIN_RADIUS = 3
  const MAX_RADIUS = 15
  const id = integerBetween(1000, 9999)
  const radius = integerBetween(MIN_RADIUS, MAX_RADIUS)
  const xPosition = integerBetween(radius, canvas.width-radius)
  const yPosition = integerBetween(radius, canvas.height-radius)
  const velocity = floatBetween(MIN_INIT_VEL, MAX_INIT_VEL)
  const direction = floatBetween(0, 2*Math.PI)
  const color = randomColor()
  return {radius, xPosition, yPosition, velocity, direction, color, id}
}

const doCollide = (obj1, obj2) => {
  const x1 = obj1.xPosition
  const y1 = obj1.yPosition
  if (obj2.getContext) {
    const cw = obj2.width
    const ch = obj2.height
    const r = obj1.radius
    if (x1 < r || x1 > cw-r || y1 < r || y1 > ch-r) return true
  }
  else {
    const x2 = obj2.xPosition
    const y2 = obj2.yPosition
    const distance = obj1.radius + obj2.radius
    if (
      Math.abs(x1 - x2) < distance &&
      Math.abs(y1 - y2) < distance &&
      Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2)) < distance
    ) return true
  }
  return false
}

const solveCollision = (obj1, obj2, canvas) => {
  const x1 = obj1.xPosition
  const y1 = obj1.yPosition
  const v1 = obj1.velocity
  const d1 = obj1.direction
  const r1 = obj1.radius
  if (obj2.getContext) {
    const cw = obj2.width
    const ch = obj2.height
    if (x1 < r1) {
      obj1.xPosition = r1
      obj1.velocity = v1 * 0.7
      obj1.direction = Math.PI-d1
    }
    else if (x1 > cw-r1) {
      obj1.xPosition = cw-r1
      obj1.velocity = v1 * 0.7
      obj1.direction = Math.PI-d1
    }
    if (y1 < r1) {
      obj1.yPosition = r1
      obj1.velocity = v1 * 0.7
      obj1.direction = 2*Math.PI-d1
    }
    else if (y1 > ch-r1) {
      obj1.yPosition = ch-r1
      obj1.velocity = v1 * 0.7
      obj1.direction = 2*Math.PI-d1
    }
  }

  else {
    const x2 = obj2.xPosition
    const y2 = obj2.yPosition
    const v2 = obj2.velocity
    const d2 = obj2.direction
    const r2 = obj2.radius
    const dx = x1-x2
    const dy = y1-y2
    const angle = calcAngle(dx, dy)
    const vx1 = Math.cos(d1-angle)*v1
    const vy1 = Math.sin(d1-angle)*v1
    const vx2 = Math.cos(d2-angle)*v2
    const vy2 = Math.sin(d2-angle)*v2
    const col = r1 + r2 - Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    const m1 = (Math.abs(vx1) / (Math.abs(vx1) + Math.abs(vx2))) * col || 0
    const m2 = col - m1 + 0.001

    obj1.xPosition = x1 + m1 * Math.cos(angle)
    obj1.yPosition = y1 + m1 * Math.sin(angle)
    obj2.xPosition = x2 - m2 * Math.cos(angle)
    obj2.yPosition = y2 - m2 * Math.sin(angle)

    obj1.velocity = Math.sqrt(Math.pow(vx2 * 0.7, 2) + Math.pow(vy1, 2))
    obj2.velocity = Math.sqrt(Math.pow(vx1 * 0.7, 2) + Math.pow(vy2, 2))
    obj1.direction = calcAngle(vx2, vy1) + angle
    obj2.direction = calcAngle(vx1, vy2) + angle
  }
}

const clear = (canvas, ctx) => {
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const drawObj = (obj, ctx) => {
  ctx.beginPath()
  ctx.arc(obj.xPosition, obj.yPosition, obj.radius, 0, 2*Math.PI)
  ctx.fillStyle = obj.color
  ctx.fill()
}

const calcAngle = (x, y) => {
  const v = Math.sqrt(Math.pow(x,2) + Math.pow(y,2))
  const a = Math.atan(y/x)
  if(a<0) {
    if(x<0) return Math.PI+a // 2nd
    else return 2*Math.PI+a // 4th
  }
  else if(x<0 && y<0) return Math.PI+a // 3rd
  else return a // 1st
}

export { newBall, doCollide, clear, drawObj, calcAngle, solveCollision }