const vShaderSrc =
`#version 300 es

in vec2 a_position;
uniform mat3 u_matrix;
void main() {
  vec3 pos = (u_matrix * vec3(a_position, 1.));
  gl_Position = vec4(pos, 1);
}
`

const fragmentShaderSource =
`#version 300 es

precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(1., 0., 0., 1.);
}
`


function createGl () {
    const canvas = document.createElement('canvas')
    const s = Math.min(window.innerWidth, window.innerHeight)
    canvas.width = canvas.height = s
    canvas.style.border = '1px solid #333333'
    document.body.style.textAlign = 'center'
    document.body.appendChild(canvas)
    return canvas.getContext('webgl2')
}



function createShader(gl, type, shaderSrc) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, shaderSrc)
    gl.compileShader(shader)
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
        return shader
    }
    console.log('shader error compile')
}

function createProgram (gl, vShader, fShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vShader)
    gl.attachShader(program, fShader)
    gl.linkProgram(program)
    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
        return program
    }
    console.log('compile program error')
}


var gl = createGl()
const vShader = createShader(gl, gl.VERTEX_SHADER, vShaderSrc)
const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
var program = createProgram(gl, vShader, fShader)

var matrixLocation = gl.getUniformLocation(program, "u_matrix");


var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var positionBuffer = gl.createBuffer()
gl.enableVertexAttribArray(positionAttributeLocation)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
const geomArr = new Float32Array([  0, 0,     0, .5,    .2, .5])
gl.bufferData(gl.ARRAY_BUFFER, geomArr, gl.STATIC_DRAW)
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

let d = 0

const tr = [0, 0]

function drawScene() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    var translationMatrix = [1, 0, 0,    0, 1, 0,   tr[0], tr[1], 1,]
    gl.uniformMatrix3fv(matrixLocation, false, translationMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 3)
}

const animate = () => {
    d += 0.05
    tr[0] = Math.sin(d) / 3
    tr[1] = Math.cos(d) / 3
    drawScene()
    requestAnimationFrame(animate)
}

animate()

