
export function createPath (val = 0) {
    startW = val

    const road = createRoad()
    const polygons = createPoligonsOfRoad(road)
    const prepared = {}
    for (let key in polygons) {
        prepared[key] = prepareArrToExportRoad(polygons[key])
    }

    return { ...prepared }
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


    const geomTop01 = []
    const geomBevel01_00 = []
    const geomBevel01_01 = []
    const geomTop02 = []
    const geomBevel02_00 = []
    const geomBevel02_01 = []

    for (let i = 0; i < arrTop.length; i += 2) {
        if (!arrTop[i + 2]) continue;

        const [ p1, p2 ] = createPolygon(arrTop[i], arrBottom[i], arrTop[i + 1], arrBottom[i + 1])
        geomTop01.push(p1, p2)

        const [ p3, p4 ] = createPolygon(arrTop[i + 1], arrBottom[i + 1], arrTop[i + 2], arrBottom[i + 2])
        geomTop02.push(p3, p4)

        const [ p5, p6 ] = createPolygon(arrTop[i], arrTopBevel[i], arrTop[i + 1], arrTopBevel[i + 1])
        geomBevel01_00.push(p5, p6)

        const [ p5_1, p6_1 ] = createPolygon(arrTop[i + 1], arrTopBevel[i + 1], arrTop[i + 2], arrTopBevel[i + 2])
        geomBevel01_01.push(p5_1, p6_1)

        const [ p7, p8 ] = createPolygon(arrBottom[i], arrBottomBevel[i], arrBottom[i + 1], arrBottomBevel[i + 1])
        geomBevel02_00.push(p7, p8)

        const [ p7_1, p8_1 ] = createPolygon(arrBottom[i + 1], arrBottomBevel[i + 1], arrBottom[i + 2], arrBottomBevel[i + 2])
        geomBevel02_01.push(p7_1, p8_1)
    }
    return {
        geomTop01,
        geomBevel01_00,
        geomBevel01_01,
        geomTop02,
        geomBevel02_00,
        geomBevel02_01,
    }
}



function createPolygon(c1, c2, c3, c4) {
    return [
        [
            [ c1[0], c1[1] ],
            [ c2[0], c2[1] ],
            [ c3[0], c3[1] ],
        ],
        [
            [ c3[0], c3[1] ],
            [ c2[0], c2[1] ],
            [ c4[0], c4[1] ],
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
