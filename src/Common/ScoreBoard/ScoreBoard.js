import React, { Component } from 'react';
import './ScoreBoard.css';

export default class ScoreBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {games: [{score: 1.14},{score: 1.14},{score: 1.14},{score: 1.14},{score: 1.14},{score: 1.15},{score: 1.15},{score: 1.15}]};
    this.renderResults = this.renderResults.bind(this);
    this.getMaxResult = this.getMaxResult.bind(this);
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
            return <div className="current-result" key={i}> Game {i + 1} : {curr.score} </div>;
          })}
        </div>
        </div>
      </div>
    );
  }
}