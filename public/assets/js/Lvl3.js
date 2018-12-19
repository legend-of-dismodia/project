var Boot3 = new Phaser.Class({

  Extends: Phaser.Scene,

    initialize:

    function Boot3()
    {
        Phaser.Scene.call(this, { key: 'Boot3' });
    },

    preload: function (){

  //------------------insère les liens de tous ce qu'on a besoin---------------//
  this.load.tilemapTiledJSON("map3", "../assets/map/lv3.json");

      this.load.image("tiles20", "../assets/tilesets/Dungeon_A2.png");
      this.load.image("tiles21", "../assets/tilesets/Dungeon_A4.png");
      this.load.image("tiles22", "../assets/tilesets/Dungeon_B.png");
      this.load.image("tiles23", "../assets/tilesets/Dungeon_C.png");



      this.load.spritesheet("escalier3", "../assets/tilesets/Inside_B.png", { frameWidth: 48, frameHeight: 48});
      this.load.spritesheet('loupgarou', '../assets/spritesheet/loup.png', { frameWidth: 85, frameHeight: 100});
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

        const tiles20 = map.addTilesetImage("Dungeon_A2", "tiles20");
        const tiles21 = map.addTilesetImage("Dungeon_A4", "tiles21");
        const tiles22= map.addTilesetImage("Dungeon_B", "tiles22");
        const tiles23= map.addTilesetImage("Dungeon_C", "tiles23");

      //---------------------------ce sont les calques------------------------------//

        const sol = map.createDynamicLayer("sol", tiles20);
        const mur = map.createDynamicLayer("mur", tiles21);
        const decoration1 = map.createDynamicLayer("decoration1", tiles22);
        const decoration2 = map.createDynamicLayer("decoration2", tiles23);


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

      const spawnPoint = map.findObject("character", obj => obj.name === "Spawn Point");
      player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y);


      //-------------------------on affiche le personnage--------------------------//

      cursors = this.input.keyboard.createCursorKeys();
      showDebug = false;
      //-----------------------caméra qui suit le perso-------------------------//

      // empêche un bug graphique qui affiche une grille entre chaque tile
      this.cameras.roundPixels = true;

      // // changer la taille de la caméra
      // this.cameras.resize(300, 300);

      // // empêcher la caméra de dépasser de la carte
      // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      // faire que la caméra suive le joueur
      this.cameras.main.startFollow(player);
      //-------------------pour éviter que le personnage sorte du cadre---------------//

      player.setCollideWorldBounds(true);
      mur.setCollisionByExclusion([-1]);
      decoration1.setCollisionByExclusion([-1]);
      decoration2.setCollisionByExclusion([-1]);
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

       loupgarou = this.physics.add.sprite(950, 158, "loupgarou", 11);
       this.physics.add.overlap(player, loupgarou, collisionloup, null, this);


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

         function collisionStairs3(player, escalier3)
                     {
             console.log( this.scene );
             this.scene.switch('BootScene');


         }
         function collisionloup(player, loupgarou)
                     {
             this.scene.switch('LoupScene');
             loupgarou.disableBody(true, true);
         }
