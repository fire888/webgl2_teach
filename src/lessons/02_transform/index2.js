import vertSrc from './box.vert'
import fragSrc from './box.frag'




const canvas = document.createElement('canvas')
canvas.width = 400
canvas.height = 400
canvas.style.border = '1px solid #222222'
document.body.appendChild(canvas)
const gl = canvas.getContext('webgl2')


var SPECTOR = require("spectorjs")
var spector = new SPECTOR.Spector()
spector.displayUI()





const buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
const poses = [0, 0,       0, 0.5,     0.1, 0.5,
               0.1, 0.5,   0.1, 0,     0, 0  ]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(poses), gl.STATIC_DRAW)


function createShader(gl, type, shaderSrc) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, shaderSrc)
    gl.compileShader(shader)
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
        return shader
    } else {
        console.log('shader Error')
    }
}



const vertShader = createShader(gl, gl.VERTEX_SHADER, vertSrc)
const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragSrc)
const program = gl.createProgram()
gl.attachShader(program, vertShader)
gl.attachShader(program, fragShader)
gl.linkProgram(program)
const success = gl.getProgramParameter(program, gl.LINK_STATUS)
if (!success) {
    console.log('program compile error')
}
const posAttributeLocation = gl.getAttribLocation(program, 'a_position')
const offsetUniformLocation = gl.getUniformLocation(program, 'u_offset')
const rotatedUniformLocation = gl.getUniformLocation(program, 'u_rot')
const colorUniformLocation = gl.getUniformLocation(program, 'u_color')

gl.useProgram(program)
gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1)
gl.uniform2f(offsetUniformLocation, 0, 0)
gl.uniform2f(rotatedUniformLocation, 1, 1)

gl.enableVertexAttribArray(posAttributeLocation)
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.vertexAttribPointer(posAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.drawArrays(gl.TRIANGLES, 0, 6)



let t = 0
const animate = () => {
    requestAnimationFrame(animate)
    //t = 0
    t += 0.01
    //t = -Math.PI / 2
    //t = Math.PI
    gl.uniform2f(offsetUniformLocation, Math.sin(t) * 0.5, 0)
    gl.uniform2fv(rotatedUniformLocation, [Math.sin(t), Math.cos(t)])
    gl.drawArrays(gl.TRIANGLES, 0, 6)
}
animate()










