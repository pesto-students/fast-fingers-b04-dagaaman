const SessionAssistant = {
  getSession(sessionKey) {
        try {
          const sessionObj = sessionStorage.getItem(sessionKey);
          if(sessionObj) {
              const obj = JSON.parse(sessionObj);
              return obj;
          }
      } catch(exception) {
          console.log(`Some Error Occurred while getting session. More Details: ${exception}`);
      }
    
      return null;
      },
      setSession(sessionKey, sessionValue) {
        sessionStorage.setItem(sessionKey, JSON.stringify(sessionValue));
        return;
      }
};

export default SessionAssistant;