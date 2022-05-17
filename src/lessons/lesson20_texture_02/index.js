/** https://webglfundamentals.org/webgl/lessons/ru/webgl-3d-lighting-point.html */

import { easyShaderF, easyShaderV } from './shaders'
import { prepareGL } from './glUtils'
import { createPoints } from './createGeom'
import { m4 } from "./m4";




const { points, normals, texCoords, texture,  } = createPoints()


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
    'a_texcoord': {
        name: 'a_texcoord',
        getLocation: 'getAttribLocation',
        location: null,
        size: 2,
        type: 'FLOAT',
        dataForBuffer: texCoords,
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
    'u_viewWorldPosition': {
        name: 'u_viewWorldPosition',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniform3fv',
        val: null,
    },
    'u_worldViewProjection': {
        name: 'u_worldViewProjection',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniformMatrix4fv',
        val: null,
    },
    'u_color': {
        name: 'u_color',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniform3fv',
        val: [1., 1., 1.],
    },
}




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

    uGl.createTextureByData({ arrTexture: texture, width: 3, height: 5 })

    // image.addEventListener('load', () => {
    //     uGl.createTextureBufferByImage({ image })
    // })







    const projectionMatrix = m4.perspective(1.8, 1, .01, 50)
    const camera = [0, 0, 5];
    uniforms['u_viewWorldPosition'].val = camera
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const cameraMatrix = m4.lookAt(camera, target, up);
    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);


    const update = d => {
        const dark = 0.1
        uGl.prepareRender([dark, dark, dark])

        const worldYRot = m4.yRotation(d / 15)
        const worldXRot = m4.xRotation(d / 40)
        uniforms['u_worldViewProjection'].val = m4.multiply(m4.multiply(viewProjectionMatrix, worldYRot), worldXRot)

        uGl.setUniforms(uniforms)
        uGl.render()
    }

    let d = 0
    const animate = () => {
        d += 0.12
        update(d)
        requestAnimationFrame(animate)
    }
    animate()

}



main()


