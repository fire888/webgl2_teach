import vertexShaderSource from './shaders/first.vert'
import fragmentShaderSource from './shaders/first.frag'


const canvas = document.createElement('canvas')
canvas.width = 800
canvas.height = 800
document.body.appendChild(canvas)


var gl = canvas.getContext("webgl2")


function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}



function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}



var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
var program = createProgram(gl, vertexShader, fragmentShader);



var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,

    -0.5, -0.5,
    -0.5, 0,
    0, 0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);



var vao = gl.createVertexArray();
gl.bindVertexArray(vao);





var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionAttributeLocation);





var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)




gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);



function setTriangle (gl, x, y) {
    // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
    // whatever buffer is bound to the `ARRAY_BUFFER` bind point
    // but so far we only have one buffer. If we had more than one
    // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.
    const arr = new Float32Array([
        x, y,
        x + 0.1, y,
        x + 0.1, y + 0.1,
    ])
   
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW)
}


var colorLocation = gl.getUniformLocation(program, "u_color");

for (var ii = 0; ii < 50; ++ii) {
    // Setup a random rectangle
    setTriangle(gl, Math.random(), Math.random());
 
    // Set a random color.
    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
 
    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
}



