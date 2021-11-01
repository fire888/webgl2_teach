


/** MATH HELPERS ****************/

export const m4 = {
    normalize: (v, dst) => {
        dst = dst || new Float32Array(3);
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // make sure we don't divide by 0.
        if (length > 0.00001) {
            dst[0] = v[0] / length;
            dst[1] = v[1] / length;
            dst[2] = v[2] / length;
        }
        return dst;
    },

    persp: (fovRad, aspect, near, far) => {
        const f = Math.tan(Math.PI * .5 - .5 * fovRad)
        const range = 1. / (near - far)

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * range, 1.2,
            0, 0, near * far * range * 2, 0,
        ]
    },

    move: (tx, ty, tz) => [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1,
    ],

    rotX: rad => {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ]
    },

    rotY: rad => {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ]
    },

    rotZ: rad => {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        return [
            c, s, 0, 0,
            -s, c , 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
    },

    scaling: function(sx, sy, sz) {
        return [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ];
    },

    mult: (a, b) => {
        const
            a00 = a[0 * 4 + 0],
            a01 = a[0 * 4 + 1],
            a02 = a[0 * 4 + 2],
            a03 = a[0 * 4 + 3],
            a10 = a[1 * 4 + 0],
            a11 = a[1 * 4 + 1],
            a12 = a[1 * 4 + 2],
            a13 = a[1 * 4 + 3],
            a20 = a[2 * 4 + 0],
            a21 = a[2 * 4 + 1],
            a22 = a[2 * 4 + 2],
            a23 = a[2 * 4 + 3],
            a30 = a[3 * 4 + 0],
            a31 = a[3 * 4 + 1],
            a32 = a[3 * 4 + 2],
            a33 = a[3 * 4 + 3]

        const
            b00 = b[0 * 4 + 0],
            b01 = b[0 * 4 + 1],
            b02 = b[0 * 4 + 2],
            b03 = b[0 * 4 + 3],
            b10 = b[1 * 4 + 0],
            b11 = b[1 * 4 + 1],
            b12 = b[1 * 4 + 2],
            b13 = b[1 * 4 + 3],
            b20 = b[2 * 4 + 0],
            b21 = b[2 * 4 + 1],
            b22 = b[2 * 4 + 2],
            b23 = b[2 * 4 + 3],
            b30 = b[3 * 4 + 0],
            b31 = b[3 * 4 + 1],
            b32 = b[3 * 4 + 2],
            b33 = b[3 * 4 + 3]

        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ]
    },

    inverse: function(m) {
        var m00 = m[0 * 4 + 0];
        var m01 = m[0 * 4 + 1];
        var m02 = m[0 * 4 + 2];
        var m03 = m[0 * 4 + 3];
        var m10 = m[1 * 4 + 0];
        var m11 = m[1 * 4 + 1];
        var m12 = m[1 * 4 + 2];
        var m13 = m[1 * 4 + 3];
        var m20 = m[2 * 4 + 0];
        var m21 = m[2 * 4 + 1];
        var m22 = m[2 * 4 + 2];
        var m23 = m[2 * 4 + 3];
        var m30 = m[3 * 4 + 0];
        var m31 = m[3 * 4 + 1];
        var m32 = m[3 * 4 + 2];
        var m33 = m[3 * 4 + 3];
        var tmp_0  = m22 * m33;
        var tmp_1  = m32 * m23;
        var tmp_2  = m12 * m33;
        var tmp_3  = m32 * m13;
        var tmp_4  = m12 * m23;
        var tmp_5  = m22 * m13;
        var tmp_6  = m02 * m33;
        var tmp_7  = m32 * m03;
        var tmp_8  = m02 * m23;
        var tmp_9  = m22 * m03;
        var tmp_10 = m02 * m13;
        var tmp_11 = m12 * m03;
        var tmp_12 = m20 * m31;
        var tmp_13 = m30 * m21;
        var tmp_14 = m10 * m31;
        var tmp_15 = m30 * m11;
        var tmp_16 = m10 * m21;
        var tmp_17 = m20 * m11;
        var tmp_18 = m00 * m31;
        var tmp_19 = m30 * m01;
        var tmp_20 = m00 * m21;
        var tmp_21 = m20 * m01;
        var tmp_22 = m00 * m11;
        var tmp_23 = m10 * m01;

        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        return [
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ];
    },

    translate:  (m, tx, ty, tz, dst) => {
        // This is the optimized version of
        // return multiply(m, translation(tx, ty, tz), dst);
        dst = new Float32Array(16);

        var m00 = m[0];
        var m01 = m[1];
        var m02 = m[2];
        var m03 = m[3];
        var m10 = m[1 * 4 + 0];
        var m11 = m[1 * 4 + 1];
        var m12 = m[1 * 4 + 2];
        var m13 = m[1 * 4 + 3];
        var m20 = m[2 * 4 + 0];
        var m21 = m[2 * 4 + 1];
        var m22 = m[2 * 4 + 2];
        var m23 = m[2 * 4 + 3];
        var m30 = m[3 * 4 + 0];
        var m31 = m[3 * 4 + 1];
        var m32 = m[3 * 4 + 2];
        var m33 = m[3 * 4 + 3];

        if (m !== dst) {
            dst[ 0] = m00;
            dst[ 1] = m01;
            dst[ 2] = m02;
            dst[ 3] = m03;
            dst[ 4] = m10;
            dst[ 5] = m11;
            dst[ 6] = m12;
            dst[ 7] = m13;
            dst[ 8] = m20;
            dst[ 9] = m21;
            dst[10] = m22;
            dst[11] = m23;
        }

        dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
        dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
        dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
        dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

        return dst;
    },
}

// function inverse(m, dst) {
//     dst = dst || new Float32Array(16);
//     var m00 = m[0 * 4 + 0];
//     var m01 = m[0 * 4 + 1];
//     var m02 = m[0 * 4 + 2];
//     var m03 = m[0 * 4 + 3];
//     var m10 = m[1 * 4 + 0];
//     var m11 = m[1 * 4 + 1];
//     var m12 = m[1 * 4 + 2];
//     var m13 = m[1 * 4 + 3];
//     var m20 = m[2 * 4 + 0];
//     var m21 = m[2 * 4 + 1];
//     var m22 = m[2 * 4 + 2];
//     var m23 = m[2 * 4 + 3];
//     var m30 = m[3 * 4 + 0];
//     var m31 = m[3 * 4 + 1];
//     var m32 = m[3 * 4 + 2];
//     var m33 = m[3 * 4 + 3];
//     var tmp_0  = m22 * m33;
//     var tmp_1  = m32 * m23;
//     var tmp_2  = m12 * m33;
//     var tmp_3  = m32 * m13;
//     var tmp_4  = m12 * m23;
//     var tmp_5  = m22 * m13;
//     var tmp_6  = m02 * m33;
//     var tmp_7  = m32 * m03;
//     var tmp_8  = m02 * m23;
//     var tmp_9  = m22 * m03;
//     var tmp_10 = m02 * m13;
//     var tmp_11 = m12 * m03;
//     var tmp_12 = m20 * m31;
//     var tmp_13 = m30 * m21;
//     var tmp_14 = m10 * m31;
//     var tmp_15 = m30 * m11;
//     var tmp_16 = m10 * m21;
//     var tmp_17 = m20 * m11;
//     var tmp_18 = m00 * m31;
//     var tmp_19 = m30 * m01;
//     var tmp_20 = m00 * m21;
//     var tmp_21 = m20 * m01;
//     var tmp_22 = m00 * m11;
//     var tmp_23 = m10 * m01;
//
//     var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
//         (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
//     var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
//         (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
//     var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
//         (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
//     var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
//         (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
//
//     var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
//
//     dst[0] = d * t0;
//     dst[1] = d * t1;
//     dst[2] = d * t2;
//     dst[3] = d * t3;
//     dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
//         (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
//     dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
//         (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
//     dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
//         (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
//     dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
//         (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
//     dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
//         (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
//     dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
//         (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
//     dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
//         (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
//     dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
//         (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
//     dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
//         (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
//     dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
//         (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
//     dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
//         (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
//     dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
//         (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
//
//     return dst;
// }