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
            <div className="stop-game App-Button">
              <img src={Constants.CROSS} alt="Stop Game" />
              <span>Stop Game</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="footer-container">
        <div className="stop-game ">
            <span className="App-Button">Quit</span>
        </div>
      </div>
    );
  }
}