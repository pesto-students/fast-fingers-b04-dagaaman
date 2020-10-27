import React, { Component } from 'react';
import './Player.css';
import Footer from '../Common/Footer/Footer';
import Header from '../Common/Header/Header';
import ScoreBoard from '../Common/ScoreBoard/ScoreBoard';
import { Constants, MODE, TIMER, ROUTES_ENUMS, KEYWORDS, DIFFCULTY_LEVEL } from '../constants';
import CommonUtility from '../Service/CommonUtility';
import { Redirect } from "react-router-dom";


export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { user: CommonUtility.getCurrentUser(), testData: CommonUtility.getTestData(), currentState: 1, instruction: '', currentWord: null, userWord: null, timerInterval: null, timePassed: 0, timeLeft: TIMER.TIME_LIMIT, remainingPathColor : TIMER.COLOR_CODES.info.color, letterStatus: [] };
    this.renderFooter = this.renderFooter.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.updateUserWord = this.updateUserWord.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.updateWordCompletion = this.updateWordCompletion.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.beginScreen = this.beginScreen.bind(this);
    // setTimeout(() => {
    //   this.startTimer();
    // }, 2000);
  }

  componentDidMount() {
    CommonUtility.setCurrentGameMode(MODE.PLAYING, this.forceUpdateHandler());
    this.beginScreen();
  }

  forceUpdateHandler(){
    return () => {
      this.forceUpdate();
      if(!!this.state.currentWord) {
        this.getWord();
      }
    };
  }

  async playAgain() {
    await this.setState(state => ({
      currentWord: null
    }));
    CommonUtility.setCurrentGameMode(MODE.PLAYING);
    this.updateTestData(0);
    this.beginScreen();
  }

  getWord() {
    if(this.state.user && this.state.user.level) {
      const word = CommonUtility.getWord(this.state.user.level);
      this.setState(state => ({
        currentWord: word
      }));
    }
  }

  async updateUserLevel() {
    const user = this.state.user;
    user.level = user.level + DIFFCULTY_LEVEL.INCREASE_FACTOR;
    await this.setState(state => ({
      user: user
    }));
    CommonUtility.setCurrentUserGameLevel(user.level);
    CommonUtility.forceUpdate();    
  }

  onSuccessfulAttempt() {
    this.getWord();
    // increaseDiffculty
    this.updateUserLevel();
    this.updateTestData(1);
    // update timer
    document.getElementById('user-word-input').value = '';
    document.getElementById('user-word-input').focus();
  }

  updateTestData(success) {
    const testData = CommonUtility.updateTestData(success, 20);
    this.setState(state => ({
      testData: testData
    }));
  }

  async beginScreen() {
    let curr = 0;
    const interval = setInterval(() => {
      if(curr < KEYWORDS.INTRODUCTION.length) {
        this.setState(state => ({
          instruction: KEYWORDS.INTRODUCTION[curr]
        }));
        curr++;
      } else {
        clearInterval(interval);
        this.hideInstruction();
        this.getWord();
        document.getElementById('user-word-input').focus();
      }
    }, 1000);
  }

  async hideInstruction() {
    await this.setState(state => ({
      instruction: null
    }));
  }

  async updateUserWord(event) {
    let curr = event.target.value;
    if(!!curr) {
      curr = curr.toUpperCase();
    }
    await this.setState(state => ({
      userWord: curr
    }));

    this.updateWordCompletion();
  }

  async updateWordCompletion() {
    const letterStatus = Array(1).fill('');
    const userWord = this.state.userWord;
    if(this.state.userWord && this.state.userWord.length && this.state.userWord.toLowerCase() === this.state.currentWord.toLowerCase()) {
      this.onSuccessfulAttempt();
    } else {
      if(userWord) {
        [...userWord].forEach((curr, i) => {
            if(curr.toLowerCase() === this.state.currentWord[i].toLowerCase()) {
              letterStatus[i] = 'correct';
            } else {
              letterStatus[i] = 'wrong';
            }
          }
        )
      }
    }

    await this.setState(state => ({
      letterStatus: letterStatus
    }));
  }

  renderFooter() {
    const currMode = CommonUtility.getCurrentGameMode();
    if(currMode) {
      return <Footer
      footerType={currMode}
      />
    } 
    return '';
  }

  renderHeader() {
    const currMode = CommonUtility.getCurrentGameMode();
    if(currMode) {
      return <Header
      headerType={currMode}
      />
    } 
    return '';
  }

  onTimesUp() {
    clearInterval(this.state.timerInterval);
  }

  startTimer() {
    const timerInterval = setInterval(() => {
      const timePassed = this.state.timePassed + 1;
      this.setState(state => ({
        timePassed: timePassed
      }));

      const timeLeft = TIMER.TIME_LIMIT - timePassed;
      this.setState(state => ({
        timeLeft: timeLeft
      }));

      document.getElementById("base-timer-label").innerHTML = this.formatTime(timeLeft);

      this.setState(state => ({
        timerInterval: timerInterval
      }));

      this.setCircleDasharray();
      this.setRemainingPathColor(timeLeft);
  
      if (timeLeft === 0) {
        this.onTimesUp();
      }
    }, 1000);
  }

  formatTime() {
    return CommonUtility.formatTime(this.state.timeLeft);
  }

  setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = TIMER.COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(info.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(warning.color);
    }
  }

  calculateTimeFraction() {
    const rawTimeFraction = this.state.timeLeft / TIMER.TIME_LIMIT;
    return rawTimeFraction - (1 / TIMER.TIME_LIMIT) * (1 - rawTimeFraction);
  }

  setCircleDasharray() {
    const circleDasharray = `${(
      this.calculateTimeFraction() * TIMER.FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  }

  initializeGame() {
    this.setState(state => ({
      gameInitialize: true
    }));
  }

  render() {
    if(CommonUtility.getCurrentGameMode() === MODE.HOME) {
      return <Redirect to={ROUTES_ENUMS.DEFAULT} />
    }
    return (
      <div className="player-container">
        {this.renderHeader()}
        <div className="player-box">
          <div className={`scoreboard-wrapper ${(CommonUtility.getCurrentGameMode() === MODE.PLAYING) ? "" : "hide"}`}> <ScoreBoard /> </div>
          <div className={`game-wrapper ${(this.state.instruction) ? "hide" : "show"}`}>
          {CommonUtility.getCurrentGameMode() === MODE.PLAYING ? (
              <div className={`play-container ${(this.state.currentWord) ? "" : "hide"}`} >
              <div className="timer">
                <div id="app">
                <div className="base-timer">
                  <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g className="base-timer__circle">
                      <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                      <path
                        id="base-timer-path-remaining"
                        strokeDasharray="283"
                        className={`base-timer__path-remaining ${this.state.remainingPathColor}`}
                        d="
                          M 50, 50
                          m -45, 0
                          a 45,45 0 1,0 90,0
                          a 45,45 0 1,0 -90,0
                        "
                      ></path>
                    </g>
                  </svg>
                  <span id="base-timer-label" className="base-timer__label">{this.formatTime()}</span>
                </div>
                </div>
              </div>
              <div className="word">
                {[...this.state.currentWord || ''].map((curr, i) => {
                  return <span key={i} className={`${this.state.letterStatus[i]}`}>{curr}</span>
                })}
              </div>
              <div className="input-word">
              <input className="App-Input" id="user-word-input" onChange={(e) => { this.updateUserWord(e) }} tabIndex="0" type="text"/>
              </div>
            </div>
          ) : (
            <div className="score-container">
              <div className="game-name">
                <span className="header">Score </span>
                <span className="name">: Game {this.state.testData?.gameName}</span>
              </div>
              <div className="score">9833:59</div>
              <div className="high-score">New high score</div>
              <div className="play-again">
                <div className="play-again-container App-Button" onClick={this.playAgain}>
                  <img src={Constants.REPEAT} alt="Play Again"/>
                  <span className="repeat">Play again</span>
                </div>
              </div>
            </div>
            )}            
          </div>
          <div className={`game-wrapper ${(this.state.instruction) ? "" : "hide"}`}>
            <div className="play-container">
              <div className="word">
                 <span>{this.state.instruction}</span>
              </div>
              
            </div>        
          </div>
          
        </div>
        {this.renderFooter()}
      </div>
    );  
  }
}
