export const Constants = {
    GAME_LOGO_PATH : '/static/img/game-logo.svg',
    PLAY_BUTTON_PATH : '/static/img/play-button.svg',
    DROPDOWN_PATH : '/static/img/dropdown.svg',
    PROFILE : '/static/img/profile.svg',
    GAME : '/static/img/gamepad.svg',
    CROSS: '/static/img/cross.svg',
    REPEAT: '/static/img/repeat.svg'
  };

export const DIFFCULTY_LEVEL = {
    EASY: 1,
    MEDIUM: 1.5,
    HARD: 2,
    INCREASE_FACTOR: 0.01
};

export const ROUTES_ENUMS = {
    DEFAULT: '/home',
    PLAY: '/play',
    SCORE: '/result'
};

export const SESSION = {
    CURRENT_USER: 'lastUser'
};

export const MODE = {
    PLAYING: 1,
    SCORE_REPORT: 2,
    HOME: 3
};

export const TIMER = {
    TIME_LIMIT: 20,
    FULL_DASH_ARRAY: 283,
    COLOR_CODES: {
        info: {
          color: "red"
        },
        warning: {
          color: "red",
          threshold: 10
        },
        alert: {
          color: "red",
          threshold: 5
        }
      }
};

export const KEYWORDS = {
    INTRODUCTION: [
        "Lets Begin!",
        "Ready",
        "Steady",
        "GO!!"
    ]
}