//let offset = [0, 0]

const
W = 0.05,
hW = W / 2,
length = .8,
segments = 200,
lenSegment = length / segments



// export function createPath () {
//     const centralLine = createCentralLine()
//     const points = createPoints(centralLine)
//     const polygons = createPoligons(points)
//     const arrToExport = prepareArrToExport(polygons)
//     return arrToExport
// }

export function createPath (val = 0) {
    currentW = val
    const road = createRoad()
    const polygons = createPoligonsOfRoad(road)
    const arrToExportColor1 = prepareArrToExportRoad(polygons.arrColor1)
    const arrToExportColor2 = prepareArrToExportRoad(polygons.arrColor2)
    return {
        arrGeom1: arrToExportColor1,
        arrGeom2: arrToExportColor2,
    }
}



function createCentralLine() {
    const arr = []
    const start = 0
    for (let i = 0; i < segments; ++i) {
        arr.push([start + (i * lenSegment), 0])
    }
    return arr
}


const circles = 4
const len = 2 * Math.PI * circles
const stepLen = len / segments
const stepRadius = 1.5 / segments
const spdW = 0.7

let currentW = 0
let currentLen = 0
let currentR = 0


function createRoad() {
    const arrTop = []
    const arrBottom = []

    for (let i = 0; i < segments; ++i) {
        currentR += stepRadius
        currentLen += stepLen
        currentW += spdW
        const w = (Math.sin(currentW) + 2) / 20

        arrTop.push([Math.sin(currentLen) * (currentR + w), Math.cos(currentLen) * (currentR + w)])
        arrBottom.push([Math.sin(currentLen) * (currentR - w), Math.cos(currentLen) * (currentR - w)])
    }
    return { arrTop, arrBottom }
}

function createPoligonsOfRoad(data) {
    const { arrTop, arrBottom } = data
    const arrColor1 = []
    const arrColor2 = []
    for (let i = 0; i < arrTop.length; i += 2) {
        if (!arrTop[i + 2]) continue;

        const p1 = [
            [ arrTop[i][0],       arrTop[i][1]      ],
            [ arrBottom[i][0],    arrBottom[i][1]   ],
            [ arrTop[i + 1][0],   arrTop[i + 1][1]  ],
        ]

        const p2 = [
            [ arrTop[i + 1][0], arrTop[i + 1][1]       ],
            [ arrBottom[i][0], arrBottom[i][1]         ],
            [ arrBottom[i + 1][0], arrBottom[i + 1][1] ],
        ]

        arrColor1.push(p1, p2)

        const p3 = [
            [ arrTop[i + 1][0],       arrTop[i + 1][1]      ],
            [ arrBottom[i + 1][0],    arrBottom[i + 1][1]   ],
            [ arrTop[i + 2][0],   arrTop[i + 2][1]  ],
        ]

        const p4 = [
            [ arrTop[i + 2][0], arrTop[i + 2][1]   ],
            [ arrBottom[i + 1][0], arrBottom[i + 1][1]         ],
            [ arrBottom[i + 2][0], arrBottom[i + 2][1] ],
        ]

        arrColor2.push(p3, p4)
    }
    return { arrColor1, arrColor2 }
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




function createPoints(line) {
    const arr = []
    for (let i = 0; i < line.length; ++i) {
        arr.push(
            [line[i][0], line[i][1] - (width / 2)],
            [line[i][0], line[i][1] + (width / 2)],
        )
    }
    return arr
}

function createPoligons(points) {
    const arr = []
    for (let i = 0; i < points.length; i += 4) {

        const square_1 = [
            points[i][0], points[i][1],
            points[i + 1][0], points[i + 1][1],
            points[i + 2][0], points[i + 2][1],

            points[i + 2][0], points[i + 2][1],
            points[i + 1][0], points[i + 1][1],
            points[i + 3][0], points[i + 3][1],
        ]

        arr.push(square_1)

        if (points[i + 4]) {
            const square_2 = [
                points[i + 2][0], points[i + 2][1],
                points[i + 3][0], points[i + 3][1],
                points[i + 4][0], points[i + 4][1],

                points[i + 4][0], points[i + 4][1],
                points[i + 3][0], points[i + 3][1],
                points[i + 5][0], points[i + 5][1],
            ]

           // arr.push(square_2)
        }
    }

    return arr
}

function prepareArrToExport(poligons) {
    const arr = []
    for (let i = 0; i < poligons.length; ++i) {
        for (let j = 0; j < poligons[i].length; ++j) {
            arr.push(poligons[i][j])
        }
    }
    return arr
}