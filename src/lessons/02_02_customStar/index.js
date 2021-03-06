const vShaderSrc = `
attribute vec2 a_position;

void main () {
    gl_Position = vec4(a_position, 0., 1.);
}    
`

const fShaderSrc = `
precision mediump float;
uniform vec4 u_color;

void main() {
    gl_FragColor = u_color;
}
`



/** GL ***************************************************/

const glUtils = () => {



    function createGl () {
        document.body.style.textAlign = 'center'
        document.body.style.overflow = 'hidden'
        const canvas = document.createElement('canvas')
        const s = Math.min(window.innerWidth, window.innerHeight)
        canvas.width = canvas.height = s
        canvas.style.border = '2px solid #000000'
        canvas.style.boxSizing = 'border-box'
        document.body.appendChild(canvas)
        return canvas.getContext('webgl')
    }



    function createShader (gl, type, shaderSrc) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, shaderSrc)
        gl.compileShader(shader)
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (success) {
            return shader
        }
        console.log('compile shader error')
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
        console.log('program compile error')
    }


    const gl = createGl()
    let posAttributeLocation, colorUniformLocation

    const size = 2          // 2 components per iteration
    const type = gl.FLOAT   // the data is 32bit floats
    const normalize = false // don't normalize the data
    const stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0        // start at the beginning of the buffer



    return {
        createBuffer () {
            return gl.createBuffer()
        },

        prepareProgram () {
            const vShader = createShader(gl, gl.VERTEX_SHADER, vShaderSrc)
            const fShader = createShader(gl, gl.FRAGMENT_SHADER, fShaderSrc)
            const program = createProgram(gl, vShader, fShader)

            posAttributeLocation = gl.getAttribLocation(program, 'a_position')
            colorUniformLocation = gl.getUniformLocation(program, 'u_color')

            gl.useProgram(program)
        },

        clearCanvas(color) {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
            gl.clearColor(...color)
            gl.clear(gl.COLOR_BUFFER_BIT)
        },

        drawLayer (layer, newPoses = layer.poses, color) {
            gl.bindBuffer(gl.ARRAY_BUFFER, layer.buffer)
            for (let i = 0; i < layer.poses.length; i ++) {
                layer.poses32[i] = newPoses[i]
            }
            gl.bufferData(gl.ARRAY_BUFFER, layer.poses32, gl.STATIC_DRAW)

            gl.uniform4f(colorUniformLocation, ...color)
            gl.enableVertexAttribArray(posAttributeLocation)
            gl.vertexAttribPointer(posAttributeLocation, size, type, normalize, stride, offset)
            gl.drawArrays(gl.TRIANGLES, 0, layer.poses32.length / 2)
        }
    }
}



const createLayersManager = (glU, poses) => {
    const layers = [
        { key: 'geomBevel01_00' },
        { key: 'geomBevel01_01' },
        { key: 'geomBevel02_00' },
        { key: 'geomBevel02_01' },
        { key: 'geomTop01' },
        { key: 'geomTop02' },
    ]

    for (let i = 0; i < layers.length; ++i) {
        const { key } = layers[i]

        if (!poses[key]) continue;

        layers[i].poses = poses[key]
        layers[i].poses32 = new Float32Array(poses[key])

        layers[i].buffer = glU.createBuffer()
    }

    return {
        update (poses, color) {
            for (let i = 0; i < layers.length; ++i) {
                const { key } = layers[i]
                if (!poses[key]) continue;

                glU.drawLayer(layers[i], poses[key], color[key])
            }
        }
    }
}




/** CREATE GEOM DATA **********************************************/

function createGeom (val = 0) {

    const segments = 360
    const circles = 4
    const len = 2 * Math.PI * circles
    const stepLen = len / segments
    const stepRadius = 2 / segments
    const width = 1 / 12
    const spdW = 0.7
    const bevelOffset = [-.05, -.1]

    /**
     *--------*-------* arrTop
     /|       /|      /|
     / |      / |     / |
     * -|---- *--|----*  | arrTopBevel
     *--------*-------* arrBottom
     /        /       /
     /        /       /
     *--------*-------* arrBottomBevel

     */

    function createRoad(dist) {

        let currentLen = dist / 8
        let currentRadius = 0
        let currentWidth = dist

        const arrTop = []
        const arrTopBevel = []
        const arrBottom = []
        const arrBottomBevel = []


        for (let i = 0; i < segments; ++i) {
            currentRadius += stepRadius
            currentLen += stepLen
            currentWidth -= spdW

            const capWidthStart = Math.min(i / 100, 1)
            const w = (Math.sin(currentWidth) + 2) * width * capWidthStart


            const topPoint = [Math.sin(currentLen) * (currentRadius + w), Math.cos(currentLen) * (currentRadius + w)]
            arrTop.push([topPoint[0], topPoint[1]])
            arrTopBevel.push([topPoint[0] + bevelOffset[0], topPoint[1] + bevelOffset[1]])


            const bottomPoint = [Math.sin(currentLen) * (currentRadius - w), Math.cos(currentLen) * (currentRadius - w)]
            arrBottom.push([bottomPoint[0], bottomPoint[1]])
            arrBottomBevel.push([bottomPoint[0] + bevelOffset[0], bottomPoint[1] + bevelOffset[1]])
        }
        return { arrTop, arrBottom, arrTopBevel, arrBottomBevel }
    }




    function createPoligonsOfRoad(data) {
        const { arrTop, arrBottom,  arrTopBevel, arrBottomBevel } = data


        const geomTop01 = []
        const geomBevel01_00 = []
        const geomBevel01_01 = []
        const geomTop02 = []
        const geomBevel02_00 = []
        const geomBevel02_01 = []

        for (let i = 0; i < arrTop.length; i += 2) {
            if (!arrTop[i + 2]) continue;

            const [ p1, p2 ] = createPolygon(arrTop[i], arrBottom[i], arrTop[i + 1], arrBottom[i + 1])
            geomTop01.push(p1, p2)

            const [ p3, p4 ] = createPolygon(arrTop[i + 1], arrBottom[i + 1], arrTop[i + 2], arrBottom[i + 2])
            geomTop02.push(p3, p4)

            const [ p5, p6 ] = createPolygon(arrTop[i], arrTopBevel[i], arrTop[i + 1], arrTopBevel[i + 1])
            geomBevel01_00.push(p5, p6)

            const [ p5_1, p6_1 ] = createPolygon(arrTop[i + 1], arrTopBevel[i + 1], arrTop[i + 2], arrTopBevel[i + 2])
            geomBevel01_01.push(p5_1, p6_1)

            const [ p7, p8 ] = createPolygon(arrBottom[i], arrBottomBevel[i], arrBottom[i + 1], arrBottomBevel[i + 1])
            geomBevel02_00.push(p7, p8)

            const [ p7_1, p8_1 ] = createPolygon(arrBottom[i + 1], arrBottomBevel[i + 1], arrBottom[i + 2], arrBottomBevel[i + 2])
            geomBevel02_01.push(p7_1, p8_1)
        }
        return {
            geomTop01,
            geomBevel01_00,
            geomBevel01_01,
            geomTop02,
            geomBevel02_00,
            geomBevel02_01,
        }
    }


    function createPolygon(c1, c2, c3, c4) {
        return [
            [
                [ c1[0], c1[1] ],
                [ c2[0], c2[1] ],
                [ c3[0], c3[1] ],
            ],
            [
                [ c3[0], c3[1] ],
                [ c2[0], c2[1] ],
                [ c4[0], c4[1] ],
            ]
        ]
    }


    function prepareArrToExport(data) {
        const arr = []
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data[i].length; ++j) {
                arr.push(data[i][j][0])
                arr.push(data[i][j][1])
            }
        }
        return arr
    }


    const road = createRoad(val)
    const polygons = createPoligonsOfRoad(road)
    const prepared = {}
    for (let key in polygons) {
        prepared[key] = prepareArrToExport(polygons[key])
    }

    return prepared
}



/** COLOR UPDATER ******************************************************/

function createColorUpdater() {

    const getRanColor = () => [Math.random(), Math.random(), Math.random(), 1]
    const colors = {
        geomTop01: getRanColor(),
        geomTop02: getRanColor(),
        geomBevel01_00: getRanColor(),
        geomBevel01_01: getRanColor(),
        geomBevel02_00: getRanColor(),
        geomBevel02_01: getRanColor(),
        back: getRanColor(),
    }
    const arrStatesColors = [
        {"geomTop01":[0.061061990122547094,0.8178499612684555,0.4963069716228097,1],"geomTop02":[0.38346371635565357,0.005539668862797997,0.7782512477040859,1],"geomBevel01_00":[0.7628648304872341,0.6889642123998252,0.897430847709699,1],"geomBevel01_01":[0.08506765968768115,0.6483427684312006,0.23899073017141603,1],"geomBevel02_00":[0.17580958727582696,0.9368246793675437,0.736277758461634,1],"geomBevel02_01":[0.06546655456859063,0.6606894757651116,0.37580106865195173,1],"back":[0.23847078723067305,0.047939100065423235,0.9925846826877804,1]},
        {"geomTop01":[0.5658981406782624,0.18916278529551445,0.7200738307526098,1],"geomTop02":[0.07007510670894024,0.9810110714850953,0.27661021617748527,1],"geomBevel01_00":[0.7595947382960011,0.8316554205307327,0.27008358562246926,1],"geomBevel01_01":[0.33983669021959506,0.699828222852855,0.4188743303008313,1],"geomBevel02_00":[0.245398390482773,0.7316534438373163,0.754391702125506,1],"geomBevel02_01":[0.21094552256324173,0.46707230832021596,0.7081347652037566,1],"back":[0.059921717993761,0.9084427741195202,0.13560542717420798,1]},
        {"geomTop01":[0.04317924241801796,0.004180958974006943,0.2835525584108052,1],"geomTop02":[0.680755842365679,0.25810988469296525,0.9008466055546098,1],"geomBevel01_00":[0.7301898144132017,0.8803684400330045,0.9357494955165875,1],"geomBevel01_01":[0.5484932077681481,0.11469715774672729,0.5493717331358947,1],"geomBevel02_00":[0.7981728751513844,0.20934861403895955,0.7371981467507012,1],"geomBevel02_01":[0.6794195346318372,0.06719040888873629,0.9387565015623716,1],"back":[0.6960645109939256,0.03413048892974535,0.06835778613860644,1]},
        {"geomTop01":[0.720499865264254,0.9814204532501585,0.2398361555118833,1],"geomTop02":[0.4775544088822292,0.2823338580270449,0.3517987020485025,1],"geomBevel01_00":[0.581127944658355,0.7575408290829451,0.370695715681447,1],"geomBevel01_01":[0.08743387898998756,0.043608935401008964,0.23816992421665928,1],"geomBevel02_00":[0.8037291737571963,0.6568170008774079,0.3741201433049206,1],"geomBevel02_01":[0.12968347539193226,0.12189714692090381,0.30101125828744935,1],"back":[0.9706049758279709,0.7457150274748807,0.4528662215190471,1]},
        {"geomTop01":[0.10864891560645273,0.8098572945875164,0.19171439371529542,1],"geomTop02":[0.6921563518547538,0.06297595064535444,0.919702802959234,1],"geomBevel01_00":[0.4836973551382415,0.049700571273823435,0.41483963902362353,1],"geomBevel01_01":[0.7434236821044629,0.6383876162851256,0.4049401854108161,1],"geomBevel02_00":[0.38522978422678844,0.34217111145840984,0.3433227999539079,1],"geomBevel02_01":[0.37113408720713137,0.11829985244234953,0.4724821121180032,1],"back":[0.44301439441397283,0.48242061719449514,0.0944553698513031,1]},
        {"geomTop01":[0.2699285708511474,0.24042686811144898,0.8858649257429361,1],"geomTop02":[0.7557950160684321,0.9653092421018761,0.4777530786438149,1],"geomBevel01_00":[0.4916214870939255,0.5839485614147117,0.4540299906447809,1],"geomBevel01_01":[0.0929093316926759,0.9071661884946864,0.2006789206846138,1],"geomBevel02_00":[0.42049964553378283,0.35917973659789904,0.9837264770240977,1],"geomBevel02_01":[0.18945891440394713,0.3895802092428955,0.006801882071238996,1],"back":[0.17050174326949996,0.03170611058559869,0.4894798244158216,1]},
        {"geomTop01":[0.7008875645613291,0.42979570102771913,0.9783375445375926,1],"geomTop02":[0.04859156534705411,0.06438480620242393,0.37269357004547365,1],"geomBevel01_00":[0.7600200835219637,0.06926733826499487,0.5050084974563531,1],"geomBevel01_01":[0.6674618991914767,0.2991705420437396,0.7195097647945743,1],"geomBevel02_00":[0.8606592607464616,0.12381785914354348,0.48945566949665076,1],"geomBevel02_01":[0.16096941185795166,0.6991802335340798,0.23348338904531696,1],"back":[0.5231032431233018,0.03040823056473907,0.2456931754844831,1]},
        {"geomTop01":[0.3999916710977065,0.10289652972005725,0.8918518537592404,1],"geomTop02":[0.854442971168645,0.5528672576839095,0.7394306559563919,1],"geomBevel01_00":[0.9314944589088245,0.6225043294859938,0.26659371940581145,1],"geomBevel01_01":[0.1663917237815844,0.934125245325474,0.3752283629526494,1],"geomBevel02_00":[0.615327128519211,0.5476136737142199,0.01702416964285236,1],"geomBevel02_01":[0.9033949892900219,0.4222387741482432,0.6329971744551992,1],"back":[0.36769384901439595,0.49994820534232387,0.7314810280803661,1]},
        {"geomTop01":[0.4846770311451709,0.6449265754553717,0.8904335773426877,1],"geomTop02":[0.13129894782913354,0.4653726468340189,0.8395177723522229,1],"geomBevel01_00":[0.2366750973140448,0.9346765304119131,0.8896559700667446,1],"geomBevel01_01":[0.1212694735969122,0.31843443834702234,0.5022694832222476,1],"geomBevel02_00":[0.919771698489172,0.27994205629680713,0.2728208196561148,1],"geomBevel02_01":[0.3255659719681461,0.009290704938763605,0.7167011379519568,1],"back":[0.8870035810608237,0.9063514156398189,0.03666222210216841,1]},
        {"geomTop01":[0.7096163489746847,0.6592045412740906,0.8850381374234029,1],"geomTop02":[0.17360608565136348,0.12368402689946767,0.3712664157282741,1],"geomBevel01_00":[0.7395611991838731,0.5553492812680287,0.01940419876890198,1],"geomBevel01_01":[0.6510830132498846,0.9552097724849602,0.9099942123585312,1],"geomBevel02_00":[0.900232431494133,0.6560504033444421,0.01719132339676399,1],"geomBevel02_01":[0.6985919555935438,0.37069367260453157,0.9645993834649416,1],"back":[0.8287554365292573,0.8898877804332563,0.2016687413096514,1]},
        {"geomTop01":[0.9919476629081474,0.8707772296373291,0.3644646994481977,1],"geomTop02":[0.014154732331317366,0.27342845274947525,0.6991158670747379,1],"geomBevel01_00":[0.3771727790739827,0.5874157268984661,0.15132174656170116,1],"geomBevel01_01":[0.6815390729550859,0.48964464180835576,0.8975553768220279,1],"geomBevel02_00":[0.3795781106221199,0.384879338753352,0.5503198575656179,1],"geomBevel02_01":[0.08402252006038813,0.6118072299224644,0.7721487640935136,1],"back":[0.07358161168484867,0.7949197422749672,0.5809113146371261,1]},
        {"geomTop01":[0.5973752415745599,0.15149813019228708,0.3423597707910444,1],"geomTop02":[0.12011497459677001,0.9988622323989127,0.322094762461407,1],"geomBevel01_00":[0.7424645516218564,0.1618970358186318,0.24607725889402765,1],"geomBevel01_01":[0.9736781040228577,0.06263194592039234,0.6275271521585086,1],"geomBevel02_00":[0.9903852106736071,0.95073696147152,0.27649274847249283,1],"geomBevel02_01":[0.45966097713841614,0.735557145979425,0.8183584327902795,1],"back":[0.039842057510506956,0.9800288834078905,0.04617500072775127,1]},
        {"geomTop01":[0.2676243339165145,0.018334910811982796,0.2297732210151182,1],"geomTop02":[0.0547937380126442,0.7131066929335927,0.33427726342724506,1],"geomBevel01_00":[0.3816911590618748,0.6187260943724873,0.4316980323381665,1],"geomBevel01_01":[0.5834392782911153,0.8646656454170796,0.6276136528132481,1],"geomBevel02_00":[0.3267271734469621,0.33748479439636947,0.8052415605148897,1],"geomBevel02_01":[0.32414839171183973,0.22071226144904577,0.9896943080954426,1],"back":[0.1506644353750164,0.38557418877094873,0.5173943938404706,1]},
        {"geomTop01":[0.7693196365341597,0.4529653285719859,0.5485416927454696,1],"geomTop02":[0.10854612491926807,0.14401026976889164,0.5587005243043441,1],"geomBevel01_00":[0.05063708460872718,0.4498709369701017,0.9459112351672889,1],"geomBevel01_01":[0.3004157309875086,0.6477267868431635,0.6704362940957196,1],"geomBevel02_00":[0.657282072213085,0.8115730044104021,0.3058254913380227,1],"geomBevel02_01":[0.6397274892311013,0.377165383197549,0.13763831577106433,1],"back":[0.7739754345144121,0.8794962187418667,0.8483746043255795,1]},
        {"geomTop01":[0.907380293231121,0.3931825868499297,0.7453851933757394,1],"geomTop02":[0.796628483385067,0.911740495055041,0.30660062141665434,1],"geomBevel01_00":[0.8301854671988778,0.38248514899293085,0.15796859428059307,1],"geomBevel01_01":[0.23857587042085182,0.8014745527444436,0.07528136832839527,1],"geomBevel02_00":[0.6688532183494946,0.8389524737024194,0.7624412471541824,1],"geomBevel02_01":[0.6758832600542779,0.6933625785931421,0.43596487637467085,1],"back":[0.18856464995584732,0.7457167958960234,0.7691692459821975,1]},
        {"geomTop01":[0.05685673477196418,0.1095621869278911,0.37574356174967516,1],"geomTop02":[0.8318373750945212,0.15405554496741125,0.5540423981558806,1],"geomBevel01_00":[0.9734915884100419,0.718753314058713,0.29503596327017756,1],"geomBevel01_01":[0.8059513856821932,0.6903405438347707,0.02423387433546309,1],"geomBevel02_00":[0.36271320764448967,0.33103776644608973,0.4412799443009383,1],"geomBevel02_01":[0.756129133443914,0.5464120183749357,0.4881397739638571,1],"back":[0.5163709461476984,0.2824227439905347,0.6341835773301159,1]},
        {"geomTop01":[0.9167050343380083,0.3386455561655701,0.15029127634890083,1],"geomTop02":[0.7907793199278752,0.6961297235612192,0.19567540768725644,1],"geomBevel01_00":[0.45590674345348137,0.7873888682587957,0.12177093421657803,1],"geomBevel01_01":[0.058937293318825024,0.6904027017386742,0.26033663612461266,1],"geomBevel02_00":[0.9657087349980433,0.9413415516724195,0.19798305138184835,1],"geomBevel02_01":[0.8950691406933482,0.047830803178928294,0.07646882280620915,1],"back":[0.9392470046289267,0.4142079995525658,0.7728141991767594,1]},
        {"geomTop01":[0.983570067227659,0.10122958019718564,0.3170524477231531,1],"geomTop02":[0.5116519677609122,0.19493340058858855,0.11034711410198761,1],"geomBevel01_00":[0.3334075773649836,0.9866488827113242,0.38260290410312914,1],"geomBevel01_01":[0.8464404669782286,0.7839450174702975,0.2886395873002592,1],"geomBevel02_00":[0.7452351150917349,0.5220376786452019,0.2752652750717597,1],"geomBevel02_01":[0.39710696343381824,0.4897169314808918,0.16993453514808676,1],"back":[0.530706264549196,0.040436822002096307,0.18906363746000432,1]},
    ]
    let currentStateColor = 0
    let count = 200



    return {
        update () {
            if (count > 200) {
                count = 0

                for (let key in colors) {
                    colors[key] = arrStatesColors[currentStateColor][key]
                }

                ++currentStateColor
                currentStateColor === arrStatesColors.length && (currentStateColor = 0)
            }
            ++count
            return colors
        }
    }
}



function main () {
      const colorUpdater = createColorUpdater()
      const glU = glUtils()
      const layerManager = createLayersManager(glU, createGeom())
      glU.prepareProgram()

      let dist = 0
      const spd = 0.05
      const animate = () => {
        const color = colorUpdater.update()
        glU.clearCanvas(color.back)

        dist += spd
        const poses = createGeom(dist)
        layerManager.update(poses, color)

        requestAnimationFrame(animate)
    }
    animate()
} 

window.addEventListener('load', main) 
