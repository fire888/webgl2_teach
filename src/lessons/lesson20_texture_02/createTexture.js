const white = [128, 128, 128]
const white2 = [100, 100, 100]
const black = [0, 0, 0]

const c1 = white2
const c2 = black


export const createTexture = () => {
    const arr = [
        ...c1,    ...c1,   ...c1,
        ...c1,    ...c1,   ...c1,
        ...c2,    ...c2,   ...c2,
        ...c1,    ...c1,   ...c1,
        ...c1,    ...c1,   ...c1,
    ]
    return {
        arr: new Uint8Array(arr),
        w: 3,
        h: 5 ,
    }
}