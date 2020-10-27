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
    this.currentGameMode = gameMode;
    if (listner) {
      this.addListner(listner);
    }
    this.forceUpdate();
  },
  addListner(listner) {
    this.listener.push(listner);
  },
  stopGame(score) {
    // set user Data in session
    this.setCurrentUser(this.currentUser.name, this.userGameLevel || this.currentUser.level);
    this.updateTestData(0, score)
    const userData = this.populateUserGameData();
    userData.results.push(this.getTestData());
    SessionAssistant.setSession(this.currentUser.name, userData);
    this.testData = null;
    this.currScore = 0;
    //update mode
    this.setCurrentGameMode(MODE.SCORE_REPORT);
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
  formatTime(displayTime) {
    if(!displayTime) {
      displayTime = 0;
    }
    const time = displayTime;
    let seconds = time % 60;
  
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    let milisec = time % 100;
  
    if (milisec < 10) {
      milisec = `0${milisec}`;
    }

  
    return `${seconds}:${milisec}`;
  }

};

export default CommonUtility;