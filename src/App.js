import React, { Component } from "react";
import { Row } from "./Row";
import "./App.css";
import * as Generator from "./generator";

class App extends Component {
    constructor(props) {
        super(props);

        this.pieces = ["o", "i", "s", "z", "l", "j", "t"];
        this.colors = ["red", "orange", "pink", "yellow", "white"];
        this.maxRows = 22;
        this.maxColumns = 10;
        this.previewRows = 6;
        this.previewColumns = 5;
        this.state = {
            score: 0,
            pieceData: this.initializeEmptyBoard(this.maxColumns, this.maxRows),
            nextPieceData: this.initializeEmptyBoard(this.previewColumns, this.previewRows),
            piece: this.chooseRandomNewPiece(),
            color: this.chooseRandomNewColor(),
            nextPiece: this.chooseRandomNewPiece(),
            nextColor: this.chooseRandomNewColor()
        };
        this.interval = setInterval(() => this.tick(), 300);
    }

    getTile(x, y) {
        return this.state.pieceData[y][x];
    }

    getPreviewTile(x, y) {
        return this.state.nextPieceData[y][x];
    }

    initializeEmptyBoard(width, height) {
        let initData = [];
        for (let row = 0; row < height; row++) {
            initData.push([]);
            for (let col = 0; col < width; col++) {
                initData[row].push({
                    type: Generator.tileTypes.EMPTY,
                    isPivot: false,
                    color: "empty"
                });
            }
        }
        return initData;
    }

    chooseRandomNewPiece() {
        return this.pieces[Math.floor(Math.random() * this.pieces.length)];
    }

    chooseRandomNewColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    handleKeyPress(e) {
        e.preventDefault();
        const currPieceLocs = this.getCurrPieceLocs();
        if (e.key === "ArrowLeft") {
            this.movePieceLeft(currPieceLocs);
        } else if (e.key === "ArrowRight") {
            this.movePieceRight(currPieceLocs);
        } else if (e.key === "ArrowDown") {
            this.movePieceDown(currPieceLocs);
        } else if (e.key === "z") {
            this.rotatePieceLeft(currPieceLocs);
        } else if (e.key === "x") {
            this.rotatePieceRight(currPieceLocs);
        } else if (e.key === " ") {
            this.dropPiece(currPieceLocs);
        }
        this.setState({pieceData: this.state.pieceData,
            nextPieceData: this.state.nextPieceData});
    }

    getCurrPieceLocs() {
        let currPieceLocs = [];
        for (let row = 0; row < this.maxRows; row++) {
            for (let col = 0; col < this.maxColumns; col++) {
                if (this.getTile(col, row).type === Generator.tileTypes.FALLING) {
                    currPieceLocs.push({ x: col, y: row, pivot: this.getTile(col, row).isPivot});
                }
            }
        }
        return currPieceLocs;
    }

    swapTileContents(x1, y1, x2, y2) {
        let tile1 = this.getTile(x1, y1);
        let tile2 = this.getTile(x2, y2);
        let temp1 = Object.assign({}, tile1);
        for (let key in tile2) {
            tile1[key] = tile2[key];
        }
        for (let key in temp1) {
            tile2[key] = temp1[key];
        }
    }

    movePieceLeft(currPieceLocs) {
        if (this.noCollisionLeft(currPieceLocs)) {
            for (let i = 0; i < currPieceLocs.length; i++) {
                this.swapTileContents(currPieceLocs[i].x, currPieceLocs[i].y, 
                    currPieceLocs[i].x - 1, currPieceLocs[i].y);              
            }
            return true;
        }
        return false;
    }

    movePieceRight(currPieceLocs) {
        if (this.noCollisionRight(currPieceLocs)) {
            for (let i = currPieceLocs.length - 1; i >= 0; i--) {
                this.swapTileContents(currPieceLocs[i].x, currPieceLocs[i].y, 
                    currPieceLocs[i].x + 1, currPieceLocs[i].y);                               
            }
            return true;
        }
        return false;
    }

    movePieceDown(currPieceLocs) {
        if (this.noCollisionDown(currPieceLocs)) {
            for (let i = currPieceLocs.length - 1; i >= 0; i--) {
                this.swapTileContents(currPieceLocs[i].x, currPieceLocs[i].y, 
                    currPieceLocs[i].x, currPieceLocs[i].y + 1);                               
            }
            return true;
        }
        return false;
    }

    noCollisionRight(currPieceLocs) {
        let edgeMap = {};
        for (let i in currPieceLocs) {
            let key = String(currPieceLocs[i].y);
            if (key in edgeMap){
                if (currPieceLocs[i].x > edgeMap[key]){
                    edgeMap[key] = currPieceLocs[i].x;
                }
            } else {
                edgeMap[key] = currPieceLocs[i].x;
            }
        }  

        for (let key in edgeMap) {
            let checkTileX = edgeMap[key] + 1;
            let checkTileY = Number(key);
            if(checkTileX >= this.maxColumns)
                return false;
            else if(this.getTile(checkTileX, checkTileY).type !== Generator.tileTypes.EMPTY) 
                return false;
        }

        return true;   
    }

    noCollisionLeft(currPieceLocs) {
        let edgeMap = {};
        for (let i in currPieceLocs) {
            let key = String(currPieceLocs[i].y);
            if (key in edgeMap){
                if (currPieceLocs[i].x < edgeMap[key]){
                    edgeMap[key] = currPieceLocs[i].x;
                }
            } else {
                edgeMap[key] = currPieceLocs[i].x;
            }
        }  

        for (let key in edgeMap) {
            let checkTileX = edgeMap[key] - 1;
            let checkTileY = Number(key);
            if(checkTileX < 0)
                return false;
            else if(this.getTile(checkTileX, checkTileY).type !== Generator.tileTypes.EMPTY) 
                return false;
        }

        return true;   
    }

    noCollisionDown(currPieceLocs) {
        let edgeMap = {};
        for (let i in currPieceLocs) {
            let key = String(currPieceLocs[i].x);
            if (key in edgeMap){
                if (currPieceLocs[i].y > edgeMap[key]){
                    edgeMap[key] = currPieceLocs[i].y;
                }
            } else {
                edgeMap[key] = currPieceLocs[i].y;
            }
        }  

        for (let key in edgeMap) {
            let checkTileY = edgeMap[key] + 1;
            let checkTileX = Number(key);
            if(checkTileY >= this.maxRows)
                return false;
            else if(this.getTile(checkTileX, checkTileY).type !== Generator.tileTypes.EMPTY) 
                return false;
        }

        return true;
    }

    rotatePieceLeft(currPieceLocs) {
        let pivotPiece = this.getPivotPiece(this.adjustPosition(currPieceLocs));        
        if (pivotPiece) {
            let adjustedX = pivotPiece.x - 1;
            let adjustedY = pivotPiece.y - 1;
            let N = 3;
            console.log(this.state.piece);
            if (this.state.nextPiece === "i") N++;
            for (let x = 0; x < Math.floor(N / 2); x++) {
                for (let y = x; y < N - x - 1; y++) {
                    this.swapTileContents(y + adjustedX, x + adjustedY, N - 1 - x + adjustedX, y + adjustedY);
                    this.swapTileContents(N - 1 - x + adjustedX, y + adjustedY, N - 1 - y + adjustedX, N - 1 - x + adjustedY);
                    this.swapTileContents(N - 1 - y + adjustedX, N - 1 - x + adjustedY, x + adjustedX, N - 1 - y + adjustedY);
                }
            } 
        } 
    }

    rotatePieceRight(currPieceLocs) {
        let pivotPiece = this.getPivotPiece(this.adjustPosition(currPieceLocs));
        if (pivotPiece) {

        }
    }

    getPivotPiece(currPieceLocs){
        for (let pieceLoc in currPieceLocs) {
            if(currPieceLocs[pieceLoc].pivot) {
                return currPieceLocs[pieceLoc];
            }
        }
        return false;
    }

    adjustPosition(currPieceLocs) {
        return currPieceLocs;
    }

    dropPiece() {
        for (let i = 0; i < this.maxRows + 1; i++) {
            this.movePieceDown(this.getCurrPieceLocs());
        }
        this.lockPiece(this.getCurrPieceLocs());
        let scoreGain = this.addScore(this.clearRows());
        this.generateNewPiece();
        this.setState({score: this.state.score + scoreGain});
    }

    generateNewPiece() {
        let gameOrigin = {x: 4, y: 0};
        let previewOrigin = {x: 1, y: 1};
        this.state.nextPieceData.map(row => {row.map(tile => {tile.color = "empty";});});

        this.setState({
            piece: this.state.nextPiece,
            color: this.state.nextColor,
            nextPiece: this.chooseRandomNewPiece(),
            nextColor: this.chooseRandomNewColor(),
        });

        switch (this.state.piece) {
        case "o":
            Generator.generateO((x, y) => this.getTile(x, y), gameOrigin.x, gameOrigin.y, this.state.color);
            break;
        case "i":            
            Generator.generateI((x, y) => this.getTile(x, y), gameOrigin.x, gameOrigin.y, this.state.color);
            break;
        case "s":
            Generator.generateS((x, y) => this.getTile(x, y), gameOrigin.x, gameOrigin.y, this.state.color);           
            break;
        case "z": 
            Generator.generateZ((x, y) => this.getTile(x, y), gameOrigin.x, gameOrigin.y, this.state.color);                       
            break;
        case "l":  
            Generator.generateL((x, y) => this.getTile(x, y), gameOrigin.x, gameOrigin.y, this.state.color);                       
            break;
        case "j":    
            Generator.generateJ((x, y) => this.getTile(x, y), gameOrigin.x, gameOrigin.y, this.state.color);                       
            break;
        case "t": //t
        default:
            Generator.generateT((x, y) => this.getTile(x, y), gameOrigin.x, gameOrigin.y, this.state.color);   
        }

        switch (this.state.nextPiece) {
        case "o":
            Generator.generateO((x, y) => this.getPreviewTile(x, y), previewOrigin.x, previewOrigin.y + 1, this.state.nextColor);
            break;
        case "i":            
            Generator.generateI((x, y) => this.getPreviewTile(x, y), previewOrigin.x + 1, previewOrigin.y, this.state.nextColor);            
            break;
        case "s":
            Generator.generateS((x, y) => this.getPreviewTile(x, y), previewOrigin.x + 1, previewOrigin.y + 1, this.state.nextColor);            
            break;
        case "z": 
            Generator.generateZ((x, y) => this.getPreviewTile(x, y), previewOrigin.x + 1, previewOrigin.y + 1, this.state.nextColor);
            break;
        case "l":  
            Generator.generateL((x, y) => this.getPreviewTile(x, y), previewOrigin.x, previewOrigin.y, this.state.nextColor);
            break;
        case "j":    
            Generator.generateJ((x, y) => this.getPreviewTile(x, y), previewOrigin.x + 1, previewOrigin.y, this.state.nextColor);            
            break;
        case "t": //t
        default:
            Generator.generateT((x, y) => this.getPreviewTile(x, y), previewOrigin.x + 1, previewOrigin.y + 1, this.state.nextColor);                        
        }
    }

    lockPiece(currPieceLocs) {
        for (let pieceLoc in currPieceLocs) {
            this.getTile(currPieceLocs[pieceLoc].x, currPieceLocs[pieceLoc].y).type = Generator.tileTypes.LOCKED;
        }
    }

    clearRows() {
        let clearedRows = 0;
        for (let row = this.maxRows - 1; row >= 0; row--) {
            if(this.checkForFullRow(row)){
                this.clearRow(row);
                clearedRows++;
                row++;
            }   
        }
        return clearedRows;
    }

    clearRow(row) {
        for (let col = 0; col < this.maxColumns; col++) {
            this.getTile(col, row).type = Generator.tileTypes.EMPTY;
            this.getTile(col, row).color = "none";
        }
        for (let currRow = row - 1; currRow >= 0; currRow--) {
            for (let col = 0; col < this.maxColumns; col++) {
                if (this.getTile(col, currRow).type === Generator.tileTypes.LOCKED) {
                    this.swapTileContents(col, currRow, col, currRow + 1);
                }
            }
        } 
    }

    checkForFullRow(row) {
        return this.state.pieceData[row].every(tile => {return tile.type === Generator.tileTypes.LOCKED;});
    }

    addScore(numRowsCleared) {
        if (numRowsCleared === 1) {
            return 40;
        } else if (numRowsCleared === 2) {
            return 100;
        } else if (numRowsCleared === 3) {
            return 300;
        } else if (numRowsCleared === 4) {
            return 1200;
        } else {
            return numRowsCleared * 300;
        }
    }

    tick() {
        //check for no falling pieces before generating a new one
        let scoreGained = 0;
        if (this.state.pieceData.every(row => {return row.every(tile => {return tile.type !== Generator.tileTypes.FALLING;});})) {
            this.generateNewPiece();
        } else {
            let currPieceLocs = this.getCurrPieceLocs();
            if(!this.movePieceDown(currPieceLocs)){ // we have a downwards collision
                this.lockPiece(currPieceLocs);
                scoreGained = this.addScore(this.clearRows());
                this.generateNewPiece();
            }
        }
        this.setState({pieceData: this.state.pieceData,
            nextPieceData: this.state.nextPieceData,
            score: this.state.score + scoreGained});
    }

    componentDidMount() {
        document.getElementsByClassName("app")[0].focus();
    }

    render() {
        const gameRows = this.state.pieceData.map((row, index) => {
            return <Row rowData={row} key={index} />;
        });

        const nextPieceRows = this.state.nextPieceData.map((row, index) => {
            return <Row rowData={row} key={index} />;
        });

        return (
            <div className="app flex-container" onKeyDown={e => this.handleKeyPress(e)} tabIndex="0">
                <div id="col1">
                    <h1 id="title">REACTRIS</h1>
                    <div className="game-board">
                        {gameRows}
                    </div>
                </div>
                <div id="col2">
                    <h2 id="title-next-piece">NEXT PIECE</h2>
                    <div id="next-piece-slot">
                        {nextPieceRows}
                    </div>
                    <h2 className="score">SCORE</h2>
                    <h3 className="score">{this.state.score}</h3>
                </div>
            </div>  
        );
    }
}

export default App;
