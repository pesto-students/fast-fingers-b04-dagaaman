import React, { Component } from 'react';
import './Timer.css';
import { MODE, TIMER, ROUTES_ENUMS } from '../constants';
import CommonUtility from '../Service/CommonUtility';
import { Redirect } from "react-router-dom";


export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerInterval: null,
      timePassed: 0,
      timeLeft: TIMER.TIME_LIMIT,
      actualTime: TIMER.TIME_LIMIT,
      remainingPathColor : TIMER.COLOR_CODES.info.color, 
      timerOn: false,
      timerStart: 0,
      timerTime: 0 
    };
    // this.formatTime = this.formatTime.bind(this);
    // // this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    // this.updateTimerEvent = this.updateTimerEvent.bind(this);
    
    // setTimeout(() => {
    //   this.startTimer();
    // }, 2000);
  }

  componentDidMount() {
  }

  // async setTimer(word) {
  //   if(this.state.user && this.state.user.level) {
  //     const time = CommonUtility.getTimeLimit(word);
  //     await this.setState(state => ({
  //       actualTime: time
  //     }));
  //     await this.setState(state => ({
  //       timeLeft: time
  //     }));
  //     this.startTimer();
  //   }
  // }
  // onTimesUp() {
  //   this.stopTimer();
  //   CommonUtility.stopGame();
  // }

  // // startTimer() {
  // //   const currTime = Date.now();
  // //   this.setState({
  // //     timerOn: true,
  // //     timerTime: this.state.timerTime,
  // //     timerStart: Date.now() - this.state.timerTime
  // //   });
  // //   const timerInterval = setInterval(() => {
  // //     const diff = CommonUtility.timeDiff(currTime);
  // //     const timePassed = diff/1000;
  // //     this.setState(state => ({
  // //       timePassed: timePassed
  // //     }));

  // //     const timeLeft = this.state.timeLeft - timePassed;
  // //     this.setState(state => ({
  // //       timeLeft: timeLeft
  // //     }));

  // //     if(document.getElementById("base-timer-label")) {
  // //       document.getElementById("base-timer-label").innerHTML = this.formatTime(diff);
  // //     }

  // //     this.setState(state => ({
  // //       timerInterval: timerInterval
  // //     }));

  // //     this.setCircleDasharray();
  // //     this.setRemainingPathColor(timeLeft);
  
  // //     if (timeLeft < 0) {
  // //       this.onTimesUp();
  // //     }
  // //   }, 1000);
  // // }

  // formatTime(time) {
  //   return CommonUtility.formatTime(time);
  // }

  // setRemainingPathColor(timeLeft) {
  //   const { alert, warning, info } = TIMER.COLOR_CODES;
  //   if(document.getElementById("base-timer-path-remaining")) {
  //     if (timeLeft <= alert.threshold ) {
  //       document
  //         .getElementById("base-timer-path-remaining")
  //         .classList.remove(warning.color);
  //       document
  //         .getElementById("base-timer-path-remaining")
  //         .classList.add(alert.color);
  //     } else if (timeLeft <= warning.threshold) {
  //       document
  //         .getElementById("base-timer-path-remaining")
  //         .classList.remove(info.color);
  //       document
  //         .getElementById("base-timer-path-remaining")
  //         .classList.add(warning.color);
  //     }
  //   }
  // }

  // calculateTimeFraction() {
  //   const rawTimeFraction = this.state.timePassed / this.state.actualTime;

  //   // console.log(rawTimeFraction, rawTimeFraction - (1 / this.state.timeLeft) * (1 - rawTimeFraction));
  //   // console.log(Math.max(0, rawTimeFraction));
  //   return Math.min(1, rawTimeFraction);
  //   // return rawTimeFraction - (1 / this.state.timeLeft) * (1 - rawTimeFraction);
  // }

  // setCircleDasharray() {
  //   const circleDasharray = `${(
  //     this.calculateTimeFraction() * TIMER.FULL_DASH_ARRAY
  //   ).toFixed(0)} 283`;
  //   if(document.getElementById("base-timer-path-remaining")) {
  //     document
  //       .getElementById("base-timer-path-remaining")
  //       .setAttribute("stroke-dasharray", circleDasharray);

  //   }
  // }

  // startTimer = () => {
  //   this.resetTimer();
  //   this.setState({
  //     timerOn: true,
  //     timerTime: this.state.timerTime,
  //     timerStart: Date.now() - this.state.timerTime
  //   });

  //   this.timer = setInterval(this.updateTimerEvent, 10);
    
  // };

  // async updateTimerEvent(){
  //   let currTimer = Date.now() - this.state.timerStart;
  //   if(this.state.actualTime > currTimer) {
  //     this.setState({
  //       timerTime: Date.now() - this.state.timerStart
  //     });
  //   } else {
  //     currTimer = this.state.actualTime;
  //     this.onTimesUp();
  //   }

  //   if(document.getElementById("base-timer-label")) {
  //           document.getElementById("base-timer-label").innerHTML = this.formatTime(this.state.actualTime - currTimer);
  //   }
  //   this.setCircleDasharray();
  //   this.setRemainingPathColor(this.state.actualTime - currTimer);
  // };

  // stopTimer = () => {
  //   this.setState({ timerOn: false });
  //   clearInterval(this.timer);
  // };

  // resetTimer = () => {
  //   this.setState({
  //     timerStart: 0,
  //     timerTime: 0
  //   });
  // };

  // initializeGame() {
  //   this.setState(state => ({
  //     gameInitialize: true
  //   }));
  // }

  render() {
    if(CommonUtility.getCurrentGameMode() === MODE.HOME) {
      return <Redirect to={ROUTES_ENUMS.DEFAULT} />
    }
    return (
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
          <span id="base-timer-label" className="base-timer__label"></span>
        </div>
        </div>
      </div>
    );  
  }
}
