var Boot = new Phaser.Class({

  Extends: Phaser.Scene,

    initialize:

    function Boot ()
    {
        Phaser.Scene.call(this, { key: 'Boot' });
    },

    preload: function (){

  //------------------insère les liens de tous ce qu'on a besoin---------------//

      this.load.image("tiles10", "../assets/tilesets/Inside_A4.png");
      this.load.image("tiles11", "../assets/tilesets/Dungeon_A4.png");
      this.load.image("tiles12", "../assets/tilesets/Dungeon_A5.png");
      this.load.image("tiles13", "../assets/tilesets/Inside_B.png");
      this.load.image("tiles14", "../assets/tilesets/Chest.png");

      this.load.tilemapTiledJSON("map", "../assets/map/nivo1.json");
      this.load.spritesheet("escalier", "../assets/tilesets/Inside_B.png", { frameWidth: 48, frameHeight: 48});
      this.load.spritesheet('princess', '../assets/spritesheet/princessfinal clone.png', { frameWidth: 80, frameHeight: 80});
      this.load.spritesheet('souris', '../assets/spritesheet/troll.png', { frameWidth: 80, frameHeight: 80});
    this.load.spritesheet("chest", "../assets/tilesets/chest.png", { frameWidth: 48, frameHeight: 48});
    },

      create: function (){

      this.scene.start('World');

      },

    });


    var World = new Phaser.Class({

        Extends: Phaser.Scene,

        initialize:

        function World ()
        {
            Phaser.Scene.call(this, { key: 'World' });
        },

        preload: function (){

      //-------------------il n y a rien c'est normal-----------------------------//

      },


        create:function () {

        //-------------------------on affiche la map--------------------------------//
        //----------------------bien respecter l'ordre des calques------------------//

        const map = this.make.tilemap({ key: "map" });

        const tiles10 = map.addTilesetImage("Inside_A4", "tiles10");
        const tiles11 = map.addTilesetImage("Dungeon_A4", "tiles11");
        const tiles12= map.addTilesetImage("Dungeon_A5", "tiles12");
        const tiles13 = map.addTilesetImage("Inside_B", "tiles13");
        const tiles14= map.addTilesetImage("Chest", "tiles14");

      //---------------------------ce sont les calques------------------------------//

        const sol = map.createDynamicLayer("sol", tiles10);
        const mur = map.createDynamicLayer("mur", tiles10);
        const enter = map.createDynamicLayer("enter", tiles12);
        const stairs = map.createDynamicLayer("stairs", tiles13);
        const coffreevent = map.createDynamicLayer("coffreevent", tiles14 );

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
      //
      mur.setCollisionByExclusion([-1]);


      //----------sert à définir la position du personnage sur la map--------------//

      const spawnPoint = map.findObject("spawncharacter", obj => obj.name === "Spawn Point");
      player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y);


      //-------------------------on affiche le personnage--------------------------//

      cursors = this.input.keyboard.createCursorKeys();
      showDebug = false;

      //-------------------pour éviter que le personnage sorte du cadre---------------//

      player.setCollideWorldBounds(true);

      mur.setDepth(10);

       this.physics.add.collider(player, mur);

       // this.physics.add.collider(player, solLave);
       // this.physics.add.collider(player, mur);
       //  this.physics.add.collider(player, statue);

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

       escalier = this.physics.add.sprite(1032, 407, "escalier", 20);
       this.physics.add.overlap(player, escalier, collisionStairs, null, this);

       souris1 = this.physics.add.sprite(900, 350, "souris", 2);
       this.physics.add.overlap(player, souris1, collisionSouris1, null, this);

       chest = this.physics.add.sprite(850, 20, "chest", 2);
       this.physics.add.overlap(player, chest, collisionChest, null, this);

       //-----------------------ouvrir l'inventaire-------------------------//

       this.input.keyboard.once("keydown_D", event =>{
       this.scene.switch('Sac');
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

function collisionStairs(player, escalier)
            {
    console.log( this.scene );
    this.scene.switch('Boot2');
}

function collisionSouris1(player, souris1)
            {

              this.scene.switch('BattleScene');
                souris1.disableBody(true, true);
}

function collisionChest(player, chest)
            {

                chest.disableBody(true, true);
                chest = this.physics.add.sprite(850, 20, "chest", 13);

}
