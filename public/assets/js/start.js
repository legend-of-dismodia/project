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
            debug: false // set to true to view zones
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
      UIScene5,
      UIScene2,
      UIScene3,
      UIScene4,



      Boot2,
      World2,

      Boot3,
      World3,

      BootScene,
      WorldScene,
      Sac,

    ]
};
var game = new Phaser.Game(config);
