import SessionAssistant from './SessionAssistance';
import {SESSION, MODE} from '../constants';


const CommonUtility = {
  currentUser: null,
  currentGameMode: null,
  listener: [],
  setCurrentUser(name, level) {
    this.currentUser = {
      name: name,
      level: level
    };
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
  getCurrentGameMode() {
    return this.currentGameMode;
  },
  setCurrentGameMode(gameMode, listner) {
    console.log('gameMode upated', gameMode);
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
  }
};

export default CommonUtility;