const { sin, cos, PI, min, max, floor, round } = Math
const PI2 = PI * 2

let gl

function _createGL() {
    const c = document.createElement('canvas')
    c.width = c.height = min(window.innerHeight, window.innerWidth)
    document.body.appendChild(c)
    document.body.style.textAlign = 'center'
    gl = c.getContext('webgl')
    console.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION))
    gl.enable(gl.DEPTH_TEST)
    return gl
}

function _createShader(type, src) {
    const sh = gl.createShader(type)
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    const success = gl.getShaderParameter(sh, gl.COMPILE_STATUS)
    if (success) {
        return sh
    }
    console.log('compile sh error')
}

function _createProgram(vSh, fSh) {
    const program = gl.createProgram()
    gl.attachShader(program, vSh)
    gl.attachShader(program, fSh)
    gl.linkProgram(program)
    const sucsess = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (sucsess) {
        return program
    }
    console.log('program compile error')
}

function prepareProgram(vSrc, fSrc) {
    const vShader = _createShader(gl.VERTEX_SHADER, vSrc)
    const fShader = _createShader(gl.FRAGMENT_SHADER, fSrc)
    const program = _createProgram(vShader, fShader)
    const posLoc = gl.getAttribLocation(program, 'a_position')
    const normLoc = gl.getAttribLocation(program, 'a_normal')
    const colorLoc = gl.getUniformLocation(program, 'u_color')
    const matrixLoc = gl.getUniformLocation(program, 'u_viewMatrix')
    const lightLoc = gl.getUniformLocation(program, 'u_reverseLightDirection')
    const matrixLightLoc = gl.getUniformLocation(program, 'u_invRotMatrix')
    const uFlashLoc = gl.getUniformLocation(program, 'u_flash')
    return {
        program,
        posLoc,
        normLoc,
        colorLoc,
        matrixLoc,
        lightLoc,
        matrixLightLoc,
        uFlashLoc,
    }
}

function createBuffer(arr32) {
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, arr32, gl.STATIC_DRAW)
    return {
        buffer,
        bufferLength: arr32.length / 3
    }
}

function clearCanvas(color) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(...color, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

function render({
                    program,
                    buffers,
                    matrix,
                    matrixLoc,
                    color,
                    colorLoc,
                    light,
                    lightLoc,
                    lightMatrix,
                    matrixLightLoc,
                    uFlash,
                    uFlashLoc,
                }) {
    gl.useProgram(program)
    for (let i = 0; i < buffers.length; ++i) {
        const { loc, buffer } = buffers[i]
        gl.enableVertexAttribArray(loc)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0)
    }
    gl.uniform3fv(colorLoc, color)
    gl.uniform3fv(lightLoc, light)
    gl.uniformMatrix4fv(matrixLightLoc, false, lightMatrix)
    gl.uniformMatrix4fv(matrixLoc, false, matrix)
    gl.uniform1f(uFlashLoc, false, uFlash)
    gl.drawArrays(gl.TRIANGLES, 0, buffers[0].bufferLength)
}

export function prepareGL() {
    gl = _createGL()

    return {
        prepareProgram,
        createBuffer,
        clearCanvas,
        render,
    }
}