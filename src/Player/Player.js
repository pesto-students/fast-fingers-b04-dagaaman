import React, { Component } from 'react';
import './Player.css';
import Footer from '../Common/Footer/Footer';
import Header from '../Common/Header/Header';
import ScoreBoard from '../Common/ScoreBoard/ScoreBoard';
import Timer from '../Timer/Timer';
import { Constants, MODE, TIMER, ROUTES_ENUMS, KEYWORDS, DIFFCULTY_LEVEL } from '../constants';
import CommonUtility from '../Service/CommonUtility';
import { Redirect } from "react-router-dom";


export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { user: CommonUtility.getCurrentUser(), testData: CommonUtility.getTestData(), currentState: 1, instruction: '', currentWord: null, userWord: null, timerInterval: null, timePassed: 0, timeLeft: TIMER.TIME_LIMIT, actualTime: TIMER.TIME_LIMIT,  remainingPathColor : TIMER.COLOR_CODES.info.color, letterStatus: [],timerOn: false, highScore: false,
    timerStart: 0,
    timerTime: 0 };
    this.renderFooter = this.renderFooter.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.updateUserWord = this.updateUserWord.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.updateWordCompletion = this.updateWordCompletion.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.beginScreen = this.beginScreen.bind(this);
    // this.updateTimerEvent = this.updateTimerEvent.bind(this);
    this.lastScore = this.lastScore.bind(this);
    
    // setTimeout(() => {
    //   this.startTimer();
    // }, 2000);
  }

  componentDidMount() {
    CommonUtility.setCurrentGameMode(MODE.PLAYING, this.forceUpdateHandler());
    this.beginScreen();
    CommonUtility.resetTimer();
  }

  getMaxResult(testData) {
    return Math.max.apply(Math, testData.results.map(function(o) { return o.score; }))
  }

  updateHighScore(isHighScore) {
    if(this.state.highScore !== isHighScore) { 
      this.setState(state => ({
        highScore: isHighScore
      }));
    }
  }

  lastScore() {
    const testData = CommonUtility.populateUserGameData();
    let highScore = false;
    if(!!testData && testData.results && testData.results.length) {
      if(testData.results[testData.results.length - 1].score === this.getMaxResult(testData)) {
        highScore = true;
        this.updateHighScore(highScore);
      }
      return CommonUtility.formatTime(testData.results[testData.results.length - 1].score);
    }
    this.updateHighScore(highScore);
    return CommonUtility.formatTime();
  }

  forceUpdateHandler(){
    return () => {
      this.forceUpdate();
      if(!!this.state.currentWord && CommonUtility.getCurrentGameMode() === MODE.PLAYING) {
        this.getWord();
      }
    };
  }

  async playAgain() {
    await this.setState(state => ({
      currentWord: null
    }));
    CommonUtility.resetTimer();
    CommonUtility.setCurrentGameMode(MODE.PLAYING);
    this.updateTestData(0);
    this.beginScreen();
  }

  async setTimer(word) {
    if(this.state.user && this.state.user.level) {
      const time = CommonUtility.getTimeLimit(word);
      await this.setState(state => ({
        actualTime: time
      }));
      await this.setState(state => ({
        timeLeft: time
      }));
      this.startTimer();

    }
  }

  getWord() {
    if(this.state.user && this.state.user.level) {
      const word = CommonUtility.getWord(this.state.user.level);
      this.setState(state => ({
        currentWord: word
      }));
      this.setTimer(word);
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
        CommonUtility.startTimer();
        this.getWord();
        if(document.getElementById('user-word-input')) {
          document.getElementById('user-word-input').focus();
        }
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
            if(curr && this.state.currentWord && this.state.currentWord[i] && curr.toLowerCase() === this.state.currentWord[i].toLowerCase()) {
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
    this.stopTimer();
    CommonUtility.stopGame();
  }

  formatTime(time) {
    return CommonUtility.formatTime(time);
  }

  setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = TIMER.COLOR_CODES;
    if(document.getElementById("base-timer-path-remaining")) {
      if (timeLeft <= alert.threshold ) {
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
  }

  calculateTimeFraction(val) {
    const rawTimeFraction = val / this.state.actualTime;
    return Math.min(1, rawTimeFraction);
    // console.log(rawTimeFraction, rawTimeFraction - (1 / this.state.timeLeft) * (1 - rawTimeFraction));
    // console.log(Math.max(0, rawTimeFraction));
    // return rawTimeFraction - (1 / this.state.timeLeft) * (1 - rawTimeFraction);
  }

  setCircleDasharray(val) {
    const circleDasharray = `${(
      this.calculateTimeFraction(val) * TIMER.FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    if(document.getElementById("base-timer-path-remaining")) {
      document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);

    }
  }

  startTimer = () => {
    this.resetTimer();
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: Date.now() - this.state.timerTime
    });

    let timer = setInterval(() => {
      if(timer && this.state.timerOn) {
        let currTimer = Date.now() - this.state.timerStart;
        if(this.state.actualTime > currTimer) {
          this.setState({
            timerTime: Date.now() - this.state.timerStart
          });
        } else {
          clearInterval(timer);
          timer = undefined;
          currTimer = this.state.actualTime;
          this.onTimesUp();
        }
    
        if(document.getElementById("base-timer-label")) {
                document.getElementById("base-timer-label").innerHTML = this.formatTime(this.state.actualTime - currTimer);
          }
          
        this.setCircleDasharray(this.state.actualTime - currTimer);
        this.setRemainingPathColor(this.state.actualTime - currTimer);
      }
    }, 10);
  };

  stopTimer = () => {
    this.setState({ timerOn: false });
  };

  resetTimer = () => {
    this.setState({
      timerStart: 0,
      timerTime: 0
    });
  };

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
                <Timer />
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
              <div className="score">{this.lastScore()}</div>
              <div className={`high-score ${(this.state.highScore) ? "show" : ""}`}>New high score</div>
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
