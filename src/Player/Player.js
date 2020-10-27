import React, { Component } from 'react';
import './Player.css';
import Footer from '../Common/Footer/Footer';
import Header from '../Common/Header/Header';
import ScoreBoard from '../Common/ScoreBoard/ScoreBoard';
import { Constants, MODE, TIMER, ROUTES_ENUMS } from '../constants';
import CommonUtility from '../Service/CommonUtility';
import { Redirect } from "react-router-dom";


export default class Player extends Component {
  constructor(props) {
    super(props);
    debugger;
    this.state = { currentState: 1, currentWord: 'WINDOW', userWord: null, timerInterval: null, timePassed: 0, timeLeft: TIMER.TIME_LIMIT, remainingPathColor : TIMER.COLOR_CODES.info.color, letterStatus: [] };
    this.renderFooter = this.renderFooter.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.updateUserWord = this.updateUserWord.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.updateWordCompletion = this.updateWordCompletion.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.playAgain = this.playAgain.bind(this);

    // setTimeout(() => {
    //   this.startTimer();
    // }, 2000);
  }

  componentDidMount() {
    CommonUtility.setCurrentGameMode(MODE.PLAYING, this.forceUpdateHandler());
  }

  forceUpdateHandler(){
    return () => {
      this.forceUpdate();
    };
  }

  playAgain() {
    CommonUtility.setCurrentGameMode(MODE.PLAYING);
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
    if(userWord) {
      [...userWord].forEach((curr, i) => {
          if(curr === this.state.currentWord[i]) {
            letterStatus[i] = 'correct';
          } else {
            letterStatus[i] = 'wrong';
          }
        }
      )
    }

    await this.setState(state => ({
      letterStatus: letterStatus
    }));
  }

  renderFooter() {
    const currMode = CommonUtility.getCurrentGameMode();
    console.log(currMode);
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
    const time = this.state.timeLeft;
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
  
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
  
    return `${minutes}:${seconds}`;
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
          <div className="game-wrapper">
          {CommonUtility.getCurrentGameMode() === MODE.PLAYING ? (
              <div className="play-container">
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
              {[...this.state.currentWord].map((curr, i) => {
                // if(curr === this.getMaxResult()) {
                //   return  <span key={i}>{curr}</span>
                // }
                return <span key={i} className={`${this.state.letterStatus[i]}`}>{curr}</span>
              })}
              </div>
              <div className="input-word">
              <input className="App-Input" onChange={(e) => { this.updateUserWord(e) }} tabIndex="0" type="text"/>
              </div>
            </div>
          ) : (
            <div className="score-container">
              <div className="game-name">
                <span className="header">Score </span>
                <span className="name">: Game 2</span>
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
        </div>
        {this.renderFooter()}
      </div>
    );  
  }
}
