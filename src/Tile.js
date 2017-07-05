import React, { Component } from 'react';
import './Tile.css'

class Tile extends Component {
  render() {
    return (
      <div className="tile">
        {this.props.status}
      </div>
    );
  }
}

class Row extends Component {
  render() {
    const tiles = this.props.rowData.map((tileStatus, index) => {
      return <Tile status={tileStatus} key={index}/>;
    });

    return (
      <div className="row">
        {tiles}
      </div>
    );
  }
}

export { Tile, Row };
