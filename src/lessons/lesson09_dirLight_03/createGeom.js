
/** GEOMETRY */

const XL = -.1
const XR = .1
const YB = .1
const YT = -.1
const ZF = .1
const ZB = -.1

export const createPoints = () => ({
    points: new Float32Array([
        // FRONT
        XL, YB, ZF,
        XR, YB, ZF,
        XL, YT, ZF,

        XR, YB, ZF,
        XR, YT, ZF,
        XL, YT, ZF,

        // BACK
        XL, YB, ZB,
        XR, YB, ZB,
        XL, YT, ZB,

        XR, YB, ZB,
        XR, YT, ZB,
        XL, YT, ZB,

        // RIGHT
        XR, YB, ZF,
        XR, YB, ZB,
        XR, YT, ZF,

        XR, YB, ZB,
        XR, YT, ZB,
        XR, YT, ZF,

        // LEFT
        XL, YB, ZB,
        XL, YB, ZF,
        XL, YT, ZF,

        XL, YB, ZB,
        XL, YT, ZF,
        XL, YT, ZB,

        // TOP
        XL, YT, ZF,
        XL, YT, ZB,
        XR, YT, ZB,

        XR, YT, ZB,
        XR, YT, ZF,
        XL, YT, ZF,

        // BOTTOM
        XL, YB, ZB,
        XL, YB, ZF,
        XR, YB, ZF,

        XR, YB, ZF,
        XR, YB, ZB,
        XL, YB, ZB,
    ]),

    normals: new Float32Array([
        // FRONT
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        // BACK
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        // LEFT
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        // RIGHT
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // TOP
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // BOTTOM
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

    ]),
})