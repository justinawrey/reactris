import React, { Component } from "react";
import "./Tile.css";

class Tile extends Component {
  render() {
    return (
      <div className={this.props.type}>
      </div>
    );
  }
}

export { Tile };