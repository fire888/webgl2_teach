
/** GEOMETRY */

const XL = -2//1.5
const XR = 2//1.5
const YB = -2//1.5
const YT = 2//1.5
const ZF = 2//1.5
const ZB = -2//1.5

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
        XR, YB, ZB,
        XL, YB, ZB,
        XR, YT, ZB,

        XL, YB, ZB,
        XL, YT, ZB,
        XR, YT, ZB,

        // // LEFT
        XL, YB, ZB,
        XL, YB, ZF,
        XL, YT, ZB,

        XL, YB, ZF,
        XL, YT, ZF,
        XL, YT, ZB,

        // // RIGHT
        XR, YB, ZF,
        XR, YB, ZB,
        XR, YT, ZF,
        //
        XR, YB, ZB,
        XR, YT, ZB,
        XR, YT, ZF,

        // BOTTOM
        XL, YB, ZB,
        XR, YB, ZB,
        XL, YB, ZF,
        //
        XR, YB, ZB,
        XR, YB, ZF,
        XL, YB, ZF,
        // //
        // TOP
        XL, YT, ZF,
        XR, YT, ZF,
        XL, YT, ZB,
        //
        XR, YT, ZF,
        XR, YT, ZB,
        XL, YT, ZB,
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

        // BOTTOM
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        // TOP
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
    ]),
})