import React, { Component } from "react";
import { Row } from "./Row";
import { Score } from "./Score";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.pieces = ["o", "i", "s", "z", "l", "j", "t"];
        this.maxRows = 22;
        this.maxColumns = 10;
        this.tileTypes = Object.freeze({
            FALLING: "falling",
            EMPTY: "empty",
            LOCKED: "locked"
        });
        this.state = {
            data: this.initializeEmptyBoard(),
            score: 0,
            nextPiece: this.chooseRandomNewPiece()
        };
        setInterval(() => this.tick(), 500);
    }

    newTileObj(type, isPivot = false) {
        return {
            type: type,
            isPivot: isPivot
        };
    }

    getTileObj(x, y) {
        return this.state.data[y][x];
    }

    initializeEmptyBoard() {
        let initData = [];
        for (let row = 0; row < this.maxRows; row++) {
            initData.push([]);
            for (let col = 0; col < this.maxColumns; col++) {
                initData[row].push(this.newTileObj(this.tileTypes.EMPTY));
            }
        }
        return initData;
    }

    chooseRandomNewPiece() {
        return this.pieces[Math.floor(Math.random() * 7)];
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
        this.setState({data: this.state.data});
    }

    getCurrPieceLocs() {
        let currPieceLocs = [];
        for (let row = 0; row < this.maxRows; row++) {
            for (let col = 0; col < this.maxColumns; col++) {
                if (this.getTileObj(col, row).type === this.tileTypes.FALLING) {
                    currPieceLocs.push({ x: col, y: row });
                }
            }
        }
        return currPieceLocs;
    }

    movePieceLeft(currPieceLocs) {
        if (this.noCollisionLeft(currPieceLocs)) {
            for (let i = 0; i < currPieceLocs.length; i++) {
                let currTileObj = this.getTileObj(currPieceLocs[i].x, currPieceLocs[i].y);
                let swapTileObj = this.getTileObj(currPieceLocs[i].x - 1, currPieceLocs[i].y);
                currTileObj.type = this.tileTypes.EMPTY;
                swapTileObj.type = this.tileTypes.FALLING;
            }
            return true;
        }
        return false;
    }

    movePieceRight(currPieceLocs) {
        if (this.noCollisionRight(currPieceLocs)) {
            for (let i = currPieceLocs.length - 1; i >= 0; i--) {
                let currTileObj = this.getTileObj(currPieceLocs[i].x, currPieceLocs[i].y);
                let swapTileObj = this.getTileObj(currPieceLocs[i].x + 1, currPieceLocs[i].y);
                currTileObj.type = this.tileTypes.EMPTY;
                swapTileObj.type = this.tileTypes.FALLING;
            }
            return true;
        }
        return false;
    }

    movePieceDown(currPieceLocs) {
        if (this.noCollisionDown(currPieceLocs)) {
            for (let i = currPieceLocs.length - 1; i >= 0; i--) {
                let currTileObj = this.getTileObj(currPieceLocs[i].x, currPieceLocs[i].y);
                let swapTileObj = this.getTileObj(currPieceLocs[i].x, currPieceLocs[i].y + 1);
                currTileObj.type = this.tileTypes.EMPTY;
                swapTileObj.type = this.tileTypes.FALLING;
            }
            return true;
        }
        return false;
    }

    noCollisionRight(currPieceLocs) {
        let pieceLocs = currPieceLocs.slice(); // make new copy
        let edgeMap = {};
        for (let i in pieceLocs) {
            let key = String(pieceLocs[i].y);
            if (key in edgeMap){
                if (pieceLocs[i].x > edgeMap[key]){
                    edgeMap[key] = pieceLocs[i].x;
                }
            } else {
                edgeMap[key] = pieceLocs[i].x;
            }
        }  

        for (let key in edgeMap) {
            let checkTileX = edgeMap[key] + 1;
            let checkTileY = Number(key);
            if(checkTileX >= this.maxColumns)
                return false;
            else if(this.getTileObj(checkTileX, checkTileY).type !== this.tileTypes.EMPTY) 
                return false;
        }

        return true;   
    }

    noCollisionLeft(currPieceLocs) {
        let pieceLocs = currPieceLocs.slice(); // make new copy
        let edgeMap = {};
        for (let i in pieceLocs) {
            let key = String(pieceLocs[i].y);
            if (key in edgeMap){
                if (pieceLocs[i].x < edgeMap[key]){
                    edgeMap[key] = pieceLocs[i].x;
                }
            } else {
                edgeMap[key] = pieceLocs[i].x;
            }
        }  

        for (let key in edgeMap) {
            let checkTileX = edgeMap[key] - 1;
            let checkTileY = Number(key);
            if(checkTileX < 0)
                return false;
            else if(this.getTileObj(checkTileX, checkTileY).type !== this.tileTypes.EMPTY) 
                return false;
        }

        return true;   
    }

    noCollisionDown(currPieceLocs) {
        let pieceLocs = currPieceLocs.slice(); // make new copy
        let edgeMap = {};
        for (let i in pieceLocs) {
            let key = String(pieceLocs[i].x);
            if (key in edgeMap){
                if (pieceLocs[i].y > edgeMap[key]){
                    edgeMap[key] = pieceLocs[i].y;
                }
            } else {
                edgeMap[key] = pieceLocs[i].y;
            }
        }  

        for (let key in edgeMap) {
            let checkTileY = edgeMap[key] + 1;
            let checkTileX = Number(key);
            if(checkTileY >= this.maxRows)
                return false;
            else if(this.getTileObj(checkTileX, checkTileY).type !== this.tileTypes.EMPTY) 
                return false;
        }

        return true;
    }

    rotatePieceLeft(currPieceLocs) {
        let pieceLocs = currPieceLocs.slice(); // make new copy
    }

    rotatePieceRight(currPieceLocs) {
        let pieceLocs = currPieceLocs.slice(); // make new copy
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

    //return new state for rendering with new piece falling on top
    generateNewPiece() {
        switch (this.state.nextPiece) {
        case "o":
            this.getTileObj(4, 0).type = this.tileTypes.FALLING;
            this.getTileObj(4, 0).isPivot = true;
            this.getTileObj(5, 0).type = this.tileTypes.FALLING;
            this.getTileObj(5, 0).isPivot = true;
            this.getTileObj(4, 1).type = this.tileTypes.FALLING;
            this.getTileObj(4, 1).isPivot = true;
            this.getTileObj(5, 1).type = this.tileTypes.FALLING;
            this.getTileObj(5, 1).isPivot = true;
            break;

        case "i":
            this.getTileObj(4, 0).type = this.tileTypes.FALLING;
            this.getTileObj(4, 1).type = this.tileTypes.FALLING;
            this.getTileObj(4, 1).isPivot = true;
            this.getTileObj(4, 2).type = this.tileTypes.FALLING;
            this.getTileObj(4, 3).type = this.tileTypes.FALLING;
            break;

        case "s":
            this.getTileObj(4, 0).type = this.tileTypes.FALLING;
            this.getTileObj(4, 0).isPivot = true;
            this.getTileObj(5, 0).type = this.tileTypes.FALLING;
            this.getTileObj(4, 1).type = this.tileTypes.FALLING;
            this.getTileObj(3, 1).type = this.tileTypes.FALLING;
            break;

        case "z":
            this.getTileObj(3, 0).type = this.tileTypes.FALLING;
            this.getTileObj(4, 0).type = this.tileTypes.FALLING;
            this.getTileObj(4, 0).isPivot = true;
            this.getTileObj(4, 1).type = this.tileTypes.FALLING;
            this.getTileObj(5, 1).type = this.tileTypes.FALLING;
            break;

        case "l":
            this.getTileObj(4, 0).type = this.tileTypes.FALLING;
            this.getTileObj(4, 1).type = this.tileTypes.FALLING;
            this.getTileObj(4, 1).isPivot = true;
            this.getTileObj(4, 2).type = this.tileTypes.FALLING;
            this.getTileObj(4, 3).type = this.tileTypes.FALLING;
            this.getTileObj(5, 3).type = this.tileTypes.FALLING;
            break;

        case "j":
            this.getTileObj(4, 0).type = this.tileTypes.FALLING;
            this.getTileObj(4, 1).type = this.tileTypes.FALLING;
            this.getTileObj(4, 1).isPivot = true;
            this.getTileObj(4, 2).type = this.tileTypes.FALLING;
            this.getTileObj(4, 3).type = this.tileTypes.FALLING;
            this.getTileObj(3, 3).type = this.tileTypes.FALLING;
            break;

        case "t": //t
        default:
            this.getTileObj(3, 0).type = this.tileTypes.FALLING;
            this.getTileObj(4, 0).type = this.tileTypes.FALLING;
            this.getTileObj(4, 0).isPivot = true;
            this.getTileObj(5, 0).type = this.tileTypes.FALLING;
            this.getTileObj(4, 1).type = this.tileTypes.FALLING;
        }
        this.setState({nextPiece: this.chooseRandomNewPiece()});
    }

    lockPiece(currPieceLocs) {
        for (let pieceLoc in currPieceLocs) {
            this.getTileObj(currPieceLocs[pieceLoc].x, currPieceLocs[pieceLoc].y).type = this.tileTypes.LOCKED;
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
            this.getTileObj(col, row).type = this.tileTypes.EMPTY;
        }
        for (let currRow = row - 1; currRow >= 0; currRow--) {
            for (let col = 0; col < this.maxColumns; col++) {
                if (this.getTileObj(col, currRow).type === this.tileTypes.LOCKED) {
                    this.getTileObj(col, currRow).type = this.tileTypes.EMPTY;
                    this.getTileObj(col, currRow + 1).type = this.tileTypes.LOCKED;
                }
            }
        } 
    }

    checkForFullRow(row) {
        return this.state.data[row].every(tile => {return tile.type === this.tileTypes.LOCKED;});
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
        if (this.state.data.every(row => {return row.every(tile => {return tile.type !== this.tileTypes.FALLING;});})) {
            this.generateNewPiece();
        } else {
            let currPieceLocs = this.getCurrPieceLocs();
            if(!this.movePieceDown(currPieceLocs)){ // we have a downwards collision
                this.lockPiece(currPieceLocs);
                scoreGained = this.addScore(this.clearRows());
                this.generateNewPiece();
            }
        }
        this.setState({data: this.state.data,
                       score: this.state.score + scoreGained});
    }

    componentDidMount() {
        document.getElementsByClassName("app")[0].focus();
    }

    render() {
        const rowsToRender = this.state.data.map((row, index) => {
            return <Row rowData={row} key={index} />;
        });

        return (
            <div className="app flex-container" onKeyDown={e => this.handleKeyPress(e)} tabIndex="0">
                <div className="col1">
                    <h2 id="title">REACTRIS</h2>
                    <div className="game-board">
                        {rowsToRender}
                    </div>
                </div>
                <div className="col2">
                    <Score value={this.state.score} />
                    <h3>NEXT PIECE</h3>
                    <div className="next-piece-slot">
                        {this.state.nextPiece}
                    </div>
                </div>
            </div>  
        );
    }
}

export default App;
