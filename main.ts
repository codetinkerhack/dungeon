let pathxy: number[] = []
let ANY = -1
let RIGHT = 0
let DOWN = 1
let UP = 3
let LEFT = 2
let xmax = 32
let ymax = 32

function genExit(xmax: number, ymax: number) {
    while (true) {
        let w = randint(0, 3)
        let ex = randint(1, xmax - 1)
        let ey = randint(1, ymax - 1)

        if (w == DOWN && getPath(ex, ymax - 1) == 1) {
            return { x: ex, y: ymax }
        }
        if (w == RIGHT && getPath(xmax - 1, ey) == 1) {
            return { x: xmax, y: ey }
        }
    }
}

function getPath(x: number, y: number) {
    if (pathxy[y * xmax + x] != 1 && pathxy[y * xmax + x] != 2)
        return 0
    else
        return pathxy[y * xmax + x]
}

function setPath(x: number, y: number, value = 1) {
    pathxy[y * xmax + x] = value
}

function gotMoves(dir: number, x: number, y: number) {
    if ((dir == RIGHT || dir == ANY) && x + 2 < xmax && getPath(x + 2, y) == 0) {
        return true
    } else if ((dir == DOWN || dir == ANY) && y + 2 < ymax && getPath(x, y + 2) == 0) {
        return true
    } else if ((dir == LEFT || dir == ANY) && x - 2 > 0 && getPath(x - 2, y) == 0) {
        return true
    } else if ((dir == UP || dir == ANY) && y - 2 > 0 && getPath(x, y - 2) == 0) {
        return true
    }
    return false
}

function checkSpace(x: number, y: number, xm: number, ym: number) {
    if (!(x + xm + 2 < xmax && x - 2 > 0 && y + ym + 2 < ymax && y - 2 > 0)) return false
    for (let xd = 0; xd <= xm; xd++) {
        for (let yd = 0; yd <= ym; yd++) {
            if (getPath(x + xd, y + yd) == 1) {
                return false
            }
        }
    }
    return true
}

function fillSpace(x: number, y: number, xmax: number, ymax: number, tile: number) {
    for (let xd = 0; xd <= xmax; xd++) {
        for (let yd = 0; yd <= ymax; yd++) {
            setPath(x + xd, y + yd, tile)
        }
    }
}

function buildRoom(dir: number, x: number, y: number, xsize: number, ysize: number) {
    if ((dir == RIGHT || dir == ANY) && checkSpace(x - 2, y - 2, xsize + 2, ysize + 2)) {
        fillSpace(x - 1, y - 1, xsize + 1, ysize + 1, 1)
        fillSpace(x, y, xsize, ysize, 2)
        return true
    }
    // else if ((dir == DOWN || dir == ANY) && y + ysize < ymax && getPath(x, y + 2) != 1) {
    //     return true
    // } else if ((dir == LEFT || dir == ANY) && x - 2 > 0 && getPath(x - 2, y) != 1) {
    //     return true
    // } else if ((dir == UP || dir == ANY) && y - 2 > 0 && getPath(x, y - 2) != 1) {
    //     return true
    // }
    return false
}

function moveDir(dir: number, x: number, y: number) {
    if (dir == RIGHT && gotMoves(dir, x, y)) {
        x++
        setPath(x, y)
        x++
        setPath(x, y)
    } else if (dir == DOWN && gotMoves(dir, x, y)) {
        y++
        setPath(x, y)
        y++
        setPath(x, y)
    } else if (dir == LEFT && gotMoves(dir, x, y)) {
        x--
        setPath(x, y)
        x--
        setPath(x, y)
    } else if (dir == UP && gotMoves(dir, x, y)) {
        y--
        setPath(x, y)
        y--
        setPath(x, y)
    }
    return { x: x, y: y }
}



function genMaze(dir: number, x: number, y: number, depth: number) {
    while (gotMoves(ANY, x, y) && depth - 1 != 0) {
        let loc = moveDir(dir, x, y)
        x = loc.x
        y = loc.y
        let dirNew = randint(0, 3)
        if (dir != dirNew && gotMoves(dirNew, x, y) && depth - 1 != 0) {
            genMaze(dirNew, x, y, depth - 1)
        }
    }
}

function buildRandRoom() {
    let x = randint(2, xmax - 2)
    let y = randint(2, ymax - 2)
    buildRoom(RIGHT, x, y, 6, 6)
}

function drawMaze() {
    for (let x = 0; x <= xmax; x++) {
        for (let y = 0; y <= ymax; y++) {
            if (getPath(x, y) == 1) {
                tiles.setTileAt(tiles.getTileLocation(x, y), sprites.dungeon.darkGroundCenter)
                tiles.setWallAt(tiles.getTileLocation(x, y), false)
            } else if (getPath(x, y) == 2) {
                tiles.setTileAt(tiles.getTileLocation(x, y), sprites.dungeon.buttonTeal)
                tiles.setWallAt(tiles.getTileLocation(x, y), false)
            } else {
                tiles.setTileAt(tiles.getTileLocation(x, y), sprites.dungeon.floorDark5)
                tiles.setWallAt(tiles.getTileLocation(x, y), false)
            }
        }
    }
}

tiles.setTilemap(tilemap`level1`)
let mySprite = sprites.create(img`
    . . . . . f f f f . . . . .
    . . . f f f 2 2 f f f . . .
    . . f f f 2 2 2 2 f f f . .
    . f f f e e e e e e f f f .
    . f f e 2 2 2 2 2 2 e e f .
    . f e 2 f f f f f f 2 e f .
    . f f f f e e e e f f f f .
    f f e f b f 4 4 f b f e f f
    f e e 4 1 f d d f 1 4 e e f
    . f f f f d d d d d e e f .
    f d d d d f 4 4 4 e e f . .
    f b b b b f 2 2 2 2 f 4 e .
    f b b b b f 2 2 2 2 f d 4 .
    . f c c f 4 5 5 4 4 f 4 4 .
`, SpriteKind.Player)
controller.moveSprite(mySprite)
mySprite.setPosition(12 * 2, 12 * 2)

// buildRandRoom()
// buildRandRoom()
// buildRandRoom()
setPath(1, 1)
genMaze(DOWN, 1, 1, 99)
drawMaze()
// info.startCountdown(120)

scene.cameraFollowSprite(mySprite)
let exit = genExit(xmax, ymax)
let exitSprite = sprites.create(sprites.dungeon.doorClosedWest, SpriteKind.Food)
exitSprite.setPosition(exit.x * 16 + 7, exit.y * 16 + 7)

sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    game.over(true, effects.confetti)
})

info.onCountdownEnd(function () {
    game.over(false, effects.melt)
})
