import React, { Component } from 'react';
import './Home.css';
import { Constants, DIFFCULTY_LEVEL, ROUTES_ENUMS }from '../constants.ts';
import { Redirect } from "react-router-dom";
// import SessionAssistant from '../Service/SessionAssistance';
import CommonUtility from '../Service/CommonUtility';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {showDropdown: false, diffLevel: 0, username: null, redirect: null};

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.setDifficultyLevel = this.setDifficultyLevel.bind(this);
    this.renderLevelDesc = this.renderLevelDesc.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  toggleDropdown() {
    const curr = !this.state.showDropdown;
    this.setState(state => ({
      showDropdown: curr
    }));
  }

  setDifficultyLevel(val) {
    this.setState(state => ({
      diffLevel: val
    }));
  }

  updateUsername(event) {
    const name = event.target.value.toUpperCase();
    this.setState(state => ({
      username: name
    }));
  }

  renderLevelDesc() {
    let val;
    switch(this.state.diffLevel) {
      case DIFFCULTY_LEVEL.EASY:
        val = 'EASY'; break;
      case DIFFCULTY_LEVEL.MEDIUM:
        val = 'MEDIUM'; break;
      case DIFFCULTY_LEVEL.HARD:
        val = 'HARD'; break;
      default: val = 'Diffculty Level';
    }
    return val;
  }

  startGame() {
    if(!(!!this.state.username)) {
      alert('Enter Username');
      return;
    }

    if(!(this.state.diffLevel)) {
      alert('Select Diffculty Level');
      return;
    }

    // TO DO : session related
    CommonUtility.setCurrentUser(this.state.username, this.state.diffLevel);
    
    this.setState(state => ({
      redirect: ROUTES_ENUMS.PLAY
    }));

    return;
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="home-container">
        <div className="logo">
          <img src={Constants.GAME_LOGO_PATH} alt="FAST FINGERS"/>
        </div>
        <div className="game-details">
          <div className="game-header">Fast Fingers</div>
          <div className="game-description">
            <span className="line"></span>
            <span className="text">The ultimate typing game</span>
            <span className="line"></span>
          </div>
        </div>
        <div className="game-username">
          <input className="App-Input" onChange={(e) => { this.updateUsername(e) }} tabIndex="0" placeholder="Type Your Name" type="text"/>
        </div>
        <div className="App-Dropdown game-diffculty" onClick={this.toggleDropdown} tabIndex="0">
          <div className="App-Dropdown-main">
            <span>{this.renderLevelDesc()}</span>
            <img src={Constants.DROPDOWN_PATH} alt="Click to expand or collapse"/>
          </div>
          <div className={`App-Dropdown-options ${(this.state.showDropdown) ? "show" : ""}`}>
            <div className="App-Dropdown-options-content">
              <span tabIndex="0" className="App-Dropdown-Option" onClick={() => { this.setDifficultyLevel(1) }}>Easy</span>
              <span tabIndex="0" className="App-Dropdown-Option" onClick={() => { this.setDifficultyLevel(2) }}>Medium</span>
              <span tabIndex="0" className="App-Dropdown-Option" onClick={() => { this.setDifficultyLevel(3) }}>Hard</span>
            </div>
          </div>
        </div>
        <div className={`start-game ${(this.state.diffLevel && !!this.state.username) ? "start" : ""}`} onClick={this.startGame}>
          <img src={Constants.PLAY_BUTTON_PATH} alt="Start Game"/>
          <span>Start Game</span>
        </div>
      </div>
    );
  }
}