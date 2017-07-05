import React, { Component } from 'react';

class Score extends Component {
  render() {
    return (
      <h3>
      Score: {this.props.value}
      </h3>
    );
  }
}

export { Score };
