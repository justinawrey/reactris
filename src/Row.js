import React, { Component } from "react";
import { Tile } from "./Tile";
import "./Row.css";

class Row extends Component {
    render() {
        const tiles = this.props.rowData.map((tileObj, index) => {
            return <Tile tileType={tileObj.type} isPivot={tileObj.isPivot} color={tileObj.color} key={index}/>;
        });
        return (
            <div className="row">
                {tiles}
            </div>
        );
    }
}

export { Row };
