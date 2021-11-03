const { min } = Math


let gl
let program

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
    program = _createProgram(vShader, fShader)
}



function createBufferByData(data) {
    const { name, dataForBuffer, size } = data
    const location = gl.getAttribLocation(program, name)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, dataForBuffer, gl.STATIC_DRAW)
    return {
        location,
        buffer,
        bufferLength: dataForBuffer.length / size,
    }
}


function getUniformLocation(data) {
    const { name } = data
    const location = gl.getUniformLocation(program, name)

    return { location }
}


function clearCanvas(color) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(...color, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}


function render(attributes, uniforms) {

    gl.useProgram(program)

    let bufferLen = null

    for (let key in attributes) {
        const { buffer, bufferLength, location, name, size, type } = attributes[key]
        gl.enableVertexAttribArray(location)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.vertexAttribPointer(location, size, gl[type], false, 0, 0)

        bufferLen = bufferLength
    }

    for (let key in uniforms) {
        const { execSetVal, val, location } = uniforms[key]
        if (execSetVal === 'uniformMatrix4fv') {
            gl[execSetVal](location, false, val)
        } else {
            gl[execSetVal](location, val)
        }
    }

    gl.drawArrays(gl.TRIANGLES, 0, bufferLen)
}

export function prepareGL() {
    gl = _createGL()

    return {
        createBufferByData,
        getUniformLocation,
        prepareProgram,
        clearCanvas,
        render,
    }
}