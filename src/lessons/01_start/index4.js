import vertexShaderSource from './first.vert'
import vertexOffsetShaderSource from './firstCustom.vert'
import fragmentShaderSource from './first.frag'
import fragmentShaderSourceGreen from './firstGreen.frag'
import fragShaderCustomColor from './firstCustomColor.frag'

var SPECTOR = require("spectorjs")
var spector = new SPECTOR.Spector()
spector.displayUI()



const createRenderer = function (gl) {
    return {
        gl,
        preRender () {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

            gl.clearColor(0, 0, 0, 255  )
            gl.clear(gl.COLOR_BUFFER_BIT);
        },
        renderMesh (meshData) {

            const {
                positionAttributeLocation,
                colorUniformLocation,
                positionBuffer,
                program,
                offsetUniformLocation,
            } = meshData

            gl.useProgram(program)

            colorUniformLocation && gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
            if (offsetUniformLocation) gl.uniform2f(offsetUniformLocation, Math.random() - .5, Math.random() - .5)

            gl.enableVertexAttribArray(positionAttributeLocation)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            var size = 2;          // 2 components per iteration
            var type = gl.FLOAT;   // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

            // draw
            var primitiveType = gl.TRIANGLES
            var offset = 0
            var count = 6
            gl.drawArrays(primitiveType, offset, count)
        },
    }
}



const glUtils = {
    createShader(gl, type, source) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader
        }

        console.log(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
    },
    createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram()
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    },

    createPositionBuffer (gl, offsetX, offsetY) {
        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        const positions = [
            0 + offsetX, 0 + offsetY,
            0 + offsetX, 0.1 + offsetY,
            0.1 + offsetX, 0 + offsetY,

            0 + offsetX, 0.1 + offsetY,
            0.1 + offsetX, 0.1 + offsetY,
            0.1 + offsetX, 0 + offsetY,
        ]
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
        return positionBuffer
    }
}




function prepareMesh (meshData, gl) {
    const {
        colorUniformKey,
        offsetUniformKey,
    } = meshData

    meshData.positionAttributeLocation = gl.getAttribLocation(meshData.program, "a_position")
    if (colorUniformKey) meshData.colorUniformLocation = gl.getUniformLocation(meshData.program, colorUniformKey)
    if (offsetUniformKey) meshData.offsetUniformLocation = gl.getUniformLocation(meshData.program, offsetUniformKey)


    return Object.assign({}, meshData)
}












let meshData4, renderer
let count = 0



const button = document.createElement('button')
button.innerText = 'start'
document.body.appendChild(button)

const canvas = document.createElement('canvas')
canvas.width = 800
canvas.height = 800
document.body.appendChild(canvas)
const gl = canvas.getContext("webgl2")

button.addEventListener('click', () => {
    const animate = () => {
        //if (count === 0) {
            renderer = createRenderer(gl)
            const positionBuffer = glUtils.createPositionBuffer(renderer.gl, 0, 0)
            const vertexShader = glUtils.createShader(renderer.gl, renderer.gl.VERTEX_SHADER, vertexOffsetShaderSource)
            const fragmentShader = glUtils.createShader(renderer.gl, renderer.gl.FRAGMENT_SHADER, fragShaderCustomColor)
            const program = glUtils.createProgram(renderer.gl, vertexShader, fragmentShader)


            meshData4 = {
                offsetUniformKey: 'u_offset',
                offsetUniformLocation: null,
                positionAttributeLocation: null,

                positionBuffer,

                uOffset: [Math.random(), Math.random()],
                colorUniformKey: 'u_color',
                colorUniformLocation: null,

                program,
            }

            renderer.preRender()
        //}
        for (let i = 0; i < 20; ++i) {
            //glUtils.createPositionBuffer(renderer.gl, 0, 0)
            const newData = Object.assign({}, meshData4)
            const m = prepareMesh(newData, renderer.gl)
            renderer.renderMesh(m)
        }
        //}
        //++count
    }
    requestAnimationFrame(animate)
})

// renderer.preRender()
// for (let i = 0; i < 35; ++i) {
//     const newData = Object.assign({}, meshData4)
//     const m = prepareMesh(newData, renderer.gl)
//     renderer.renderMesh(m)
// }
