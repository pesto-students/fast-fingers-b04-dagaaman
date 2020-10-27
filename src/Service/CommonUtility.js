import SessionAssistant from './SessionAssistance';
import {SESSION} from '../constants';


const CommonUtility = {
  currentUser: null,
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
  }
};

export default CommonUtility;