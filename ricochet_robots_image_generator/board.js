'use strict';

const random = require('@omnigame/core/common/random/index');

const TOP_LEFT = 1;
const TOP_RIGHT = 2;
const BOTTOM_RIGHT = 3;
const BOTTOM_LEFT = 4;

const CORNER_TYPES = [
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_RIGHT,
    BOTTOM_LEFT
];

const ALLOWED_TARGET_COLORS = ['red', 'green', 'yellow', 'blue'];

class Board {
    constructor(size = 16) {
        this.size = size;
        this.fields = Array(size * size).fill(0);
        this.robotColors = ['red', 'green', 'yellow', 'blue', 'black'];
        this.robotPositions = [0, 1, 2, 3, 4];
        this.targetColor = 'red';
        this.targetPosition = 0;

        this.addMiddle();

        this.addTopWalls();
        this.addBottomWalls();
        this.addLeftWalls();
        this.addRightWalls();

        for (let i = 0; i < CORNER_TYPES.length; i++) {
            this.addCorner(CORNER_TYPES[i], 1, size / 2, 1, size / 2);
            this.addCorner(CORNER_TYPES[i], size / 2, size - 1, 1, size / 2);
            this.addCorner(CORNER_TYPES[i], 1, size / 2, size / 2, size - 1);
            this.addCorner(CORNER_TYPES[i], size / 2, size - 1, size / 2, size - 1);
        }

        this.randomizeRobotPositions();
        this.randomizeTarget();
    }

    getIndex(x, y) {
        return y * this.size + x;
    }

    getValue(x, y) {
        return this.fields[this.getIndex(x, y)];
    }

    getDistanceLeft(sx, sy) {
        var distance = 0;

        switch (this.getValue(sx, sy)) {
            case TOP_LEFT:
            case BOTTOM_LEFT:
                return distance;
        }

        distance = 1;

        while (sx - distance >= 0) {
            let x = sx - distance;
            if (!this.isValidRobotPosition(this.getIndex(x, sy)))
                return distance - 1;

            switch (this.getValue(x, sy)) {
                case TOP_LEFT:
                case BOTTOM_LEFT:
                    return distance;
                case TOP_RIGHT:
                case BOTTOM_RIGHT:
                    return distance - 1;
            }

            distance++;
        }

        return distance - 1;
    }

    getDistanceRight(sx, sy) {
        var distance = 0;

        switch (this.getValue(sx, sy)) {
            case TOP_RIGHT:
            case BOTTOM_RIGHT:
                return distance;
        }

        distance = 1;

        while (sx + distance < this.size) {
            let x = sx + distance;

            if (!this.isValidRobotPosition(this.getIndex(x, sy)))
                return distance - 1;

            switch (this.getValue(x, sy)) {
                case TOP_LEFT:
                case BOTTOM_LEFT:
                    return distance - 1;
                case TOP_RIGHT:
                case BOTTOM_RIGHT:
                    return distance;
            }

            distance++;
        }

        return distance - 1;
    }

    getDistanceUp(sx, sy) {
        var distance = 0;

        switch (this.getValue(sx, sy)) {
            case TOP_LEFT:
            case TOP_RIGHT:
                return distance;
        }

        distance = 1;

        while (sy - distance >= 0) {
            let y = sy - distance;

            if (!this.isValidRobotPosition(this.getIndex(sx, y)))
                return distance - 1;

            switch (this.getValue(sx, y)) {
                case TOP_LEFT:
                case TOP_RIGHT:
                    return distance;
                case BOTTOM_LEFT:
                case BOTTOM_RIGHT:
                    return distance - 1;
            }

            distance++;
        }

        return distance - 1;
    }

    getDistanceDown(sx, sy) {
        var distance = 0;

        switch (this.getValue(sx, sy)) {
            case BOTTOM_LEFT:
            case BOTTOM_RIGHT:
                return distance;
        }

        distance = 1;

        while (sy + distance < this.size) {
            let y = sy + distance;

            if (!this.isValidRobotPosition(this.getIndex(sx, y)))
                return distance - 1;

            switch (this.getValue(sx, y)) {
                case TOP_LEFT:
                case TOP_RIGHT:
                    return distance - 1;
                case BOTTOM_LEFT:
                case BOTTOM_RIGHT:
                    return distance;
            }

            distance++;
        }

        return distance - 1;
    }

    hasNeighbours(x, y) {
        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++)
                if (this.getValue(x + i, y + j) !== 0)
                    return true;
        return false;
    }

    addMiddle() {
        this.fields[this.getIndex(this.size / 2 - 1, this.size / 2 - 1)] = TOP_LEFT;
        this.fields[this.getIndex(this.size / 2,     this.size / 2 - 1)] = TOP_RIGHT;
        this.fields[this.getIndex(this.size / 2,     this.size / 2)]     = BOTTOM_RIGHT;
        this.fields[this.getIndex(this.size / 2 - 1, this.size / 2)]     = BOTTOM_LEFT;
    }

    addTopWalls() {
        const size = this.size / 2;
        var x = random.integer(2, size - 1);
        var y = 0;
        this.fields[this.getIndex(x, y)] = TOP_LEFT;

        x = random.integer(size + 1, this.size - 3);
        this.fields[this.getIndex(x, y)] = TOP_LEFT;
    }

    addBottomWalls() {
        const size = this.size / 2;
        var x = random.integer(2, size - 1);
        var y = this.size - 1;
        this.fields[this.getIndex(x, y)] = BOTTOM_LEFT;

        x = random.integer(size + 1, this.size - 3);
        this.fields[this.getIndex(x, y)] = BOTTOM_LEFT;
    }

    addLeftWalls() {
        const size = this.size / 2;
        var y = random.integer(2, size - 1);
        var x = 0;
        this.fields[this.getIndex(x, y)] = TOP_LEFT;

        y = random.integer(size + 1, this.size - 3);
        this.fields[this.getIndex(x, y)] = TOP_LEFT;
    }

    addRightWalls() {
        const size = this.size / 2;
        var y = random.integer(2, size - 1);
        var x = this.size - 1;
        this.fields[this.getIndex(x, y)] = TOP_RIGHT;

        y = random.integer(size + 1, this.size - 3);
        this.fields[this.getIndex(x, y)] = TOP_RIGHT;
    }

    addCorner(type, minX, maxX, minY, maxY) {
        const places = [];

        for (let y = minY; y < maxY; y++)
            for (let x = minX; x < maxX; x++) {
                if (this.hasNeighbours(x, y))
                    continue;
                places.push(this.getIndex(x, y));
            }

        let index = random.integer(0, places.length);
        this.fields[places[index]] = type;
    }

    isMiddle(index) {
        if (index === this.getIndex(this.size / 2 - 1, this.size / 2 - 1))
            return true;
        if (index === this.getIndex(this.size / 2, this.size / 2 - 1))
            return true;
        if (index === this.getIndex(this.size / 2, this.size / 2))
            return true;
        if (index === this.getIndex(this.size / 2 - 1, this.size / 2))
            return true;
        return false;
    }

    isValidRobotPosition(index) {
        if (this.isMiddle(index))
            return false;

        if (this.robotPositions.includes(index))
            return false;

        switch (this.fields[index]) {
            case 0:
            case TOP_LEFT:
            case TOP_RIGHT:
            case BOTTOM_LEFT:
            case BOTTOM_RIGHT:
                return true;
        }

        return false;
    }

    isValidTargetPosition(index) {
        if (this.isMiddle(index))
            return false;

        if (this.robotPositions.includes(index))
            return false;

        const x = index % this.size;
        const y = Math.floor(index / this.size);

        if (x === 0)
            return false;
        if (y === 0)
            return false;
        if (x === this.size - 1)
            return false;
        if (y === this.size - 1)
            return false;

        switch (this.fields[index]) {
            case TOP_LEFT:
            case TOP_RIGHT:
            case BOTTOM_LEFT:
            case BOTTOM_RIGHT:
                return true;
        }

        return false;
    }

    randomizeRobotPositions() {
        var index;
        this.robotPositions = [-1, -1, -1, -1, -1];
        for (var i = 0; i < this.robotPositions.length; i++) {
            do {
                index = random.integer(0, this.fields.length - 1);
            } while (!this.isValidRobotPosition(index));

            this.robotPositions[i] = index;
        }
    }

    randomizeTarget() {
        this.targetColor = random.choice(ALLOWED_TARGET_COLORS);
        var index;
        do {
            index = random.integer(0, this.fields.length - 1);
        } while (!this.isValidTargetPosition(index));

        this.targetPosition = index;
    }

    toString() {
        var output = '';
        for (let i = 0; i < this.size; i++) {
            output += this.fields.slice(i * this.size, (i + 1) * this.size).join(',') + '\n';
        }

        return output;
    }

}

module.exports = Board;
