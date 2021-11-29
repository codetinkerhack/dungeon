let pathxy: number[] = []
let rooms: any[] = []
let ANY = -1
let RIGHT = 0
let DOWN = 1
let UP = 3
let LEFT = 2
let xmax = 31
let ymax = 31

function drawTile(x:number, y:number, tile:number) {
    let t = sprites.dungeon.darkGroundCenter
    let wall = false

    if (tile == 1) {
        t = sprites.dungeon.darkGroundCenter
        wall = false
    } else if (tile == 2) {
        t = sprites.dungeon.buttonTeal
        // wall = true
    } else if (tile == 0) {
        t = sprites.dungeon.floorDark5
        // wall = true
    }

    tiles.setTileAt(tiles.getTileLocation(x * 2, y * 2), t)
    tiles.setWallAt(tiles.getTileLocation(x * 2, y * 2), wall)

    tiles.setTileAt(tiles.getTileLocation(x * 2 + 1, y * 2), t)
    tiles.setWallAt(tiles.getTileLocation(x * 2 + 1, y * 2), wall)

    tiles.setTileAt(tiles.getTileLocation(x * 2, y * 2 + 1), t)
    tiles.setWallAt(tiles.getTileLocation(x * 2, y * 2 + 1), wall)

    tiles.setTileAt(tiles.getTileLocation(x * 2 + 1, y * 2 + 1), t)
    tiles.setWallAt(tiles.getTileLocation(x * 2 + 1, y * 2 + 1), wall)
}

function drawMaze() {
    for (let x = 0; x <= xmax; x++) {
        for (let y = 0; y <= ymax; y++) { 
            drawTile(x, y, getPath(x, y))
        }
    }
}

function getPath(x: number, y: number) {
    if (pathxy[y * xmax + x] != 1 && pathxy[y * xmax + x] != 2) {
        return 0
    } else
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
    for (let xd = 0; xd < xm; xd++) {
        for (let yd = 0; yd < ym; yd++) {
            if (getPath(x + xd, y + yd) != 0) {
                return false
            }
        }
    }
    return true
}

function fillSpace(x: number, y: number, xmax: number, ymax: number, tile: number) {
    for (let xd = 0; xd < xmax; xd++) {
        for (let yd = 0; yd < ymax; yd++) {
            setPath(x + xd, y + yd, tile)
        }
    }
}

function buildRoom(x: number, y: number, size: number) {
    if (checkSpace(x, y, size, size)) {
        fillSpace(x, y, size, size, 2)
        fillSpace(x + 1, y + 1, size - 2, size - 2, 1)
        return { status: true, room: { x, y, size } }
    }
    return { status: false, room: { x, y, size } }
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
    let size = 5 + randint(1, 3) * 2
    let x = randint(1, xmax - size - 1)
    let y = randint(1, ymax - size - 1)

    return buildRoom(x * 2, y * 2, size)
}

function genRoomExit(room: any, firstRoom = false) {
    while (true) {
        let w = randint(0, 3)
        let d = randint(1, room.size - 2)
        if (w == UP && (getPath(room.x + d, room.y - 1) == 1 || firstRoom)) {
            return { x: (room.x + d), y: room.y, dir: w }
        } else if (w == LEFT && (getPath(room.x - 1, room.y + d) == 1 || firstRoom)) {
            return { x: room.x, y: (room.y + d), dir: w }
        } else if (w == DOWN && (getPath(room.x + d, room.y + room.size) == 1 || firstRoom)) {
            return { x: (room.x + d), y: (room.y + room.size - 1), dir: w }
        } else if (w == RIGHT && (getPath(room.x + room.size, room.y + d) == 1 || firstRoom)) {
            return { x: (room.x + room.size - 1), y: (room.y + d), dir: w }
        }
    }
}



let c = 0
let roomsNum = 6
let t = 0

while (c < roomsNum && t < 100) {
    let result = buildRandRoom()
    if (result.status) {
        rooms.push(result.room)
        c++
        t=0
    } else {
        t++
    }
}

let room = rooms[0]
let e = genRoomExit(room, true)
room.exit = e
setPath(e.x, e.y, 1)
if(e.dir == UP) genMaze(e.dir, e.x, e.y-1, 55)
if (e.dir == DOWN) genMaze(e.dir, e.x, e.y + 1, 55)
if (e.dir == RIGHT) genMaze(e.dir, e.x+1, e.y, 55)
if (e.dir == LEFT) genMaze(e.dir, e.x-1, e.y, 55)

c = 1
while (c < rooms.length) {
    let room = rooms[c]
    let exit = genRoomExit(room)
    room.exit = exit
    setPath(exit.x, exit.y, 1)
    c++
}

tiles.setTilemap(tilemap`level1`)
drawMaze()
// info.startCountdown(120)


let knight = sprites.create(img`
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
controller.moveSprite(knight)
knight.setPosition((rooms[0].x + 2) * 32, (rooms[0].y + 2) * 32)
scene.cameraFollowSprite(knight)

let exitSprite = sprites.create(sprites.dungeon.doorClosedWest, SpriteKind.Food)
exitSprite.setPosition((rooms[rooms.length - 1].x + rooms[rooms.length - 1].size / 2) * 32, (rooms[rooms.length - 1].y + rooms[rooms.length - 1].size / 2) * 32)


sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    game.over(true, effects.confetti)
})

info.onCountdownEnd(function () {
    game.over(false, effects.melt)
})
