/** https://webglfundamentals.org/webgl/lessons/ru/webgl-3d-lighting-directional.html */


const vSh = `
attribute vec4 a_position;
attribute vec3 a_normal;
uniform mat4 u_viewMatrix;
varying vec3 v_normal;

void main() {
    v_normal = a_normal;
    gl_Position = u_viewMatrix * a_position;
}`

const fSh = `
precision mediump float;
varying vec3 v_normal;

void main() {
    vec3 color = vec3(1., 0., 0.) +  v_normal;
    gl_FragColor = vec4(color, 1.);
}`


/** CONST ***********************/

const { sin, cos, PI, min, max, floor } = Math
const PI2 = PI * 2

/** GL **************************/

let gl

function _createGL() {
    const c = document.createElement('canvas')
    c.width = c.height = min(window.innerHeight, window.innerWidth)
    document.body.appendChild(c)
    document.body.style.textAlign = 'center'
    const gl = c.getContext('webgl')
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
    const matrixLoc = gl.getUniformLocation(program, 'u_viewMatrix')
    return {
        program,
        posLoc,
        normLoc,
        matrixLoc,
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
    gl.clearColor(...color, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

function render({ 
    program, 
    buffers, 
    matrix,
    matrixLoc, 
}) {
    gl.useProgram(program)
    for (let i = 0; i < buffers.length; ++i) {
        const { loc, buffer } = buffers[i]
        gl.enableVertexAttribArray(loc)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0)
    }
    gl.uniformMatrix4fv(matrixLoc, false, matrix)
    gl.drawArrays(gl.TRIANGLES, 0, buffers[0].bufferLength)
}

function prepareGL() {
    gl = _createGL()

    return {
        prepareProgram,
        createBuffer,
        clearCanvas,
        render,
    }
}


/** GEOMETRY */
const createPoints = () => ({ 
    points: new Float32Array([ 
        -.1, 0, 0.,
        .1, 0, 0.,
        -.1, -.3, 0.,

        .1, 0, 0.,
        -.1, -.3, 0.,
        .1, -.3, 0.,
    ]), 
    normals: new Float32Array([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ]),
})



/** main */

const OFFSET_X = .22, OFFSET_Y = .35

function main() {
    const uGl = prepareGL()
    const { points, normals } = createPoints()

    const pointsBuffer = uGl.createBuffer(points) 
    const normalsBuffer = uGl.createBuffer(normals) 

    const { program, posLoc, normLoc, matrixLoc } = uGl.prepareProgram(vSh, fSh) 

    pointsBuffer.loc = posLoc
    normalsBuffer.loc = normLoc

    
    const update = d => {
        uGl.clearCanvas([0, 0, 0])

        for (let i = 0; i < 40; ++i) {
            const x = (i % 8) * OFFSET_X - .8
            const y = Math.floor(i / 8) * OFFSET_Y - .6

            const rotMatrix = m4.rotX(Math.sin(d + (i / 25) * PI2))
            matrix = m4.mult(m4.move(x, y, 0), rotMatrix)
            uGl.render({
                program,
                buffers: [pointsBuffer, normalsBuffer],
                matrix,
                matrixLoc,
            })
        }   
    }


    let d = 0
    const animate = () => {
        d += 0.01
        update(d)
        requestAnimationFrame(animate)
    }
    animate()

} 






/** MATH HELPERS ****************/

const m4 = {
    persp: (fovRad, aspect, near, far) => {
        const f = Math.tan(Math.PI * .5 - .5 * fovRad)
        const range = 1. / (near - far)

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * range, 1.2,
            0, 0, near * far * range * 2, 0,
        ]
    },


    move: (tx, ty, tz) => [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1,
    ],
    rotX: rad => {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ]
    },
    rotY: rad => {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ]
    },
    rotZ: rad => {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        return [
            c, s, 0, 0,
            -s, c , 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
    },

    scaling: function(sx, sy, sz) {
        return [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ];
    },

    mult: (a, b) => {
        const
            a00 = a[0 * 4 + 0],
            a01 = a[0 * 4 + 1],
            a02 = a[0 * 4 + 2],
            a03 = a[0 * 4 + 3],
            a10 = a[1 * 4 + 0],
            a11 = a[1 * 4 + 1],
            a12 = a[1 * 4 + 2],
            a13 = a[1 * 4 + 3],
            a20 = a[2 * 4 + 0],
            a21 = a[2 * 4 + 1],
            a22 = a[2 * 4 + 2],
            a23 = a[2 * 4 + 3],
            a30 = a[3 * 4 + 0],
            a31 = a[3 * 4 + 1],
            a32 = a[3 * 4 + 2],
            a33 = a[3 * 4 + 3]

        const
            b00 = b[0 * 4 + 0],
            b01 = b[0 * 4 + 1],
            b02 = b[0 * 4 + 2],
            b03 = b[0 * 4 + 3],
            b10 = b[1 * 4 + 0],
            b11 = b[1 * 4 + 1],
            b12 = b[1 * 4 + 2],
            b13 = b[1 * 4 + 3],
            b20 = b[2 * 4 + 0],
            b21 = b[2 * 4 + 1],
            b22 = b[2 * 4 + 2],
            b23 = b[2 * 4 + 3],
            b30 = b[3 * 4 + 0],
            b31 = b[3 * 4 + 1],
            b32 = b[3 * 4 + 2],
            b33 = b[3 * 4 + 3]

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
        ]
    },

    inverse: function(m) {
        var m00 = m[0 * 4 + 0];
        var m01 = m[0 * 4 + 1];
        var m02 = m[0 * 4 + 2];
        var m03 = m[0 * 4 + 3];
        var m10 = m[1 * 4 + 0];
        var m11 = m[1 * 4 + 1];
        var m12 = m[1 * 4 + 2];
        var m13 = m[1 * 4 + 3];
        var m20 = m[2 * 4 + 0];
        var m21 = m[2 * 4 + 1];
        var m22 = m[2 * 4 + 2];
        var m23 = m[2 * 4 + 3];
        var m30 = m[3 * 4 + 0];
        var m31 = m[3 * 4 + 1];
        var m32 = m[3 * 4 + 2];
        var m33 = m[3 * 4 + 3];
        var tmp_0  = m22 * m33;
        var tmp_1  = m32 * m23;
        var tmp_2  = m12 * m33;
        var tmp_3  = m32 * m13;
        var tmp_4  = m12 * m23;
        var tmp_5  = m22 * m13;
        var tmp_6  = m02 * m33;
        var tmp_7  = m32 * m03;
        var tmp_8  = m02 * m23;
        var tmp_9  = m22 * m03;
        var tmp_10 = m02 * m13;
        var tmp_11 = m12 * m03;
        var tmp_12 = m20 * m31;
        var tmp_13 = m30 * m21;
        var tmp_14 = m10 * m31;
        var tmp_15 = m30 * m11;
        var tmp_16 = m10 * m21;
        var tmp_17 = m20 * m11;
        var tmp_18 = m00 * m31;
        var tmp_19 = m30 * m01;
        var tmp_20 = m00 * m21;
        var tmp_21 = m20 * m01;
        var tmp_22 = m00 * m11;
        var tmp_23 = m10 * m01;

        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        return [
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ];
    },
}

main()

//////////////////////////////////////////////////////////////////

// const vSh = `
// attribute vec4 a_position;
// attribute vec4 a_color;
// uniform mat4 u_matrix;

// varying vec4 v_color; 

// void main() {
//   v_color = a_color;
//   gl_Position = u_matrix * a_position;  
// }`


// const fSh = `
// precision mediump float;

// varying vec4 v_color;

// void main() {
//     gl_FragColor = v_color; 
// }`


// const colorsEnv = {
//     "back": [0.521, 0.435, 0.545],
//     "faceL": [0.784, 0.796, 0.705],
//     "faceB": [0.623, 0.478, 0.596],
//     "bevel": [0.937, 0.945, 0.894],
// }

// const { sin, cos, PI, min, max, floor } = Math
// const PI2 = PI * 2
// const mix = (v1, v2, f) => v1 * f + v2 * (1 - f)
// const mixArrs = (arr1, arr2, f) => arr1.map((_, i) => mix(arr1[i], arr2[i], f))



// /** GL **************************/

// let gl

// function _createGL() {
//     const c = document.createElement('canvas')
//     c.width = c.height = min(window.innerHeight, window.innerWidth)
//     document.body.appendChild(c)
//     document.body.style.textAlign = 'center'
//     const gl = c.getContext('webgl')
//     gl.enable(gl.DEPTH_TEST)
//     return gl
// }

// function _createShader(type, src) {
//     const sh = gl.createShader(type)
//     gl.shaderSource(sh, src)
//     gl.compileShader(sh)
//     const success = gl.getShaderParameter(sh, gl.COMPILE_STATUS)
//     if (success) {
//         return sh
//     }
//     console.log('compile sh error')
// }

// function _createProgram(vSh, fSh) {
//     const program = gl.createProgram()
//     gl.attachShader(program, vSh)
//     gl.attachShader(program, fSh)
//     gl.linkProgram(program)
//     const sucsess = gl.getProgramParameter(program, gl.LINK_STATUS)
//     if (sucsess) {
//         return program
//     }
//     console.log('program compile error')
// }

// function prepareProgram(vSrc, fSrc) {
//     const vShader = _createShader(gl.VERTEX_SHADER, vSrc)
//     const fShader = _createShader(gl.FRAGMENT_SHADER, fSrc)
//     const program = _createProgram(vShader, fShader)
//     const posLoc = gl.getAttribLocation(program, 'a_position')
//     const colorLoc = gl.getAttribLocation(program, 'a_color')
//     const matLoc = gl.getUniformLocation(program, 'u_matrix')
//     return {
//         program,
//         posLoc,
//         colorLoc,
//         matLoc,
//     }
// }

// function createBuffer(arr32) {
//     const buffer = gl.createBuffer()
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
//     gl.bufferData(gl.ARRAY_BUFFER, arr32, gl.STATIC_DRAW)
//     return {
//         buffer,
//         bufferLength: arr32.length / 3
//     }
// }

// function clearCanvas(color) {
//     gl.viewport(0,0, gl.canvas.width, gl.canvas.height)
//     gl.clearColor(...color, 1)
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
// }

// function render({ program, buffers, mat4, matLoc }) {
//     gl.useProgram(program)
//     for (let key in buffers) {
//         const { buffer, loc } = buffers[key]
//         gl.enableVertexAttribArray(loc)
//         gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
//         gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0)
//     }
//     gl.uniformMatrix4fv(matLoc, false, mat4)
//     gl.drawArrays(gl.TRIANGLES, 0, buffers.pos.bufferLength)
// }

// function prepareGL() {
//     gl = _createGL()

//     return {
//         prepareProgram,
//         createBuffer,
//         clearCanvas,
//         render,
//     }
// }


// /** GEOMETRY ********************/

// /**
//  *        bo[3]           bo[2]
//  *            *--------- *
//  *           / |bi[3]   /|
//  *         /   *----*  / |
//  *  fo[3] *----------*   |
//  *        |  fi[3]   |   |
//  *        |  *----*  |   |
//  *        |  |    |  |   |
//  *        |  |    |  |   * bo[1]
//  *        |  *----*  |  /
//  *        | fi[0]    | /
//  *        *----------*
//  *    fo[0]      fo[1]
//  */
// function _segmentPoints(l, lh, s, w, r, r2) {
//     const fo = [
//         [sin(l) * r, lh, cos(l) * r],
//         [sin(l + s) * r, lh, cos(l + s) * r],
//         [sin(l + s) * r, lh + s, cos(l + s) * r],
//         [sin(l) * r, lh + s, cos(l) * r],
//     ]
//     const bo = [
//         [sin(l) * r2, lh, cos(l) * r2],
//         [sin(l + s) * r2, lh, cos(l + s) * r2],
//         [sin(l + s) * r2, lh + s, cos(l + s) * r2],
//         [sin(l) * r2, lh + s, cos(l) * r2],
//     ]
//     const fi = [
//         [sin(l + w) * r, lh + w, cos(l + w) * r],
//         [sin(l + s - w) * r, lh + w, cos(l + s - w) * r],
//         [sin(l + s - w) * r, lh + s - w, cos(l + s - w) * r],
//         [sin(l + w) * r, lh + s - w, cos(l + w) * r],
//     ]
//     const bi = [
//         [sin(l + w) * r2, lh + w, cos(l + w) * r2],
//         [sin(l + s - w) * r2, lh + w, cos(l + s - w) * r2],
//         [sin(l + s - w) * r2, lh + s - w, cos(l + s - w) * r2],
//         [sin(l + w) * r2, lh + s - w, cos(l + w) * r2],
//     ]
//     return { fo, bo, fi, bi }
// }


// /**
//  *             y
//  *             |
//  *             *
//  *         *  *  *  *
//  *      *   *    *    *
//  *     *    *     *    * -x
//  *      *   *    *   *
//  *        *  *  *  *
//  *            *
//  */

// function _createPoints() {
//     const arr = []

//     const xn = 30
//     const yn = 30
//     const step = PI2 / xn
//     const w = step / 5
//     let y = -5

//     for (let j = 0; j < yn; ++j) {

//         const r = sin(j / yn * PI ) * 3
//         const r2 = r + .1
//         let x = -PI / 2

//         for (let i = 0; i < xn; ++i) {
//             const f = sin(i / xn * PI)

//             arr.push({
//                 ..._segmentPoints(x, y, step, w, r, r2),
//                 colorFace: [...mixArrs(colorsEnv.faceL, colorsEnv.faceB, f)],
//                 colorBevel: colorsEnv.bevel,
//             })
//             x += step
//         }
//         y += step
//     }
//     return arr
// }

// /**
//  *      9                  8
//  *   12 *----------------- * 5
//  *      |    10     11     |
//  *      |  15 *----- * 6   |
//  *      |     |      |     |    / ....
//  *      |     |      |     |   /
//  *      |  14 *------* 7   |  /
//  *      |    3       2     | /
//  *   13 *-----------------* 4
//  *       0                 1
//  *
//  */
// function _createCoords(arr) {
//     const coords = []
//     const colors = []

//     for (let i = 0; i < arr.length; ++i) {
//         const { fo, fi, bo, bi, colorFace, colorBevel } = arr[i]
//         coords.push(
//             fo[0], fo[1], fi[1], fi[0],
//             fo[1], fo[2], fi[2], fi[1],
//             fo[2], fo[3], fi[3], fi[2],
//             fo[3], fo[0], fi[0], fi[3],

//             fi[0], fi[1], bi[1], bi[0],
//             fi[1], fi[2], bi[2], bi[1],
//             fi[2], fi[3], bi[3], bi[2],
//             fi[3], fi[0], bi[0], bi[3],

//             fo[1], fo[0], bo[0], bo[1],
//             fo[2], fo[1], bo[1], bo[2],
//             fo[3], fo[2], bo[2], bo[3],
//             fo[0], fo[3], bo[3], bo[0],
//         )
//         colors.push(colorFace, colorBevel, colorBevel)
//     }
//     return { coords, colors }
// }


// /**
//  *    5 p4   4
//  *      *----* 2 p3
//  *      |   /|
//  *      |  / |
//  *      | /  |
//  *    3 *----*
//  *     0 p1   1 p2
//  */

// function _createPolygon(p1, p2, p3, p4) {
//     return [...p1, ...p2, ...p3, ...p1, ...p3, ...p4]
// }


// function _createPolygons(arr, c) {
//     const poly = []
//     const polyColors = []

//     for (let i = 0, ii = 0; i < arr.length; i += 4, ++ii) {
//         poly.push(..._createPolygon(arr[i], arr[i + 1], arr[i + 2], arr[i + 3]))

//         const j = floor(ii / 4)
//         polyColors.push(...c[j], ...c[j], ...c[j], ...c[j], ...c[j], ...c[j])
//     }
//     for (let i = 0; i < poly.length; ++i) {
//         poly[i] *= 100
//     }
//     return { poly, polyColors }
// }


// function createGeometry() {
//     const points = _createPoints()
//     const { coords, colors } = _createCoords(points)
//     const { poly, polyColors } = _createPolygons(coords, colors)
//     return {
//         pos: new Float32Array(poly),
//         colors: new Float32Array(polyColors)
//     }
// }


// /** MAIN ************************/

// function main() {
//     const glU = prepareGL()

//     const {
//         program,
//         posLoc,
//         colorLoc,
//         matLoc
//     } = glU.prepareProgram(vSh, fSh)

//     const {
//         pos,
//         colors
//     } = createGeometry()

//     const buffers = {}
//     {
//         const {
//             buffer,
//             bufferLength
//         } = glU.createBuffer(pos)

//         buffers.pos = {
//             buffer,
//             bufferLength,
//             loc: posLoc,
//         }
//     }
//     {
//         const {
//             buffer,
//             bufferLength
//         } = glU.createBuffer(colors)

//         buffers.colors = {
//             buffer,
//             bufferLength,
//             loc: colorLoc,
//         }
//     }

//     let ob2Matrix = m4.scaling(3, 3, 3)
//     ob2Matrix = m4.mult(ob2Matrix, m4.move(0, 0, 40))
//     ob2Matrix = m4.mult(ob2Matrix, m4.rotX(PI / 2))

//     let d = 0
//     function animate() {
//         let camMatrix = m4.move(0, cos(d) * 250, 0)
//         camMatrix = m4.mult(camMatrix, m4.rotY(sin(d) * PI + PI ))
//         camMatrix = m4.mult(camMatrix, m4.rotX(sin(d)))
//         const viewMatrix = m4.inverse(camMatrix)

//         const projectionMatrix = m4.persp(PI / 2, 1, 2, -2)
//         const viewProjectionMatrix = m4.mult(projectionMatrix, viewMatrix)

//         glU.clearCanvas(colorsEnv.back)

//         glU.render({
//             program,
//             buffers,
//             mat4: viewProjectionMatrix,
//             matLoc,
//         })

//         const ob2MatrixView = m4.mult(viewProjectionMatrix, ob2Matrix)
//         glU.render({
//             program,
//             buffers,
//             mat4: ob2MatrixView,
//             matLoc,
//         })

//         d += 0.01
//         requestAnimationFrame(animate)
//     }
//     animate()
// }


// /** MATH HELPERS ****************/

// const m4 = {
//     persp: (fovRad, aspect, near, far) => {
//         const f = Math.tan(Math.PI * .5 - .5 * fovRad)
//         const range = 1. / (near - far)

//         return [
//             f / aspect, 0, 0, 0,
//             0, f, 0, 0,
//             0, 0, (near + far) * range, 1.2,
//             0, 0, near * far * range * 2, 0,
//         ]
//     },


//     move: (tx, ty, tz) => [
//         1, 0, 0, 0,
//         0, 1, 0, 0,
//         0, 0, 1, 0,
//         tx, ty, tz, 1,
//     ],
//     rotX: rad => {
//         const c = Math.cos(rad)
//         const s = Math.sin(rad)
//         return [
//             1, 0, 0, 0,
//             0, c, s, 0,
//             0, -s, c, 0,
//             0, 0, 0, 1,
//         ]
//     },
//     rotY: rad => {
//         const c = Math.cos(rad)
//         const s = Math.sin(rad)
//         return [
//             c, 0, -s, 0,
//             0, 1, 0, 0,
//             s, 0, c, 0,
//             0, 0, 0, 1,
//         ]
//     },
//     rotZ: rad => {
//         const c = Math.cos(rad)
//         const s = Math.sin(rad)
//         return [
//             c, s, 0, 0,
//             -s, c , 0, 0,
//             0, 0, 1, 0,
//             0, 0, 0, 1,
//         ]
//     },

//     scaling: function(sx, sy, sz) {
//         return [
//             sx, 0,  0,  0,
//             0, sy,  0,  0,
//             0,  0, sz,  0,
//             0,  0,  0,  1,
//         ];
//     },

//     mult: (a, b) => {
//         const
//             a00 = a[0 * 4 + 0],
//             a01 = a[0 * 4 + 1],
//             a02 = a[0 * 4 + 2],
//             a03 = a[0 * 4 + 3],
//             a10 = a[1 * 4 + 0],
//             a11 = a[1 * 4 + 1],
//             a12 = a[1 * 4 + 2],
//             a13 = a[1 * 4 + 3],
//             a20 = a[2 * 4 + 0],
//             a21 = a[2 * 4 + 1],
//             a22 = a[2 * 4 + 2],
//             a23 = a[2 * 4 + 3],
//             a30 = a[3 * 4 + 0],
//             a31 = a[3 * 4 + 1],
//             a32 = a[3 * 4 + 2],
//             a33 = a[3 * 4 + 3]

//         const
//             b00 = b[0 * 4 + 0],
//             b01 = b[0 * 4 + 1],
//             b02 = b[0 * 4 + 2],
//             b03 = b[0 * 4 + 3],
//             b10 = b[1 * 4 + 0],
//             b11 = b[1 * 4 + 1],
//             b12 = b[1 * 4 + 2],
//             b13 = b[1 * 4 + 3],
//             b20 = b[2 * 4 + 0],
//             b21 = b[2 * 4 + 1],
//             b22 = b[2 * 4 + 2],
//             b23 = b[2 * 4 + 3],
//             b30 = b[3 * 4 + 0],
//             b31 = b[3 * 4 + 1],
//             b32 = b[3 * 4 + 2],
//             b33 = b[3 * 4 + 3]

//         return [
//             b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
//             b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
//             b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
//             b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

//             b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
//             b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
//             b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
//             b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

//             b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
//             b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
//             b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
//             b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

//             b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
//             b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
//             b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
//             b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
//         ]
//     },

//     inverse: function(m) {
//         var m00 = m[0 * 4 + 0];
//         var m01 = m[0 * 4 + 1];
//         var m02 = m[0 * 4 + 2];
//         var m03 = m[0 * 4 + 3];
//         var m10 = m[1 * 4 + 0];
//         var m11 = m[1 * 4 + 1];
//         var m12 = m[1 * 4 + 2];
//         var m13 = m[1 * 4 + 3];
//         var m20 = m[2 * 4 + 0];
//         var m21 = m[2 * 4 + 1];
//         var m22 = m[2 * 4 + 2];
//         var m23 = m[2 * 4 + 3];
//         var m30 = m[3 * 4 + 0];
//         var m31 = m[3 * 4 + 1];
//         var m32 = m[3 * 4 + 2];
//         var m33 = m[3 * 4 + 3];
//         var tmp_0  = m22 * m33;
//         var tmp_1  = m32 * m23;
//         var tmp_2  = m12 * m33;
//         var tmp_3  = m32 * m13;
//         var tmp_4  = m12 * m23;
//         var tmp_5  = m22 * m13;
//         var tmp_6  = m02 * m33;
//         var tmp_7  = m32 * m03;
//         var tmp_8  = m02 * m23;
//         var tmp_9  = m22 * m03;
//         var tmp_10 = m02 * m13;
//         var tmp_11 = m12 * m03;
//         var tmp_12 = m20 * m31;
//         var tmp_13 = m30 * m21;
//         var tmp_14 = m10 * m31;
//         var tmp_15 = m30 * m11;
//         var tmp_16 = m10 * m21;
//         var tmp_17 = m20 * m11;
//         var tmp_18 = m00 * m31;
//         var tmp_19 = m30 * m01;
//         var tmp_20 = m00 * m21;
//         var tmp_21 = m20 * m01;
//         var tmp_22 = m00 * m11;
//         var tmp_23 = m10 * m01;

//         var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
//             (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
//         var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
//             (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
//         var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
//             (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
//         var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
//             (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

//         var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

//         return [
//             d * t0,
//             d * t1,
//             d * t2,
//             d * t3,
//             d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
//                 (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
//             d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
//                 (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
//             d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
//                 (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
//             d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
//                 (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
//             d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
//                 (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
//             d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
//                 (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
//             d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
//                 (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
//             d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
//                 (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
//             d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
//                 (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
//             d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
//                 (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
//             d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
//                 (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
//             d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
//                 (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
//         ];
//     },
// }

// const ran = () => [Math.random(), Math.random(), Math.random()]
// const colorsEnv = {
//     back: ran(),
//     faceL: ran(),
//     faceB: ran(),
//     bevel: ran(),
// }
// console.log(JSON.stringify(colorsEnv))

// main()

