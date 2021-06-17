/** SHADERS *************************************************************/

const vShaderSrc =
`#version 300 es

in vec2 a_position;
uniform mat3 u_matrix;
void main() {
    vec3 pos = (u_matrix * vec3(a_position, 1.));
    gl_Position = vec4(pos,  1.);  
} 
`

const fShaderSrc =
`#version 300 es

precision highp float;

uniform vec4 u_color;
out vec4 color;

void main() {
    color = u_color;
}
`


/** GL *************************************************************/

function createGl () {
    function createCanvasGl () {
        const canvas = document.createElement('canvas')
        const s = Math.min(window.innerWidth, window.innerHeight)
        canvas.width = canvas.height = s
        canvas.style.border = '1px solid #333333'
        document.body.style.textAlign = 'center'
        document.body.appendChild(canvas)
        return canvas.getContext('webgl2')
    }

    function createShader(gl, type, shaderSrc) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, shaderSrc)
        gl.compileShader(shader)
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (success) {
            return shader
        }
        console.log('shader error compile')
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
        console.log('compile program error')
    }


    function prepareProgram(vShaderSrc, fShaderSrc) {
        const vShader = createShader(gl, gl.VERTEX_SHADER, vShaderSrc)
        const fShader = createShader(gl, gl.FRAGMENT_SHADER, fShaderSrc)
        const program = createProgram(gl, vShader, fShader)
        const posAttribPointer = gl.getAttribLocation(program, 'a_position')
        const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix')
        const colorUniformLocation = gl.getUniformLocation(program, 'u_color')
        return {
            program,
            posAttribPointer,
            matrixUniformLocation,
            colorUniformLocation,
        }
    }


    function createBuffer(array) {
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW)
        return buffer
    }


    function clearCanvas(color) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(...color)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }


    function renderItem(data) {
        const {
            program,
            posAttribPointer,
            buffer,
            array32,
            matrixUniformLocation,
            matrixResult,
            colorUniformLocation,
            color,
        } = data

        gl.useProgram(program)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.uniformMatrix3fv(matrixUniformLocation, false, matrixResult)
        gl.uniform4f(colorUniformLocation, ...color)
        gl.enableVertexAttribArray(posAttribPointer)
        gl.vertexAttribPointer(posAttribPointer, 2, gl.FLOAT, false, 0, 0)
        gl.drawArrays(gl.TRIANGLES, 0, array32.length)
    }


    let gl = createCanvasGl()

    return {
        createShader,
        prepareProgram,
        createBuffer,
        clearCanvas,
        renderItem,
    }
}



/** GEOMETRY **************************************************************/

function createWheel(data) {
    const { qualityNum, r, width, heightTooth } = data

    const bevel1 = r + Math.max(heightTooth / 10, 0.05)
    const bevel2 = r + Math.max(heightTooth + (heightTooth / 10), 0.05)
    const bevel0 = r - width - Math.max(heightTooth / 10, 0.05)

    function createCoords() {
        const arrTop = []
        const arrBottom = []
        const arrTooth = []
        const arrBevel1 = []
        const arrBevel2 = []
        const arrBevel0 = []

        const addToLen = Math.PI * 2 / qualityNum
        let currentLen = 0

        /**
         *         *------------* arrBevel2
         *         |\          /|
         *         | *--------* | arrTooth
         *         | |        | |
         *     ----* |        | *------- arrBevel1
         *          \|        |/
         *     *-----*        *--------* arrTop
         *
         *     *-----*--------*--------* arrBottom
         *
         *     *-----*--------*--------* arrBevel0
         */

        for (let i = 0; i < qualityNum; ++i) {
            // add middle point
            const topPoint = [Math.sin(currentLen) * r, Math.cos(currentLen) * r]
            arrTop.push(topPoint)

            // add inner point
            const bottomPoint = [Math.sin(currentLen) * (r - width), Math.cos(currentLen) * (r - width)]
            arrBottom.push(bottomPoint)

            // add spike point
            const toothPoint = [Math.sin(currentLen) * (r + heightTooth), Math.cos(currentLen) * (r + heightTooth)]
            arrTooth.push(toothPoint)


            // addInner bevelPoint
            const innbecPoint = [Math.sin(currentLen) * bevel0, Math.cos(currentLen) * bevel0]
            arrBevel0.push(innbecPoint)


            const bevelPoint = []
            const bevel2Point = []

            const bevelWidth = addToLen / 2.5
            if (i % 2 === 0) {
                // add spike offset left bottom
                bevelPoint.push(Math.sin(currentLen - bevelWidth) * bevel1, Math.cos(currentLen - bevelWidth) * bevel1)
                // add spike offset left top
                bevel2Point.push(Math.sin(currentLen - bevelWidth) * bevel2, Math.cos(currentLen - bevelWidth) * bevel2)
            }
            else {
                // add spike offset right bottom
                bevelPoint.push(Math.sin(currentLen + bevelWidth) * bevel1, Math.cos(currentLen + bevelWidth) * bevel1)
                // add spike offset right top
                bevel2Point.push(Math.sin(currentLen + bevelWidth) * bevel2, Math.cos(currentLen + bevelWidth) * bevel2)
            }
            arrBevel1.push(bevelPoint)
            arrBevel2.push(bevel2Point)


            currentLen += addToLen
        }
        return [ arrTop, arrBottom, arrTooth, arrBevel1, arrBevel2, arrBevel0 ]
    }


    function createPolygonsCoords(top, bottom, tooth, bevel1, bevel2, bevel0) {
        const body = []
        const bevel = []
        for (let i = 0; i < top.length; i += 1) {

            const pI = top[i + 1] ? i + 1 : 0
            const mI = top[i - 1] ? i - 1 : top.length - 1

            body.push(...createPolygon(top[i], top[pI], bottom[i], bottom[pI]))
            bevel.push(...createPolygon(bottom[i], bottom[pI], bevel0[i], bevel0[pI]))

            if (i % 2 === 0) {
                body.push(...createPolygon(tooth[i], tooth[pI], top[i], top[pI]))
                bevel.push(...createPolygon(bevel2[i], bevel2[pI], tooth[i], tooth[pI]))
                bevel.push(...createPolygon(bevel1[mI], bevel1[i], top[mI], top[i]))
                bevel.push(...createPolygon(tooth[pI], bevel2[pI], top[pI], bevel1[pI]))
                bevel.push(...createPolygon(tooth[i], bevel2[i], top[i], bevel1[i]))
            }
        }
        return { body, bevel }
    }


    function createPolygon(c1, c2, c3, c4) {
        return [
            [  c1[0], c1[1],    c2[0], c2[1],    c3[0], c3[1]  ],
            [  c3[0], c3[1],    c2[0], c2[1],    c4[0], c4[1]  ],
        ]
    }


    function prepareArray(polygons) {
        const arr = []
        for (let i = 0; i < polygons.length; ++i) {
            for (let j = 0; j < polygons[i].length; ++j) {
                arr.push(polygons[i][j])
            }
        }
        return arr
    }


    const { body, bevel } = createPolygonsCoords(...createCoords())
    const bodyPrepared = prepareArray(body)
    const bevelPrepared = prepareArray(bevel)
    return {
        body: new Float32Array(bodyPrepared),
        bevel: new Float32Array(bevelPrepared)
    }
}





/** INIT ITEMS ************************************************************/


function main () {
    const colors = {
        body: colorRandom(),
        border: colorRandom(),
        back: colorRandom(),
    }

    //console.log('' + JSON.stringify(colors) + ',')


    function prepareWheelsBuffers(glU) {
        const countWheels = 40
        const dataWheels = []

        for (let i = 0; i < countWheels; ++i) {
            const r = Math.random() / 2

            dataWheels.push({
                geomParams: {
                    r,
                    qualityNum: Math.floor(r * 30) * 4 + 12,
                    width: r - (Math.random() * (r / 2)),
                    heightTooth: Math.max( r / 2, Math.random() * r),
                },
                offset: [Math.random() * 4 - 2, Math.random() * 2 - 1],
                rotateSpeed: Math.random(),
                body: {
                    arr32: null,
                    buffer: null,
                },
                border: {
                    arr32: null,
                    buffer: null,
                }
            })
        }

        for (let i = 0; i < countWheels; ++i) {
            const { body, bevel } = createWheel(dataWheels[i].geomParams)
            dataWheels[i].body.array32 = body
            dataWheels[i].body.buffer = glU.createBuffer(body)

            dataWheels[i].border.array32 = bevel
            dataWheels[i].border.buffer = glU.createBuffer(bevel)
        }
        return dataWheels
    }



    const glU = createGl()
    const dataWheels = prepareWheelsBuffers(glU)
    const {
        program,
        posAttribPointer,
        matrixUniformLocation,
        colorUniformLocation,
    } = glU.prepareProgram(vShaderSrc, fShaderSrc)


    function draw(d, colors) {
        glU.clearCanvas(colors.back)
        for (let i = 0; i < dataWheels.length; ++i) {
            const { offset, rotateSpeed, body, border } = dataWheels[i]

            const x = (offset[0] + (d * rotateSpeed)) % 4 - 2
            const mTranslate = m3.translate(x, offset[1])
            const mRotate = m3.rotate(d * rotateSpeed)
            const matrixResult = m3.multiply(mTranslate, mRotate)

            {
                const { buffer, array32 } = body
                glU.renderItem({
                    buffer,
                    array32,
                    color: colors.body,
                    colorUniformLocation,
                    matrixUniformLocation,
                    matrixResult,
                    posAttribPointer,
                    program,
                })
            }

            {
                const { buffer, array32 } = border
                glU.renderItem({
                    buffer,
                    array32,
                    color: colors.border,
                    colorUniformLocation,
                    matrixUniformLocation,
                    matrixResult,
                    posAttribPointer,
                    program,
                })
            }
        }
    }

    let countForColor = 0
    let currentColorIndex = 0
    let d = 0
    const animate = () => {
        countForColor = ++countForColor > 200 ? (++currentColorIndex && 0) : countForColor
        currentColorIndex === arrColors.length && (currentColorIndex = 0)

        draw(d += 0.01, arrColors[currentColorIndex])
        requestAnimationFrame(animate)
    }
    animate()
}



/** MATH HELPERS **************************************************/

const colorRandom = () => [Math.random(), Math.random(), Math.random(), 1.]

const m3 = {
    translate: (tx, ty) =>   [ 1, 0, 0,     0, 1, 0,     tx, ty, 1,   ],
    rotate: rad => {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        return               [ c, -s, 0,     s, c,  0,    0, 0,  1,   ]
    },
    scale: (sx, sy) =>       [ sx, 0, 0,     0, sy, 0,    0, 0, 1,    ],
    multiply: (a, b) => {
        const
            a00 = a[0 * 3 + 0],   a01 = a[0 * 3 + 1],   a02 = a[0 * 3 + 2],
            a10 = a[1 * 3 + 0],   a11 = a[1 * 3 + 1],   a12 = a[1 * 3 + 2],
            a20 = a[2 * 3 + 0],   a21 = a[2 * 3 + 1],   a22 = a[2 * 3 + 2],

            b00 = b[0 * 3 + 0],   b01 = b[0 * 3 + 1],    b02 = b[0 * 3 + 2],
            b10 = b[1 * 3 + 0],   b11 = b[1 * 3 + 1],    b12 = b[1 * 3 + 2],
            b20 = b[2 * 3 + 0],   b21 = b[2 * 3 + 1],    b22 = b[2 * 3 + 2]

        return [
            b00 * a00 + b01 * a10 + b02 * a20,    b00 * a01 + b01 * a11 + b02 * a21,    b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,    b10 * a01 + b11 * a11 + b12 * a21,    b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,    b20 * a01 + b21 * a11 + b22 * a21,    b20 * a02 + b21 * a12 + b22 * a22,
        ]
    },
}

const arrColors = [
    {"body":[0.0552550786049717,0.34500187146127503,0.5156481053974176,1],"border":[0.3239710995624303,0.0034800572507012184,0.06726530343383663,1],"back":[0.5985813778260423,0.7769177327295236,0.9989627154511642,1]},
    {"body":[0.9551248017665492,0.30286389616085474,0.12597615700513898,1],"border":[0.5358935466645331,0.046853379785553484,0.06787342749637149,1],"back":[0.13153043166179645,0.339486288902378,0.30074789921948386,1]},
    {"body":[0.9371522402105268,0.509915289220751,0.06044130125128189,1],"border":[0.05172973908831424,0.24182775601969264,0.515555584419747,1],"back":[0.9078767702337458,0.7755196900574175,0.11171617474531681,1]},
    {"body":[0.5113371383829524,0.4401723957131185,0.36290880231206746,1],"border":[0.7426018204196585,0.8742653416467996,0.30941440857900093,1],"back":[0.3730420840546871,0.07019937117543362,0.13307516862943203,1]},
    {"body":[0.9497129278309699,0.57920147158971,0.17997506701071475,1],"border":[0.9243790316105784,0.32031828943356166,0.13742895309894676,1],"back":[0.9872750703086524,0.12397274383015366,0.9332901304274586,1]},
    {"body":[0.05848484736300019,0.07302997147815526,0.11362516943392587,1],"border":[0.8450760654859399,0.0746831700059869,0.15274941004912868,1],"back":[0.8352540591001067,0.7284317355140064,0.07744532659664793,1]},
    {"body":[0.1796398836150539,0.04205935360045454,0.3543121207269919,1],"border":[0.29841460105053974,0.9573603737031708,0.443169806157534,1],"back":[0.8345352791991079,0.0010281375520699854,0.08178874901030464,1]},
    {"body":[0.18469878673592977,0.32547515909402036,0.3904721885628415,1],"border":[0.11971487757194499,0.03814368908143795,0.08039283936296471,1],"back":[0.644188609787173,0.8042291987740497,0.18634513334127467,1]},
    {"body":[0.34957558240311326,0.404767076275784,0.7375987182317927,1],"border":[0.013142924786148757,0.020616022304864146,0.39702062482209777,1],"back":[0.4578502279795198,0.6664362820103078,0.7553094769639628,1]},
]

main()



