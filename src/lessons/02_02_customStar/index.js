import vShaderSrc from './shader.vert'
import fShaderSrc from './shader.frag'
import { createPath } from './path'




const color1 = [Math.random(), Math.random(), Math.random(), 1]
const color2 = [Math.random(), Math.random(), Math.random(), 1]
const color3 = [Math.random(), Math.random(), Math.random(), 1]
const color4 = [Math.random() / 10, Math.random() / 10, Math.random() / 10, 1]
const color5 = [Math.random(), Math.random(), Math.random(), 1]


const red = [1, 0, 0, 1]
const redLight = [1, .3, .3, 1]
const green = [0, 1, 0, 1]
const greenLight = [0.3, 1, .3, 1]

/*
[0.9967725302274126, 0.18212122151325083, 0.5990163427382622, 1]
[0.4178191261311779, 0.12190126469705276, 0.3377100395569723, 1]
[0.9406109720203257, 0.15612787068021783, 0.6048517590022973, 1]
 */

/*
[0.7151972315239166, 0.38500599602947494, 0.3769678720718095, 1]
[0.9780542815259796, 0.9871210336324274, 0.22119000475116524, 1]
[0.5792843477820926, 0.17559856182245115, 0.44975051824707446, 1]
 */





const canvas = document.createElement('canvas')
const s = Math.min(window.innerWidth, window.innerHeight)
canvas.width = canvas.height = s
canvas.style.border = '2px solid #000000'
document.body.appendChild(canvas)
const gl = canvas.getContext('webgl2')






console.log(color1, color2, color3, color4)



function createShader (gl, type, shaderSrc) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, shaderSrc)
    gl.compileShader(shader)
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
        return shader
    }
    console.log('compile shader error')
}



function createProgram (gl, vShader, fShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vShader)
    gl.attachShader(program, fShader)
    gl.linkProgram(program)
    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
        return program
    }
    console.log('program compile error')
}



const vShader = createShader(gl, gl.VERTEX_SHADER, vShaderSrc)
const fShader = createShader(gl, gl.FRAGMENT_SHADER, fShaderSrc)
const program = createProgram(gl, vShader, fShader)



const poses = createPath()
const poses32_0 = new Float32Array(poses.arrGeom0)
const poses32_01 = new Float32Array(poses.arrGeom01)
const poses32_1 = new Float32Array(poses.arrGeom1)
const poses32_2 = new Float32Array(poses.arrGeom2)




const bufferPoses_0 = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_0)
gl.bufferData(gl.ARRAY_BUFFER, poses32_0, gl.STATIC_DRAW)

const bufferPoses_01 = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_01)
gl.bufferData(gl.ARRAY_BUFFER, poses32_01, gl.STATIC_DRAW)


const bufferPoses_1 = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_1)
gl.bufferData(gl.ARRAY_BUFFER, poses32_1, gl.STATIC_DRAW)



const bufferPoses_2 = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_2)
gl.bufferData(gl.ARRAY_BUFFER, poses32_2, gl.STATIC_DRAW)





const posAttributeLocation = gl.getAttribLocation(program, 'a_position')
const colorUniformLocation = gl.getUniformLocation(program, 'u_color')



gl.useProgram(program)


gl.enableVertexAttribArray(posAttributeLocation)
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_0)
gl.vertexAttribPointer(posAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.uniform4f(colorUniformLocation, ...color5);
gl.drawArrays(gl.TRIANGLES, 0, poses32_0.length)


gl.enableVertexAttribArray(posAttributeLocation)
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_01)
gl.vertexAttribPointer(posAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.uniform4f(colorUniformLocation, ...color5);
gl.drawArrays(gl.TRIANGLES, 0, poses32_01.length)



gl.enableVertexAttribArray(posAttributeLocation)
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_1)
gl.vertexAttribPointer(posAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
gl.drawArrays(gl.TRIANGLES, 0, poses32_1.length)


gl.enableVertexAttribArray(posAttributeLocation)
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_2)
gl.vertexAttribPointer(posAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
gl.drawArrays(gl.TRIANGLES, 0, poses32_2.length)




let d = 0
const spd = 0.05
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer





const animate = () => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(...color1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    d += spd
    const poses = createPath(d)





    gl.uniform4f(colorUniformLocation, ...red)

    gl.enableVertexAttribArray(posAttributeLocation)
    gl.vertexAttribPointer(posAttributeLocation, size, type, normalize, stride, offset)
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_0)
    for (let i = 0; i < poses32_0.length; i ++) {
        poses32_0[i] = poses.arrGeom0[i]
    }
    gl.bufferData(gl.ARRAY_BUFFER, poses32_0, gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, poses32_0.length)






    gl.uniform4f(colorUniformLocation, ...redLight)

    gl.enableVertexAttribArray(posAttributeLocation)
    gl.vertexAttribPointer(posAttributeLocation, size, type, normalize, stride, offset)
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_2)


    for (let i = 0; i < poses32_2.length; i ++) {
        poses32_2[i] = poses.arrGeom2[i]
    }
    gl.bufferData(gl.ARRAY_BUFFER, poses32_2, gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, poses32_2.length)






    gl.uniform4f(colorUniformLocation, ...green)

    gl.enableVertexAttribArray(posAttributeLocation)
    gl.vertexAttribPointer(posAttributeLocation, size, type, normalize, stride, offset)
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_1)

    for (let i = 0; i < poses32_1.length; i ++) {
        poses32_1[i] = poses.arrGeom1[i]
    }
    gl.bufferData(gl.ARRAY_BUFFER, poses32_1, gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, poses32_1.length)




    gl.uniform4f(colorUniformLocation, ...greenLight)

    gl.enableVertexAttribArray(posAttributeLocation)
    gl.vertexAttribPointer(posAttributeLocation, size, type, normalize, stride, offset)
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_01)
    for (let i = 0; i < poses32_01.length; i ++) {
        poses32_01[i] = poses.arrGeom01[i]
    }
    gl.bufferData(gl.ARRAY_BUFFER, poses32_01, gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, poses32_01.length)





















    //
    //
    //
    //











     requestAnimationFrame(animate)
}
animate()
