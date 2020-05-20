const Canvas = require('canvas-constructor')
module.exports = (data) => {
    let x = 600;
    let y = 800;
    return new Canvas(x, y)
    .setText();

}