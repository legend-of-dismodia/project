var Sac = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function Sac() {
            Phaser.Scene.call(this, { key: 'Sac' });
        },

    preload: function () {

        //------------------insère les liens de tous ce qu'on a besoin---------------//

        this.load.spritesheet("player", "../assets/spritesheet/princessfinal clone.png", { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet("objet", "../assets/spritesheet/IconSet.png", { frameWidth: 32, frameHeight: 32 });
    },

    create: function () {


        this.startInventory();

    },

    startInventory: function () {

        this.index = -1; // currently active unit


        this.scene.start('UIScene5');
    },


});

var UIScene5 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function UIScene5() {
            Phaser.Scene.call(this, { key: 'UIScene5' });
        },

    create: function () {

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(10, 0x795548);
        this.graphics.fillStyle(0x1e4363, 1);
        // x, y, w, h
        this.graphics.strokeRect(5, 5, 300, 200);
        this.graphics.fillRect(5, 5, 300, 200);

        this.graphics.strokeRect(5, 200, 300, 595);
        this.graphics.fillRect(5, 200, 300, 595);

        hp = tbl.life;

        var warrior = new PlayerCharacter(this, 80 , 90, "player", 0, "Warrior", hp, attack, 50);
        this.add.existing(warrior);

        var potion;
        var arme;
        
        if (tbl.inventories.length != 0) {

            tbl.inventories.forEach(item => {            
                switch (item.name) {
                    case 'Potion':
                        potion = new Objet(this, 40, 270, "objet", 179, item.name, item.property, item.quantity, item.rarety);
                        this.add.existing(potion); 
                        potion.setDepth(10);                   
                    break;
    
                    case 'Sword':
                        arme = new Objet (this, 40, 400, "objet", 97, item.name, item.property, item.quantity, item.rarety);
                        this.add.existing(arme);
                        arme.setDepth(10);
                    break;
    
                }
            });

        }else{            
            lo = this.add.text(90, 250, 'Pas d\'objet disponible', { font: '14px Arial', fill: 'white' });
        }

        warrior.setDepth(10);

        this.heroes = [warrior];
        this.objet = [potion, arme];

        //-----------------------------stat personnage------------------------------//

        hpText = this.add.text(160, 70, 'hp: 0', { fontSize: '24px', fill: 'white' });
        hpText.setText('HP: ' + hp);

        attackText = this.add.text(160, 100, 'attack: 0', { fontSize: '24px', fill: 'white' });
        attackText.setText('ATK: ' + attack);

        //-----------------------------------Inventaire--------------------------------//

        invent = this.add.text(115, 210, 'Inventaire', { font: 'bold 12pt Arial', fill: 'white' });
        tbl.inventories.forEach(item => {
            var properties = item.property;
            switch (item.name) {
                case 'Potion':
                    potionText = this.add.text(80, 260, 'effet: 0', { fontSize: '14px', fill: 'white' });
                    Object.keys(properties).forEach(function(key) {
                        potionText.setText(key.toUpperCase()+' : +' + properties[key]);
                    });

                    potionText = this.add.text(80, 280, 'quantité: 0', { fontSize: '14px', fill: 'white' });
                    potionText.setText('Quantité : ' + item.quantity);

                    switch (item.rarety) {
                        case '1':
                            potionText = this.add.text(80, 300, 'rare: 0', { font: 'bold 12pt Arial', fill: '#ecf0f1' });
                            potionText.setText('Commun');
                        break;

                        case '2':
                            potionText = this.add.text(80, 300, 'rare: 0', { font: 'bold 12pt Arial', fill: '#2980b9' });
                            potionText.setText('Rare');
                        break;

                        case '3':
                            potionText = this.add.text(80, 300, 'rare: 0', { font: 'bold 12pt Arial', fill: '#9b59b6' });
                            potionText.setText('Épique');
                        break;

                        case '4':
                            potionText = this.add.text(80, 300, 'rare: 0', { font: 'bold 12pt Arial', fill: '#f39c12' });
                            potionText.setText('Légendaire');
                        break;

                    }
                break;

                case 'Sword':
                    armeText = this.add.text(80, 390, 'effet: 0', { fontSize: '14px', fill: 'white' });
                    Object.keys(properties).forEach(function(key) {
                        armeText.setText(key.toUpperCase()+' : +' + properties[key]);
                    });

                    armeText = this.add.text(80, 410, 'quantité: 0', { fontSize: '14px', fill: 'white' });
                    armeText.setText('Quantité : ' + item.quantity);

                    switch (item.rarety) {
                        case '1':
                            armeText = this.add.text(80, 430, 'rare: 0', { font: 'bold 12pt Arial', fill: '#ecf0f1' });
                            armeText.setText('Commun');
                        break;

                        case '2':
                            armeText = this.add.text(80, 430, 'rare: 0', { font: 'bold 12pt Arial', fill: '#2980b9' });
                            armeText.setText('Rare');
                        break;

                        case '3':
                            armeText = this.add.text(80, 430, 'rare: 0', { font: 'bold 12pt Arial', fill: '#9b59b6' });
                            armeText.setText('Épique');
                        break;

                        case '4':
                            armeText = this.add.text(80, 430, 'rare: 0', { font: 'bold 12pt Arial', fill: '#f39c12' });
                            armeText.setText('Légendaire');
                        break;

                    }
                break;
            }
        });

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



        this.input.keyboard.once("keydown_I", event => {

            // tbl.inventories.forEach(item => {            
            //     switch (item.name) {
            //         case 'Potion':
            //             if (item.quantity > 0) {
            //                 item.quantity -= 1;

            //                 hpText = this.add.text(160, 70, 'hp: 0', { fontSize: '24px', fill: 'white' });
            //                 hpText.setText('HP: ' + hp);

            //                 this.hp = hp + item.property.hp;
            //                 getPhaserData(this.hp, tbl.xp, tbl.level);
                            
            //             }
            //             else {
            //                 alert("vous n'avez pas assez de potion");
                            
            //             }
            //         break;

            //         case 'Sword':
                        
            //         break;
            //     }
                
            // });

            tbl.inventories.forEach(item => {                            
                switch (item.name) {
                    case 'Potion':
                        if (item.quantity > 0) {
                            item.quantity -= 1;

                            hpText = this.add.text(160, 70, 'hp: 0', { fontSize: '24px', fill: 'white' });
                            hpText.setText('HP: ' + hp);

                            this.hp = hp + item.property.hp;
                            getPhaserData(this.hp, tbl.xp, tbl.level); 
                            break;                           
                        }else{
                            alert("Vous n'avez pas assez de potion");
                            break;
                        }
                    break;

                    case 'Sword':
                        
                    break;

                }
                
            });


        });


    },


});
var Unit = new Phaser.Class({
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
    setMenuItem: function (item) {
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
            console.log('hpPLayer: ' + hp);
            console.log('effet: ' + effet);

        }
});

var Unit3 = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

        function Unit3(scene, x, y, texture, frame, type, effet, quantité, rareté) {
            Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
            this.type = type;
            this.effet = effet;
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
            this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", { color: "#ffffff", align: "center", fontSize: 13, wordWrap: { width: 170, useAdvancedWrap: true } });
            this.add(this.text);
            this.text.setOrigin(0.5);
            events.on("Message", this.showMessage, this);
            this.visible = false;
        },
    showMessage: function (text) {
        this.text.setText(text);
        this.visible = true;
        if (this.hideEvent)
            this.hideEvent.remove(false);
        this.hideEvent = this.scene.time.addEvent({ delay: 2000, callback: this.hideMessage, callbackScope: this });
    },
    hideMessage: function () {
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
