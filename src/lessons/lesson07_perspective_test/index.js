

function createWebGLUtils() {
    // VVV
    function loadShader(gl, shaderType, shaderSource) {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            const lastError = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }


    // VVVVV
    function createProgram(gl, shaders) {
        const program = gl.createProgram();
        shaders.forEach(function(shader) {
            gl.attachShader(program, shader);
        });
        gl.linkProgram(program);


        const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            const lastError = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }




    // VVVVV
    function createProgramFromScripts(
        gl, shaderScriptIds) {
        const shaders = [];
        const vS = loadShader(gl, gl.VERTEX_SHADER, shaderScriptIds[0])
        const fS = loadShader(gl, gl.FRAGMENT_SHADER, shaderScriptIds[1])
        shaders.push(vS, fS)
        return createProgram(gl, shaders);
    }

    return {
        createProgramFromScripts: createProgramFromScripts,
    };

}

const webglUtils = createWebGLUtils.call(window)




const vSSrc = `
attribute vec4 a_position;

uniform mat4 u_matrix;

void main() {
    gl_Position = u_matrix * a_position;
}`

const fSSrc = `
precision mediump float;

uniform vec4 u_color;
void main() {
    gl_FragColor = u_color;
}
`



function main() {
    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas)
    canvas.height =  canvas.width = 500
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, [vSSrc, fSSrc]);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // lookup uniforms
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // Create a buffer to put positions in
    var positionBuffer = gl.createBuffer();
    //Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put geometry data into buffer
    setGeometry(gl);
    function radToDeg(r) {
         return r * 180 / Math.PI;
    }

    function degToRad(d) {
         return d * Math.PI / 180;
    }

    var translation = [45, 150, 0];
    var rotation = [degToRad(40), degToRad(25), degToRad(325)];
    var scale = [1, 1, 1];
    var color = [Math.random(), Math.random(), Math.random(), 1];

    drawScene();

    // Draw the scene.
    function drawScene() {


         // Tell WebGL how to convert from clip space to pixels
         gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

         // Clear the canvas.
         gl.clear(gl.COLOR_BUFFER_BIT);

         // Tell it to use our program (pair of shaders)
         gl.useProgram(program);

         // Turn on the attribute
         gl.enableVertexAttribArray(positionLocation);

         // Bind the position buffer.
         gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

         // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
         var size = 3;          // 3 components per iteration
         var type = gl.FLOAT;   // the data is 32bit floats
         var normalize = false; // don't normalize the data
         var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
         var offset = 0;        // start at the beginning of the buffer
         gl.vertexAttribPointer(
             positionLocation, size, type, normalize, stride, offset);

         // set the color
         gl.uniform4fv(colorLocation, color);

         // Compute the matrices
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
         var count = 18;  // 6 triangles in the 'F', 3 points per triangle
         gl.drawArrays(primitiveType, offset, count);

    }
}

var m4 = {

    projection: function(width, height, depth) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ];
    },

    multiply: function(a, b) {
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
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
        ];
    },

    translation: function(tx, ty, tz) {
        return [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1,
        ];
    },

    xRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    },

    yRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    },

    zRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    },

    scaling: function(sx, sy, sz) {
        return [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ];
    },

    translate: function(m, tx, ty, tz) {
        return m4.multiply(m, m4.translation(tx, ty, tz));
    },

    xRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.xRotation(angleInRadians));
    },

    yRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.yRotation(angleInRadians));
    },

    zRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.zRotation(angleInRadians));
    },

    scale: function(m, sx, sy, sz) {
        return m4.multiply(m, m4.scaling(sx, sy, sz));
    },

};
// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column
            0,   0,  0,
            30,   0,  0,
            0, 150,  0,
            0, 150,  0,
            30,   0,  0,
            30, 150,  0,

            // top rung
            30,   0,  0,
            100,   0,  0,
            30,  30,  0,
            30,  30,  0,
            100,   0,  0,
            100,  30,  0,

            // middle rung
            30,  60,  0,
            67,  60,  0,
            30,  90,  0,
            30,  90,  0,
            67,  60,  0,
            67,  90,  0]),
        gl.STATIC_DRAW);
}

main();



