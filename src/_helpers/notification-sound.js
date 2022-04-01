export function notificationPlay() {
    let sound = require('../assets/sounds/slow-spring-board.mp3');
    if(sound) {
        var audio = new Audio(sound);
        audio.play();
    }
}