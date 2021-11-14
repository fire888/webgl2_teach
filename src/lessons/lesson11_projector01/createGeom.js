

const { PI, sin, cos } = Math
const PI2 = PI * 2
const arrPoses = []
const center = [0, 0, 0]
const nums = 20
const offset1 = 1
const offset2 = .3
const offset3 = .5

for (let i = 0; i < nums; i++) {
    arrPoses.push(
        sin(i / nums * PI2) * offset1,             cos(i / nums * PI2) * offset1,              0,
        sin(i / nums * PI2) * (offset1 + offset2), cos(i / nums * PI2) * (offset1 + offset2),  0,
    )
}

const arrPosesGeom = []
const arrPosesNormals = []
for (let i = 0; i < arrPoses.length; i += 6) {
    if (arrPoses[i + 6]) {
        arrPosesGeom.push(
            arrPoses[i + 0],    arrPoses[i + 1],    arrPoses[i + 2],
            arrPoses[i + 6],    arrPoses[i + 7],    arrPoses[i + 8],
            arrPoses[i + 3],    arrPoses[i + 4],    arrPoses[i + 5],

            arrPoses[i + 6],    arrPoses[i + 7],    arrPoses[i + 8],
            arrPoses[i + 9],    arrPoses[i + 10],   arrPoses[i + 11],
            arrPoses[i + 3],    arrPoses[i + 4],    arrPoses[i + 5],
        )
    } else {
        const n = arrPoses.length - 1

        console.log(arrPoses[n])
        arrPosesGeom.push(
            arrPoses[i + 0],    arrPoses[i + 1],    arrPoses[i + 2],
            arrPoses[0],        arrPoses[1],        arrPoses[2],
            arrPoses[i + 3],    arrPoses[i + 4],    arrPoses[i + 5],

            arrPoses[0],        arrPoses[1],        arrPoses[2],
            arrPoses[3],        arrPoses[4],        arrPoses[5],
            arrPoses[i + 3],    arrPoses[i + 4],    arrPoses[i + 5],
        )
    }

    arrPosesNormals.push(
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    )

}

export const createPoints = () => ({
    points: new Float32Array(arrPosesGeom),
    normals: new Float32Array(arrPosesNormals),
})













//
//
//
// const dataElements = [
//     /// FRONT SIDE
//
//     // CORNER LEFT TOP
//     {
//         offset: [-.9, .9, .9],
//         isFront: true, isBack: false, isTop: true, isBottom: false, isLeft: true, isRight: false,
//         w: .1, h: .2, t: .1,
//     },
//
//     // CORNER RIGHT TOP
//     {
//         offset: [.9, .9, .9],
//         isFront: true, isBack: false, isTop: true, isBottom: false, isLeft: false, isRight: true,
//         w: .1, h: .2, t: .1,
//     },
//
//     // CORNER LEFT BOTTOM
//     {
//         offset: [-.9, -.9, .9],
//         isFront: true, isBack: false, isTop: false, isBottom: true, isLeft: true, isRight: false,
//         w: .1, h: .1, t: .1,
//     },
//
//     // CORNER RIGHT BOTTOM
//     {
//         offset: [.9, -.9, .9],
//         isFront: true, isBack: false, isTop: false, isBottom: true, isLeft: false, isRight: true,
//         w: .1, h: .1, t: .1,
//     },
//
//     // TOP
//     {
//         offset: [0, .9, .9],
//         isFront: true, isBack: true, isTop: true, isBottom: true, isLeft: false, isRight: false,
//         w: 1.7, h: .2, t: .1,
//     },
//     // BOTTOM
//     {
//         offset: [0, -.9, .9],
//         isFront: true, isBack: true, isTop: true, isBottom: true, isLeft: false, isRight: false,
//         w: 1.7, h: .1, t: .1,
//     },
//     // LEFT
//     {
//         offset: [-.9, 0, .9],
//         isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
//         w: .1, h: 1.7, t: .1,
//     },
//     // RIGHT
//     {
//         offset: [.9, 0, .9],
//         isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
//         w: .1, h: 1.7, t: .1,
//     },
//
//     ////////////// BACK SIDE
//
//
//     // CORNER LEFT TOP
//     {
//         offset: [-.9, .9, -.9],
//         isFront: false, isBack: true, isTop: true, isBottom: false, isLeft: true, isRight: false,
//         w: .1, h: .2, t: .1,
//     },
//
//     // CORNER RIGHT TOP
//     {
//         offset: [.9, .9, -.9],
//         isFront: false, isBack: true, isTop: true, isBottom: false, isLeft: false, isRight: true,
//         w: .1, h: .2, t: .1,
//     },
//
//     // CORNER LEFT BOTTOM
//     {
//         offset: [-.9, -.9, -.9],
//         isFront: false, isBack: true, isTop: false, isBottom: true, isLeft: true, isRight: false,
//         w: .1, h: .1, t: .1,
//     },
//
//     // CORNER RIGHT BOTTOM
//     {
//         offset: [.9, -.9, -.9],
//         isFront: false, isBack: true, isTop: false, isBottom: true, isLeft: false, isRight: true,
//         w: .1, h: .1, t: .1,
//     },
//
//     // TOP
//     {
//         offset: [0, .9, -.9],
//         isFront: true, isBack: true, isTop: true, isBottom: true, isLeft: false, isRight: false,
//         w: 1.7, h: .2, t: .1,
//     },
//     // BOTTOM
//     {
//         offset: [0, -.9, -.9],
//         isFront: true, isBack: true, isTop: true, isBottom: true, isLeft: false, isRight: false,
//         w: 1.7, h: .1, t: .1,
//     },
//     // LEFT
//     {
//         offset: [-.9, 0, -.9],
//         isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
//         w: .1, h: 1.7, t: .1,
//     },
//     // RIGHT
//     {
//         offset: [.9, 0, -.9],
//         isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
//         w: .1, h: 1.7, t: .1,
//     },
//
//     //////////////////////////////////////// CONNECT
//
//     // LEFT TOP
//     {
//         offset: [-.9, .9, 0],
//         isFront: false, isBack: false, isTop: true, isBottom: true, isLeft: true, isRight: true,
//         w: .1, h: .2, t: 1.7,
//     },
//     // RIGHT TOP
//     {
//         offset: [.9, .9, 0],
//         isFront: false, isBack: false, isTop: true, isBottom: true, isLeft: true, isRight: true,
//         w: .1, h: .2, t: 1.7,
//     },
//     // LEFT BOTTOM
//     {
//         offset: [-.9, -.9, 0],
//         isFront: false, isBack: false, isTop: true, isBottom: true, isLeft: true, isRight: true,
//         w: .1, h: .1, t: 1.7,
//     },
//     // RIGHT BOTTOM
//     {
//         offset: [.9, -.9, 0],
//         isFront: false, isBack: false, isTop: true, isBottom: true, isLeft: true, isRight: true,
//         w: .1, h: .1, t: 1.7,
//     },
// ]
//
// const createPointsFromData = data => {
//     const arrPoints = []
//     const arrNormals = []
//
//
//     for (let i = 0; i < data.length; i++) {
//         const {
//             offset,
//             isFront, isBack, isTop, isBottom, isLeft, isRight,
//             w, h, t,
//         } = data[i]
//
//         const hW = w / 2
//         const hH = h / 2
//         const hT = t / 2
//
//         if (isFront) {
//             arrPoints.push(
//                 offset[0] - hW,     offset[1] - hH,     offset[2] + hT,
//                 offset[0] + hW,     offset[1] - hH,     offset[2] + hT,
//                 offset[0] - hW,     offset[1] + hH,     offset[2] + hT,
//
//                 offset[0] + hW,     offset[1] - hH,     offset[2] + hT,
//                 offset[0] + hW,     offset[1] + hH,     offset[2] + hT,
//                 offset[0] - hW,     offset[1] + hH,     offset[2] + hT,
//             )
//
//             arrNormals.push(
//                 0, 0, 1,
//                 0, 0, 1,
//                 0, 0, 1,
//
//                 0, 0, 1,
//                 0, 0, 1,
//                 0, 0, 1,
//             )
//         }
//
//         if (isBack) {
//             arrPoints.push(
//                 offset[0] + hW,     offset[1] - hH,     offset[2] - hT,
//                 offset[0] - hW,     offset[1] - hH,     offset[2] - hT,
//                 offset[0] + hW,     offset[1] + hH,     offset[2] - hT,
//
//                 offset[0] - hW,     offset[1] - hH,     offset[2] - hT,
//                 offset[0] - hW,     offset[1] + hH,     offset[2] - hT,
//                 offset[0] + hW,     offset[1] + hH,     offset[2] - hT,
//             )
//
//             arrNormals.push(
//                 0, 0, -1,
//                 0, 0, -1,
//                 0, 0, -1,
//
//                 0, 0, -1,
//                 0, 0, -1,
//                 0, 0, -1,
//             )
//         }
//
//         if (isTop) {
//             arrPoints.push(
//                 offset[0] - hW,     offset[1] + hH,     offset[2] + hT,
//                 offset[0] + hW,     offset[1] + hH,     offset[2] + hT,
//                 offset[0] - hW,     offset[1] + hH,     offset[2] - hT,
//
//                 offset[0] + hW,     offset[1] + hH,     offset[2] + hT,
//                 offset[0] + hW,     offset[1] + hH,     offset[2] - hT,
//                 offset[0] - hW,     offset[1] + hH,     offset[2] - hT,
//             )
//
//             arrNormals.push(
//                 0, 1, 0,
//                 0, 1, 0,
//                 0, 1, 0,
//
//                 0, 1, 0,
//                 0, 1, 0,
//                 0, 1, 0,
//             )
//         }
//
//
//         if (isBottom) {
//             arrPoints.push(
//                 offset[0] - hW,     offset[1] - hH,     offset[2] - hT,
//                 offset[0] + hW,     offset[1] - hH,     offset[2] - hT,
//                 offset[0] - hW,     offset[1] - hH,     offset[2] + hT,
//
//                 offset[0] + hW,     offset[1] - hH,     offset[2] - hT,
//                 offset[0] + hW,     offset[1] - hH,     offset[2] + hT,
//                 offset[0] - hW,     offset[1] - hH,     offset[2] + hT,
//             )
//
//             arrNormals.push(
//                 0, -1, 0,
//                 0, -1, 0,
//                 0, -1, 0,
//
//                 0, -1, 0,
//                 0, -1, 0,
//                 0, -1, 0,
//             )
//         }
//
//
//         if (isLeft) {
//             arrPoints.push(
//                 offset[0] - hW,     offset[1] - hH,     offset[2] - hT,
//                 offset[0] - hW,     offset[1] - hH,     offset[2] + hT,
//                 offset[0] - hW,     offset[1] + hH,     offset[2] - hT,
//
//                 offset[0] - hW,     offset[1] - hH,     offset[2] + hT,
//                 offset[0] - hW,     offset[1] + hH,     offset[2] + hT,
//                 offset[0] - hW,     offset[1] + hH,     offset[2] - hT,
//             )
//
//             arrNormals.push(
//                 -1, 0, 0,
//                 -1, 0, 0,
//                 -1, 0, 0,
//
//                 -1, 0, 0,
//                 -1, 0, 0,
//                 -1, 0, 0,
//             )
//         }
//
//
//         if (isRight) {
//             arrPoints.push(
//                 offset[0] + hW,     offset[1] - hH,     offset[2] + hT,
//                 offset[0] + hW,     offset[1] - hH,     offset[2] - hT,
//                 offset[0] + hW,     offset[1] + hH,     offset[2] + hT,
//
//                 offset[0] + hW,     offset[1] - hH,     offset[2] - hT,
//                 offset[0] + hW,     offset[1] + hH,     offset[2] - hT,
//                 offset[0] + hW,     offset[1] + hH,     offset[2] + hT,
//             )
//
//             arrNormals.push(
//                 1, 0, 0,
//                 1, 0, 0,
//                 1, 0, 0,
//
//                 1, 0, 0,
//                 1, 0, 0,
//                 1, 0, 0,
//             )
//         }
//     }
//
//     return {
//         points: arrPoints,
//         normals: arrNormals,
//     }
// }
//
// /** main ***********************/
//
// const poses = [[0, 0, 0]]
// //for (let i = -4.9; i < 5; i+=2.3) {
// //    for (let j = -4.5; j < 6; j+=2.3) {
// //        for (let k = -4.5; k < 6; k+=2.3) {
// //            poses.push([i, j, k])
// //        }
// //    }
// //}
//
// let arrPoints = []
// let arrNormals = []
//
// const createBox = pos => {
//     const arr = []
//     for (let i = 0; i < dataElements.length; ++i) {
//         arr.push({ ...dataElements[i] })
//         arr[i].offset = [
//             dataElements[i].offset[0] + pos[0],
//             dataElements[i].offset[1] + pos[1],
//             dataElements[i].offset[2] + pos[2],
//         ]
//     }
//
//     const { points, normals } = createPointsFromData(arr)
//     arrPoints = arrPoints.concat(points)
//     arrNormals = arrNormals.concat(normals)
// }
//
//
// for (let i = 0; i < poses.length; i++) {
//     createBox(poses[i])
// }






