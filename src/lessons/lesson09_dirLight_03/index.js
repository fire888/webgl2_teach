/** https://webglfundamentals.org/webgl/lessons/ru/webgl-3d-lighting-directional.html */

import { vSh, fSh, easyShaderF, easyShaderV } from './shaders'
import { prepareGL } from './glUtils'
import { createPoints } from './createGeom'
import { m4 } from "./m4";


const { points, normals, colors } = createPoints()


const attributes = {
    vertices: {
        name: 'a_position',
        getLocation: 'getAttribLocation',
        location: null,
        size: 3,
        type: 'FLOAT',
        dataForBuffer: points,
        buffer: null,
    },
    colors: {
        name: 'a_color',
        getLocation: 'getAttribLocation',
        location: null,
        size: 3,
        type: 'FLOAT',
        dataForBuffer: colors,
        buffer: null,
    },
    normals: {
        name: 'a_normal',
        getLocation: 'getAttribLocation',
        location: null,
        size: 3,
        type: 'FLOAT',
        dataForBuffer: colors,
        buffer: null,
    },
}

const uniforms = {
    viewMatrix: {
        name: 'u_matrix',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniformMatrix4fv',
        val: null,
    },
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




    const projectionMatrix = m4.persp(1.8, 1, .01, 50)

    // TODO: CHECK GEOM NORMALS
    const update = d => {
        uGl.prepareRender([0., 0., 0.3])

        let cameraMatrix = m4.rotY(d);
        cameraMatrix = m4.mult(cameraMatrix, m4.rotX(d * 3))
        cameraMatrix = m4.translate(cameraMatrix, 0, 0, -2);
        const viewMatrix = m4.inverse(cameraMatrix);
        const viewProjectionMatrix = m4.mult(projectionMatrix, viewMatrix);



        for (let i = 0; i , i < X.length; ++i) {
            for (let j = 0; j < Y.length; ++j) {
                const matrix = m4.translate(viewProjectionMatrix, X[i], Y[j], 0)
                uniforms['viewMatrix'].val = matrix

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


