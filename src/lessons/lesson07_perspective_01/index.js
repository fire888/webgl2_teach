const vSSrc = `
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 color;  

void main() {
    color = a_color;
    vec4 pos = u_matrix * a_position;
    
    float zToDivideBy = 1.0 + pos.z * 1.8;
    
    gl_Position = vec4(pos.xy / zToDivideBy, pos.zw);
}`

const fSSrc = `
precision mediump float;
varying vec4 color;  

void main() {
    gl_FragColor = color;
    //gl_FragColor = vec4(1., 0., 0., 1.);
}
`


/** GEOMETRY **********************************************************/

function createGeometry({ hT = .2, hB = -.2, offsets = [.1, .1, .1, .1, .1,] }) {
    const step = Math.PI * 2 / offsets.length
    let currentStep = 0

    const arr = []
    const arrColors = []

    for (let i = 0; i < offsets.length; ++i) {
        const nextI = offsets[i + 1] ? i + 1 : 0

        arr.push(Math.sin(currentStep) * offsets[i], 0, Math.cos(currentStep) * offsets[i])
        arr.push(Math.sin(currentStep + step) * offsets[nextI], 0, Math.cos(currentStep + step) * offsets[nextI])
        arr.push(0, hT, 0)

        arr.push(Math.sin(currentStep) * offsets[i], 0, Math.cos(currentStep) * offsets[i])
        arr.push(Math.sin(currentStep + step) * offsets[nextI], 0, Math.cos(currentStep + step) * offsets[nextI])
        arr.push(0, hB, 0)


        const color1 = [Math.random(), Math.random(), Math.random()]
        const color2 = [Math.random(), Math.random(), Math.random()]
        arrColors.push(...color1)
        arrColors.push(...color1)
        arrColors.push(...color1)
        arrColors.push(...color2)
        arrColors.push(...color2)
        arrColors.push(...color2)

        currentStep += step
    }
    return {
        arr: new Float32Array(arr),
        arrColors: new Float32Array(arrColors)
    }
}


/** GEOM MANAGER ***********************************************/

function createGeomManager(webGLUtils) {
    const {
        program,
        posLoc,
        colorLoc,
        matrixLoc
    } = webGLUtils.prepareProgram(vSSrc, fSSrc)

    const arrItems = []

    const r = 3
    const n = 80
    const d = r * Math.PI * 2
    const step = d / n
    const rad = .8


    function createItems() {
        for (let i = 0; i < n; ++i) {
            const pos = [Math.sin(step * i) * rad, Math.cos(step * i) * rad, -(i / n) * 2 - 1]
            const rotZ = (d / i)
            arrItems.push(_createItem(pos, rotZ))
        }
    }

    function _createItem(pos, rotZ) {
        const h = Math.random() * .3 + .2
        const { arr, arrColors } = createGeometry({
            // hT: h,
            // hB: -h,
            // offsets: (function () {
            //     const arr = []
            //     for (let i = 0; i < Math.random() * 15 + 3; ++i) {
            //         arr.push(Math.random() * 0.2)
            //     }
            //     return arr
            // })()
        })
        const itemData = { pos: null, color: null, transform: null }
        {
            const { bufferLength, buffer } = webGLUtils.createBuffer(arr)
            itemData.pos = { buffer, bufferLength, loc: posLoc }
        }
        {
            const { bufferLength, buffer } = webGLUtils.createBuffer(arrColors)
            itemData.color = { buffer, bufferLength, loc: colorLoc }
        }
        itemData.transform = {
            move: pos,
            rot: [Math.PI / 2, 0, 0]
        }
        return itemData
    }

    function updateItems(d) {
        for (let i = 0; i < arrItems.length; ++i) {
            _updateItem(arrItems[i], d)
        }
    }


    function _updateItem(item, d) {
        const { transform, pos, color } = item

        let matrix = m4.translation(transform.move[0],  transform.move[1], ((transform.move[2] - d) % 1) * 1.5 + 1.2,)
        matrix = m4.xRotate(matrix, transform.rot[0]);
        //matrix = m4.yRotate(matrix, d);
        //matrix = m4.zRotate(matrix, transform.rot[2]);

        webGLUtils.render({
            program,
            pos,
            color,
            matrix,
            matrixLoc
        })
    }

    return {
        createItems,
        updateItems,
    }
}


/** MAIN *********************************************/

function main() {
    const webGLUtils = createWebGLUtils()
    const geomManager = createGeomManager(webGLUtils)
    geomManager.createItems(10)


    let d = 0
    function animate() {
        webGLUtils.clearCanvas([0, 0, 0, 1])
        geomManager.updateItems(d)

        d += 0.01
        requestAnimationFrame(animate)
    }
    animate()
}


/** webGL ******************************************************/

function createWebGLUtils() {
    function _createGL() {
        const canvas = document.createElement('canvas')
        const s = Math.min(window.innerWidth, window.innerHeight)
        canvas.width = canvas.height = s
        document.body.appendChild(canvas)
        document.body.style.textAlign = 'center'
        canvas.style.border = '1px solid #000000'
        const gl = canvas.getContext('webgl')
        //gl.enable(gl.CULL_FACE) // NO IPHONE
        gl.enable(gl.DEPTH_TEST)
        return gl
    }

    function _createShader(gl, type, sSrc) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, sSrc)
        gl.compileShader(shader)
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (success) {
            return shader
        }
        console.log('compile shader error', type)
    }

    function _createProgram(gl, vShader, fShader) {
        const program = gl.createProgram()
        gl.attachShader(program, vShader)
        gl.attachShader(program, fShader)
        gl.linkProgram(program)
        const success = gl.getProgramParameter(program, gl.LINK_STATUS)
        if (success) {
            return program
        }
        console.log('compile program error')
    }

    function prepareProgram(vShaderSrc, fShaderSrc) {
        const vShader = _createShader(gl, gl.VERTEX_SHADER, vShaderSrc)
        const fShader = _createShader(gl, gl.FRAGMENT_SHADER, fShaderSrc)
        const program = _createProgram(gl, vShader, fShader)
        const posLoc = gl.getAttribLocation(program, 'a_position')
        const colorLoc = gl.getAttribLocation(program, 'a_color')
        const matrixLoc = gl.getUniformLocation(program, "u_matrix");

        return {
            program,
            posLoc,
            colorLoc,
            matrixLoc,
        }
    }


    function createBuffer(arr) {
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW)
        return { buffer, bufferLength: arr.length / 3 }
    }



    function clearCanvas(color) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(...color)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }


    function render({ program, pos, color, matrixLoc, matrix }) {
        gl.useProgram(program)
        {
            const { buffer, loc } = pos
            gl.enableVertexAttribArray(loc)
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0)
        }
        {
            const { buffer, loc } = color
            gl.enableVertexAttribArray(loc)
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0)
        }

        gl.uniformMatrix4fv(matrixLoc, false, matrix);
        gl.drawArrays(gl.TRIANGLES,  0,  pos.bufferLength);
    }


    const gl = _createGL()

    return {
        gl,
        prepareProgram,
        createBuffer,
        clearCanvas,
        render,
    };

}



/** MATH HELPERS *******************************************************/

var m4 = {

    projection: function(width, height, depth) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ];
    },

    multiply: function(a, b) {
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },

    translation: function(tx, ty, tz) {
        return [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1,
        ];
    },

    xRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    },

    yRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    },

    zRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    },

    scaling: function(sx, sy, sz) {
        return [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ];
    },

    translate: function(m, tx, ty, tz) {
        return m4.multiply(m, m4.translation(tx, ty, tz));
    },

    xRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.xRotation(angleInRadians));
    },

    yRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.yRotation(angleInRadians));
    },

    zRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.zRotation(angleInRadians));
    },

    scale: function(m, sx, sy, sz) {
        return m4.multiply(m, m4.scaling(sx, sy, sz));
    },

}


main()




