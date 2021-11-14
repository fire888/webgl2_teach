

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
        getCompletedGeometry: () => {
            return {
                points: new Float32Array(points),
                uv: new Float32Array(uv),
                normals: new Float32Array(normals),
            }
        }
    }
}


const createrGeom = createGeometry()

const { PI, sin, cos } = Math
const PI2 = PI * 2
const R = 2.5


//help ring X
const t = 40
for (let i = 0; i < t; i ++) {
    if (i < t - 1) {
        createrGeom.add4Points([
            [ R * sin(i / t * PI2),        -.1,     R * cos(i / t * PI2), ],
            [ R * sin((i + 1) / t * PI2),  -.1,     R * cos((i + 1) / t * PI2) ],
            [ R * sin(i / t * PI2),        .1,      R * cos(i / t * PI2), ],
            [ R * sin((i + 1) / t * PI2),  .1,      R * cos((i + 1) / t * PI2) ],
        ])
    }
    else {
        createrGeom.add4Points([
            [ R * sin(i / t * PI2),        -.1,     R * cos(i / t * PI2), ],
            [ R * sin(0),  -.1,     R * cos(0) ],
            [ R * sin(i / t * PI2),        .1,      R * cos(i / t * PI2), ],
            [ R * sin(0),  .1,      R * cos(0) ],
        ])
    }
}
// help ring Y
for (let i = 0; i < t; i ++) {
    if (i < t - 1) {
        createrGeom.add4Points([
            [  .1, R * sin(i / t * PI2),             R * cos(i / t * PI2), ],
            [  .1, R * sin((i + 1) / t * PI2),      R * cos((i + 1) / t * PI2) ],
            [ -.1, R * sin(i / t * PI2),              R * cos(i / t * PI2), ],
            [ -.1,  R * sin((i + 1) / t * PI2),       R * cos((i + 1) / t * PI2) ],
        ])
    }
    else {
        createrGeom.add4Points([
            [ .1, R * sin(i / t * PI2),           R * cos(i / t * PI2), ],
            [ .1, R * sin(0),       R * cos(0) ],
            [ -.1,R * sin(i / t * PI2),              R * cos(i / t * PI2), ],
            [ -.1,R * sin(0),        R * cos(0) ],
        ])
    }
}


const nums = 20
const offset1 = .5
const offset2 = 2.
const quality = 3

for (let j = 0; j < quality - 1; j++) {
    const fStart = offset1 + (j * (offset2 / quality))
    const fEnd = offset1 + ((j + 1) * (offset2 / quality))

    for (let i = 0; i < nums; ++i) {
        if (i !== nums - 1) {
            const inner = []
            const outer = []
            {
                const d = (i / nums) * PI2
                const xInner = sin(d) * fStart
                const yInner = cos(d) * fStart
                const xOuter = sin(d) * fEnd
                const yOuter = cos(d) * fEnd

                const zInner = R * (cos(xInner / R) + cos(yInner / R)) / 2
                const zOuter = R * (cos(xOuter / R) + cos(yOuter / R)) / 2

                inner.push(xInner, yInner, zInner)
                outer.push(xOuter, yOuter, zOuter)
            }

            const innerNext = []
            const outerNext = []
            {
                const d = (i + 1 / nums) * PI2
                const xInner = sin(d) * fStart
                const yInner = cos(d) * fStart
                const xOuter = sin(d) * fEnd
                const yOuter = cos(d) * fEnd

                const zInner = R * (cos(xInner / R) + cos(yInner / R)) / 2
                const zOuter = R * (cos(xOuter / R) + cos(yOuter / R)) / 2

                innerNext.push(xInner, yInner, zInner)
                outerNext.push(xOuter, yOuter, zOuter)
            }



            createrGeom.add4Points([
                [...inner],
                [...outer],
                [...innerNext],
                [...outerNext],
            ])

        }

     // arrPoses.push(
     //     xInner, yInner,  zInner,
     //     xOuter, yOuter,  zOuter,
     // )






    }
}


//
// for (let i = 0; i < nums; i++) {
//     const d = (i / nums) * PI2
//     const  xInner = sin(d) * offset1
//     const  yInner = cos(d) * offset1
//     const  xOuter = sin(d) * (offset1 + offset2)
//     const  yOuter = cos(d) * (offset1 + offset2)
//
//     const zInner = R * (cos(xInner / R) + cos(yInner / R)) / 2
//     const zOuter = R * (cos(xOuter / R) + cos(yOuter / R)) / 2
//
//
//     arrPoses.push(
//         xInner, yInner,  zInner,
//         xOuter, yOuter,  zOuter,
//     )
// }











const createTexture = () => {
    const arr = [
        128, 0, 0,
        0, 0, 128,
        128, 0, 128,
        128, 128, 0,
    ]
    return arr
}



export const createPoints = () => {
    const { points, uv, normals } = createrGeom.getCompletedGeometry()
    return {
        points,
        texCoords: uv,
        normals,
        texture: new Uint8Array(createTexture())
    }
}









