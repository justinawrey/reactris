import React, { Component } from "react";
import "./Tile.css";

class Tile extends Component {
    render() {
        const className = `${this.props.type} ${this.props.color}`;
        return (
            <div className={className}>
            </div>
        );
    }
}

export { Tile };