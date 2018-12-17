    var Sac = new Phaser.Class({
      Extends: Phaser.Scene,

        initialize:

        function Sac ()
        {
            Phaser.Scene.call(this, { key: 'Sac' });
        },

        preload: function (){

      //------------------insère les liens de tous ce qu'on a besoin---------------//
      this.load.image("fond", "../assets/spritesheet/battle.png");
    this.load.spritesheet("player", "../assets/spritesheet/princessfinal clone.png", { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet("objet", "../assets/spritesheet/IconSet.png", { frameWidth: 32, frameHeight: 32 });
        },

    create: function (){

    this.add.image(400, 300, 'fond');
    this.startInventory();

          },

    startInventory:function(){

      this.scene.start('UIScene5');
    },


        });

        var UIScene5 = new Phaser.Class({

          Extends: Phaser.Scene,

          initialize:

          function UIScene5 ()
          {
              Phaser.Scene.call(this, { key: 'UIScene5' });
          },

          create: function ()
          {
            hp = tbl.life;

            var warrior = new PlayerCharacter(this, 750, 300, "player", 0, "Warrior", hp, attack, 50,);
            this.add.existing(warrior);

            var potion = new Objet (this, 80, 250, "objet", 179, "potion", objet[0]['effet'], objet[0]['quantité'], objet[0]['rareté']);
            this.add.existing(potion);

            var arme = new Objet (this, 200, 250, "objet", 97, "arme", objet[1]['effet'], objet[1]['quantité'], objet[1]['rareté']);
            this.add.existing(arme);

            warrior.setDepth(10);
            potion.setDepth(10);
            arme.setDepth(10);

            this.graphics = this.add.graphics();
            this.graphics.lineStyle(1, 0xffffff);
            this.graphics.fillStyle(0x031f4c, 1);
            this.graphics.strokeRect(50, 200, 300, 500);
            this.graphics.fillRect(50, 200, 300, 500);
            this.graphics.strokeRect(300, 200, 300, 500);
            this.graphics.fillRect(300, 200, 300, 500);
            this.graphics.strokeRect(600, 200, 300, 500);
            this.graphics.fillRect(600, 200, 300, 500);

           this.heroes = [ warrior];
           this.objet = [potion, arme];

//-----------------------------stat personnage------------------------------//

           hpText = this.add.text(650,400, 'hp: 0', { fontSize: '24px', fill: 'white' });
           hpText.setText('hp: ' + hp);

           attackText = this.add.text(650,450, 'attack: 0', { fontSize: '24px', fill: 'white' });
           attackText.setText('attaque: ' + attack);

//-----------------------------------stat objet--------------------------------//

           potionText = this.add.text(60,290, 'effet: 0', { fontSize: '14px', fill: 'white' });
           potionText.setText(' + : ' +  potion['effet']+'hp');

           potionText = this.add.text(60,380, 'rare: 0', { fontSize: '14px', fill: 'white' });
           potionText.setText(' rareté : ' +  potion['rareté']);

           potionText = this.add.text(60,350, 'rare: 0', { fontSize: '14px', fill: 'white' });

           potionText.setText(' quantité : ' +  potion['quantité']);
//-----------------------------------stat arme--------------------------------//

            armeText = this.add.text(180,290, 'effet: 0', { fontSize: '14px', fill: 'white' });
            armeText.setText(' attaque : ' +  arme['effet']);

            armeText = this.add.text(180,380, 'rare: 0', { fontSize: '14px', fill: 'white' });
            armeText.setText(' rareté : ' +  arme['rareté']);

            armeText = this.add.text(180,350, 'rare: 0', { fontSize: '14px', fill: 'white' });
            armeText.setText(' quantité : ' +  arme['quantité']);

            this.menus = this.add.container();
            //
            // this.heroesMenu2 = new HeroesMenu2(195, 153, this);
            this.actionsMenu = new ActionsMenu(400, 250, this);
            // this.objetMenu = new ObjetMenu(8, 153, this);

            // the currently selected menu
            // this.currentMenu = this.actionsMenu;


            // this.menus.add(this.heroesMenu2);
            this.menus.add(this.actionsMenu);
            // this.menus.add(this.objetMenu);

         },


      });


        var Unit3 = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,

            initialize:

            function Unit3(scene, x, y, texture, frame, type, effet, quantité, rareté) {
                Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
                this.type = type;
                this.effet= effet;
                this.quantité = quantité;
                this.rareté = rareté;
                this.living = true;
                this.menuItem = null;
            },
          });


        var Objet = new Phaser.Class({
            Extends: Unit3,

            initialize:
            function Objet(scene, x, y, texture, frame, type, effet, quantité, rareté) {
                Unit3.call(this, scene, x, y, texture, frame, type, effet, quantité, rareté);
            }
        });


        var Menu2 = new Phaser.Class({
            Extends: Phaser.GameObjects.Container,

            initialize:

            function Menu2(x, y, scene, heroes) {
                Phaser.GameObjects.Container.call(this, scene, x, y);
                this.menuItems = [];
                this.menuItemIndex = 0;
                this.heroes = heroes;
                this.x = x;
                this.y = y;
            },
            addMenuItem2: function(unit3) {
                var menuItem = new MenuItem(0, this.menuItem.length * 0, unit3, this.scene);
                this.menuItems.push(menuItem);
                this.add(menuItem);
            },
            moveSelectionUp: function() {
                this.menuItem[this.menuItemIndex].deselect();
                this.menuItemIndex--;
                if(this.menuItemIndex < 0)
                    this.menuItemIndex = this.menuItems.length - 1;
                this.menuItems[this.menuItemIndex].select();
            },
            moveSelectionDown: function() {
                this.menuItems[this.menuItemIndex].deselect();
                this.menuItemIndex++;
                if(this.menuItemIndex >= this.menuItems.length)
                    this.menuItemIndex = 0;
                this.menuItems[this.menuItemIndex].select();
            },
            // select the menu as a whole and an element with index from it
            select: function(index) {
                if(!index)
                    index = 0;
                this.menuItems[this.menuItemIndex].deselect();
                this.menuItemIndex = index;
                this.menuItems[this.menuItemIndex].select();
            },
            // deselect this menu
            deselect: function() {
                this.menuItems[this.menuItemIndex].deselect();
                this.menuItemIndex = 0;
            },
            confirm: function() {
                // wen the player confirms his slection, do the action
            },


        });

        var HeroesMenu2 = new Phaser.Class({
            Extends: Menu2,

            initialize:

            function HeroesMenu2(x, y, scene) {
                Menu2.call(this, x, y, scene);
            }
        });

        var ActionsMenu = new Phaser.Class({
            Extends: Menu2,

            initialize:

            function ActionsMenu(x, y, scene) {
                Menu2.call(this, x, y, scene);
                this.addMenuItem("equiper");
            },
            confirm: function() {
                // do something when the player selects an action
            },

        });


        // var ObjetMenu = new Phaser.Class({
        //     Extends: Menu2,
        //
        //     initialize:
        //
        //     function ObjetMenu(x, y, scene) {
        //         Menu2.call(this, x, y, scene);
        //     },
        //     confirm: function() {
        //         // do something when the player selects an enemy
        //     }
        // });
