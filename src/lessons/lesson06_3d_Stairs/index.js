const vShSrc =
`#version 300 es

in vec3 a_position;

void main() {
    gl_Position = vec4(a_position, 1);
}`

const fShSrc =
`#version 300 es

precision highp float;
out vec4 color;

void main() {
    color = vec4(1., 0., 0., 1.);   
}`

function prepareGl() {
    function createGl() {
        const canvas = document.createElement('canvas')
        const s = Math.min(window.innerWidth, window.innerHeight)
        canvas.width = canvas.height = s
        canvas.style.border = '1px solid #000000'
        document.body.appendChild(canvas)
        document.body.style.textAlign = 'center'
        return canvas.getContext('webgl2')
    }


    function createBuffer(pos) {
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW)
        return buffer
    }


    function createShader(gl, type, shaderSrc) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, shaderSrc)
        gl.compileShader(shader)
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (success) {
            return shader
        }
        console.log('shader compile mistake')
    }


    function createProgram(gl, vSh, fSh) {
        const program = gl.createProgram()
        gl.attachShader(program, vSh)
        gl.attachShader(program, fSh)
        gl.linkProgram(program)
        const success = gl.getProgramParameter(program, gl.LINK_STATUS)
        if (success) {
            return program
        }
        console.log('program compile error')
    }


    function prepareProgram(vShSrc, fShSrc) {
        const vSh = createShader(gl, gl.VERTEX_SHADER, vShSrc)
        const fSh = createShader(gl, gl.FRAGMENT_SHADER, fShSrc)
        const program = createProgram(gl, vSh, fSh)
        const posAttrLoc = gl.getAttribLocation(program, 'a_position')
        return { program, posAttrLoc }
    }


    function clearCanvas() {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }


    function render({
        program,
        posAttrLoc,
        buffer,
        bufferLength,
    }) {
        gl.useProgram(program)
        gl.enableVertexAttribArray(posAttrLoc)
        gl.vertexAttribPointer(posAttrLoc, 3, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.drawArrays(gl.TRIANGLES, 0, bufferLength)
    }


    const gl = createGl()

    return {
        clearCanvas,
        createBuffer,
        prepareProgram,
        render
    }
}



const pos = new Float32Array([
    -.2, 0, 0,
    .2, 0, 0,
    -.2, .2, 0,
])
const glU = prepareGl()
const buffer = glU.createBuffer(pos)
const {
    program,
    posAttrLoc,
} = glU.prepareProgram(vShSrc, fShSrc)


glU.clearCanvas()
glU.render({
    program,
    posAttrLoc,
    buffer,
    bufferLength: pos.length,
})
