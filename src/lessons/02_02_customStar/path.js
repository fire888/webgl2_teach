



export function createPath (val = 0) {
    startW = val

    const road = createRoad()
    const polygons = createPoligonsOfRoad(road)
    const arrToExportColor1 = prepareArrToExportRoad(polygons.arrColor1)
    const arrToExportColor2 = prepareArrToExportRoad(polygons.arrColor2)
    const arrToExportTopBevelColor3 = prepareArrToExportRoad(polygons.arrTopBevelColor)
    return {
        arrGeom1: arrToExportColor1,
        arrGeom2: arrToExportColor2,
        arrGeom0: arrToExportTopBevelColor3,
    }
}



let startW = 0
let start = 0

function createRoad() {
    const segments = 360
    const circles = 4
    const len = 2 * Math.PI * circles
    const stepLen = len / segments
    const stepRadius = 2 / segments
    const spdW = 0.7


    let currentLen = 0
    let currentR = 0


    const arrTop = []
    const arrTopBevel = []
    const arrBottom = []
    const arrBottomBevel = []

    let currentW = startW
    start = startW

    const bevelOffset = [-.05, -.1]

    for (let i = 0; i < segments; ++i) {
        currentR += stepRadius

        currentLen += stepLen
        const d = start / 10 + currentLen
        currentW -= spdW

        const capStart = Math.min(i / 100, 1)
        const w = ((Math.sin(currentW) + 2) / 15) * capStart

        const topPoint = [Math.sin(d) * (currentR + w), Math.cos(d) * (currentR + w)]
        arrTop.push([topPoint[0], topPoint[1]])
        arrTopBevel.push([topPoint[0] + bevelOffset[0], topPoint[1] + bevelOffset[1]])

        const bottomPoint = [Math.sin(d) * (currentR - w), Math.cos(d) * (currentR - w)]
        arrBottom.push([bottomPoint[0], bottomPoint[1]])
    }
    return { arrTop, arrBottom, arrTopBevel, arrBottomBevel }
}



function createPoligonsOfRoad(data) {
    const { arrTop, arrBottom,  arrTopBevel, arrBottomBevel } = data
    const arrTopBevelColor = []

    const arrColor1 = []
    const arrColor2 = []
    for (let i = 0; i < arrTop.length; i += 2) {
        if (!arrTop[i + 2]) continue;

        const p1 = [
            [ arrTop[i][0],         arrTop[i][1]       ],
            [ arrBottom[i][0],      arrBottom[i][1]    ],
            [ arrTop[i + 1][0],     arrTop[i + 1][1]   ],
        ]

        const p2 = [
            [ arrTop[i + 1][0],     arrTop[i + 1][1]    ],
            [ arrBottom[i][0],      arrBottom[i][1]     ],
            [ arrBottom[i + 1][0],  arrBottom[i + 1][1] ],
        ]

        arrColor1.push(p1, p2)



        const p3 = [
            [ arrTop[i + 1][0],     arrTop[i + 1][1]      ],
            [ arrBottom[i + 1][0],  arrBottom[i + 1][1]   ],
            [ arrTop[i + 2][0],     arrTop[i + 2][1]      ],
        ]

        const p4 = [
            [ arrTop[i + 2][0],     arrTop[i + 2][1]      ],
            [ arrBottom[i + 1][0],  arrBottom[i + 1][1]   ],
            [ arrBottom[i + 2][0],  arrBottom[i + 2][1]   ],
        ]

        arrColor2.push(p3, p4)


        const p5 = [
            [  arrTop[i][0],   arrTop[i][1]   ],
            [  arrTopBevel[i][0], arrTopBevel[i][1]  ],
            [  arrTop[i + 1][0], arrTop[i + 1][1]  ],
        ]

        const p6 = [
            [  arrTop[i+1][0],   arrTop[i+1][1]   ],
            [  arrTopBevel[i][0], arrTopBevel[i][1]  ],
            [  arrTopBevel[i + 1][0], arrTopBevel[i + 1][1]  ],
        ]

        arrTopBevelColor.push(p5, p6)

    }
    return { arrColor1, arrColor2, arrTopBevelColor }
}



function prepareArrToExportRoad(data) {
    const arr = []
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < data[i].length; ++j) {
            arr.push(data[i][j][0])
            arr.push(data[i][j][1])
        }
    }
    return arr
}
