import React, { Component } from 'react';
import './Header.css';
import { Constants } from '../../constants'

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {showDropdown: false, diffLevel: 0, username: null, redirect: null};
  }


  render() {
    return (
      <div className="header-container"> 
        <div className="user-details header-details">
          <div className="player-name">
            <img src={Constants.PROFILE} alt="Player Icon" />
            <span> PLAYER_NAME_7777 </span>
          </div>
          <div className="game-level">
            <img src={Constants.GAME} alt="Game Level" />
            <span> Medium </span>
          </div>
        </div>
        <div className="score-details header-details">
          <div className="game-header">Fast Fingers</div>
          <div className="game-current-score">Score: 0:30</div>
        </div>
      </div>
    );
  }
}