

/** SHADERS *******************************************************/

const vShSrc = `
attribute vec4 a_position;
attribute vec4 a_color;
uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
    v_color = a_color;
    gl_Position = u_matrix * a_position;
}`

const fShSrc = `
precision mediump float;

varying vec4 v_color;

void main() {
    gl_FragColor = v_color;   
}`



/** GL *************************************************************/

function prepareGl() {
    function createGl() {
        const canvas = document.createElement('canvas')
        const s = Math.min(window.innerWidth, window.innerHeight)
        canvas.width = canvas.height = s
        canvas.style.border = '1px solid #000000'
        document.body.appendChild(canvas)
        document.body.style.textAlign = 'center'
        const gl = canvas.getContext('webgl2')
        gl.enable(gl.CULL_FACE)
        gl.enable(gl.DEPTH_TEST)
        return gl
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
        const colorAttrLoc = gl.getAttribLocation(program, 'a_color')
        const matrixUniformLoc = gl.getUniformLocation(program, 'u_matrix')
        return {
            program,
            posAttrLoc,
            colorAttrLoc,
            matrixUniformLoc,
        }
    }


    function clearCanvas(color) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(...color, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }


    function render({
            program,
            posAttrLoc,
            bufferPolygons,
            colorAttrLoc,
            bufferColors,
            bufferLength,
            matrixUniformLoc,
            matrix,
        }) {

        gl.useProgram(program)

        gl.bindBuffer(gl.ARRAY_BUFFER, bufferColors)
        gl.enableVertexAttribArray(colorAttrLoc)
        gl.vertexAttribPointer(colorAttrLoc, 3, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, bufferPolygons)
        gl.enableVertexAttribArray(posAttrLoc)
        gl.vertexAttribPointer(posAttrLoc, 3, gl.FLOAT, false, 0, 0)

        gl.uniformMatrix4fv(matrixUniformLoc, false, matrix)

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



/** GEOMETRY ***************************************************/

function createGeom({
        width = 0.2,
        h1 = 0.2,
        hs= 0.04,
        lengthStep = 0.04,
        lengthTop = 0.2,
        lengthBottom = 0.2,
        countSteps = 10,
        topEmptyOffset = 0.1,
        lenEmpty = 0.3,
        lenColumn = 0.1,
        isRight = true,
        color1,
        color2,
        color3,
    }) {

    function createPoints() {
        const arrGeom = []
        const arrGeomWT = []
        const arrGeomWG = []

        const w = width / 2

        const geomColor1 = isRight ? arrGeom : arrGeomWT
        const geomColor2 = isRight ? arrGeomWT : arrGeom
        isRight
            ? geomColor1.push([
                0, 0, -w,
                lengthBottom, 0, -w,
                lengthBottom, h1, -w,
                0, h1, -w,
            ])
            : geomColor1.push([
                lengthBottom, 0, w,
                0, 0, w,
                0, h1, w,
                lengthBottom, h1, w,
            ])
        geomColor2.push([
            0, 0, -w,
            0, h1, -w,
            0, h1, w,
            0, 0, w,
        ])
        arrGeomWG.push([
            0, h1, -w,
            lengthBottom, h1, -w,
            lengthBottom, h1, w,
            0, h1, w,
        ])

        let sCurrentX = lengthBottom
        let sCurrentY = h1
        for (let i = 0; i < countSteps; ++i) {
            sCurrentY += hs
            isRight
                ? geomColor1.push([
                        sCurrentX, 0, -w,
                        sCurrentX + lengthStep, 0, -w,
                        sCurrentX + lengthStep, sCurrentY, -w,
                        sCurrentX, sCurrentY, -w,
                    ])
                : geomColor1.push([
                    sCurrentX + lengthStep, 0, w,
                    sCurrentX, 0, w,
                    sCurrentX, sCurrentY, w,
                    sCurrentX + lengthStep, sCurrentY, w,
                ])
            geomColor2.push([
                sCurrentX, sCurrentY - hs, -w,
                sCurrentX, sCurrentY, -w,
                sCurrentX, sCurrentY, w,
                sCurrentX, sCurrentY - hs, w,
            ])
            arrGeomWG.push([
                sCurrentX, sCurrentY, -w,
                sCurrentX + lengthStep, sCurrentY, -w,
                sCurrentX + lengthStep, sCurrentY, w,
                sCurrentX, sCurrentY, w,
            ])
            sCurrentX += lengthStep
        }

        isRight
            ? geomColor1.push([
                    sCurrentX, 0, -w,
                    sCurrentX + lengthTop, 0, -w,
                    sCurrentX + lengthTop, sCurrentY, -w,
                    sCurrentX, sCurrentY, -w,
                ])
            : geomColor1.push([
                sCurrentX + lengthTop, 0, w,
                sCurrentX, 0, w,
                sCurrentX, sCurrentY, w,
                sCurrentX + lengthTop, sCurrentY, w,
            ])
        arrGeomWG.push([
            sCurrentX, sCurrentY, -w,
            sCurrentX + lengthTop, sCurrentY, -w,
            sCurrentX + lengthTop, sCurrentY, w,
            sCurrentX, sCurrentY, w,
        ])


        sCurrentX += lengthTop
        const saveX = sCurrentX
        for (let i = 0; i < 3; ++i) {
            isRight
                ? geomColor1.push([
                    sCurrentX, Math.max(sCurrentY - topEmptyOffset, 0), -w,
                    sCurrentX + lenEmpty, Math.max(sCurrentY - topEmptyOffset, 0), -w,
                    sCurrentX + lenEmpty, sCurrentY, -w,
                    sCurrentX, sCurrentY, -w
                ])
                : geomColor1.push([
                    sCurrentX + lenEmpty, Math.max(sCurrentY - topEmptyOffset, 0), w,
                    sCurrentX, Math.max(sCurrentY - topEmptyOffset, 0), w,
                    sCurrentX, sCurrentY, w,
                    sCurrentX + lenEmpty, sCurrentY, w,
                ])
            sCurrentX += lenEmpty
            isRight
                ? geomColor1.push([
                    sCurrentX, 0, -w,
                    sCurrentX + lenColumn, 0, -w,
                    sCurrentX + lenColumn, sCurrentY, -w,
                    sCurrentX, sCurrentY, -w
                ])
                : geomColor1.push([
                    sCurrentX + lenColumn, 0, w,
                    sCurrentX, 0, w,
                    sCurrentX, sCurrentY, w,
                    sCurrentX + lenColumn, sCurrentY, w,
                ])
            geomColor2.push([
                sCurrentX, 0, -w,
                sCurrentX, sCurrentY - topEmptyOffset, -w,
                sCurrentX, sCurrentY - topEmptyOffset, w,
                sCurrentX, 0, w,
            ])
            sCurrentX += lenColumn
        }

        arrGeomWG.push([
            saveX, sCurrentY, -w,
            sCurrentX, sCurrentY, -w,
            sCurrentX, sCurrentY, w,
            saveX, sCurrentY, w,
        ])

        return { arrGeom, arrGeomWT, arrGeomWG }
    }



    function createPolygons({ arrGeom, color1, arrGeomWT, color2, arrGeomWG, color3 }) {
        const arr = []
        const colors = []

        fillArr(arr, arrGeom, colors, color1)
        fillArr(arr, arrGeomWT, colors, color2)
        fillArr(arr, arrGeomWG, colors, color3)

        return [ arr, colors ]
    }

    function fillArr(arr, geom, colors, color) {
        const indStart = arr.length
        for (let i = 0; i < geom.length; ++i) {
            arr.push(...createPolygon(geom[i]))
        }
        for (let i = indStart; i < arr.length; i += 3 ) {
            colors.push(...color)
        }
    }

    function createPolygon(p) {
        return [
            p[0], p[1], p[2],
            p[3], p[4], p[5],
            p[6], p[7], p[8],

            p[6], p[7], p[8],
            p[9], p[10], p[11],
            p[0], p[1], p[2],
        ]
    }


    const { arrGeom, arrGeomWT, arrGeomWG } = createPoints()
    const [ polygons, colors ] = createPolygons({ arrGeom, color1, arrGeomWT, color2, arrGeomWG, color3 })
    return {
        polygons: new Float32Array(polygons),
        colors: new Float32Array(colors)
    }
}



/** STAIRS MANAGER ******************************************************/

function createStairsManager (glU, colors) {
    const schemeStair = {
        dataGeom: {
            width: 0.18,
            h1: .05,
            hs: 0.06,
            lengthStep: 0.01,
            lengthBottom: 0.36,
            lengthTop: 0.05,
            countSteps: 10,
            isRight: true,
            color1: colors[0],
            color2: colors[1],
            color3: colors[2],
        },
        transform: {
            move: [-1, -1, 0],
            rot: [-1, -1, 0],
        },
        a_pos: {
            buffer: null,
            loc: null,
            len: null,
        },
        a_color: {
            buffer: null,
            loc: null,
            len: null,
        },
        u_matrix: {
            loc: null,
        },
    }



    function prepareStairsData(scheme, count) {
        const stairsData = []
        let yOffset = 0
        for (let i = 0; i < count; ++i) {
            const obj = JSON.parse(JSON.stringify(scheme))
            obj.dataGeom.lengthStep = Math.random() * 0.05 + 0.005
            obj.dataGeom.countSteps = Math.floor(Math.random() * 25)
            obj.dataGeom.hs = Math.random() * 0.05 + 0.005
            const isRight = i % 2 > 0
            obj.dataGeom.isRight = isRight

            obj.transform.move[0] = isRight ? 0 : -0
            yOffset += .2
            obj.transform.move[1] = yOffset - 1.5
            obj.transform.rot[1] = isRight ? -Math.PI / 4 : -Math.PI / 2 - Math.PI / 4

            stairsData.push(obj)
        }
        return { stairsData, yOffset }
    }



    const {
        program,
        posAttrLoc,
        colorAttrLoc,
        matrixUniformLoc,
    } = glU.prepareProgram(vShSrc, fShSrc)


    function prepareStairsGL(arr) {
        for (let i = 0; i < arr.length; ++i) {
            const { polygons, colors } = createGeom(arr[i].dataGeom)

            arr[i].a_pos = {
                buffer: glU.createBuffer(polygons),
                loc: posAttrLoc,
                len: polygons.length,
            }
            arr[i].a_color = {
                buffer: glU.createBuffer(colors),
                loc: colorAttrLoc,
                len: colors.length,
            }
            arr[i].u_matrix = {
                loc: matrixUniformLoc,
            }
        }

        return arr
    }



    let stairs, lengthY

    function createStairs(num = 30) {
        const { stairsData, yOffset } = prepareStairsData(schemeStair, num)
        lengthY = yOffset
        stairs = prepareStairsGL(stairsData)
    }



    function updateStairs (d) {
        for (let i = 0; i < stairs.length; ++i) {
            const item = stairs[i]

            const x = item.transform.move[0]
            const y = ((item.transform.move[1] - d - 1.5) % lengthY) + 1.5

            const translate = m4.translate(x, y ,0)
            const xRot = m4.xRotation(item.transform.rot[0])
            const yRot = m4.yRotation(item.transform.rot[1])
            let result = m4.multiply(translate, xRot)
            result = m4.multiply(result, yRot)

            glU.render({
                program,
                posAttrLoc: item.a_pos.loc,
                bufferPolygons: item.a_pos.buffer,
                colorAttrLoc: item.a_color.loc,
                bufferColors: item.a_color.buffer,
                matrixUniformLoc: item.u_matrix.loc,
                matrix: result,
                bufferLength: item.a_pos.len,
            })
        }
    }


    return {
        createStairs,
        updateStairs,
    }
}


function main(colors) {
    const glU = prepareGl()
    const stairsManager = createStairsManager(glU, colors)
    stairsManager.createStairs(20)


    let d = 0
    const animate = () => {
        glU.clearCanvas(colors[3])
        stairsManager.updateStairs(d)

        d += 0.005
        requestAnimationFrame(animate)
    }
    animate()
}



/** MATH HELPERS **********************************************/

const m4 = {
    translate: (tx, ty, tz) => [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1,
    ],
    xRotation: rad => {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    },
    yRotation: rad => {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ]
    },
    multiply: function(a, b) {
        const a00 = a[0 * 4 + 0],
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
            a33 = a[3 * 4 + 3],
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
        ];
    },
}



/** START *****************************************************/

const colors = [
    [0.4744710385589861,0.06608719024768228,0.08711951962455244],
    [0.8306956077250696,0.6354755611608229,0.20973172956690278],
    [0.4000863961159107,0.8624258707771839,0.4668493034128858],
    [0.4661298822911881,0.4542687482277381,0.34983460352031015],
]

main(colors)
