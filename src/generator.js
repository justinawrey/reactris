const tileTypes = Object.freeze({
    FALLING: "falling",
    EMPTY: "empty",
    LOCKED: "locked"
});

function generateO(getTileFunc, x, y, color) {
    getTileFunc(x, y).type = tileTypes.FALLING;
    getTileFunc(x, y).color = color;
    getTileFunc(x + 1, y).type = tileTypes.FALLING;
    getTileFunc(x + 1, y).color = color;
    getTileFunc(x, y + 1).type = tileTypes.FALLING;
    getTileFunc(x, y + 1).color = color;
    getTileFunc(x + 1, y + 1).type = tileTypes.FALLING;
    getTileFunc(x + 1, y + 1).color = color;
}

function generateI(getTileFunc, x, y, color) {
    getTileFunc(x, y).type = tileTypes.FALLING;
    getTileFunc(x, y).color = color;
    getTileFunc(x, y + 1).type = tileTypes.FALLING;
    getTileFunc(x, y + 1).color = color;           
    getTileFunc(x, y + 1).isPivot = true;
    getTileFunc(x, y + 2).type = tileTypes.FALLING;
    getTileFunc(x, y + 2).color = color;
    getTileFunc(x, y + 3).type = tileTypes.FALLING;
    getTileFunc(x, y + 3).color = color;
}

function generateS(getTileFunc, x, y, color) {
    getTileFunc(x, y).type = tileTypes.FALLING;
    getTileFunc(x, y).color = color;           
    getTileFunc(x, y).isPivot = true;
    getTileFunc(x + 1, y).type = tileTypes.FALLING;
    getTileFunc(x + 1, y).color =color;            
    getTileFunc(x, y + 1).type = tileTypes.FALLING;
    getTileFunc(x, y + 1).color = color;           
    getTileFunc(x - 1, y + 1).type = tileTypes.FALLING;
    getTileFunc(x - 1, y + 1).color = color;
}

function generateZ(getTileFunc, x, y, color) {
    getTileFunc(x - 1, y).type = tileTypes.FALLING;
    getTileFunc(x - 1, y).color = color;            
    getTileFunc(x, y).type = tileTypes.FALLING;
    getTileFunc(x, y).color = color;            
    getTileFunc(x, y).isPivot = true;
    getTileFunc(x, y + 1).type = tileTypes.FALLING;
    getTileFunc(x, y + 1).color = color;            
    getTileFunc(x + 1, y + 1).type = tileTypes.FALLING;
    getTileFunc(x + 1, y + 1).color = color;  
}

function generateL(getTileFunc, x, y, color) {
    getTileFunc(x, y).type = tileTypes.FALLING;
    getTileFunc(x, y).color = color;            
    getTileFunc(x, y + 1).type = tileTypes.FALLING;
    getTileFunc(x, y + 1).color = color;            
    getTileFunc(x, y + 1).isPivot = true;
    getTileFunc(x, y + 2).type = tileTypes.FALLING;
    getTileFunc(x, y + 2).color = color;                    
    getTileFunc(x + 1, y + 2).type = tileTypes.FALLING;
    getTileFunc(x + 1, y + 2).color = color; 
}

function generateJ(getTileFunc, x, y, color) {
    getTileFunc(x, y).type = tileTypes.FALLING;
    getTileFunc(x, y).color = color;            
    getTileFunc(x, y + 1).type = tileTypes.FALLING;
    getTileFunc(x, y + 1).color = color;            
    getTileFunc(x, y + 1).isPivot = true;
    getTileFunc(x, y + 2).type = tileTypes.FALLING;
    getTileFunc(x, y + 2).color = color;                      
    getTileFunc(x - 1, y + 2).type = tileTypes.FALLING;
    getTileFunc(x - 1, y + 2).color = color; 
}

function generateT(getTileFunc, x, y, color) {
    getTileFunc(x - 1, y).type = tileTypes.FALLING;
    getTileFunc(x - 1, y).color = color;            
    getTileFunc(x, y).type = tileTypes.FALLING;
    getTileFunc(x, y).color = color;            
    getTileFunc(x, y).isPivot = true;
    getTileFunc(x + 1, y).type = tileTypes.FALLING;
    getTileFunc(x + 1, y).color = color;            
    getTileFunc(x, y + 1).type = tileTypes.FALLING;
    getTileFunc(x, y + 1).color = color;
}

export {generateO, generateI, generateS, generateZ, generateL, generateJ, generateT, tileTypes, pieces, colors};