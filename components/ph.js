

ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)

const drawObjects = (objects, frame) => {
  ctx.fillStyle = 'white'
  for (let i=0; i<objects.length; i++) {
    const obj = objects[i]
    for (let j=i+1; j<objects.length; j++) {
      const col = objects[j]
      const dx = col.x-obj.x
      const dy = col.y-obj.y
      const d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
      if (d < 10) {
        const xa = calcAngle(dx, dy)
        const a1 = xa > obj.d ? obj.d - xa + 2*Math.PI : obj.d - xa
        const a2 = xa > col.d ? col.d - xa + 2*Math.PI : col.d - xa
        const vx1 = Math.cos(a2) * obj.v
        const vy1 = Math.sin(a1) * obj.v
        const vx2 = Math.cos(a1) * col.v
        const vy2 = Math.sin(a2) * obj.v
        obj.v = Math.sqrt(Math.pow(vx1, 2) + Math.pow(vy1, 2))
        col.v = Math.sqrt(Math.pow(vx2, 2) + Math.pow(vy2, 2))
        obj.d = calcAngle(vx1, vy1) - xa
        col.d = calcAngle(vx2, vy2) - xa
        obj.x -= Math.cos(xa)*(10-d)*2
        obj.y -= Math.sin(xa)*(10-d)*2
        col.x += Math.cos(xa)*(10-d)*2
        col.y += Math.sin(xa)*(10-d)*2
      }
    }
    const x = obj.x + Math.cos(obj.d)*obj.v*frame/1000
    const y = obj.y + Math.sin(obj.d)*obj.v*frame/1000
    let vx;
    let vy;
    if (x > canvas.width-5 || x < 5) {
      obj.x = x<5 ? 5 : canvas.width-5
      vx = Math.cos(obj.d) * obj.v * -0.7
    }
    else {
      obj.x = x
      vx = Math.cos(obj.d) * obj.v * 0.99
    }
    if (y > canvas.height-5 || y < 5) {
      obj.y = y<5 ? 5 : canvas.height-5
      vy = -(Math.sin(obj.d) * obj.v)
      obj.v = (Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2))) * 0.7
    }
    else {
      obj.y = y
      vy = Math.sin(obj.d) * obj.v + 600 * frame/1000
      obj.v = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2))
    }
    obj.d = calcAngle(vx, vy)
    ctx.beginPath()
    ctx.arc(obj.x, obj.y, 5, 0, 2*Math.PI)
    ctx.fillStyle = obj.color
    ctx.fill()
  }
}

setInterval(() => drawObjects(objects, 10), 10)
//setInterval(initObj, 200)

document.getElementById('button').addEventListener('click', initObj)