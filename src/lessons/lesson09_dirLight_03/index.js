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

const X = [-.22, 0, .22]
const Y = [-.22, 0, .22]


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




    const projectionMatrix = m4.persp(1.8, 1, 0, 5)

    const update = d => {
        uGl.prepareRender([0., 0., 0.3])

        let cameraMatrix = m4.rotY(d);
        cameraMatrix = m4.mult(cameraMatrix, m4.rotX(d))
        cameraMatrix = m4.translate(cameraMatrix, 0, 0, -.5);
        const viewMatrix = m4.inverse(cameraMatrix);
        const viewProjectionMatrix = m4.mult(projectionMatrix, viewMatrix);

        for (let i = 0; i , i < X.length; ++i) {
            for (let j = 0; j < Y.length; ++j) {
                const matrix = m4.translate(viewProjectionMatrix, X[i], Y[j], 0)
                uniforms['viewMatrix'].val = matrix
                uGl.render(uniforms)
            }
        }

    }

    let d = 0
    const animate = () => {
        d += 0.005
        update(d)
        requestAnimationFrame(animate)
    }
    animate()

}

main()





// const attributes = {
//     vertices: {
//         name: 'a_position',
//         getLocation: 'getAttribLocation',
//         location: null,
//         size: 3,
//         type: 'FLOAT',
//         dataForBuffer: points,
//         buffer: null,
//     },
//     normals: {
//         name: 'a_normal',
//         getLocation: 'getAttribLocation',
//         location: null,
//         size: 3,
//         type: 'FLOAT',
//         dataForBuffer: normals,
//         buffer: null,
//     },
// }
// const uniforms = {
//     color: {
//         name: 'u_color',
//         getLocation: 'getUniformLocation',
//         location: null,
//         execSetVal: 'uniform3fv',
//         val: null,
//     },
//     light: {
//         name: 'u_reverseLightDirection',
//         getLocation: 'getUniformLocation',
//         location: null,
//         execSetVal: 'uniform3fv',
//         val: null,
//     },
//     viewMatrix: {
//         name: 'u_viewMatrix',
//         getLocation: 'getUniformLocation',
//         location: null,
//         execSetVal: 'uniformMatrix4fv',
//         val: null,
//     },
//     invViewMatrix: {
//         name: 'u_invRotMatrix',
//         getLocation: 'getUniformLocation',
//         location: null,
//         execSetVal: 'uniformMatrix4fv',
//         val: null,
//     },
//     colorFlash: {
//         name: 'u_flash',
//         getLocation: 'getUniformLocation',
//         location: null,
//         execSetVal: 'uniform1f',
//         val: null,
//     },
// }

//
//
// const { PI } = Math
// const PI2 = PI * 2
//
//
// /** main */
//
// const COUNT_X = 9
// const COUNT_Y = 9
//
// function main() {
//     const uGl = prepareGL()
//     uGl.prepareProgram(vSh, fSh)
//
//      for (let key in attributes) {
//         const { location, buffer, bufferLength } = uGl.createBufferByData(attributes[key])
//         Object.assign(attributes[key], { location, buffer, bufferLength })
//     }
//      for (let key in uniforms) {
//          const { location } = uGl.getUniformLocation(uniforms[key])
//          Object.assign(uniforms[key], { location })
//      }
//
//
//
//     const update = d => {
//         uGl.clearCanvas([0., 0., 0.3])
//
//         for (let i = 0; i < (COUNT_X * COUNT_Y); ++i) {
//
//             const x = (i % COUNT_X) * (2 / COUNT_X) - .9
//             const y = Math.floor(i / COUNT_Y) * (2 / COUNT_Y) - .9
//             const z = Math.ceil(i % 2) * .2
//
//             let rotMatrix = m4.rotY(Math.sin(d + (i / 25)) * PI2)
//             rotMatrix = m4.mult(m4.rotX(Math.sin(d * .5 + (i / 25)) * PI2), rotMatrix)
//
//             let color = new Float32Array([1, 0, 0])
//
//             if ( i % 4 === 0) {
//                 color = new Float32Array([1, 2, 2])
//             }
//
//             uniforms['color'].val = color
//             uniforms['viewMatrix'].val = m4.mult(m4.move(x, y, z), rotMatrix)
//             uniforms['invViewMatrix'].val  = m4.inverse(uniforms['viewMatrix'].val)
//             uniforms['light'].val = new Float32Array([0, 0, -1])
//
//             uGl.render(attributes, uniforms)
//         }
//     }
//
//
//     let d = 0
//     const animate = () => {
//         d += 0.005
//         update(d)
//         requestAnimationFrame(animate)
//     }
//     animate()
//
// }
//
// main()
