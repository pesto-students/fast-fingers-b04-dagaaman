import React, { Component } from 'react';
import './Header.css';
import { Constants, ROUTES_ENUMS, DIFFCULTY_LEVEL, MODE } from '../../constants';
import { Redirect } from "react-router-dom";
import CommonUtility from '../../Service/CommonUtility';


export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {mode: props.headerType, currScore:'0', redirect: null, currUser: {}};
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.validateUser(this.state);
    // CommonUtility.startTimer();
  }

  componentDidMount() {
    CommonUtility.addListner(this.forceUpdateHandler());
    setInterval(() => {
      if(CommonUtility.getCurrentGameMode()) {
        const time = CommonUtility.formatTime(CommonUtility.getCurrScore());
        this.setState(state => ({
          currScore: time
        }));
      }
    }, 100);
  }

  forceUpdateHandler(){
    return () => {
      this.setState(state => ({
        mode: CommonUtility.getCurrentGameMode()
      }));
      this.updateGameLevel();
    };
  }

  updateGameLevel() {
    let user = this.state.currUser;
    user.level = CommonUtility.getCurrentUserGameLevel();
    user = this.setLevel(user);
    this.setState(state => ({
      currUser: user
    }));
  }

  validateUser(obj) {
    let user = CommonUtility.getCurrentUser();
    if(!user) {
      obj.redirect = ROUTES_ENUMS.DEFAULT;
      // this.setState(state => ({
      //   redirect: ROUTES_ENUMS.DEFAULT
      // }));
      return;
    }
    user = this.setLevel(user);
    obj.currUser = user;
    return;
  }

  setLevel(obj) {
    if(obj && !!obj.name && !!obj.level) {
      switch(CommonUtility.normalizeLevel(obj.level)) {
        case DIFFCULTY_LEVEL.EASY: obj.levelVal = "EASY";
          break;
        case DIFFCULTY_LEVEL.MEDIUM: obj.levelVal = "MEDIUM";
          break;
        case DIFFCULTY_LEVEL.HARD: obj.levelVal = "HARD";
          break;
        default: obj.levelVal = '';
      }
    }
    return obj;

  }


  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="header-container"> 
          <div className="game-header-top">Fast Fingers</div>
        <div className="user-details header-details">
          <div className="player-name">
            <img src={Constants.PROFILE} alt="Player Icon" />
            <span> {this.state.currUser.name} </span>
          </div>
          <div className="game-level">
            <img src={Constants.GAME} alt="Game Level" />
            <span> {this.state.currUser.levelVal}</span>
          </div>
        </div>
        <div className="score-details header-details">
          <div className="game-header game-header-player">Fast Fingers</div>
          <div className={`current-score ${(this.state.mode === MODE.PLAYING) ? "" : "hide"}`}>Score: {this.state.currScore}</div>
        </div>
      </div>
    );
  }
}