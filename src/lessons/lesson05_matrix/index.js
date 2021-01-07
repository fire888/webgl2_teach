import { webglUtils } from '../../libs/webgl-utils'
import { webglLessonsUI } from '../../libs/webgl-lessons-ui'
import vertexShaderSource from './s.vert'
import fragmentShaderSource from './ss.frag'




function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }

    // Use our boilerplate utils to compile the shaders and link into a program
    var program = webglUtils.createProgramFromSources(gl,
        [vertexShaderSource, fragmentShaderSource]);


    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");




    /* POSITION ***********************************************/
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var positionBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const geomArr = new Float32Array([
        // left column
        0, 0,
        30, 0,
        0, 150,
        0, 150,
        30, 0,
        30, 150,

        // top rung
        30, 0,
        100, 0,
        30, 30,
        30, 30,
        100, 0,
        100, 30,

        // middle rung
        30, 60,
        67, 60,
        30, 90,
        30, 90,
        67, 60,
        67, 90,
    ])
    gl.bufferData(gl.ARRAY_BUFFER, geomArr, gl.STATIC_DRAW);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);


    // Draw the scene.
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Pass in the canvas resolution so we can convert from
        // pixels to clipspace in the shader
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // Set the color.
        gl.uniform4fv(colorLocation, color);

        // Compute the matrices
        var translationMatrix = m3.translation(translation[0], translation[1]);
        var rotationMatrix = m3.rotation(rotationInRadians);
        var scaleMatrix = m3.scaling(scale[0], scale[1]);

        // Starting Matrix.
        //var matrix = m3.identity();
        var matrix = m3.test();

        for (var i = 0; i < 5; ++i) {
             // Multiply the matrices.
             matrix = m3.multiply(matrix, translationMatrix);
             matrix = m3.multiply(matrix, rotationMatrix);
             matrix = m3.multiply(matrix, scaleMatrix);

            // Set the matrix.
            gl.uniformMatrix3fv(matrixLocation, false, matrix);

            // Draw the geometry.
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 18;
            gl.drawArrays(primitiveType, offset, count);
        }
    }



    // First let's make some variables
    // to hold the translation,
    var translation = [60, 40];
    var rotationInRadians = -10 * Math.PI / 180;
    var scale = [0.85, 0.85];

    // Setup a ui.
    webglLessonsUI.setupSlider("#x",      {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y",      {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angle",  {value: rotationInRadians * 180 / Math.PI | 0, slide: updateAngle, max: 360});
    webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

    function updatePosition(index) {
        return function(event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        rotationInRadians = angleInDegrees * Math.PI / 180;
        drawScene();
    }

    function updateScale(index) {
        return function(event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }

    drawScene();
}



var m3 = {
    test: () =>
        // [
        //     1, 0.2, 0,
        //     -.2, 1, 0,
        //    300, 300, 0,
        // ],
    // [
    //     1, 0.2, 0,
    //     -.2, 1, 0,
    //    300, 300, 1,
    // ],
    //
    // [
    //     .2, 0, 0,
    //     0, .2, 0,
    //     0, 0, 0,
    // ],

    [
        0, .2, 0,
        -.2, 0, 0,
        300, 50, 1,
    ],


    identity: function identity() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    },

    translation: function translation(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    },

    rotation: function rotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    },

    scaling: function scaling(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    },

    multiply: function multiply(a, b) {
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];

        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
};

main();
