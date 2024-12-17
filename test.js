const fs = require('fs');
const chalk = require('chalk');
const ctx = new chalk.Instance({level: 3});
ResetColor = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"
FgGray = "\x1b[90m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
BgGray = "\x1b[100m"

function color(str, color, bgcolor = "", style = "") {
    return color + bgcolor + style + str + ResetColor;
}

function setDefaultColor(str) {
    if (str !== "\n") {
        return color(str, FgWhite, BgBlack, Bright);
    } else {
        return str;
    }

}
function setGreenColor(str) {
    if (str !== "\n") {
        return color(str, FgGreen, BgBlack, Bright);
    } else {
        return str;
    }

}

const consoleWidth = 80;
const consoleHeight = 50;
const keyUp = '\u001B\u005B\u0041';
const keyRight = '\u001B\u005B\u0043';
const keyLeft = '\u001B\u005B\u0044';
const keyDown = '\u001B\u005B\u0042';
const playerUp = setGreenColor('\u2B8B');
const playerLeft = setGreenColor('\u2B8A');
const playerRight = setGreenColor('\u2B88');
const playerDown = setGreenColor('\u2B89');

//const playerUp = setDefaultColor('a');
//const playerLeft = setDefaultColor('b');
//const playerRight = setDefaultColor('x');
//const playerDown = setDefaultColor('d');

const fireVerticalSpell1 = "◯"
const fireVerticalSpell2 = "◯"
const fireVerticalSpell3 = "◯"
const fireVerticalSpell4 = "◯"
const fireHorizontalSpell1 = "◯"
const fireHorizontalSpell2 = "◯"
const fireHorizontalSpell3 = "◯"
const fireHorizontalSpell4 = "◯"
const nextFireAnimationVertical = [
    fireVerticalSpell2,
    fireVerticalSpell3,
    fireVerticalSpell4,
    fireVerticalSpell1
]
const nextFireAnimationHorizontal = [
    fireHorizontalSpell2,
    fireHorizontalSpell3,
    fireHorizontalSpell4,
    fireHorizontalSpell1,
]
const nextFireColor = {
    [FgRed + BgBlack + Bright]: FgYellow + BgBlack + Dim,
    [FgYellow + BgBlack + Dim]: FgYellow + BgBlack + Bright,
    [FgYellow + BgBlack + Bright]: FgRed + BgBlack + Dim,
    [FgRed + BgBlack + Dim]: FgRed + BgBlack + Bright,
}
let spells = [];
let playerOrientation = playerUp;
playerUp["right"] = playerUp
let playerSpeedVertical = 75;
let playerSpeedHorizontal = 25;
let playerMayMove = true;

let playerPosition = {
    x: 30 * 19,
    y: 15
}
let keybuffer = [];
let levelFile = fs.readFileSync("./map/houseOfPriest.txt", "utf8");
let level = "";
for (let i = 0; i < levelFile.length; i++) {
    level += setDefaultColor(levelFile.charAt(i));
}

function setKeyboardInput() {
    var stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', function (key) {
        if (key === '\u0003') {
            process.exit();
        }
        keybuffer.push(key);
    });

}

const clearLines = (n) => {
    for (let i = 0; i < n; i++) {
        //first clear the current line, then clear the previous line
        const y = i === 0 ? null : -1
        process.stdout.moveCursor(0, y)
        process.stdout.clearLine(1)
    }
    process.stdout.cursorTo(0)
}


console.log();
clearLines(150);





function init() {
    setKeyboardInput();
    render();

}

function setPlayerMayMoveTrue() {
    playerMayMove = true;
}

String.prototype.replaceAt = function (index, replacement, replacementLength) {
    return this.substring(0, index) + replacement + this.substring(index + replacementLength);
}
actualKey = "TEST";

function checkLevelCollision(playerPosition, level, levelWidth) {
    let relativePosition = playerPosition.y * (levelWidth + 1) + playerPosition.x - playerOrientation.length;
    let posString = level.substring(relativePosition, relativePosition + playerOrientation.length);
    //let levelstring="";
    /*for(let i=0; i<level.split("\n").length;i++){
        levelstring +=level.split("\n")[i]+"\n";
        levelstring += "Row:"+i+"Length:"+level.split("\n")[i].length+"\n";
    }*/
    /*fs.writeFileSync(
        'log.txt', 
        playerPosition.y+"\n"
        +levelWidth+"\n"
        +relativePosition+"\n"
        +posString+"\n"+""
        +setDefaultColor(" ")+"\n"
        +level.length+"\n"+""
        +levelstring+"\n"+""
    );*/
    if (posString !== setDefaultColor(" ")) {
        return posString
    }
    return false
}



function handleKeyPress(key, levelWidth) {
    if (key == keyUp) {
        actualKey = "keyuP";
        playerPosition.y -= 1;
        if (playerMayMove
            && checkLevelCollision(playerPosition, level, levelWidth) == false
            && playerOrientation == playerUp) {
            playerMayMove = false;
            setTimeout(setPlayerMayMoveTrue, playerSpeedVertical);
        } else {
            playerPosition.y += 1;
        }
        playerOrientation = playerUp;
    } else if (key == keyRight) {
        actualKey = "keyRight";
        playerPosition.x += 19;
        if (playerMayMove
            && checkLevelCollision(playerPosition, level, levelWidth) == false
            && playerOrientation == playerRight) {
            playerMayMove = false;
            setTimeout(setPlayerMayMoveTrue, playerSpeedHorizontal);
        } else {
            playerPosition.x -= 19;
        }
        playerOrientation = playerRight;
    } else if (key == keyDown) {
        actualKey = "keyDown";
        playerPosition.y += 1;
        if (playerMayMove
            && playerOrientation == playerDown
            && checkLevelCollision(playerPosition, level, levelWidth) == false) {
            playerMayMove = false;
            setTimeout(setPlayerMayMoveTrue, playerSpeedVertical);
        } else {
            playerPosition.y -= 1;
        }
        playerOrientation = playerDown;
    } else if (key == keyLeft) {
        actualKey = "keyLeft";
        playerPosition.x -= 19;
        if (playerMayMove
            && playerOrientation == playerLeft
            && checkLevelCollision(playerPosition, level, levelWidth) == false) {
            playerMayMove = false;
            setTimeout(setPlayerMayMoveTrue, playerSpeedHorizontal);
        } else {
            playerPosition.x += 19;
        }
        playerOrientation = playerLeft;
    } else if (key == "w") {
        playerPosition.y -= 1;
        if (playerMayMove && checkLevelCollision(playerPosition, level, levelWidth) == false) {
            playerMayMove = false;
            setTimeout(setPlayerMayMoveTrue, playerSpeedVertical);
        } else {
            playerPosition.y += 1;
        }
    } else if (key == "a") {
        playerPosition.x -= 19;
        if (playerMayMove && checkLevelCollision(playerPosition, level, levelWidth) == false) {
            playerMayMove = false;
            setTimeout(setPlayerMayMoveTrue, playerSpeedHorizontal);
        } else {
            playerPosition.x += 19;
        }
    } else if (key == "s") {
        playerPosition.y += 1;
        if (playerMayMove && checkLevelCollision(playerPosition, level, levelWidth) == false) {
            playerMayMove = false;
            setTimeout(setPlayerMayMoveTrue, playerSpeedVertical);
        } else {
            playerPosition.y -= 1;
        }
    } else if (key == "d") {
        playerPosition.x += 19;
        if (playerMayMove && checkLevelCollision(playerPosition, level, levelWidth) == false) {
            playerMayMove = false;
            setTimeout(setPlayerMayMoveTrue, playerSpeedHorizontal);
        } else {
            playerPosition.x -= 19;
        }
    } else if (key == "q") {
        shootFire();
    }
}

function shootFire() {
    let spelldirection = "up";
    if (playerOrientation == playerDown) {
        spelldirection = "down";
    } else if (playerOrientation == playerLeft) {
        spelldirection = "left";
    } else if (playerOrientation == playerRight) {
        spelldirection = "right";
    }

    let animationIndex = Math.floor(Math.random() * 4);
    if (spelldirection == "up" || spelldirection == "down") {
        actualAnimation = nextFireAnimationVertical[animationIndex];
    } else {
        actualAnimation = nextFireAnimationHorizontal[animationIndex];
    }
    let actualColor;
    if (animationIndex == 0) {
        actualColor = FgRed + BgBlack + Bright;
    } else if (animationIndex == 1) {
        actualColor = FgYellow + BgBlack + Dim;
    } else if (animationIndex == 2) {
        actualColor = FgYellow + BgBlack + Bright;
    } else if (animationIndex == 3) {
        actualColor = FgRed + BgBlack + Dim;
    }

    spells.push({
        kind: "fire",
        x: playerPosition.x,
        y: playerPosition.y,
        mayFly: true,
        actualAnimation: actualAnimation,
        animationIndex: animationIndex,
        direction: spelldirection,
        actualColor: actualColor
    })
}

function setMayFlyTrue(spell) {
    spell.mayFly = true;
}

//TODO Spells: ICE, Wind, Earth(permanent), 
function handleSpell(spell, renderedLevel, i, levelWidth) {
    if (spell.mayFly == false) {
        if (spell.kind == "fire") {
            spell.actualColor = nextFireColor[spell.actualColor];
            spell.String = color(spell.actualAnimation, spell.actualColor);
        }
        spellString = spell.String;
        let replaceSpellPosition = spell.y * (levelWidth + 1) + spell.x - spellString.length;
        renderedLevel = renderedLevel.replaceAt(replaceSpellPosition, spellString, spellString.length);
        return renderedLevel;
    }
    if (spell.kind == "fire") {
        var timeout = 200;
        if (spell.direction == "up") {
            spell.y -= 1;
        } else if (spell.direction == "down") {
            spell.y += 1;
        } else if (spell.direction == "left") {
            spell.x -= 19;
            timeout = 100;
        } else if (spell.direction == "right") {
            spell.x += 19;
            timeout = 100;
        }
        let collisionCheck = checkLevelCollision({ x: spell.x, y: spell.y }, level, levelWidth);
        if (collisionCheck == false) {
            spell.mayFly = false;
            setTimeout(setMayFlyTrue.bind(null, spell), timeout);
            spell.animationIndex = Math.floor(Math.random()*4);
            if (spell.animationIndex > 3) {
                spell.animationIndex = 0;
            }

            spell.actualColor = nextFireColor[spell.actualColor];
            if (spell.direction == "up" || spell.direction == "down") {
                spell.actualAnimation = nextFireAnimationVertical[spell.animationIndex];
            } else {
                spell.actualAnimation = nextFireAnimationHorizontal[spell.animationIndex];
            }
            //animations.push(spell.actualAnimation);
            spellString = color(spell.actualAnimation, spell.actualColor);
            spell.String = spellString;
            let replaceSpellPosition = spell.y * (levelWidth + 1) + spell.x - spellString.length;
            renderedLevel = renderedLevel.replaceAt(replaceSpellPosition, spellString, spellString.length);
        } else {
            if(collisionCheck.replace(FgWhite,"").replace(BgBlack,"").replace(Bright,"").replace(ResetColor,"")=="❤"){
                 fs.writeFileSync(
                    'log.txt', 
                    collisionCheck.replace(FgWhite,"").replace(BgBlack,"").replace(Bright,"").replace(ResetColor,"")
                );
                let replaceSpellPosition = spell.y * (levelWidth + 1) + spell.x - collisionCheck.length;
                level = level.replaceAt(replaceSpellPosition, setDefaultColor(" "), setDefaultColor(" ").length);
            }
            spells.splice(i, 1);
        }

        return renderedLevel;
    }
    return renderedLevel;
}

const toAscii = (string) => string.split('').map(char=>char.charCodeAt(0).toString(16)).join(" ")

function render() {
    clearLines(consoleHeight);
    levelWidth = level.split("\n")[0].length;
    replacePlayerPosition = playerPosition.y * (levelWidth + 1) + playerPosition.x - playerOrientation.length;
    keybuffer.forEach((key) => {
        //console.log(key)
        handleKeyPress(key, levelWidth)
    })

    keybuffer = [];
    let renderedLevel = level;
    for (let i = 0; i < spells.length; i++) {
        let spell = spells[i];
        renderedLevel = handleSpell(spell, renderedLevel, i, levelWidth);
    }
    renderedLevel = renderedLevel.replaceAt(replacePlayerPosition, playerOrientation, playerOrientation.length)
    process.stdout.write(renderedLevel)
    //TrueColor
    //process.satdout.write("\x1b[38;2;242;216;89m-Orange\n");
    //process.stdout.write(JSON.stringify(spells));
    //process.stdout.write(playerOrientation.length+"|");
    //process.stdout.write(levelWidth+"|");
    setTimeout(render, 0);
}

init();