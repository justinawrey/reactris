export const maxRows = 22;
export const maxColumns = 10;
export const previewRows = 6;
export const previewColumns = 5; 

export const pieces = [{
    type: "o",
    color: "red"
}, {
    type: "i",
    color: "orange"
}, {
    type: "s",
    color: "pink"
}, {
    type: "z",
    color: "yellow"
}, {
    type: "l",
    color: "white"
}, {
    type: "j",
    color: "red"
}, {
    type: "t",
    color: "orange"
}];

export const tileTypes = Object.freeze({
    FALLING: "falling",
    EMPTY: "empty",
    LOCKED: "locked"
});

export function generateO(getTileFunc, x, y, color) {
    getTileFunc(x, y).type = tileTypes.FALLING;
    getTileFunc(x, y).color = color;
    getTileFunc(x + 1, y).type = tileTypes.FALLING;
    getTileFunc(x + 1, y).color = color;
    getTileFunc(x, y + 1).type = tileTypes.FALLING;
    getTileFunc(x, y + 1).color = color;
    getTileFunc(x + 1, y + 1).type = tileTypes.FALLING;
    getTileFunc(x + 1, y + 1).color = color;
}

export function generateI(getTileFunc, x, y, color) {
    getTileFunc(x, y).type = tileTypes.FALLING;
    getTileFunc(x, y).color = color;
    getTileFunc(x, y + 1).type = tileTypes.FALLING;
    getTileFunc(x, y + 1).color = color;           
    getTileFunc(x, y + 1).isPivot = true;
    getTileFunc(x, y + 2).type = tileTypes.FALLING;
    getTileFunc(x, y + 2).color = color;
    getTileFunc(x, y + 2).isPivot = true;
    getTileFunc(x, y + 3).type = tileTypes.FALLING;
    getTileFunc(x, y + 3).color = color;
}

export function generateS(getTileFunc, x, y, color) {
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

export function generateZ(getTileFunc, x, y, color) {
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

export function generateL(getTileFunc, x, y, color) {
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

export function generateJ(getTileFunc, x, y, color) {
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

export function generateT(getTileFunc, x, y, color) {
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