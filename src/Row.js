import React, { Component } from 'react';
import { Tile } from "./Tile";
import "./Row.css";

class Row extends Component {
  render() {
    const tiles = this.props.rowData.map((tileStatus, index) => {
      return <Tile type={tileStatus} key={index}/>;
    });
    return (
      <div className="row">
        {tiles}
      </div>
    );
  }
}

export { Row };
