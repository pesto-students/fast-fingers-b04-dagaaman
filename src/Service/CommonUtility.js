import SessionAssistant from './SessionAssistance';
import {DIFFCULTY_LEVEL, SESSION, MODE} from '../constants';
import dictionary from '../Static/dictionary.json'


const CommonUtility = {
  currentUser: null,
  currentGameMode: null,
  listener: [],
  dictonaryByLevel: null,
  userGameLevel: null,
  testData: null,
  currScore: 0,
  timerInterval: null,
  setCurrentUser(name, level) {
    this.currentUser = {
      name: name,
      level: level
    };
    this.userGameLevel = this.currentUser.level;
    SessionAssistant.setSession(SESSION.CURRENT_USER, this.currentUser);
  },
  getCurrentUser() {
    if(this.currentUser){
      return this.currentUser;
    }
    const lastUser = SessionAssistant.getSession(SESSION.CURRENT_USER);
    if (lastUser) {
      this.currentUser = lastUser;
      return this.currentUser;
    }

    return null;
  },
  setCurrentUserGameLevel(level) {
    this.userGameLevel = level;
  },
  getCurrentUserGameLevel() {
    return this.userGameLevel;
  },
  startTimer() {
    const currTime = Date.now();
    if(this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.currScore = this.timeDiff(currTime);
    }, 0.05);
  },
  timeDiff(offset) {
    var now = Date.now(),
      d   = now - offset;
    offset = now;
    return d;
  },
  stopTimer() {
    if(this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = null;
  },
  resetTimer() {
    if(this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.currScore = 0;
  },
  getCurrScore() {
    return this.currScore;
  },
  setCurrentGameData(data) {
    this.testData = data;
  },
  getCurrentGameData() {
    return this.testData;
  },
  populateUserGameData() {
    if(this.currentUser && this.currentUser.name) {
      let userData = SessionAssistant.getSession(this.currentUser.name);
      if(!userData) {
        userData = {results:[], user: this.currentUser};
      }
      return userData;
    }
    return null;

  },
  getTestData() {
    if(this.currentUser) {
      if(!this.testData) {
        this.testData = {
          score: 0,
          words: 0,
          gameName: this.populateUserGameData().results.length + 1
        }
      }
  
      return this.testData;
    }
    return null;
  },
  updateTestData(word) {
    const testData = this.getTestData();
    testData.words += word;
    testData.score = this.currScore;
    this.testData = testData;

    return this.getTestData();
  },
  getCurrentGameMode() {
    return this.currentGameMode;
  },
  setCurrentGameMode(gameMode, listner) {
    debugger;
    this.currentGameMode = gameMode;
    if (listner) {
      this.addListner(listner);
    }
    this.forceUpdate();
  },
  addListner(listner) {
    this.listener.push(listner);
  },
  stopGame() {
    // set user Data in session
    this.setCurrentUser(this.currentUser.name, this.userGameLevel || this.currentUser.level);
    this.updateTestData(0, this.currScore)
    const userData = this.populateUserGameData();
    userData.results.push(this.getTestData());
    SessionAssistant.setSession(this.currentUser.name, userData);
    this.testData = null;
    this.currScore = 0;
    //update mode
    this.setCurrentGameMode(MODE.SCORE_REPORT);
    this.forceUpdate();
  },
  quitGame(){
    this.setCurrentGameMode(MODE.HOME);
  },
  forceUpdate() {
    this.listener.forEach((curr) => {
      curr();
    })
  },
  removeAllListner() {
    this.listener = [];
  },
  getDictonary() {
    return dictionary;
  },
  getDictonaryByLevel() {
    if(this.dictonaryByLevel) {
      return this.dictonaryByLevel;
    }
    const obj = {}, easy = [], medium = [], hard = [];

    for(const word of this.getDictonary()) {
      if(word.length > 8) {
        hard.push(word);
      } else if (word.length > 4){
        medium.push(word);
      } else {
        easy.push(word);
      }
    }

    obj[DIFFCULTY_LEVEL.EASY] = easy;
    obj[DIFFCULTY_LEVEL.MEDIUM] = medium;
    obj[DIFFCULTY_LEVEL.HARD] = hard;
    this.dictonaryByLevel = obj;

    return this.dictonaryByLevel;
  },
  getWord(level) {
    const nlevel = this.normalizeLevel(level);
    const dic = this.getDictonaryByLevel()
    const random = this.getRandomInt(dic[nlevel].length);
    return dic[nlevel][random];
  },
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },
  normalizeLevel(currLevel) {
    let level;
    if(currLevel >= DIFFCULTY_LEVEL.HARD) {
      level = DIFFCULTY_LEVEL.HARD;
    } else if(currLevel >= DIFFCULTY_LEVEL.MEDIUM) {
      level = DIFFCULTY_LEVEL.MEDIUM;
    } else {
      level = DIFFCULTY_LEVEL.EASY;
    }

    return level;
  },
  formatTime(milisec) {
    if(milisec < 0) {
      milisec = 0;
    }
    let seconds = Math.round(milisec / 1000);
    milisec = Math.round(milisec % 100);
  
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
  
    if (milisec < 10) {
      milisec = `0${milisec}`;
    }

  
    return `${seconds}:${milisec}`;
  },
  getTimeLimit(word) {
    const timerVal = (word.length)/(this.userGameLevel || this.currentUser.level);
    return Math.ceil(Math.max(timerVal, 2)) * 1000;
  }

};

export default CommonUtility;