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

const createGl = () => {
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

    function clearCanvas() {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
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
        gl.uniformMatrix3fv(matrixUniformLocation, false, matrixResult)
        gl.uniform4f(colorUniformLocation, ...color)
        gl.enableVertexAttribArray(posAttribPointer)
        gl.vertexAttribPointer(posAttribPointer, 2, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
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

    const bevel1 = r + 0.01
    const bevel2 = r + heightTooth + 0.01

    function createCoords() {
        const arrTop = []
        const arrBottom = []
        const arrTooth = []
        const arrBevel1 = []
        const arrBevel2 = []

        const addToLen = Math.PI * 2 / qualityNum
        let currentLen = 0

        for (let i = 0; i < qualityNum; ++i) {

            const bevelPoint = []
            const bevel2Point = []
            if (i % 2 === 0) {
                bevelPoint.push(Math.sin(currentLen - 0.005) * bevel1, Math.cos(currentLen - 0.005) * bevel1)
                bevel2Point.push(Math.sin(currentLen - 0.005) * bevel2, Math.cos(currentLen - 0.005) * bevel2)
            }
            else {
                bevelPoint.push(Math.sin(currentLen + 0.005) * bevel1, Math.cos(currentLen + 0.005) * bevel1)
                bevel2Point.push(Math.sin(currentLen - 0.005) * bevel2, Math.cos(currentLen - 0.005) * bevel2)
            }
            arrBevel1.push(bevelPoint)
            arrBevel2.push(bevel2Point)


            const topPoint = [Math.sin(currentLen) * r, Math.cos(currentLen) * r]
            arrTop.push(topPoint)

            const bottomPoint = [Math.sin(currentLen) * (r - width), Math.cos(currentLen) * (r - width)]
            arrBottom.push(bottomPoint)

            const toothPoint = [Math.sin(currentLen) * (r + heightTooth), Math.cos(currentLen) * (r + heightTooth)]
            arrTooth.push(toothPoint)

            currentLen += addToLen
        }
        return { arrTop, arrBottom, arrTooth, arrBevel1, arrBevel2 }
    }



    function createPolygonsCoords(coordsTop, coordsBottom, coordsTooth) {
        const arr = []
        const arrBevel = []
        for (let i = 0; i < coordsTop.length; i += 1) {
            if (!coordsTop[i + 1]) {
                arr.push(...createPolygon(coordsTop[i], coordsTop[0], coordsBottom[i], coordsBottom[0]))
                continue;
            }

            arr.push(...createPolygon(coordsTop[i], coordsTop[i + 1], coordsBottom[i], coordsBottom[i + 1]))
            if (i % 2 === 0) arr.push(...createPolygon(coordsTooth[i], coordsTooth[i + 1], coordsTop[i], coordsTop[i + 1]))
        }
        return arr
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


    const { arrTop, arrBottom, arrTooth } = createCoords()
    const polygonsCoords = createPolygonsCoords(arrTop, arrBottom, arrTooth)
    const preparedArr = prepareArray(polygonsCoords)
    return new Float32Array(preparedArr)
}





/** INIT ITEMS ************************************************************/


function main () {
    const dataWheels = [
        {
            geom: {
                qualityNum: Math.floor(Math.random() * 30) * 4,
                r: Math.random(),
                width: Math.random() * 0.8,
                heightTooth: Math.random(),
            },
            offset: [.3, .2],
            rotateSpeed: .3,
            body: {
                arr32: null,
                buffer: null,
                color: colorRandom()
            },
            border: {
                arr32: null,
                buffer: null,
                color: colorRandom()
            }
        },
        {
            geom: {
                qualityNum: Math.floor(Math.random() * 30) * 4,
                r: Math.random(),
                width: Math.random() * 0.8,
                heightTooth: Math.random(),
            },
            offset: [-.3, .2],
            rotateSpeed: -.3,
            body: {
                arr32: null,
                buffer: null,
                color: colorRandom()
            },
            border: {
                arr32: null,
                buffer: null,
                color: colorRandom()
            }
        },
        {
            geom: {
                qualityNum: Math.floor(Math.random() * 30) * 4,
                r: Math.random(),
                width: Math.random() * 0.8,
                heightTooth: Math.random(),
            },
            offset: [.3, -.2],
            rotateSpeed: .6,
            body: {
                arr32: null,
                buffer: null,
                color: colorRandom()
            },
            border: {
                arr32: null,
                buffer: null,
                color: colorRandom()
            }
        },
    ]

    const glU = createGl()

    for (let i = 0; i < dataWheels.length; ++i) {
        const array32 = createWheel(dataWheels[i].geom)
        const buffer = glU.createBuffer(array32)
        dataWheels[i].body.array32 = array32
        dataWheels[i].body.buffer = buffer
    }

    const {
        program,
        posAttribPointer,
        matrixUniformLocation,
        colorUniformLocation,
    } = glU.prepareProgram(vShaderSrc, fShaderSrc)



    function draw(d) {
        glU.clearCanvas()

        for (let i = 0; i < dataWheels.length; ++i) {
            const {offset, rotateSpeed, body } = dataWheels[i]

            const mTranslate = m3.translate(offset[0], offset[1])
            const mRotate = m3.rotate(d * rotateSpeed)
            const matrixResult = m3.multiply(mTranslate, mRotate)

            glU.renderItem({
                buffer: body.buffer,
                array32: body.array32,
                color: body.color,
                colorUniformLocation,
                matrixUniformLocation,
                matrixResult,
                posAttribPointer,
                program,
            })
        }
    }


    let d = 0
    const animate = () => {
        d += 0.01
        draw(d)
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

main()



