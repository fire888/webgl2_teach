

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

    if (i % 4 === 0) {
        arrPoses.push(
            sin(i / nums * PI2) * (offset1 + offset2), cos(i / nums * PI2) * (offset1 + offset2),  0,
            sin(i / nums * PI2) * (offset1 + offset2 + offset3), cos(i / nums * PI2) * (offset1 + offset2 + offset3),  0,

            sin((i + 1) / nums * PI2) * (offset1 + offset2), cos((i + 1) / nums * PI2) * (offset1 + offset2),  0,
            sin((i + 1) / nums * PI2) * (offset1 + offset2 + offset3), cos((i + 1) / nums * PI2) * (offset1 + offset2 + offset3),  0,
        )
    }
}

const arrPosesGeom = []
const arrPosesNormals = []
const arrTextureCoords = []
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

    arrTextureCoords.push(
        0, 0,
        0, 1,
        1, 0,
        0, 1,
        1, 1,
        1, 0,
    )
}


const createTexture = () => {
    const arr = [
        128, 0, 0,
        0, 0, 128,
        128, 0, 128,
        128, 128, 0,
    ]
    return arr
}

export const createPoints = () => ({
    points: new Float32Array(arrPosesGeom),
    texCoords: new Float32Array(arrTextureCoords),
    normals: new Float32Array(arrPosesNormals),
    texture: new Uint8Array(createTexture())
})









