import React, { Component } from 'react';
import './Footer.css';
import { Constants, MODE } from '../../constants'

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {mode: props.footerType};
  }

  render() {
    if(this.state.mode === MODE.PLAYING) {
      return (
        <div className="footer-container">
          <div className="stop-game">
              <img src={Constants.CROSS} alt="Stop Game" />
              <span>Stop Game</span>
          </div>
        </div>
      );
    }

    return (
      <div className="footer-container">
        <div className="stop-game">
            <span>Quit</span>
        </div>
      </div>
    );
  }
}