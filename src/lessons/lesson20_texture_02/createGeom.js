

const createGeometry = () => {
    const points = []
    const uv = []
    const normals = []

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

            //console.log(data)

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
            //console.log(points)
            return {
                points: new Float32Array(points),
                uv: new Float32Array(uv),
                normals: new Float32Array(normals),
            }
        },
        clear: () => {
            const points = []
            const uv = []
            const normals = []
        },
    }
}


const createrGeom = createGeometry()

const { PI, sin, cos } = Math
const PI2 = PI * 2

const h0 = -4
const h1 = -1
const h2 = 1
const h3 = 4
const count = 9
const R = 2.5

const bottomRound = (() => {
    const arr = []
    for (let i = 0; i < count; ++i) {
        arr.push([sin(PI2 * (i / count)) * R, h1, cos(PI2 * (i / count)) * R])
    }
    return arr
})()  

const topRound = (() => {
    const arr = []
    const offset = PI2 / count / 2
    for (let i = 0; i < count; ++i) {
        arr.push([sin(PI2 * (i / count) + offset) * R, h2, cos(PI2 * (i / count) + offset) * R])
    }
    return arr
})()

//console.log(bottomRound, topRound)





for (let i = 0; i < count; ++i) {
    if (i < count - 1) {
        createrGeom.add3Points([ bottomRound[i], [0, h0, 0], bottomRound[i + 1] ])
        createrGeom.add3Points([ bottomRound[i + 1], topRound[i], bottomRound[i] ])
        createrGeom.add3Points([ topRound[i], bottomRound[i + 1], topRound[i + 1] ])
        createrGeom.add3Points([ topRound[i + 1], [0, h3, 0], topRound[i] ])
    }
    if (i === count - 1) {
        createrGeom.add3Points([ bottomRound[i], [0, h0, 0], bottomRound[0] ])
        createrGeom.add3Points([ bottomRound[0], topRound[i], bottomRound[i] ]) 
        createrGeom.add3Points([ topRound[i], bottomRound[0], topRound[0] ]) 
        createrGeom.add3Points([ topRound[0], [0, h3, 0], topRound[i] ])
    }
}







/** **********************************************/

const createTexture = () => {
    const arr = [
        128, 0, 0,    128, 0, 0,   128, 0, 0,  
        70, 0, 0,    70, 0, 0,   70, 0, 0,   
        0, 50, 128,    0, 50, 128,     0, 50, 128,   
        70, 0, 0,    70, 0, 0,   70, 0, 0,   
        128, 0, 0,    128, 0, 0,   128, 0, 0,   
    ]
    return arr
}


/** ************************************************/



export const createPoints = () => {
    const { points, uv, normals } = createrGeom.getCompletedGeometry()
    return {
        points,
        texCoords: uv,
        normals,
        texture: new Uint8Array(createTexture())
    }
}
