import SessionAssistant from './SessionAssistance';

const CommonUtility = {
  currentUser: null,
  setCurrentUser(name, level) {
    this.currentUser = {
      name: name,
      level: level
    };
    SessionAssistant.setSession('lastUser', this.currentUser);
  },
  getCurrentUser() {
    return this.currentUser;
  }
};

export default CommonUtility;