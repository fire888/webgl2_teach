
/** GEOMETRY */

const XL = -.3
const XR = .3
const YB = -.3
const YT = .3
const ZF = .3
const ZB = -.3

export const createPoints = () => ({
    points: new Float32Array([
        // FRONT
        XR, YT, ZF,
        XL, YB, ZF,
        XL, YT, ZF,

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

        // // RIGHT
        XR, YT, ZF,
        XR, YT, ZB,
        XR, YB, ZF,
        //
        XR, YT, ZB,
        XR, YB, ZB,
        XR, YB, ZF,

        // // LEFT
        XL, YT, ZB,
        XL, YT, ZF,
        XL, YB, ZF,

        XL, YT, ZB,
        XL, YB, ZF,
        XL, YB, ZB,

        // BOTTOM
        XL, YB, ZF,
        XR, YB, ZF,
        XL, YB, ZB,
        //
        XR, YB, ZF,
        XR, YB, ZB,
        XL, YB, ZB,
        // //
        // TOP
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
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,

        1, 1, 1,
        1, 1, 1,
        1, 1, 1,

        // BACK
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        // RIGHT
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        // LEFT
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        // TOP
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        // BOTTOM
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        1, 1, 0,
        1, 1, 0,
        1, 1, 0,
    ]),

/*
    colors: new Float32Array([
        // FRONT
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        // BACK
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // RIGHT
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,

        1, 1, 1,
        1, 1, 1,
        1, 1, 1,

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
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
    ]),
    */

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