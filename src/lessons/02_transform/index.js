import { webglUtils } from '../../helpers/webgl-utils'
import { webglLessonsUI } from '../../helpers/webgl-ui'
import { m3 } from '../../helpers/m3'

import vs from './box.vert'
import fs from './box.frag'


"use strict";


function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  canvas.width = 800
  canvas.height = 800
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }



  // setup GLSL program
  var program = webglUtils.createProgramFromSources(gl, [vs, fs]);
  // Create set of attributes
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);




 // POSITIONS BUFFER **********************************/
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const arrPozes = new Float32Array([
      -150, -100,
      150, -100,
      -150,  100,
      150, -100,
      -150,  100,
      150,  100,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, arrPozes, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  var size = 2;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);





  // COLORS BUFFER **********************************/
  var colorLocation = gl.getAttribLocation(program, "a_color");
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Set the colors.
  const arrColors = new Float32Array([
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
  ])
  gl.bufferData(gl.ARRAY_BUFFER, arrColors, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(colorLocation);
  var size = 4;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);





  // UNIFORMS TRANSLATE ******************************/
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");




  // MAIN REDRAW *************************************/
  function drawScene() {
      webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      // Clear the canvas
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      // Tell it to use our program (pair of shaders)
      gl.useProgram(program);
  
      // Bind the attribute/buffer set we want.
      gl.bindVertexArray(vao);
  
      // Compute the matrices
      var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
      matrix = m3.translate(matrix, translation[0], translation[1]);
      matrix = m3.rotate(matrix, angleInRadians);
      matrix = m3.scale(matrix, scale[0], scale[1]);
  
      // Set the matrix.
      gl.uniformMatrix3fv(matrixLocation, false, matrix);
  
      // Draw the geometry.
      var offset = 0;
      var count = 6;
      gl.drawArrays(gl.TRIANGLES, offset, count);
  }


  // UI *************************************************/
  var translation = [200, 150];
  var angleInRadians = 0;
  var scale = [1, 1];

  // Setup a ui.
  webglLessonsUI.setupSlider("#x",      {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
  webglLessonsUI.setupSlider("#y",      {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
  webglLessonsUI.setupSlider("#angle",  {slide: updateAngle, max: 360});
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
    angleInRadians = angleInDegrees * Math.PI / 180;
    drawScene();
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      drawScene();
    };
  }


  // FIRST DRAW *****************************************/
  drawScene();
}

main();
