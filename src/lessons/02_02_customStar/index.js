import vShaderSrc from './shader.vert'
import fShaderSrc from './shader.frag'
import { createPath } from './path'
import { createColorUpdater } from './color'



const glUtils = () => {
    function createGl () {
        document.body.style.textAlign = 'center'
        document.body.style.overflow = 'hidden'
        const canvas = document.createElement('canvas')
        const s = Math.min(window.innerWidth, window.innerHeight)
        canvas.width = canvas.height = s
        canvas.style.border = '2px solid #000000'
        canvas.style.boxSizing = 'border-box'
        document.body.appendChild(canvas)
        return canvas.getContext('webgl2')
    }



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


    const gl = createGl()

    let posAttributeLocation, colorUniformLocation

    const size = 2          // 2 components per iteration
    const type = gl.FLOAT   // the data is 32bit floats
    const normalize = false // don't normalize the data
    const stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0        // start at the beginning of the buffer



    return {
        createBuffer (arr32) {
            const buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, arr32, gl.STATIC_DRAW)
            return buffer
        },
        prepareProgram () {
            const vShader = createShader(gl, gl.VERTEX_SHADER, vShaderSrc)
            const fShader = createShader(gl, gl.FRAGMENT_SHADER, fShaderSrc)
            const program = createProgram(gl, vShader, fShader)

            posAttributeLocation = gl.getAttribLocation(program, 'a_position')
            colorUniformLocation = gl.getUniformLocation(program, 'u_color')

            gl.useProgram(program)
        },

        clearCanvas(color) {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
            gl.clearColor(...color)
            gl.clear(gl.COLOR_BUFFER_BIT)
        },

        drawLayer (layer, newPoses = layer.poses, color) {
            gl.uniform4f(colorUniformLocation, ...color)

            gl.enableVertexAttribArray(posAttributeLocation)
            gl.bindBuffer(gl.ARRAY_BUFFER, layer.buffer)
            for (let i = 0; i < layer.poses.length; i ++) {
                layer.poses32[i] = newPoses[i]
            }
            gl.bufferData(gl.ARRAY_BUFFER, layer.poses32, gl.STATIC_DRAW)

            gl.vertexAttribPointer(posAttributeLocation, size, type, normalize, stride, offset)
            gl.drawArrays(gl.TRIANGLES, 0, layer.poses32.length)
        }
    }
}



const createLayersManager = (glU, poses) => {
    const layers = [
        { key: 'geomBevel01_00' },
        { key: 'geomBevel01_01' },
        { key: 'geomBevel02_00' },
        { key: 'geomBevel02_01' },
        { key: 'geomTop01' },
        { key: 'geomTop02' },
    ]

    for (let i = 0; i < layers.length; ++i) {
        const { key } = layers[i]

        if (!poses[key]) continue;

        layers[i].poses = poses[key]
        layers[i].poses32 = new Float32Array(poses[key])

        layers[i].buffer = glU.createBuffer(layers[i].poses32)
    }

    return {
        update (poses, color) {
            for (let i = 0; i < layers.length; ++i) {
                const { key } = layers[i]
                if (!poses[key]) continue;

                glU.drawLayer(layers[i], poses[key], color[key])
            }
        }
    }
}




const colorUpdater = createColorUpdater()
const glU = glUtils()
const layerManager = createLayersManager(glU, createPath())
glU.prepareProgram()

let dist = 0
const spd = 0.05
const animate = () => {
    const color = colorUpdater.update()
    glU.clearCanvas(color.back)

    dist += spd
    const poses = createPath(dist)
    layerManager.update(poses, color)

    requestAnimationFrame(animate)
}
animate()
