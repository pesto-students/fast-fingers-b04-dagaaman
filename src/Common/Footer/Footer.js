import React, { Component } from 'react';
import './Footer.css';
import { Constants, MODE } from '../../constants'
import CommonUtility from '../../Service/CommonUtility';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {mode: props.footerType};

    this.stopGame = this.stopGame.bind(this);
    this.quitGame = this.quitGame.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  }

  componentDidMount() {
    CommonUtility.addListner(this.forceUpdateHandler());
  }

  forceUpdateHandler(){
    return () => {
      this.setState(state => ({
        mode: CommonUtility.getCurrentGameMode()
      }));
    };
  }

  stopGame() {
    CommonUtility.stopGame();
  }

  quitGame() {
    CommonUtility.quitGame();
  }

  render() {
    if(this.state.mode === MODE.PLAYING) {
      return (
        <div className="footer-container">
          <div className="stop-game">
            <div className="stop-game App-Button" onClick={this.stopGame}>
              <img src={Constants.CROSS} alt="Stop Game" />
              <span>Stop Game</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="footer-container">
        <div className="stop-game" onClick={this.quitGame}>
            <span className="App-Button">Quit</span>
        </div>
      </div>
    );
  }
}