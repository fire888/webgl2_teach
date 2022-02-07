/** https://webglfundamentals.org/webgl/lessons/ru/webgl-3d-lighting-point.html */

import { easyShaderF, easyShaderV } from './shaders'
import { prepareGL } from '../glUtils'



const attributes = {
    'a_position': {
        name: 'a_position',
        getLocation: 'getAttribLocation',
        location: null,
        size: 3,
        type: 'FLOAT',
        dataForBuffer: new Float32Array([
            -1, -1, 0,
            1, -1, 0,
            1, 1, 0,
            
            -1, -1, 0,
            1, 1, 0,
            -1, 1, 0,
        ]),
        buffer: null,
    },
}

const uniforms = {
    'u_time': {
        name: 'u_time',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniform1f',
        val: 0,
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


    const dark = 0.1
    uGl.prepareRender([dark, dark, dark])


    const update = t => {
        uniforms['u_time'].val = Math.sin(t)

        uGl.setUniforms(uniforms)
        uGl.render()
    }

    let d = 0
    const animate = () => {
        d += 0.02
        update(d)
        requestAnimationFrame(animate)
    }
    animate()

}



main()


