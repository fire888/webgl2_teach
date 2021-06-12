



export function createPath (val = 0) {
    startW = val

    const road = createRoad()
    const polygons = createPoligonsOfRoad(road)
    const arrToExportColor1 = prepareArrToExportRoad(polygons.arrColor1)
    const arrToExportColor2 = prepareArrToExportRoad(polygons.arrColor2)
    const arrToExportTopBevelColor3 = prepareArrToExportRoad(polygons.arrTopBevelColor)
    const arrToExportTopBevelColor4 = prepareArrToExportRoad(polygons.arrBottomBevelColor)
    return {
        arrGeom1: arrToExportColor1,
        arrGeom2: arrToExportColor2,
        arrGeom0: arrToExportTopBevelColor3,
        arrGeom01: arrToExportTopBevelColor4,
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
        const w = ((Math.sin(currentW) + 2) / 12  ) * capStart

        const topPoint = [Math.sin(d) * (currentR + w), Math.cos(d) * (currentR + w)]
        arrTop.push([topPoint[0], topPoint[1]])
        arrTopBevel.push([topPoint[0] + bevelOffset[0], topPoint[1] + bevelOffset[1]])

        const bottomPoint = [Math.sin(d) * (currentR - w), Math.cos(d) * (currentR - w)]
        arrBottom.push([bottomPoint[0], bottomPoint[1]])
        arrBottomBevel.push([bottomPoint[0] + bevelOffset[0], bottomPoint[1] + bevelOffset[1]])
    }
    return { arrTop, arrBottom, arrTopBevel, arrBottomBevel }
}



function createPoligonsOfRoad(data) {
    const { arrTop, arrBottom,  arrTopBevel, arrBottomBevel } = data
    const arrTopBevelColor = []
    const arrBottomBevelColor = []

    const arrColor1 = []
    const arrColor2 = []
    for (let i = 0; i < arrTop.length; i += 2) {
        if (!arrTop[i + 2]) continue;

        const [ p1, p2 ] = createPolygon(arrTop[i], arrBottom[i], arrTop[i + 1], arrBottom[i + 1])
        arrColor1.push(p1, p2)

        const [ p3, p4 ] = createPolygon(arrTop[i + 1], arrBottom[i + 1], arrTop[i + 2], arrBottom[i + 2])
        arrColor2.push(p3, p4)


        const [ p5, p6 ] = createPolygon(arrTop[i], arrTopBevel[i], arrTop[i + 1], arrTopBevel[i + 1])
        arrTopBevelColor.push(p5, p6)


        const [ p7, p8 ] = createPolygon(arrBottom[i], arrBottomBevel[i], arrBottom[i + 1], arrBottomBevel[i + 1])
        arrBottomBevelColor.push(p7, p8)

    }
    return { arrColor1, arrColor2, arrTopBevelColor, arrBottomBevelColor }
}

function createPolygon(coord1, coord2, coord3, coord4) {
    return [
        [
            [ coord1[0], coord1[1] ],
            [ coord2[0], coord2[1] ],
            [ coord3[0], coord3[1] ],
        ],
        [
            [ coord3[0], coord3[1] ],
            [ coord2[0], coord2[1] ],
            [ coord4[0], coord4[1] ],
        ]
    ]
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
