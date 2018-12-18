var Sac = new Phaser.Class({
     Extends: Phaser.Scene,

       initialize:

       function Sac ()
       {
           Phaser.Scene.call(this, { key: 'Sac' });
       },

       preload: function (){

     //------------------insère les liens de tous ce qu'on a besoin---------------//

   this.load.spritesheet("player", "../assets/spritesheet/princessfinal clone.png", { frameWidth: 80, frameHeight: 80 });
   this.load.spritesheet("objet", "../assets/spritesheet/IconSet.png", { frameWidth: 32, frameHeight: 32 });
       },

   create: function (){


   this.startInventory();

         },

   startInventory:function(){

     this.index = -1; // currently active unit


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

           // var arme = new Objet (this, 200, 250, "objet", 97, "arme", objet[1]['effet'], objet[1]['quantité'], objet[1]['rareté']);
           // this.add.existing(arme);

           warrior.setDepth(10);
           potion.setDepth(10);
           // arme.setDepth(10);

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
          this.objet = [potion];

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

          potionText = this.add.text(60,350, 'quantité: 0', { fontSize: '14px', fill: 'white' });

          potionText.setText(' quantité : ' +  potion['quantité']);
//-----------------------------------stat arme--------------------------------//

           // armeText = this.add.text(180,290, 'effet: 0', { fontSize: '14px', fill: 'white' });
           // armeText.setText(' attaque : ' +  arme['effet']);
           //
           // armeText = this.add.text(180,380, 'rare: 0', { fontSize: '14px', fill: 'white' });
           // armeText.setText(' rareté : ' +  arme['rareté']);
           //
           // armeText = this.add.text(180,350, 'quantité: 0', { fontSize: '14px', fill: 'white' });
           // armeText.setText(' quantité : ' +  arme['quantité']);

           // this.menus = this.add.container();
           // //
           // // this.heroesMenu = new HeroesMenu(195, 153, this);
           // this.actionsMenu = new ActionsMenu(400, 250, this);
           // // this.objetMenu = new ObjetMenu(8, 153, this);
           //
           // // the currently selected menu
           // // this.currentMenu = this.actionsMenu;
           //
           //
           // // this.menus.add(this.heroesMenu2);
           // this.menus.add(this.actionsMenu);
           // // this.menus.add(this.objetMenu);

           this.input.keyboard.once("keydown_D", event =>{
           this.scene.sleep('UIScene5');

 });


           this.input.keyboard.once("keydown_I", event =>{
              if (objet[0]['quantité'] > 0){
           objet[0]['quantité'] -= 1 ;

           hpText = this.add.text(650,400, 'hp: 0', { fontSize: '24px', fill: 'white' });
           hpText.setText('hp: ' + hp  );

           this.hp = hp + potion['effet'];
           getPhaserData(this.hp);
}
else {
  alert("vous n'avez pas assez de potion");
}
           });


        },


     });
     var Unit= new Phaser.Class({
         Extends: Phaser.GameObjects.Sprite,

         initialize:
         function Unit(scene, x, y, texture, frame, type, hp, damage, magie, lvl, xp, mana) {
             Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
             this.type = type;
             this.maxHp = this.hp = hp;
             this.damage = damage; // default damage
             this.magie = magie;
             this.living = true;
             this.menuItem = null;

         },
         // we will use this to notify the menu item when the unit is dead
         setMenuItem: function(item) {
             this.menuItem = item;
         },

     });

     var PlayerCharacter = new Phaser.Class({
         Extends: Unit,

         initialize:
         function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage, magie, lvl, xp, mana) {
             Unit.call(this, scene, x, y, texture, frame, type, hp, damage, magie, lvl, xp);
             // flip the image so I don"t have to edit it manually
             this.flipX = true;

             this.setScale(2);
             console.log('hpPLayer: '+hp);
             console.log('effet: '+effet);

         }
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

     //     var MenuItem = new Phaser.Class({
     //         Extends: Phaser.GameObjects.Text,
     //
     //         initialize:
     //
     //         function MenuItem(x, y, text, scene) {
     //             Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: "#ffffff", align: "left", fontSize: 15});
     //         },
     //
     //         select: function() {
     //             this.setColor("#f8ff38");
     //         },
     //
     //         deselect: function() {
     //             this.setColor("#ffffff");
     //         },
     //         // when the associated enemy or player unit is killed
     //         unitKilled: function() {
     //             this.active = false;
     //             this.visible = false;
     //         }
     //
     //     });
     //
       var Objet = new Phaser.Class({
           Extends: Unit3,

           initialize:
           function Objet(scene, x, y, texture, frame, type, effet, quantité, rareté) {
               Unit3.call(this, scene, x, y, texture, frame, type, effet, quantité, rareté);
           }
       });

     //
     //   var Menu = new Phaser.Class({
     //       Extends: Phaser.GameObjects.Container,
     //
     //       initialize:
     //
     //       function Menu(x, y, scene, heroes) {
     //           Phaser.GameObjects.Container.call(this, scene, x, y);
     //           this.menuItems = [];
     //           this.menuItemIndex = 0;
     //           this.x = x;
     //           this.y = y;
     //           this.selected = false;
     //       },
     //       addMenuItem: function(unit) {
     //           var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
     //           this.menuItems.push(menuItem);
     //           this.add(menuItem);
     //           return menuItem;
     //       },
     //       // menu navigation
     //       moveSelectionUp: function() {
     //           this.menuItems[this.menuItemIndex].deselect();
     //           do {
     //               this.menuItemIndex--;
     //               if(this.menuItemIndex < 0)
     //                   this.menuItemIndex = this.menuItems.length - 1;
     //           } while(!this.menuItems[this.menuItemIndex].active);
     //           this.menuItems[this.menuItemIndex].select();
     //       },
     //       moveSelectionDown: function() {
     //           this.menuItems[this.menuItemIndex].deselect();
     //           do {
     //               this.menuItemIndex++;
     //               if(this.menuItemIndex >= this.menuItems.length)
     //                   this.menuItemIndex = 0;
     //           } while(!this.menuItems[this.menuItemIndex].active);
     //           this.menuItems[this.menuItemIndex].select();
     //       },
     //       // select the menu as a whole and highlight the choosen element
     //       select: function(index) {
     //           if(!index)
     //               index = 0;
     //           this.menuItems[this.menuItemIndex].deselect();
     //           this.menuItemIndex = index;
     //           while(!this.menuItems[this.menuItemIndex].active) {
     //               this.menuItemIndex++;
     //               if(this.menuItemIndex >= this.menuItems.length)
     //                   this.menuItemIndex = 0;
     //               if(this.menuItemIndex == index)
     //                   return;
     //           }
     //           this.menuItems[this.menuItemIndex].select();
     //           this.selected = true;
     //       },
     //       // deselect this menu
     //       deselect: function() {
     //           this.menuItems[this.menuItemIndex].deselect();
     //           this.menuItemIndex = 0;
     //           this.selected = false;
     //       },
     //       confirm: function() {
     //           // when the player confirms his slection, do the action
     //       },
     //       // clear menu and remove all menu items
     //       clear: function() {
     //           for(var i = 0; i < this.menuItems.length; i++) {
     //               this.menuItems[i].destroy();
     //           }
     //           this.menuItems.length = 0;
     //           this.menuItemIndex = 0;
     //       },
     //       // recreate the menu items
     //       remap: function(units) {
     //           this.clear();
     //           for(var i = 0; i < units.length; i++) {
     //               var unit3 = units[i];
     //               unit3.setMenuItem(this.addMenuItem(unit.type));
     //           }
     //           this.menuItemIndex = 0;
     //       }
     //   });
     //
     //
     //   var HeroesMenu = new Phaser.Class({
     //       Extends: Menu,
     //
     //       initialize:
     //
     //       function HeroesMenu(x, y, scene) {
     //           Menu.call(this, x, y, scene);
     //       }
     //   });
     //
     //   var ActionsMenu = new Phaser.Class({
     //       Extends: Menu,
     //
     //       initialize:
     //
     //       function ActionsMenu(x, y, scene) {
     //           Menu.call(this, x, y, scene);
     //           this.addMenuItem("equiper");
     //
     //       },
     //       confirm: function() {
     //           // we select an action and go to the next menu and choose from the enemies to apply the action
     //           this.scene.events.emit("SelectedAction");
     //       }
     //
     //   });


       var Message = new Phaser.Class({

           Extends: Phaser.GameObjects.Container,

           initialize:
           function Message(scene, events) {
               Phaser.GameObjects.Container.call(this, scene, 160, 30);
               var graphics = this.scene.add.graphics();
               this.add(graphics);
               graphics.lineStyle(1, 0xffffff, 0.8);
               graphics.fillStyle(0x031f4c, 0.3);
               graphics.strokeRect(-90, -15, 180, 30);
               graphics.fillRect(-90, -15, 180, 30);
               this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", { color: "#ffffff", align: "center", fontSize: 13, wordWrap: { width: 170, useAdvancedWrap: true }});
               this.add(this.text);
               this.text.setOrigin(0.5);
               events.on("Message", this.showMessage, this);
               this.visible = false;
           },
           showMessage: function(text) {
               this.text.setText(text);
               this.visible = true;
               if(this.hideEvent)
                   this.hideEvent.remove(false);
               this.hideEvent = this.scene.time.addEvent({ delay: 2000, callback: this.hideMessage, callbackScope: this });
           },
           hideMessage: function() {
               this.hideEvent = null;
               this.visible = false;
           }
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
