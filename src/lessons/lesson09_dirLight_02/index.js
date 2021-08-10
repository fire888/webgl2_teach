/** https://webglfundamentals.org/webgl/lessons/ru/webgl-3d-lighting-directional.html */




const vSh = `
attribute vec4 a_position;
attribute vec3 a_normal;
uniform mat4 u_viewMatrix;
uniform mat4 u_lightMatrix;
varying vec3 v_normal;

void main() {
    v_normal = (u_lightMatrix * vec4(a_normal, 1.)).xyz;
    gl_Position = u_viewMatrix * a_position;
}`




const fSh = `
precision mediump float;
uniform vec3 u_reverseLightDirection;
uniform vec3 v_color;
varying vec3 v_normal;


void main() {
    vec3 normal = v_normal;
    float light = dot(normal, normalize(u_reverseLightDirection));
    vec3 color = vec3(step(.5, light));
    color = mix(color, v_color, v_color.r);

    gl_FragColor = vec4(color, 1.);
}`




/** CONST ***********************/

const { sin, cos, PI, min, max, floor, round } = Math
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
    const colorLoc = gl.getUniformLocation(program, 'v_color')
    const matrixLoc = gl.getUniformLocation(program, 'u_viewMatrix')
    const lightLoc = gl.getUniformLocation(program, 'u_reverseLightDirection')
    const matrixLightLoc = gl.getUniformLocation(program, 'u_lightMatrix')
    return {
        program,
        posLoc,
        normLoc,
        colorLoc,
        matrixLoc,
        lightLoc,
        matrixLightLoc,
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

const XL = -.1
const XR = .1
const YB = .1
const YT = -.1
const ZF = .1
const ZB = -.1 

const createPoints = () => ({ 
    points: new Float32Array([ 
        // FRONT
        XL, YB, ZF,
        XR, YB, ZF,
        XL, YT, ZF,

        XR, YB, ZF,
        XR, YT, ZF,
        XL, YT, ZF,

        // BACK
        XL, YB, ZB,
        XR, YB, ZB,
        XL, YT, ZB,

        XR, YB, ZB,
        XR, YT, ZB,
        XL, YT, ZB,

        // RIGHT    
        XR, YB, ZF,
        XR, YB, ZB,
        XR, YT, ZF,

        XR, YB, ZB,
        XR, YT, ZB,
        XR, YT, ZF,

        // LEFT
        XL, YB, ZB,
        XL, YB, ZF,
        XL, YT, ZF,

        XL, YB, ZB,
        XL, YT, ZF,
        XL, YT, ZB,

        // TOP
        XL, YT, ZF,
        XL, YT, ZB,
        XR, YT, ZB,

        XR, YT, ZB,
        XR, YT, ZF,
        XL, YT, ZF,

        // BOTTOM
        XL, YB, ZB,
        XL, YB, ZF,
        XR, YB, ZF,

        XR, YB, ZF,
        XR, YB, ZB,
        XL, YB, ZB,
    ]), 

    normals: new Float32Array([
        // FRONT
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        // BACK
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        // LEFT
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        // RIGHT
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // TOP
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // BOTTOM
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

    ]),
})



/** main */

const COUNT_X = 9
const COUNT_Y = 9

function main() {
    const uGl = prepareGL()
    const { points, normals } = createPoints()

    const pointsBuffer = uGl.createBuffer(points) 
    const normalsBuffer = uGl.createBuffer(normals)

    const { program, posLoc, normLoc, colorLoc, matrixLoc, lightLoc, matrixLightLoc } = uGl.prepareProgram(vSh, fSh)

    pointsBuffer.loc = posLoc
    normalsBuffer.loc = normLoc

    const light = new Float32Array([1, 1, -1])
    let color = new Float32Array([0, 0, 0])
    
    const update = d => {
        uGl.clearCanvas([0., 0., 0.])

        for (let i = 0; i < (COUNT_X * COUNT_Y); ++i) {



            const p = round((d * 5) % (COUNT_X * COUNT_Y / 2))
            color[0] = round(p / (i - 1)) - round( p / (i + 1))




            const x = (i % COUNT_X) * (2 / COUNT_X) - .9 
            const y = Math.floor(i / COUNT_Y) * (2 / COUNT_Y) - .9
            const z = Math.ceil(i % 2) * .5

            let rotMatrix = m4.rotY(Math.sin(d + (i / 25)) * PI2)
            rotMatrix = m4.mult(m4.rotX(Math.sin(d * .5 + (i / 25)) * PI2), rotMatrix)
            const lightMatrix = inverse(rotMatrix)

            const matrix = m4.mult(m4.move(x, y, z), rotMatrix)
            uGl.render({
                program,
                buffers: [pointsBuffer, normalsBuffer],
                matrix,
                matrixLoc,
                color,
                colorLoc,
                light,
                lightLoc,
                lightMatrix,
                matrixLightLoc,
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
    normalize: (v, dst) => {
        dst = dst || new Float32Array(3);
        var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // make sure we don't divide by 0.
        if (length > 0.00001) {
          dst[0] = v[0] / length;
          dst[1] = v[1] / length;
          dst[2] = v[2] / length;
        }
        return dst;
    },
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

function inverse(m, dst) {
    dst = dst || new Float32Array(16);
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

    dst[0] = d * t0;
    dst[1] = d * t1;
    dst[2] = d * t2;
    dst[3] = d * t3;
    dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
        (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
    dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
        (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
    dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
        (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
    dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
        (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
    dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
        (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
    dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
        (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
    dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
        (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
    dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
        (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
    dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
        (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
    dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
        (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
    dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
        (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
    dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
        (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

    return dst;
}


main()
