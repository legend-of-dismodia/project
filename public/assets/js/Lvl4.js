//------------------------------première scène--------------------------------//

var BootScene = new Phaser.Class({

  Extends: Phaser.Scene,

    initialize:

    function BootScene()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

//--------------------------précharger la scène------------------------------//

  preload: function (){

//------------------insère les liens de tous ce qu'on a besoin---------------//
    this.load.tilemapTiledJSON("map4", "../assets/map/BossMap.json");
    this.load.image("tiles", "../assets/tilesets/DungeonA1.png");
    this.load.image("tiles2", "../assets/tilesets/DungeonA4.png");
    this.load.image("tiles3", "../assets/tilesets/DungeonB.png");
    this.load.image("tiles4", "../assets/tilesets/InsideA5.png");
    this.load.image("tiles5", "../assets/tilesets/InsideC.png");

    this.load.spritesheet("boss", "../assets/spritesheet/boss.png",  { frameWidth: 374, frameHeight: 354});

    this.load.spritesheet('princess', '../assets/spritesheet/princessfinal clone.png', { frameWidth: 80, frameHeight: 80});

  },

//---------------------on appelle la scène principale-------------------------//

  create: function (){
    this.scene.start('WorldScene');

  },

});

//-------------------------on définit la scène principale--------------------//

var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },


      preload: function (){

//-------------------il n y a rien c'est normal-----------------------------//

},

  create:function () {

  //-------------------------on affiche la map--------------------------------//
  //----------------------bien respecter l'ordre des calques------------------//

  const map = this.make.tilemap({ key: "map4" });

  const tiles = map.addTilesetImage("DungeonA1", "tiles");
  const tiles2 = map.addTilesetImage("DungeonA4", "tiles2");
  const tiles3 = map.addTilesetImage("DungeonB", "tiles3");
  const tiles4= map.addTilesetImage("InsideA5", "tiles4");
  const tiles5 = map.addTilesetImage("InsideC", "tiles5");

//---------------------------ce sont les calques------------------------------//

  const solLave = map.createDynamicLayer("solLave", tiles);
  const sol = map.createDynamicLayer("sol", tiles4);
  const mur = map.createDynamicLayer("mur", tiles2);
  const mur2 = map.createDynamicLayer("mur2", tiles4);
  const lave = map.createDynamicLayer("lave", tiles);
  const rocher = map.createDynamicLayer("rocher", tiles5);
  const statue = map.createDynamicLayer("statue", tiles5);

//----------------------créer l'animation du personnage-----------------------//

  const anims = this.anims;

  anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('princess', { start: 19, end: 25 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('princess', { start: 11, end: 17 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "up",
    frames: anims.generateFrameNames("princess", {start: 2, end: 9}),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "down",
    frames: anims.generateFrameNames("princess",{ start: 26, end: 32}),
    frameRate: 10,
    repeat: -1
  });


//--------------------------gérer les colisions---------------------------------//

mur.setCollisionByExclusion([-1]);
mur2.setCollisionByExclusion([-1]);
statue.setCollisionByExclusion([-1]);
lave.setCollisionByExclusion([-1]);
solLave.setCollisionByExclusion([-1]);

//----------sert à définir la position du personnage sur la map--------------//

const spawnPoint = map.findObject("character", obj => obj.name === "Spawn Point");
player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y);


//-------------------------on affiche le personnage--------------------------//

cursors = this.input.keyboard.createCursorKeys();
showDebug = false;

//-------------------pour éviter que le personnage sorte du cadre---------------//

player.setCollideWorldBounds(true);

// objet.setDepth(10);

 this.physics.add.collider(player, mur2);
 this.physics.add.collider(player, solLave);
 this.physics.add.collider(player, mur);
  this.physics.add.collider(player, statue);

//--------verifier si phaser a bien pris en compte les colisions--------------//

// this.input.keyboard.once("keydown_D", event => {
//     // Turn on physics debugging to show player's hitbox
//     this.physics.world.createDebugGraphic();


//     const graphics = this.add
//       .graphics()
//       .setAlpha(0.75)
//       .setDepth(20);
//     mur.renderDebug(graphics, {
//     tileColor: null, // Color of non-colliding tiles
//     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),// Color of colliding tiles
//    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
//  });
//
// objet.renderDebug(graphics, {
//    tileColor: null, // Color of non-colliding tiles
//     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
// });
//
// mur2.renderDebug(graphics, {
//    tileColor: null, // Color of non-colliding tiles
//    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),// Color of colliding tiles
//    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
// });
// });

//------------------evenement combat-------------------------------------------//

 enemies1 = this.physics.add.sprite(700, 420, "boss");


enemies1.setCollideWorldBounds(true);

this.physics.add.overlap(player, enemies1, collisionEnemies1, null, this);
// this.physics.add.collider(mur, enemies);
// // this.physics.add.collider(objet, enemies);

this.input.keyboard.on("keydown_D", event =>{
this.scene.sendToBack();
this.scene.run('Sac');

});

this.input.keyboard.on("keydown_F", event =>{

this.scene.sleep('UIScene5');

});
},


//---------------------------quand le perso bouge---------------------------//


          update: function (){

            if (cursors.left.isDown)
            {
                player.setVelocityX(-160);

                player.anims.play('left', true);
            }
            else if (cursors.right.isDown)
            {
                player.setVelocityX(160);

                player.anims.play('right', true);
            }

            else if (cursors.up.isDown)
            {
                player.setVelocityY(-160);

                player.anims.play('up', true);
            }
            else if (cursors.down.isDown)
            {
                player.setVelocityY(160);

                player.anims.play('down', true);
            }
            else
            {

            player.setVelocityX(0);
            player.setVelocityY(0);

          }

       }


   });

  function collisionEnemies1(player, enemies1)
      {
        // shake the world

    // start battle
    this.scene.switch('BossBattle');
  enemies1.disableBody(true, true);
  if (enemies1.disableBody === true) {
    console.log ("Le jeu est fini")
  }

  }
