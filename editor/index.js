const fs = require('fs');
var levelFile = process.argv[2];
const level = require(levelFile);
const editorWidth = 80;
const editorHeight = 40;


String.prototype.replaceAt = function (index, replacement, replacementLength) {
    return this.substring(0, index) + replacement + this.substring(index + replacementLength);
}

function log(filename,str){
    fs.writeFileSync(
        filename,
        str + "\n"
    );
}
function logAppend(filename,str){
    fs.appendFileSync(filename, str);
}


class Keyboard {
    constructor() {
        this.keyUp =
        this.keyUp = '\u001B\u005B\u0041';
        this.keyRight = '\u001B\u005B\u0043';
        this.keyLeft = '\u001B\u005B\u0044';
        this.keyDown = '\u001B\u005B\u0042';
    }
}

class RenderedEditor {
    constructor(x, y, maxWidth, maxHeight) {
        this.x = x;
        this.y = y;
        this.string = "";
        this.maxHeight = maxHeight;
        this.maxWidth = maxWidth;
        this.emptyEditor = this.getEditorTemplate();
        this.rowWidth = this.emptyEditor.split("\n")[0].length+1;
    }

 

    getEditorTemplate() {
        return fs.readFileSync("./editorTemplate.txt", "utf8");
    }

    String() {
        return this.string;
    }

    moveUp() {
        if (this.y > 0) {
            this.y--;
        }
    }

    moveDown() {
        if (this.y < this.maxHeight) {
            this.y++;
        }
    }

    moveLeft() {
        if (this.x > 0) {
            this.x--;
        }
    }

    moveRight() {
        if (this.x < this.maxWidth) {
            this.x++;
        }
    }
}

class Console {
    constructor(height) {
        this.height = height
    }
    clearLines = () => {
        for (let i = 0; i < this.height; i++) {
            //first clear the current line, then clear the previous line
            const y = i === 0 ? null : -1
            process.stdout.moveCursor(0, y)
            process.stdout.clearLine(1)
        }
        process.stdout.cursorTo(0)
    }
    write(str) {
        process.stdout.write(str);
    }
}

class Cursor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}

class AssetCursor {
    constructor(x, y,xIndex,yIndex) {
        this.x = x;
        this.y = y;
        this.xIndex = xIndex;
        this.yIndex = yIndex;
    }
}

class Editor {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.console = new Console(60);
        this.cursor = new Cursor(1, 1);
        this.renderedEditor = new RenderedEditor(this.cursor.x, this.cursor.y,100000,100000);
        this.keyboard = new Keyboard();
        this.selectedAsset = 0;

        this.assets = this.loadAssets();
        
        this.assetCategories = this.createAssetCategories();
        this.selectedAssetCategoryIndexX = 0;
        this.selectedAssetCategoryIndexY = 0;
        this.selectedAssetIndex = 0;

        this.assetCursor = new AssetCursor(0,0,0,0);

        this.renderString;
        this.renderStringArray = [];
        this.init();
    }

    createAssetCategories(){
        let assetCategories = Object.keys(this.assets);
        return assetCategories;
    }

    loadAssets(){
        return require('../assets/importantCharacters.json');

    }

    setKeyboardInput() {
        var stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        stdin.on('data', (key) => {
            if (key === '\u0003') {
                process.exit();
            }
            this.handleKeyPress(key, undefined);
        });
    }

    init() {
        this.setKeyboardInput();
        this.renderFirst();
        this.render();
    }

    renderFirst(){
        this.console.clearLines();
        this.renderedEditor.string = this.renderedEditor.emptyEditor;
        let renderString = this.renderedEditor.string;
        renderString = this.renderPositions(renderString);
        renderString = this.renderAssets(renderString);
        this.renderString = renderString;
        this.console.write(renderString)
        this.renderStringArray = renderString.split("");
    }

    handleKeyPress(key, levelWidth) {
        if (key == this.keyboard.keyUp) {
            if(this.assetCursor.yIndex<=0){
                if (this.selectedAssetCategoryIndexY>0){
                    this.selectedAssetCategoryIndexY--;
                }
            }else{
                this.assetCursor.yIndex--;
            }
        } else if (key == this.keyboard.keyRight) {
            if(this.assetCursor.xIndex>=3){
                if(this.assetCategories[this.selectedAssetCategoryIndexX+4]!==undefined){
                    this.selectedAssetCategoryIndexX++;
                } 
            }else{
                this.assetCursor.xIndex++;
            }
        } else if (key == this.keyboard.keyDown) {
            if(this.assetCursor.yIndex>18){
                if(this.assets[this.selectedAssetCategoryIndexX+this.assetCursor.xIndex]
                [this.selectedAssetCategoryIndexY+this.assetCursor.yIndex]!==undefined){
                    this.selectedAssetCategoryIndexY++;
                } 
            }else{
                if(this.assets[this.selectedAssetCategoryIndexX+this.assetCursor.xIndex]
                    [this.selectedAssetCategoryIndexY+this.assetCursor.yIndex]!==undefined)
                this.assetCursor.yIndex++;
            }
        } else if (key == this.keyboard.keyLeft) {
            if(this.assetCursor.xIndex<=0){
                if(this.selectedAssetCategoryIndexX>0){
                    this.selectedAssetCategoryIndexX--;
                } 
            }else{
                this.assetCursor.xIndex--;
            }
            
        } else if (key == "w") {
            if (this.cursor.y > 1) {
                this.cursor.y--;
            } else {
                this.renderedEditor.moveUp();
            }
        } else if (key == "a") {
            if (this.cursor.x > 1) {
                this.cursor.x--;
            } else {
                this.renderedEditor.moveLeft();
            }
        } else if (key == "s") {
            if (this.cursor.y < this.height) {
                this.cursor.y++;
                
            } else {
                this.renderedEditor.moveDown();
            }
        } else if (key == "d") {
            if (this.cursor.x < this.width) {
                this.cursor.x++;
            } else {
                this.renderedEditor.moveRight();
            }
        } else if (key == "q") {

        }
        process.stdout.cursorTo(this.cursor.x, this.cursor.y);
        this.render();
    }

    renderPositions(renderString ){
        renderString = renderString.replace("{XXXXXXX}", (this.renderedEditor.x + "").padStart(9, " "))
        renderString = renderString.replace("{YYYYYYY}", (this.renderedEditor.y + "").padStart(9, " "))
        renderString = renderString.replace("{lXXX}", (this.cursor.x + "").padStart(6, " "))
        renderString = renderString.replace("{lYYY}", (this.cursor.y + "").padStart(6, " "))
        return renderString;
    }

    renderAssets(renderString){ 
        renderString = renderString.replace("{cat1111}", (this.assetCategories[this.selectedAssetCategoryIndexX].substring(0,9).padStart(9," ")));
        renderString = renderString.replace("{cat2222}", (this.assetCategories[this.selectedAssetCategoryIndexX+1].substring(0,9).padStart(9," ")))
        renderString = renderString.replace("{cat3333}", (this.assetCategories[this.selectedAssetCategoryIndexX+2].substring(0,9).padStart(9," ")))
        renderString = renderString.replace("{cat4444}", (this.assetCategories[this.selectedAssetCategoryIndexX+3].substring(0,9).padStart(9," ")))
        let i = 0;
        for(let categoryIndex = this.selectedAssetCategoryIndexX; 
            categoryIndex<this.selectedAssetCategoryIndexX+4; 
            categoryIndex++){
            let itemIndex = this.selectedAssetIndex;
            for (let ii=4; ii<40; ii+=2) {
                let key = Object.keys(this.assets[this.assetCategories[categoryIndex]])[itemIndex];
                if(key!==undefined){
                    let character = this.assets[this.assetCategories[categoryIndex]][key]
                    //logAppend("character.txt",character)
                    renderString = renderString.replaceAt(ii*124 + 86 + (i)*10,character,1);
                }
                itemIndex++;
            }
            i++;
        }
        renderString = renderString.replaceAt((this.assetCursor.yIndex+2)*2*124 + 85 + (this.assetCursor.xIndex)*10,this.assets.editor.assetCursor,1);
        return renderString;
    }

    render() {
        let renderString = this.renderedEditor.emptyEditor;
        renderString = this.renderPositions(renderString);
        renderString = this.renderAssets(renderString);
        let renderStringArray = renderString.split("");
        for(let i = 0;i<renderStringArray.length;i++){
            if(renderStringArray[i]!==this.renderStringArray[i]){
                let y = Math.floor(i / 124);
                let x = i - y * 124;
                process.stdout.cursorTo(x, y);
                process.stdout.write(renderStringArray[i]);
            }
        }
        
        this.renderStringArray = renderStringArray;
        this.renderString = renderString;
        process.stdout.cursorTo(this.cursor.x, this.cursor.y);
    }
}

var editor = new Editor(80,40);