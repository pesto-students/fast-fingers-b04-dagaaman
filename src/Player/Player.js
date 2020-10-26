import React, { Component } from 'react';
import './Player.css';
import Footer from '../Common/Footer/Footer';
import Header from '../Common/Header/Header';
import ScoreBoard from '../Common/ScoreBoard/ScoreBoard';
import { MODE } from '../constants'

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {showDropdown: true, diffLevel: 0, username: null, redirect: null};
    this.renderFooter = this.renderFooter.bind(this);
  }

  renderFooter() {
    if(this.state.showDropdown) {
      return <Footer
      footerType={MODE.PLAYING}
      acc={this.state.showDropdown}
      />
    } else if (!this.state.showDropdown) {
      return <Footer
      footerType={MODE.SCORE_REPORT}
      acc={this.state.showDropdown}
      />
    }
    return '';
  }

  render() {
    return (
      <div className="player-container">
        <Header/>
        <div className="player-box">
          <div className="scoreboard-wrapper"> <ScoreBoard /> </div>
          <div className="game-wrapper">
            {/* // if else here */}
          </div>

          

        </div>
        {this.renderFooter()}
      </div>
    );  
  }
}