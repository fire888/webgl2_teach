/** https://webglfundamentals.org/webgl/lessons/ru/webgl-3d-lighting-point.html */

import { easyShaderF, easyShaderV } from './shaders'
import { prepareGL } from './glUtils'
import { createGeometry } from './createGeom'
import { createTexture } from './createTexture'
import { m4 } from './m4'



let geomQuality = 0
const { a_position, a_texcoord, a_normal, } = createGeometry(0)



const attributes = {
    'a_position': {
        name: 'a_position',
        getLocation: 'getAttribLocation',
        location: null,
        size: 3,
        type: 'FLOAT',
        dataForBuffer: a_position,
        buffer: null,
    },
    'a_texcoord': {
        name: 'a_texcoord',
        getLocation: 'getAttribLocation',
        location: null,
        size: 2,
        type: 'FLOAT',
        dataForBuffer: a_texcoord,
        buffer: null,
    },
    'a_normal': {
        name: 'a_normal',
        getLocation: 'getAttribLocation',
        location: null,
        size: 3,
        type: 'FLOAT',
        dataForBuffer: a_normal,
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



const main = () => {
    const uGl = prepareGL()
    uGl.prepareProgram(easyShaderV, easyShaderF)

    for (let key in attributes) {
        const { location, buffer } = uGl.createBufferByData(attributes[key])
        Object.assign(attributes[key], { location, buffer  })
    }
    uGl.setAttributes(attributes)

    for (let key in uniforms) {
        const { location } = uGl.getUniformLocation(uniforms[key])
        Object.assign(uniforms[key], { location })
    }

    const textureData = createTexture()
    uGl.createTextureByData({ 
        arrTexture: textureData.arr, 
        width: textureData.w, 
        height: textureData.h,  
    })


    const projectionMatrix = m4.perspective(1.8, 1, .01, 50)
    const camera = [0, 0, 10];
    uniforms['u_viewWorldPosition'].val = camera
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const cameraMatrix = m4.lookAt(camera, target, up);
    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);


    const updateAttributes = (quality, phase) => {
        const geomData = createGeometry(quality, phase)

        for (let key in attributes) {
            const { bufferLength } = uGl.fillBufferByData({
                buffer: attributes[key].buffer,
                dataForBuffer: geomData[key],
                size: attributes[key].size
            })
            Object.assign(attributes[key], { bufferLength })
        }
    }


    /** render *****************************************/

    let countFrame = 0
    let speedAddGeomQuality = 5

    const updateParams = () => {
        ++countFrame
        if (countFrame > 0) {
            countFrame = 30

            geomQuality += speedAddGeomQuality
            if (geomQuality > 70) {
                speedAddGeomQuality = -1
            }
            if (geomQuality < 20) {
                speedAddGeomQuality = 1
            }
        }
    }

    const update = d => {
        updateParams()
        updateAttributes(geomQuality, Math.sin(d / 2))
        uGl.setAttributes(attributes)

        const dark = 0.1
        uGl.prepareRender([dark, dark, dark])

        const worldYRot = m4.yRotation(d / 15)
        const worldXRot = m4.xRotation(d / 30)
        uniforms['u_worldViewProjection'].val = m4.multiply(m4.multiply(viewProjectionMatrix, worldYRot), worldXRot)

        uGl.setUniforms(uniforms)
        uGl.render()
    }


    /** update *****************************************/

    let d = 0
    const animate = () => {
        d += 0.12
        update(d)
        requestAnimationFrame(animate)
    }
    animate()
}

main()