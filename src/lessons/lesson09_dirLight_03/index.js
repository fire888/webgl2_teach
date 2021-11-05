/** https://webglfundamentals.org/webgl/lessons/ru/webgl-3d-lighting-directional.html */

import { vSh, fSh, easyShaderF, easyShaderV } from './shaders'
import { prepareGL } from './glUtils'
import { createPoints } from './createGeom'
import { m4 } from "./m4";


const { points, normals, colors } = createPoints()


const attributes = {
    'a_position': {
        name: 'a_position',
        getLocation: 'getAttribLocation',
        location: null,
        size: 3,
        type: 'FLOAT',
        dataForBuffer: points,
        buffer: null,
    },
    'a_color': {
        name: 'a_color',
        getLocation: 'getAttribLocation',
        location: null,
        size: 3,
        type: 'FLOAT',
        dataForBuffer: colors,
        buffer: null,
    },
    'a_normal': {
        name: 'a_normal',
        getLocation: 'getAttribLocation',
        location: null,
        size: 3,
        type: 'FLOAT',
        dataForBuffer: normals,
        buffer: null,
    },
}

const uniforms = {
    'u_worldViewProjection': {
        name: 'u_worldViewProjection',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniformMatrix4fv',
        val: null,
    },
    'u_world': {
        name: 'u_world',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniformMatrix4fv',
        val: null,
    },
    'u_reverseLightDirection': {
        name: 'u_reverseLightDirection',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniform3fv',
        val: null,
    }
}


const { PI } = Math
const PI2 = PI * 2

const X = [-.82, 0, .82]
const Y = [-.82, 0, .82]


function main() {
    const uGl = prepareGL()
    uGl.prepareProgram(easyShaderV, easyShaderF)

    for (let key in attributes) {
        const { location, buffer, bufferLength } = uGl.createBufferByData(attributes[key])
        Object.assign(attributes[key], { location, buffer, bufferLength })
    }
    uGl.setAttributes(attributes)

    for (let key in uniforms) {
        const { location } = uGl.getUniformLocation(uniforms[key])
        Object.assign(uniforms[key], { location })
    }


    uniforms['u_reverseLightDirection'].val = [-1., 3., 2.]

    const projectionMatrix = m4.perspective(1.8, 1, .01, 50)

    // Compute the camera's matrix
    var camera = [0, .5, 1];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(camera, target, up);

    var viewMatrix = m4.inverse(cameraMatrix);
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);


    // TODO: CHECK GEOM NORMALS
    const update = d => {
        uGl.prepareRender([0., 0., 0.3])

        var worldMatrix = m4.yRotation(d * 10);
        var worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);


        for (let i = 0; i , i < X.length; ++i) {
             for (let j = 0; j < Y.length; ++j) {
                uniforms['u_worldViewProjection'].val = worldViewProjectionMatrix ///m4.translate(worldViewProjectionMatrix, X[i], Y[j], 0)worldMatrix//m4.translate(worldViewProjectionMatrix, X[i], Y[j], -5)
                uniforms['u_world'].val = worldMatrix

                uGl.setUniforms(uniforms)
                uGl.render()
             }
        }
    }

    let d = 0
    const animate = () => {
        d += 0.001
        update(d)
        requestAnimationFrame(animate)
    }
    animate()

}

main()


