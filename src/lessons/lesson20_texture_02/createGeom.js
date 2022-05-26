

const createGeometryHub = () => {
    let points = []
    let uv = []
    let normals = []

    return {
        add4Points: (data) => {

            if (data.length !== 4) {
                console.log('add4Points data mistake', data)
            }

            points.push(
                data[0][0], data[0][1], data[0][2],
                data[1][0], data[1][1], data[1][2],
                data[2][0], data[2][1], data[2][2],

                data[1][0], data[1][1], data[1][2],
                data[3][0], data[3][1], data[3][2],
                data[2][0], data[2][1], data[2][2],
            )
            uv.push(
                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,
            )
            normals.push(
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,

                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
            )
        },
        
        add3Points: (data) => {
            if (data.length !== 3) {
                console.log('add3Points data mistake', data)
            }

            points.push(
                data[0][0], data[0][1], data[0][2],
                data[1][0], data[1][1], data[1][2],
                data[2][0], data[2][1], data[2][2],
            )
            uv.push(
                0, 0,
                .5, 1,
                1, 0,
            )

            const x = Math.min((data[0][0] + data[1][0] + data[2][0]) / 3, 1)
            const y = Math.min((data[0][1] + data[1][1] + data[2][1]) / 3, 1)
            const z = Math.min((data[0][2] + data[1][2] + data[2][2]) / 3, 1)

            normals.push(
                x, y, z,
                x, y, z,
                x, y, z,
            )
        },
        getCompletedGeometry: () => {
            return {
                points: new Float32Array(points),
                uv: new Float32Array(uv),
                normals: new Float32Array(normals),
            }
        },
        clear: () => {
            points = []
            uv = []
            normals = []
        },
    }
}


const geometryHub = createGeometryHub()

const { PI, sin, cos } = Math
const PI2 = PI * 2

const hOffset = 1.5
const hOffset1 = 1
const hOffset2 = 1

const h0 = -hOffset2 - hOffset
const h1 = -hOffset
const h2 = hOffset
const h3 = hOffset + hOffset2



let count = 9
const R = 2.5




export const createGeometry = (resolution, phase) => {
    geometryHub.clear()

    count = resolution

    const h0r = h0 - sin(phase)
    const h3r = h3 + cos(phase)

    const bottomRound = (() => {
        const arr = []
        for (let i = 0; i < count; ++i) {
            arr.push([
                sin(PI2 * (i / count)) * R, 
                h1 + cos(i / count * PI2 * 2) * phase,
                cos(PI2 * (i / count)) * R
            ])
        }
        return arr
    })()

    const topRound = (() => {
        const arr = []
        const offset = PI2 / count / 2
        for (let i = 0; i < count; ++i) {
            arr.push([
                sin(PI2 * (i / count) + offset) * R, 
                h2  + sin(i / count * PI2 * 2) * phase,
                cos(PI2 * (i / count) + offset) * R
            ])
        }
        return arr
    })()


    for (let i = 0; i < count; ++i) {
        if (i < count - 1) {
            geometryHub.add3Points([ bottomRound[i], [0, h0r, 0], bottomRound[i + 1] ])
            geometryHub.add3Points([ bottomRound[i + 1], topRound[i], bottomRound[i] ])
            geometryHub.add3Points([ topRound[i], bottomRound[i + 1], topRound[i + 1] ])
            geometryHub.add3Points([ topRound[i + 1], [0, h3r, 0], topRound[i] ])
        }
        if (i === count - 1) {
            geometryHub.add3Points([ bottomRound[i], [0, h0r, 0], bottomRound[0] ])
            geometryHub.add3Points([ bottomRound[0], topRound[i], bottomRound[i] ])
            geometryHub.add3Points([ topRound[i], bottomRound[0], topRound[0] ])
            geometryHub.add3Points([ topRound[0], [0, h3r, 0], topRound[i] ])
        }
    }

    const { points, uv, normals } = geometryHub.getCompletedGeometry()

    return {
        a_position: points,
        a_texcoord: uv,
        a_normal: normals,
    }
}
