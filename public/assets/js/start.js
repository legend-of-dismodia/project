var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1280,
    height: 800,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false, // set to true to view zones
            
        }
    },
    scene: [
      Boot,
      World,

      BattleScene,
    BossBattle,
      UIScene,
      LoupScene,
      EctoScene,
      UIScene2,
      UIScene3,
      UIScene4,

      Boot2,
      World2,
      // //
      Boot3,
      World3,
      //
      //
      BootScene,
      WorldScene,



    ]
};
var game = new Phaser.Game(config);

var timer;
var total = 0;

function create() {


    //  Create our Timer
    timer = game.time.create(false);

    //  Set a TimerEvent to occur after 2 seconds
    timer.loop(2000, updateCounter, this);

    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    timer.start();

}

function updateCounter() {

    total++;

}

function render() {

    game.debug.text('Time until event: ' + timer.duration.toFixed(0), 32, 32);
    game.debug.text('Loop Count: ' + total, 32, 64);

}
