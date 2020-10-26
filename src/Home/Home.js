import React from 'react';
import './Home.css';
import { Constants }from '../constants.ts';

function Home() {
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
        <input className="App-Input" tabIndex="0" placeholder="Type Your Name" type="text"/>
      </div>
      <div className="App-Dropdown game-diffculty" tabIndex="0">
        <div className="App-Dropdown-main">
          <span>Diffculty Level</span>
          <img src={Constants.DROPDOWN_PATH} alt="Click to expand or collapse"/>
        </div>
        <div className="App-Dropdown-options ">
          <div className="App-Dropdown-options-content">
            <span tabIndex="0" className="App-Dropdown-Option">Easy</span>
            <span tabIndex="0" className="App-Dropdown-Option">Medium</span>
            <span tabIndex="0" className="App-Dropdown-Option">Hard</span>
          </div>
        </div>
      </div>
      <div className="start-game">
        <img src={Constants.PLAY_BUTTON_PATH} alt="Start Game"/>
        <span>Start Game</span>
      </div>
    </div>
  );
}

export default Home;
