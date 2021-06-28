const vSh = `
attribute vec4 a_position;
attribute vec4 a_color;

varying vec4 v_color; 

void main() {
    v_color = a_color;
    gl_Position = a_position;
}`


const fSh = `
precision mediump float;

varying vec4 v_color;

void main() {
    gl_FragColor = v_color; 
}`


/** GL ***************************************************/

function prepareGL() {
    function createGL() {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = Math.min(window.innerHeight, window.innerWidth)
        document.body.appendChild(canvas)
        const gl = canvas.getContext('webgl')
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


    const gl = createGL()


    function prepareProgram(vSrc, fSrc) {
        const vShader = _createShader(gl.VERTEX_SHADER, vSrc)
        const fShader = _createShader(gl.FRAGMENT_SHADER, fSrc)
        const program = _createProgram(vShader, fShader)
        const posLoc = gl.getAttribLocation(program, 'a_position')
        const colorLoc = gl.getAttribLocation(program, 'a_color')
        return {
            program,
            posLoc,
            colorLoc,
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
        gl.viewport(0,0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(...color)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }


    function render({ program, buffers }) {
        gl.useProgram(program)
        for (let key in buffers) {
            const { buffer, loc } = buffers[key]
            gl.enableVertexAttribArray(loc)
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0)
        }
        gl.drawArrays(gl.TRIANGLES, 0, buffers.pos.bufferLength)
    }

    return {
        prepareProgram,
        createBuffer,
        clearCanvas,
        render,
    }
}



/** GEOMETRY **********************************************************/

function createGeometry() {
    const n = 40
    const len = Math.PI * 2
    const step = len / n
    const radius = .8

    const arr = []
    for (let i = 0; i < n; ++i) {
        const currLen = step * i
        const nextI = i === n - 1 ? 0 : i
        arr.push(
            [Math.sin(currLen) * radius, 0, Math.cos(currLen) * radius],
            [Math.sin(currLen + step) * radius, 0, Math.cos(currLen + step) * radius],
            [Math.sin(currLen + step- 0.005) * radius, .1, Math.cos(currLen + step - 0.005) * radius],
            [Math.sin(currLen + 0.005) * radius, .1, Math.cos(currLen + 0.005) * radius],
        )
    }


    function createPoligons(p1, p2, p3, p4) {
        return [...p1, ...p2, ...p3, ...p1, ...p3, ...p4]
    }


    const arrP = []
    for (let i = 0; i < arr.length; i += 4) {
        arrP.push(...createPoligons(arr[i], arr[i + 1], arr[i + 2], arr[i + 3]))
    }

    const arrC = []
    for (let i = 0; i < arrP.length; i+= 3) {
        arrC.push(0, 1, 1)
    }


    return {
        pos: new Float32Array(arrP),
        colors: new Float32Array(arrC)
    }




    // const pos = new Float32Array([
    //     -.2, 0, 0,
    //     .2, 0, 0,
    //     -.2, -.1, 0,
    // ])
    //
    // const colors = new Float32Array([
    //     0, 1, 0,
    //     0, 1, 0,
    //     0, 1, 0,
    // ])
    //
    // return {
    //     pos,
    //     colors,
    // }
}


/** MAIN *************************************************************/

function main() {
    const glU = prepareGL()
    const {
        program,
        posLoc,
        colorLoc,
    } = glU.prepareProgram(vSh, fSh)
    const { pos, colors } = createGeometry()

    const buffers = {}
    {
        const { buffer, bufferLength } = glU.createBuffer(pos)
        buffers.pos = {
            buffer,
            bufferLength,
            loc: posLoc,
        }
    }
    {
        const { buffer, bufferLength } = glU.createBuffer(colors)
        buffers.colors = {
            buffer,
            bufferLength,
            loc: colorLoc,
        }
    }


    glU.clearCanvas([0, 0, 0, 1])
    glU.render({
        program,
        buffers,
    })
}

main()

