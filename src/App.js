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

    movePiece(e) {
        e.preventDefault();
        const currPieceLocs = this.getCurrPieceLocs();
        if (e.key === "ArrowLeft") {
            this.movePieceLeft(currPieceLocs);
        } else if (e.key === "ArrowRight") {
            this.movePieceRight(currPieceLocs);
        } else if (e.key === "ArrowDown") {
            this.movePieceDown(currPieceLocs);
        }
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
                let currTileObj = this.getTileObj(
                    currPieceLocs[i].x,
                    currPieceLocs[i].y
                );
                let swapTileObj = this.getTileObj(
                    currPieceLocs[i].x - 1,
                    currPieceLocs[i].y
                );
                currTileObj.type = this.tileTypes.EMPTY;
                swapTileObj.type = this.tileTypes.FALLING;
            }
        }
    }

    movePieceRight(currPieceLocs) {
        if (this.noCollisionRight(currPieceLocs)) {
            for (let i = currPieceLocs.length - 1; i >= 0; i--) {
                let currTileObj = this.getTileObj(
                    currPieceLocs[i].x,
                    currPieceLocs[i].y
                );
                let swapTileObj = this.getTileObj(
                    currPieceLocs[i].x + 1,
                    currPieceLocs[i].y
                );
                currTileObj.type = this.tileTypes.EMPTY;
                swapTileObj.type = this.tileTypes.FALLING;
            }
        }
    }

    movePieceDown(currPieceLocs) {
        if (this.noCollisionDown(currPieceLocs)) {
            for (let i = currPieceLocs.length - 1; i >= 0; i--) {
                let currTileObj = this.getTileObj(
                    currPieceLocs[i].x,
                    currPieceLocs[i].y
                );
                let swapTileObj = this.getTileObj(
                    currPieceLocs[i].x,
                    currPieceLocs[i].y + 1
                );
                currTileObj.type = this.tileTypes.EMPTY;
                swapTileObj.type = this.tileTypes.FALLING;
            }
        }
    }

    noCollisionRight(currPieceLocs) {
        let pieceLocs = currPieceLocs.slice(); // make new copy
    }

    noCollisionLeft(currPieceLocs) {
        let pieceLocs = currPieceLocs.slice(); // make new copy
    }

    noCollisionDown(currPieceLocs) {
        let pieceLocs = currPieceLocs.slice(); // make new copy
    }

    //let a piece fall if it can, and return new state for rendering
    letPieceFallAndPotentiallyLock(state) {
        //bump piece down one row.  check 5 rows upwards because 5 rows is max piece size
        //if we hit something, raise a lock signal
        let newState = state;
        let lock = false;
        for (
            let j = newState.activePieceBottom;
            j > newState.activePieceBottom - 5;
            j--
        ) {
            if (j >= 0) {
                for (let i = 0; i < 10; i++) {
                    if (newState.data[j][i] === this.newTileObj("falling")) {
                        newState.data[j][i] = this.newTileObj("empty");
                        newState.data[j + 1][i] = this.newTileObj("falling");
                        if (
                            j + 2 <= 21 &&
                            newState.data[j + 2][i].type === "locked"
                        ) {
                            // check if we hit a piece
                            lock = true;
                        }
                    }
                }
            }
        }
        newState.activePieceBottom++;

        //check if we hit bottom or hit a piece, and lock if we did
        if (newState.activePieceBottom === 21 || lock) {
            return this.swapFallingToLocked(newState);
        }

        return newState;
    }

    //check if any rows are cleared, give points, and return new state for rendering
    checkForClearAndBumpDown(state) {
        let newState = state;
        newState.data = newState.data.filter(row => {
            return !row.every(tile => {
                return tile.type === "locked";
            });
        });

        //increment score and fill more blank tiles
        while (newState.data.length < 22) {
            newState.data.unshift(Array(10).fill(this.newTileObj("empty")));
            newState.score += 100;
        }

        return newState;
    }

    //return new state for rendering with new piece falling on top
    generateNewPiece(state) {
        let newState = state;

        //check for no falling pieces before generating a new one
        if (
            newState.data.every(row => {
                return row.every(tile => {
                    return tile.type !== this.tileTypes.FALLING;
                });
            })
        ) {
            switch (newState.nextPiece) {
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
        }
        newState.nextPiece = this.chooseRandomNewPiece();
        return newState;
    }

    //return new state with all 'f' changed to 'x'
    swapFallingToLocked(state) {
        let newState = state;
        newState.data = newState.data.map(row => {
            return row.map(tile => {
                return tile.type === "falling"
                    ? this.newTileObj("locked")
                    : tile;
            });
        });
        return newState;
    }

    //a single game move
    tick() {
        //newState = this.letPieceFallAndPotentiallyLock(this.state); //let piece fall
        // newState = this.checkForClearAndBumpDown(newState); //check for line clears
        let newState = this.generateNewPiece(this.state); //generate a new falling piece

        //set new state ONLY ONCE
        this.setState(newState);
    }

    //render app
    render() {
        //get rows to render
        const rowsToRender = this.state.data.map((row, index) => {
            return <Row rowData={row} key={index} />;
        });

        //render app
        return (
            <div
                className="app flex-container"
                onKeyDown={e => this.movePiece(e)}
            >
                <div className="col1">
                    <div className="app-header">
                        <h2 id="title">REACTRIS</h2>
                    </div>
                    <div className="game-board">{rowsToRender}</div>
                </div>
                <div className="col2">
                    <div className="score">
                        <Score value={this.state.score} />
                    </div>
                    <div className="next-piece-header">
                        <h3>NEXT PIECE</h3>
                    </div>
                    <div className="next-piece-slot">
                        {this.state.nextPiece}
                    </div>
                    <button onClick={() => this.tick()}> tick </button>
                </div>
            </div>
        );
    }
}

export default App;
