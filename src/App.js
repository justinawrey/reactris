import React, { Component } from "react";
import { Tile } from "./Tile";
import { Row } from "./Row";
import { Score } from "./Score";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.pieces = ["o", "i", "s", "z", "l", "j", "t"];
        this.state = {
            data: this.initializeEmptyBoard(),
            activePieceBottom: 0,
            score: 0,
            nextPiece: this.chooseRandomNewPiece()
        };
    }

    newTileObj(type, isPivot=false) {
        return {
            type: type,
            isPivot: isPivot
        };
    }

    initializeEmptyBoard() {
        return Array(22)
            .fill()
            .map(() => Array(10).fill(this.newTileObj("empty")));
    }

    chooseRandomNewPiece() {
        return this.pieces[Math.floor(Math.random() * 7)];
    }

    //a single game move
    tick() {
        let newState;
        newState = this.letPieceFallAndPotentiallyLock(this.state); //let piece fall
        newState = this.checkForClearAndBumpDown(newState); //check for line clears
        newState = this.generateNewPiece(newState); //generate a new falling piece

        //set new state ONLY ONCE
        this.setState(newState);
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
                    return tile.type !== "falling";
                });
            })
        ) {
            switch (newState.nextPiece) {
                case "o":
                    newState.data.splice(
                        0,
                        2,
                        ["e", "e", "e", "e", "fp", "fp", "e", "e", "e", "e"],
                        ["e", "e", "e", "e", "fp", "fp", "e", "e", "e", "e"]
                    );
                    newState.activePieceBottom = 1;
                    break;

                case "i":
                    newState.data.splice(
                        0,
                        4,
                        ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"],
                        ["e", "e", "e", "e", "e", "fp", "e", "e", "e", "e"],
                        ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"],
                        ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"]
                    );
                    newState.activePieceBottom = 3;
                    break;

                case "s":
                    newState.data.splice(
                        0,
                        2,
                        ["e", "e", "e", "e", "fp", "f", "e", "e", "e", "e"],
                        ["e", "e", "e", "f", "f", "e", "e", "e", "e", "e"]
                    );
                    newState.activePieceBottom = 1;
                    break;

                case "z": //z
                    newState.data.splice(
                        0,
                        2,
                        ["e", "e", "e", "e", "f", "fp", "e", "e", "e", "e"],
                        ["e", "e", "e", "e", "e", "f", "f", "e", "e", "e"]
                    );
                    newState.activePieceBottom = 1;
                    break;

                case "l": //l
                    newState.data.splice(
                        0,
                        4,
                        ["e", "e", "e", "e", "f", "e", "e", "e", "e", "e"],
                        ["e", "e", "e", "e", "fp", "e", "e", "e", "e", "e"],
                        ["e", "e", "e", "e", "f", "e", "e", "e", "e", "e"],
                        ["e", "e", "e", "e", "f", "f", "e", "e", "e", "e"]
                    );
                    newState.activePieceBottom = 3;
                    break;

                case "j": //j
                    newState.data.splice(
                        0,
                        4,
                        ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"],
                        ["e", "e", "e", "e", "e", "fp", "e", "e", "e", "e"],
                        ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"],
                        ["e", "e", "e", "e", "f", "f", "e", "e", "e", "e"]
                    );
                    newState.activePieceBottom = 3;
                    break;

                case "t": //t
                default:
                    newState.data.splice(
                        0,
                        2,
                        ["e", "e", "e", "e", "f", "fp", "f", "e", "e", "e"],
                        ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"]
                    );
                    newState.activePieceBottom = 1;
            }
        }
        newState.nextPiece = this.chooseRandomNewPiece();
    }

    //return new state with all 'f' changed to 'x'
    swapFallingToLocked(state) {
        let newState = state;
        newState.data = newState.data.map(row => {
            return row.map(tile => {
                return tile.type === "falling" ? this.newTileObj("locked") : tile;
            });
        });
        return newState;
    }

    //render app
    render() {
        //get rows to render
        const rowsToRender = this.state.data.map((row, index) => {
            return <Row rowData={row} key={index} />;
        });

        //render app
        return (
            <div className="app">
                <div className="col1">
                    <div className="app-header">
                        <h2>REACTRIS</h2>
                    </div>
                    <div className="game-board">{rowsToRender}</div>
                    <button onClick={() => this.tick()}> tick </button>
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
                </div>
            </div>
        );
    }
}

export default App;
