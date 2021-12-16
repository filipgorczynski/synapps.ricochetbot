'use strict';

const Board = require('./board');
const Jimp = require('jimp');

const images = {
    '1': 'images/corner.png',
    '2': 'images/corner.png',
    '3': 'images/corner.png',
    '4': 'images/corner.png',
    'tile': 'images/tile.png',
    'red': 'images/robot.png',
    'green': 'images/robot.png',
    'yellow': 'images/robot.png',
    'blue': 'images/robot.png',
    'black': 'images/robot.png',
    'target': 'images/target.png',
};

const colors = {
    'red': [],
    'green': [
        {'apply': 'hue', 'params': [117]},
        {'apply': 'desaturate', 'params': [34]},
    ],
    'blue': [
        {'apply': 'hue', 'params': [-138]},
        {'apply': 'desaturate', 'params': [34]},
    ],
    'yellow': [{'apply': 'hue', 'params': [50]}],
    'black': [
        {'apply': 'desaturate', 'params': [100]},
        {'apply': 'darken', 'params': [50]}
    ]
};

async function generate() {
    const board = new Board();

    console.log(board.toString());

    const render = new Jimp(16 * 64, 16 * 64, 0x000000);

    // Decode all images
    const promises = [];
    for (var filename in images) {
        const f = filename;
        promises.push(Jimp.read(images[filename]).then(function(image) {
            images[f] = image;
        }).catch(function() {
            log.warn(`\x1b[31mError:\x1b[0m Image \x1b[32m'${f}'\x1b[0m corrupted or unsupported`);
        }));
    }
    await Promise.all(promises);

    images[2].rotate(-90);
    images[3].rotate(-180);
    images[4].rotate(-270);

    images.green.color(colors.green);
    images.blue.color(colors.blue);
    images.yellow.color(colors.yellow)
    images.black.color(colors.black);

    if (board.tagetColors !== 'red')
        images.target.color(colors[board.targetColor]);

    for (let i = 0; i < board.fields.length; i++) {
        switch(i) {
            case board.getIndex(board.size / 2 - 1, board.size / 2 - 1):
            case board.getIndex(board.size / 2,     board.size / 2 - 1):
            case board.getIndex(board.size / 2,     board.size / 2):
            case board.getIndex(board.size / 2 - 1, board.size / 2):
                continue;
        }

        let x = i % 16;
        let y = Math.floor(i / 16);

        render.composite(images.tile, x * 64, y * 64, {'mode': Jimp.BLEND_DESTINATION_OVER});
    }

    for (let i = 0; i < board.fields.length; i++) {
        let x = i % 16;
        let y = Math.floor(i / 16);

        switch (board.fields[i]) {
            case 1:
                render.composite(images[1], x * 64 - 16, y * 64 - 16, {'mode': Jimp.BLEND_SOURCE_OVER});
                break;
            case 2:
                render.composite(images[2], x * 64 - 16, y * 64 - 16, {'mode': Jimp.BLEND_SOURCE_OVER});
                break;
            case 3:
                render.composite(images[3], x * 64 - 16, y * 64 - 16, {'mode': Jimp.BLEND_SOURCE_OVER});
                break;
            case 4:
                render.composite(images[4], x * 64 - 16, y * 64 - 16, {'mode': Jimp.BLEND_SOURCE_OVER});
                break;
        }
    }

    for (let i = 0; i < board.robotPositions.length; i++) {
        let robotIndex = board.robotPositions[i];

        let x = robotIndex % 16;
        let y = Math.floor(robotIndex / 16);

        render.composite(images[board.robotColors[i]], x * 64, y * 64, {'mode': Jimp.BLEND_SOURCE_OVER});
    }

    let x = board.targetPosition % 16;
    let y = Math.floor(board.targetPosition / 16);

    render.composite(images.target, x * 64, y * 64, {'mode': Jimp.BLEND_SOURCE_OVER});

    images[1].resize(96, 96 * 20);
    render.composite(images[1], 0 - 16, -500, {'mode': Jimp.BLEND_SOURCE_OVER});
    render.composite(images[1], 16 * 64 - 16, -500, {'mode': Jimp.BLEND_SOURCE_OVER});

    images[1].resize(96 * 20, 96);
    render.composite(images[1], -500, 0 - 16, {'mode': Jimp.BLEND_SOURCE_OVER});
    render.composite(images[1], -500, 16 * 64 - 16, {'mode': Jimp.BLEND_SOURCE_OVER});

    await render.writeAsync('output.png');
}

generate();

