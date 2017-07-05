import React, { Component } from 'react';
import { Row } from './Tile';
import { Score } from './Score'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "x", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "x", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "x", "e", "e", "e", "e", "e", "f", "e", "e"],
        ["e", "x", "e", "e", "e", "e", "e", "f", "f", "e"],
        ["e", "x", "e", "e", "e", "e", "e", "e", "f", "e"],
        ["e", "x", "x", "x", "x", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "x", "e", "e", "e", "e", "e", "e"],
        ["x", "x", "x", "x", "x", "x", "x", "x", "e", "e"],
        ["x", "x", "x", "x", "x", "x", "x", "x", "e", "e"]],
      activePieceBottom: 18,
      score: 0,
      nextPiece: null
    };
    setInterval(() => this.tick(), 1000);
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
    let retState = state;
    let lock = false;
    for (let j = retState.activePieceBottom; j > retState.activePieceBottom - 5; j--) {
      if (j >= 0) {
        for (let i = 0; i < 10; i++) {
          if ((retState.data[j])[i] === 'f') {
            (retState.data[j])[i] = 'e';
            (retState.data[j + 1])[i] = 'f';
            if(j + 2 <= 21 && (retState.data[j + 2])[i] === 'x'){ // check if we hit a piece
              lock = true;
            }
          }
        }
      }
    }
    retState.activePieceBottom++;

    //check if we hit bottom or hit a piece, and lock if we did
    if (retState.activePieceBottom === 21 || lock) {
      return this.swapFallingToLocked(retState);
    }

    return retState;
  }

  //check if any rows are cleared, give points, and return new state for rendering
  checkForClearAndBumpDown(state) {
    let retState = state;
    retState.data = retState.data.filter(row => {
      return !row.every(tile => {
        return tile === 'x'
      });
    });

    //increment score and fill more blank tiles
    while (retState.data.length < 22) {
      retState.data.unshift(Array(10).fill('e'));
      retState.score += 100;
    }

    return retState;
  }

  //return new state for rendering with new piece falling on top
  generateNewPiece(state) {
    let retState = state;

    //check for no falling pieces before generating a new one
    if (retState.data.every(row => {return row.every(tile => {return tile !== 'f'})})) {
      switch (Math.floor(Math.random() * 7)) {
        case 0: //o
          retState.data.splice(0, 2, ["e", "e", "e", "e", "f", "f", "e", "e", "e", "e"],
                                     ["e", "e", "e", "e", "f", "f", "e", "e", "e", "e"]);
          retState.activePieceBottom = 1;
          break;

        case 1: //i
          retState.data.splice(0, 4, ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"],
                                     ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"],
                                     ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"],
                                     ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"]);
          retState.activePieceBottom = 3;
          break;

        case 2: //s
          retState.data.splice(0, 2, ["e", "e", "e", "e", "f", "f", "e", "e", "e", "e"],
                                     ["e", "e", "e", "f", "f", "e", "e", "e", "e", "e"]);
          retState.activePieceBottom = 1;
          break;

        case 3: //z
          retState.data.splice(0, 2, ["e", "e", "e", "e", "f", "f", "e", "e", "e", "e"],
                                     ["e", "e", "e", "e", "e", "f", "f", "e", "e", "e"]);
          retState.activePieceBottom = 1;
          break;

        case 4: //l
          retState.data.splice(0, 4, ["e", "e", "e", "e", "f", "e", "e", "e", "e", "e"],
                                     ["e", "e", "e", "e", "f", "e", "e", "e", "e", "e"],
                                     ["e", "e", "e", "e", "f", "e", "e", "e", "e", "e"],
                                     ["e", "e", "e", "e", "f", "f", "e", "e", "e", "e"]);
          retState.activePieceBottom = 3;
          break;

        case 5: //j
          retState.data.splice(0, 4, ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"],
                                     ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"],
                                     ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"],
                                     ["e", "e", "e", "e", "f", "f", "e", "e", "e", "e"]);
          retState.activePieceBottom = 3
          break;

        case 6: //t
          retState.data.splice(0, 2, ["e", "e", "e", "e", "f", "f", "f", "e", "e", "e"],
                                     ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"]);
          retState.activePieceBottom = 1;
          break;

        default: //default to t shape
          retState.data.splice(0, 2, ["e", "e", "e", "e", "f", "f", "f", "e", "e", "e"],
                                     ["e", "e", "e", "e", "e", "f", "e", "e", "e", "e"]);
          retState.activePieceBottom = 1;
          break;
      }
    }
    return retState;
  }

  //return new state with all 'f' changed to 'x'
  swapFallingToLocked(state) {
    let retState = state;
    retState.data = retState.data.map(row => {
      return row.map(tile => {
        return tile === 'f' ? 'x' : tile
      });
    });
    return retState;
  }


  //render app
  render() {
    //get rows to render
    const rowsToRender = this.state.data.map((row, index) => {
      return <Row rowData={row} key={index}/>;
    });

    //render app
    return (
      <div className="app">
        <div className="col1">
          <div className="app-header">
            <h2>REACTRIS</h2>
          </div>
          <div className="game-board">
            {rowsToRender}
          </div>
          <button onClick={() => this.tick()}> tick </button>
        </div>
        <div className="col2">
          <div className="score">
            <Score value={this.state.score}/>
          </div>
          <div className="next-piece-header">
            <h3>NEXT PIECE</h3>
          </div>
          <div className="next-piece-slot">
            hello
          </div>
        </div>
      </div>
      );
  }
}

export default App;
