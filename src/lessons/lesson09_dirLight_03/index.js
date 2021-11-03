/** https://webglfundamentals.org/webgl/lessons/ru/webgl-3d-lighting-directional.html */

import { vSh, fSh } from './shaders'
import { prepareGL } from './glUtils'
import { createPoints } from './createGeom'
import { m4 } from "./m4";


const { points, normals } = createPoints()


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
    normals: {
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
    color: {
        name: 'u_color',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniform3fv',
        val: null,
    },
    light: {
        name: 'u_reverseLightDirection',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniform3fv',
        val: null,
    },
    viewMatr: {
        name: 'u_viewMatrix',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniformMatrix4fv',
        val: null,
    },
    invViewMatr: {
        name: 'u_invRotMatrix',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniformMatrix4fv',
        val: null,
    },
    colorFlash: {
        name: 'u_flash',
        getLocation: 'getUniformLocation',
        location: null,
        execSetVal: 'uniform1f',
        val: null,
    },
}



const { PI } = Math
const PI2 = PI * 2


/** main */

const COUNT_X = 9
const COUNT_Y = 9

function main() {
    const uGl = prepareGL()
    uGl.prepareProgram(vSh, fSh)


     for (let key in attributes) {
        const { location, buffer, bufferLength } = uGl.createBufferByData(attributes[key])
        Object.assign(attributes[key], { location, buffer, bufferLength })
    }
     for (let key in uniforms) {
         const { location } = uGl.getUniformLocation(uniforms[key])
         Object.assign(uniforms[key], { location })
     }



    const update = d => {
        uGl.clearCanvas([0., 0., 0.3])

        for (let i = 0; i < (COUNT_X * COUNT_Y); ++i) {

            const x = (i % COUNT_X) * (2 / COUNT_X) - .9
            const y = Math.floor(i / COUNT_Y) * (2 / COUNT_Y) - .9
            const z = Math.ceil(i % 2) * .2

            let rotMatrix = m4.rotY(Math.sin(d + (i / 25)) * PI2)
            rotMatrix = m4.mult(m4.rotX(Math.sin(d * .5 + (i / 25)) * PI2), rotMatrix)

            let color = new Float32Array([1, 0, 0])

            if (
                i === 10 ||
                i === 11 ||
                i === 12 ||
                i === 13 ||
                i === 14 ||
                i === 15 ||
                i === 16 ||

                i === 19 ||
                i === 28 ||
                i === 37 ||
                i === 46 ||
                i === 55 ||
                i === 64 ||


                i === 25 ||
                i === 34 ||
                i === 43 ||
                i === 52 ||
                i === 61 ||
                i === 70 ||

                i === 65 ||
                i === 66 ||
                i === 67 ||
                i === 68 ||
                i === 69 ||

                i === 40
            ) {
                color = new Float32Array([1, 2, 2])
            }

            uniforms['color'].val = color
            uniforms['viewMatr'].val = m4.mult(m4.move(x, y, z), rotMatrix)
            uniforms['invViewMatr'].val  = m4.inverse(uniforms['viewMatr'].val)
            uniforms['light'].val = new Float32Array([0, 0, -1])

            uGl.render(attributes, uniforms)
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
