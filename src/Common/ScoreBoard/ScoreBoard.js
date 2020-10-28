import React, { Component } from 'react';
import './ScoreBoard.css';
import CommonUtility from '../../Service/CommonUtility';

export default class ScoreBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {games: []};
    this.renderResults = this.renderResults.bind(this);
    this.getMaxResult = this.getMaxResult.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  }

  componentDidMount() {
    CommonUtility.addListner(this.forceUpdateHandler());
  }

  forceUpdateHandler(){
    return () => {
      let userGameData = CommonUtility.populateUserGameData();
      if(!userGameData) {
        userGameData = {results:[]};
      }
      const results = [];
      userGameData.results.forEach((curr) => {
        curr.score = CommonUtility.formatTime(curr.score);
        results.push(curr);
      });
      userGameData.results = results;
      this.setState(state => ({
        games: userGameData.results
      }));
    };
  }

  getMaxResult() {
    return Math.max.apply(Math, this.state.games.map(function(o) { return o.score; }))
  }

  renderResults() {
    if(!!this.state.games) {
      let dom = <div> ${1} </div>;
      this.state.games.forEach((curr) => {
        if(dom) {
          dom += <div> ${curr.score} </div>;
        } else {
          dom = <div> ${curr.score} </div>;
        }
      });
      return dom;
    }
    return null;
  }



  render() {
    return (
      <div className="board-container">
        <div className="board-box"> 
        <div className="board-header"> SCORE BOARD </div>
        <div className="board-results">
          {this.state.games.map((curr, i) => {
            if(curr.score === this.getMaxResult()) {
              return  <div className="current-result" key={i}> <div className="best">PERSONAL BEST</div> Game {i + 1} : {curr.score} </div>;
            }
            return <div className="current-result" key={i}> Game {curr.gameName} : {curr.score || 0} </div>;
          })}
        </div>
        </div>
      </div>
    );
  }
}