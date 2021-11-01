/** https://webglfundamentals.org/webgl/lessons/ru/webgl-3d-lighting-directional.html */

import { vSh, fSh } from './shaders'
import { prepareGL } from './glUtils'
import { createPoints } from './createGeom'
import { m4 } from "./m4";



const { PI } = Math
const PI2 = PI * 2


/** main */

const COUNT_X = 9
const COUNT_Y = 9

function main() {
    const uGl = prepareGL()
    const { points, normals } = createPoints()

    const pointsBuffer = uGl.createBuffer(points) 
    const normalsBuffer = uGl.createBuffer(normals)

    const {
        program,
        posLoc,
        normLoc,
        colorLoc,
        matrixLoc,
        lightLoc,
        matrixLightLoc,
        uFlashLoc,
    } = uGl.prepareProgram(vSh, fSh)

    pointsBuffer.loc = posLoc
    normalsBuffer.loc = normLoc

    const light = new Float32Array([0, 0, -1])
    let color = new Float32Array([1, 0, 0])
    
    const update = d => {
        uGl.clearCanvas([0., 0., 0.])

        for (let i = 0; i < (COUNT_X * COUNT_Y); ++i) {

            const x = (i % COUNT_X) * (2 / COUNT_X) - .9 
            const y = Math.floor(i / COUNT_Y) * (2 / COUNT_Y) - .9
            const z = Math.ceil(i % 2) * .2

            let rotMatrix = m4.rotY(Math.sin(d + (i / 25)) * PI2)
            rotMatrix = m4.mult(m4.rotX(Math.sin(d * .5 + (i / 25)) * PI2), rotMatrix)

            const matrix = m4.mult(m4.move(x, y, z), rotMatrix)

            let invRotMatrix = m4.inverse(matrix)

            //const uFlash = Math.sin(d % Math.PI)

            uGl.render({
                program,
                buffers: [pointsBuffer, normalsBuffer],
                matrix,
                matrixLoc,
                color,
                colorLoc,
                light,
                lightLoc,
                lightMatrix: invRotMatrix,
                matrixLightLoc,
                //uFlash,
                //uFlashLoc,
            })
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
