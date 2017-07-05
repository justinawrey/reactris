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
        ["e", "x", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "x", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "x", "e", "e", "e", "e", "e", "e", "f", "f"],
        ["e", "x", "x", "x", "x", "e", "e", "e", "f", "f"],
        ["e", "e", "e", "x", "e", "e", "e", "e", "e", "e"],
        ["x", "x", "x", "x", "x", "x", "x", "x", "e", "e"],
        ["x", "x", "x", "x", "x", "x", "x", "x", "e", "e"]],
      activePieceBottom: 18,
      score: 0,
      nextPiece: null
    };
  }

  //a single game move
  tick() {
    let newState;
    newState = this.letPieceFallAndPotentiallyLock(this.state); //let piece fall
    console.log(newState);
    newState = this.checkForClearAndBumpDown(newState); //check for line clears
    console.log(newState);

    //set new state ONLY ONCE
    this.setState(newState);
  }

  //check if any rows are cleared, give points, and return new state for rendering
  checkForClearAndBumpDown(state) {
    let retState = state;
    retState.data = retState.data.filter(row => {
      return !row.every(tile => {return tile === 'x'});
    });

    //increment score and fill more blank tiles
    while(retState.data.length < 22){
      retState.data.unshift(Array(10).fill('e'));
      retState.score += 100;
    }

    return retState;
  }

  //let a piece fall if it can, and return new state for rendering
  letPieceFallAndPotentiallyLock(state) {
    //bump piece down one row.  check 5 rows upwards because 5 rows is max piece size
    let retState = state;
    for (let j = retState.activePieceBottom; j > retState.activePieceBottom - 5; j--) {
      if (j >= 0) {
        for (let i = 0; i < 10; i++) {
          if ((retState.data[j])[i] === 'f') {
            (retState.data[j])[i] = 'e';
            (retState.data[j + 1])[i] = 'f';
          }
        }
      }
    }
    retState.activePieceBottom++;

    //check if we hit bottom, and lock if we did
    if(retState.activePieceBottom === 21){
      return this.swapFallingToLocked(retState);
    }

    const rowToCheck = retState.data[retState.activePieceBottom];
    const nextRow = retState.data[retState.activePieceBottom + 1];

    //check if we hit another tile, and lock if we did
    for (let i = 0; i < 10; i++) {
      if (rowToCheck[i] === 'f' && nextRow[i] === 'x') { //hit a tile
        return this.swapFallingToLocked(retState);
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
