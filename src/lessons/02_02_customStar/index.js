import vShaderSrc from './shader.vert'
import fShaderSrc from './shader.frag'
import {createPath } from './path'


const canvas = document.createElement('canvas')
canvas.width = 400
canvas.height = 400
canvas.style.border = '2px solid #000000'
document.body.appendChild(canvas)
const gl = canvas.getContext('webgl2')



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



const poses = createPath(2)
const poses32_1 = new Float32Array(poses.arrGeom1)
//const poses32_2 = new Float32Array(poses.arrGeom2)


const bufferPoses_1 = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_1)
//gl.bufferData(gl.ARRAY_BUFFER, poses32_1, gl.STATIC_DRAW)
gl.bufferData(gl.ARRAY_BUFFER, poses32_1, gl.STATIC_DRAW)


//const bufferPoses_2 = gl.createBuffer()
//gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_2)
//gl.bufferData(gl.ARRAY_BUFFER, poses32_2, gl.DYNAMIC_DRAW)



const posAttributeLocation = gl.getAttribLocation(program, 'a_position')
const colorUniformLocation = gl.getUniformLocation(program, 'u_color')

gl.useProgram(program)

gl.enableVertexAttribArray(bufferPoses_1)
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_1)
gl.vertexAttribPointer(posAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
gl.drawArrays(gl.TRIANGLES, 0, poses32_1.length)

// gl.enableVertexAttribArray(bufferPoses_2)
// gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_2)
// gl.vertexAttribPointer(posAttributeLocation, 2, gl.FLOAT, false, 0, 0)
// gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
// gl.drawArrays(gl.TRIANGLES, 0, poses32_2.length)




let d = 0
const spd = 0.08
const animate = () => {
    d += spd

    const poses = createPath(d)

    gl.enableVertexAttribArray(bufferPoses_1)
    //gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_1)
    gl.uniform4f(colorUniformLocation, (Math.sin(d) + 1) / 2 , 0, 0, 1);

    for (let i = 0; i < poses32_1.length; i++) {
         poses32_1[i] = poses.arrGeom1[i]
    }

    //  //poses[0] = (Math.sin(d) /  2)
    //  //gl.bufferData(gl.ARRAY_BUFFER, poses32, gl.DYNAMIC_DRAW)
    //  //gl.bufferData(gl.ARRAY_BUFFER, poses32, gl.STREAM_DRAW)
    //  gl.bufferData(gl.ARRAY_BUFFER, poses32_1, gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, poses32_1.length)
    //
    // gl.enableVertexAttribArray(bufferPoses_2)
    // gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoses_2)
    // gl.uniform4f(colorUniformLocation, 0, 1, 0, 1);
    // for (let i = 0; i < poses32_2.length; i += 4) {
    //     poses32_2[i] = (Math.sin(d))
    //     poses32_2[i + 1] = 0//(Math.sin(d))
    // }
    // d += 0.05
    // //poses[0] = (Math.sin(d) /  2)
    // //gl.bufferData(gl.ARRAY_BUFFER, poses32, gl.DYNAMIC_DRAW)
    // //gl.bufferData(gl.ARRAY_BUFFER, poses32, gl.STREAM_DRAW)
    // gl.bufferData(gl.ARRAY_BUFFER, poses32_2, gl.STATIC_DRAW)
    // gl.drawArrays(gl.TRIANGLES, 0, poses32_2.length)

     setTimeout(() => requestAnimationFrame(animate), 0)
}
animate()




//      //gl.bufferData(gl.ARRAY_BUFFER, poses32, gl.DYNAMIC_DRAW)
//      //gl.bufferData(gl.ARRAY_BUFFER, poses32, gl.STREAM_DRAW)
//      gl.bufferData(gl.ARRAY_BUFFER, poses32_1, gl.STATIC_DRAW)


