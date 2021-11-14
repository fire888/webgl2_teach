

const dataElements = [
    // TOP CONNECTOR FRONT LEFT
    {
        offset: [-.9, 1.15, .9],
        isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
        w: .1, h: .4, t: .1,
    },

    // TOP CONNECTOR FRONT RIGHT
    {
        offset: [.9, 1.15, .9],
        isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
        w: .1, h: .4, t: .1,
    },
    // TOP CONNECTOR BACK LEFT
    {
        offset: [-.9, 1.15, -.9],
        isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
        w: .1, h: .4, t: .1,
    },

    // TOP CONNECTOR BACK RIGHT
    {
        offset: [.9, 1.15, -.9],
        isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
        w: .1, h: .4, t: .1,
    },

    // TOP CONNECTOR FRONT GOR
    {
        offset: [.9, .2, 1.15],
        isFront: false, isBack: false, isTop: true, isBottom: true, isLeft: true, isRight: true,
        w: .1, h: .1, t: .4,
    },
        
    // TOP CONNECTOR FRONT GOR LEFT
    {
        offset: [-1.15, .2, .9],
        isFront: true, isBack: true, isTop: true, isBottom: true, isLeft: false, isRight: false,
        w: .4, h: .1, t: .1,
    },


    /// FRONT SIDE
    

    // CORNER LEFT TOP
    {
        offset: [-.9, .9, .9],
        isFront: true, isBack: false, isTop: false, isBottom: false, isLeft: true, isRight: false,
        w: .1, h: .1, t: .1,
    },

    // CORNER RIGHT TOP
    {
        offset: [.9, .9, .9],
        isFront: true, isBack: false, isTop: true, isBottom: false, isLeft: false, isRight: true,
        w: .1, h: .1, t: .1,
    },

    // CORNER LEFT BOTTOM
    {
        offset: [-.9, -.9, .9],
        isFront: true, isBack: false, isTop: false, isBottom: true, isLeft: true, isRight: false,
        w: .1, h: .1, t: .1,
    },

    // CORNER RIGHT BOTTOM
    {
        offset: [.9, -.9, .9],
        isFront: true, isBack: false, isTop: false, isBottom: true, isLeft: false, isRight: true,
        w: .1, h: .1, t: .1,
    },

    // TOP
    {
        offset: [0, .9, .9],
        isFront: true, isBack: true, isTop: true, isBottom: true, isLeft: false, isRight: false,
        w: 1.7, h: .1, t: .1,
    },
    // BOTTOM
    {
        offset: [0, -.9, .9],
        isFront: true, isBack: true, isTop: true, isBottom: true, isLeft: false, isRight: false,
        w: 1.7, h: .1, t: .1,
    },
    // LEFT
    {
        offset: [-.9, 0, .9],
        isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
        w: .1, h: 1.7, t: .1,
    },
    // RIGHT
    {
        offset: [.9, 0, .9],
        isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
        w: .1, h: 1.7, t: .1,
    },

    ////////////// BACK SIDE


    // CORNER LEFT TOP
    {
        offset: [-.9, .9, -.9],
        isFront: false, isBack: true, isTop: true, isBottom: false, isLeft: true, isRight: false,
        w: .1, h: .1, t: .1,
    },

    // CORNER RIGHT TOP
    {
        offset: [.9, .9, -.9],
        isFront: false, isBack: true, isTop: true, isBottom: false, isLeft: false, isRight: true,
        w: .1, h: .1, t: .1,
    },

    // CORNER LEFT BOTTOM
    {
        offset: [-.9, -.9, -.9],
        isFront: false, isBack: true, isTop: false, isBottom: true, isLeft: true, isRight: false,
        w: .1, h: .1, t: .1,
    },

    // CORNER RIGHT BOTTOM
    {
        offset: [.9, -.9, -.9],
        isFront: false, isBack: true, isTop: false, isBottom: true, isLeft: false, isRight: true,
        w: .1, h: .1, t: .1,
    },

    // TOP
    {
        offset: [0, .9, -.9],
        isFront: true, isBack: true, isTop: true, isBottom: true, isLeft: false, isRight: false,
        w: 1.7, h: .1, t: .1,
    },
    // BOTTOM
    {
        offset: [0, -.9, -.9],
        isFront: true, isBack: true, isTop: true, isBottom: true, isLeft: false, isRight: false,
        w: 1.7, h: .1, t: .1,
    },
    // LEFT
    {
        offset: [-.9, 0, -.9],
        isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
        w: .1, h: 1.7, t: .1,
    },
    // RIGHT
    {
        offset: [.9, 0, -.9],
        isFront: true, isBack: true, isTop: false, isBottom: false, isLeft: true, isRight: true,
        w: .1, h: 1.7, t: .1,
    },

    //////////////////////////////////////// CONNECT

    // LEFT TOP
    {
        offset: [-.9, .9, 0],
        isFront: false, isBack: false, isTop: true, isBottom: true, isLeft: true, isRight: true,
        w: .1, h: .1, t: 1.7,
    },
    // RIGHT TOP
    {
        offset: [.9, .9, 0],
        isFront: false, isBack: false, isTop: true, isBottom: true, isLeft: true, isRight: true,
        w: .1, h: .1, t: 1.7,
    },
    // LEFT BOTTOM
    {
        offset: [-.9, -.9, 0],
        isFront: false, isBack: false, isTop: true, isBottom: true, isLeft: true, isRight: true,
        w: .1, h: .1, t: 1.7,
    },
    // RIGHT BOTTOM
    {
        offset: [.9, -.9, 0],
        isFront: false, isBack: false, isTop: true, isBottom: true, isLeft: true, isRight: true,
        w: .1, h: .1, t: 1.7,
    },
]

const createPointsFromData = data => {
    const arrPoints = []
    const arrNormals = []


    for (let i = 0; i < data.length; i++) {
        const {
            offset,
            isFront, isBack, isTop, isBottom, isLeft, isRight,
            w, h, t,
        } = data[i]

        const hW = w / 2
        const hH = h / 2
        const hT = t / 2

        if (isFront) {
            arrPoints.push(
                offset[0] - hW,     offset[1] - hH,     offset[2] + hT,
                offset[0] + hW,     offset[1] - hH,     offset[2] + hT,
                offset[0] - hW,     offset[1] + hH,     offset[2] + hT,

                offset[0] + hW,     offset[1] - hH,     offset[2] + hT,
                offset[0] + hW,     offset[1] + hH,     offset[2] + hT,
                offset[0] - hW,     offset[1] + hH,     offset[2] + hT,
            )

            arrNormals.push(
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,

                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
            )
        }

        if (isBack) {
            arrPoints.push(
                offset[0] + hW,     offset[1] - hH,     offset[2] - hT,
                offset[0] - hW,     offset[1] - hH,     offset[2] - hT,
                offset[0] + hW,     offset[1] + hH,     offset[2] - hT,

                offset[0] - hW,     offset[1] - hH,     offset[2] - hT,
                offset[0] - hW,     offset[1] + hH,     offset[2] - hT,
                offset[0] + hW,     offset[1] + hH,     offset[2] - hT,
            )

            arrNormals.push(
                0, 0, -1,
                0, 0, -1,
                0, 0, -1,

                0, 0, -1,
                0, 0, -1,
                0, 0, -1,
            )
        }

        if (isTop) {
            arrPoints.push(
                offset[0] - hW,     offset[1] + hH,     offset[2] + hT,
                offset[0] + hW,     offset[1] + hH,     offset[2] + hT,
                offset[0] - hW,     offset[1] + hH,     offset[2] - hT,

                offset[0] + hW,     offset[1] + hH,     offset[2] + hT,
                offset[0] + hW,     offset[1] + hH,     offset[2] - hT,
                offset[0] - hW,     offset[1] + hH,     offset[2] - hT,
            )

            arrNormals.push(
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,

                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
            )
        }


        if (isBottom) {
            arrPoints.push(
                offset[0] - hW,     offset[1] - hH,     offset[2] - hT,
                offset[0] + hW,     offset[1] - hH,     offset[2] - hT,
                offset[0] - hW,     offset[1] - hH,     offset[2] + hT,

                offset[0] + hW,     offset[1] - hH,     offset[2] - hT,
                offset[0] + hW,     offset[1] - hH,     offset[2] + hT,
                offset[0] - hW,     offset[1] - hH,     offset[2] + hT,
            )

            arrNormals.push(
                0, -1, 0,
                0, -1, 0,
                0, -1, 0,

                0, -1, 0,
                0, -1, 0,
                0, -1, 0,
            )
        }


        if (isLeft) {
            arrPoints.push(
                offset[0] - hW,     offset[1] - hH,     offset[2] - hT,
                offset[0] - hW,     offset[1] - hH,     offset[2] + hT,
                offset[0] - hW,     offset[1] + hH,     offset[2] - hT,

                offset[0] - hW,     offset[1] - hH,     offset[2] + hT,
                offset[0] - hW,     offset[1] + hH,     offset[2] + hT,
                offset[0] - hW,     offset[1] + hH,     offset[2] - hT,
            )

            arrNormals.push(
                -1, 0, 0,
                -1, 0, 0,
                -1, 0, 0,

                -1, 0, 0,
                -1, 0, 0,
                -1, 0, 0,
            )
        }


        if (isRight) {
            arrPoints.push(
                offset[0] + hW,     offset[1] - hH,     offset[2] + hT,
                offset[0] + hW,     offset[1] - hH,     offset[2] - hT,
                offset[0] + hW,     offset[1] + hH,     offset[2] + hT,

                offset[0] + hW,     offset[1] - hH,     offset[2] - hT,
                offset[0] + hW,     offset[1] + hH,     offset[2] - hT,
                offset[0] + hW,     offset[1] + hH,     offset[2] + hT,
            )

            arrNormals.push(
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,

                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
            )
        }
    }

    return {
        points: arrPoints,
        normals: arrNormals,
    }
}

/** main ***********************/

const poses = []
for (let i = -4.9; i < 5; i+=2.3) {
    for (let j = -4.5; j < 6; j+=2.3) {
        for (let k = -4.5; k < 6; k+=2.3) {
            poses.push([i, j, k])
        }
    }
}

let arrPoints = []
let arrNormals = []

const createBox = pos => {
    const arr = []
    for (let i = 0; i < dataElements.length; ++i) {
        arr.push({ ...dataElements[i] })
        arr[i].offset = [
            dataElements[i].offset[0] + pos[0],
            dataElements[i].offset[1] + pos[1],
            dataElements[i].offset[2] + pos[2],
        ]
    }

    const { points, normals } = createPointsFromData(arr)
    arrPoints = arrPoints.concat(points)
    arrNormals = arrNormals.concat(normals)
}


for (let i = 0; i < poses.length; i++) {
    createBox(poses[i])
}




export const createPoints = () => ({
    points: new Float32Array(arrPoints),
    normals: new Float32Array(arrNormals),
})

