import { webglUtils } from '../../libs/webgl-utils'
import { webglLessonsUI } from '../../libs/webgl-lessons-ui'
import vertexShaderSource from './s.vert'
import fragmentShaderSource from './ss.frag'
import { ARR_VERTICIES, ARR_COLORS } from './buffers'
import { m4 } from '../../libs/m3'



function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }


    var program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);


    /** POSITIONS ****************************************************/
    var positionBuffer = gl.createBuffer();
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, ARR_VERTICIES, gl.STATIC_DRAW);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);




    /** COLORS ****************************************************/


    // and copy in the color values
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, ARR_COLORS, gl.STATIC_DRAW);
    var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    // Turn on the attribute
    gl.enableVertexAttribArray(colorAttributeLocation);
    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
    var normalize = true;  // convert from 0-255 to 0.0-1.0
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);


    /** TRANSLATE ****************************************************/

    // look up uniform locations
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");



    /** DRAW *********************************************************/
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // turn on depth testing
        gl.enable(gl.DEPTH_TEST);

        // tell webgl to cull faces
        gl.enable(gl.CULL_FACE);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Compute the matrix
        var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
        matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
        matrix = m4.xRotate(matrix, rotation[0]);
        matrix = m4.yRotate(matrix, rotation[1]);
        matrix = m4.zRotate(matrix, rotation[2]);
        matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 16 * 6;
        gl.drawArrays(primitiveType, offset, count);
    }




    /** UI **************************************/

    function radToDeg(r) {
        return r * 180 / Math.PI;
    }

    function degToRad(d) {
        return d * Math.PI / 180;
    }

    // First let's make some variables
    // to hold the translation,
    var translation = [45, 150, 0];
    var rotation = [degToRad(40), degToRad(25), degToRad(325)];
    var scale = [1, 1, 1];

    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#x",      {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y",      {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#z",      {value: translation[2], slide: updatePosition(2), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angleX", {value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
    webglLessonsUI.setupSlider("#angleY", {value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
    webglLessonsUI.setupSlider("#angleZ", {value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
    webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleZ", {value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});

    function updatePosition(index) {
        return function(event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    function updateRotation(index) {
        return function(event, ui) {
            var angleInDegrees = ui.value;
            var angleInRadians = degToRad(angleInDegrees);
            rotation[index] = angleInRadians;
            drawScene();
        };
    }

    function updateScale(index) {
        return function(event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }

}


main();