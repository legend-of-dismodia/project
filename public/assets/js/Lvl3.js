var Boot3 = new Phaser.Class({

  Extends: Phaser.Scene,

    initialize:

    function Boot3()
    {
        Phaser.Scene.call(this, { key: 'Boot3' });
    },

    preload: function (){

  //------------------insère les liens de tous ce qu'on a besoin---------------//
  this.load.tilemapTiledJSON("map3", "../assets/map/niveau3.json");

      this.load.image("tiles20", "../assets/tilesets/Inside_A2.png");
      this.load.image("tiles21", "../assets/tilesets/Inside_A4.png");
      this.load.image("tiles22", "../assets/tilesets/Dungeon_A5.png");
      this.load.image("tiles23", "../assets/tilesets/Inside_C.png");
      this.load.image("tiles24", "../assets/tilesets/Dungeon_B.png");
      this.load.image("tiles25", "../assets/tilesets/Dungeon_C.png");
      this.load.image("tiles26", "../assets/tilesets/Chest.png");


      this.load.spritesheet("escalier3", "../assets/tilesets/Inside_B.png", { frameWidth: 48, frameHeight: 48});
      this.load.spritesheet('princess', '../assets/spritesheet/princessfinal clone.png', { frameWidth: 80, frameHeight: 80});


    },

      create: function (){

      this.scene.start('World3');

      },

    });


    var World3 = new Phaser.Class({

        Extends: Phaser.Scene,

        initialize:

        function World3 ()
        {
            Phaser.Scene.call(this, { key: 'World3' });
        },

        preload: function (){

      //-------------------il n y a rien c'est normal-----------------------------//

      },


        create:function () {

        //-------------------------on affiche la map--------------------------------//
        //----------------------bien respecter l'ordre des calques------------------//

        const map = this.make.tilemap({ key: "map3" });

        const tiles20 = map.addTilesetImage("Inside_A2", "tiles20");
        const tiles21 = map.addTilesetImage("Inside_A4", "tiles21");
        const tiles22= map.addTilesetImage("Dungeon_A5", "tiles22");
        const tiles23 = map.addTilesetImage("Inside_C", "tiles23");
        const tiles24= map.addTilesetImage("Dungeon_B", "tiles24");
        const tiles25= map.addTilesetImage("Dungeon_C", "tiles25");
        const tiles26= map.addTilesetImage("Chest", "tiles26");
      //---------------------------ce sont les calques------------------------------//

        const sol = map.createDynamicLayer("sol", tiles20);
        const mur = map.createDynamicLayer("mur", tiles21);
        const decoration = map.createDynamicLayer("decoration", tiles23);
        const events = map.createDynamicLayer("events", tiles25);
        const coffreevents = map.createDynamicLayer("coffreevents", tiles26);

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



      //----------sert à définir la position du personnage sur la map--------------//

      const spawnPoint = map.findObject("spawncharacter", obj => obj.name === "Spawn Point");
      player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y);


      //-------------------------on affiche le personnage--------------------------//

      cursors = this.input.keyboard.createCursorKeys();
      showDebug = false;

      //-------------------pour éviter que le personnage sorte du cadre---------------//
  coffreevents.setCollisionByExclusion([-1]);
      player.setCollideWorldBounds(true);
      mur.setCollisionByExclusion([-1]);

     this.physics.add.collider(player, mur);
     player.setDepth(10);

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

       // escalier = this.physics.add.sprite(1032, 407, "escalier", 20);
       // this.physics.add.overlap(player, escalier, collisionStairs, null, this);

       // escalier3 = this.physics.add.sprite(850, 158, "escalier3", 20);
       // this.physics.add.overlap(player, escalier3, collisionStairs, null, this);
       escalier3 = this.physics.add.sprite(850, 158, "escalier3", 20);
       this.physics.add.overlap(player, escalier3, collisionStairs3, null, this);
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

         function collisionStairs3(player, escalier3)
                     {
             console.log( this.scene );
             this.scene.switch('BootScene');


         }
