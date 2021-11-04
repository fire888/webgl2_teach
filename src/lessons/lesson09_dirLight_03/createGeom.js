
/** GEOMETRY */

const XL = -.1
const XR = .1
const YB = -.1
const YT = .1
const ZF = .1
const ZB = -.1

export const createPoints = () => ({
    points: new Float32Array([
        // FRONT
        XL, YT, ZF,
        XR, YT, ZF,
        XL, YB, ZF,

        XR, YT, ZF,
        XR, YB, ZF,
        XL, YB, ZF,

        // BACK
        XR, YT, ZB,
        XL, YT, ZB,
        XR, YB, ZB,

        XL, YT, ZB,
        XL, YB, ZB,
        XR, YB, ZB,

        // RIGHT
        XR, YT, ZF,
        XR, YT, ZB,
        XR, YB, ZF,
        //
        XR, YT, ZB,
        XR, YB, ZB,
        XR, YB, ZF,
        //
        // LEFT
        XL, YT, ZB,
        XL, YT, ZF,
        XL, YB, ZF,
        //
        XL, YT, ZB,
        XL, YB, ZF,
        XL, YB, ZB,
        //
        // // TOP
        XL, YB, ZF,
        XR, YB, ZF,
        XL, YB, ZB,
        //
        XR, YB, ZF,
        XR, YB, ZB,
        XL, YB, ZB,
        //
        // // BOTTOM
        XL, YT, ZB,
        XR, YT, ZB,
        XL, YT, ZF,
        //
        XR, YT, ZB,
        XR, YT, ZF,
        XL, YT, ZF,
    ]),

    colors: new Float32Array([
        // FRONT
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // BACK
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // RIGHT
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        // LEFT
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,

        1, 0, 1,
        1, 0, 1,
        1, 0, 1,

        // TOP
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        // BOTTOM
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,

        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
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