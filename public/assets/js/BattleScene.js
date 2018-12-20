var BattleScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function BattleScene ()
    {
        Phaser.Scene.call(this, { key: "BattleScene" });

    },
    preload: function ()
    {
        // load resources
    this.load.spritesheet("player", "../assets/spritesheet/princessfinal clone.png", { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('souris1', '../assets/spritesheet/troll2.png', { frameWidth: 462, frameHeight: 669});
    this.load.image("fond", "../assets/spritesheet/nv1.png");
    this.load.spritesheet('hero', '../assets/spritesheet/Breath.png', { frameWidth: 192, frameHeight: 192});

    },
    create: function ()
    {

        this.add.image(650, 300, 'fond');
        this.startBattle();

    },

    startBattle: function() {
  //---------------------------stat pour base de donnée----------------------//
        hp = tbl.life;
        xp = tbl.xp;
       level = tbl.level;
//------------------------------on définit les personnages--------------------//

        var warrior = new PlayerCharacter(this, 900, 400, "player", 11, "Warrior", hp, attack, xp, level);
        this.add.existing(warrior);


        var souris = new Enemy(this, 500, 400, "souris1", null, "souris1", 50, 10);
        this.add.existing(souris);

//--------------------on définit les animations pour les sprite--------------//

        this.anims.create({
        key: 'hero',
        frames: this.anims.generateFrameNumbers('hero', { start: 1, end: 15}),
        frameRate: 10,
        repeat: 0

          });

//------------------listes des heros et ennemies disponibl-------------------//

        this.heroes = [ warrior];

        this.enemies = [souris];

        this.units = this.heroes.concat(this.enemies);

        this.index = -1;

//---------------------on appelle la scene qui affihe l'interface------------//

        this.scene.run("UIScene");
    },

//----------------------------------tour suivant-------------------------------//
    nextTurn: function() {

//------------------------------si victoire ou defaite------------------------//
        if(this.checkEndBattle()) {
            this.endBattle();

            return;
        }
        do {

            this.index++;

            if(this.index >= this.units.length) {
                this.index = 0;
            }
        } while(!this.units[this.index].living);

        if(this.units[this.index] instanceof PlayerCharacter) {


            this.events.emit("PlayerSelect", this.index);
        } else {

            var r;
            do {
                r = Math.floor(Math.random() * this.heroes.length);
            } while(!this.heroes[r].living)

            this.units[this.index].attack(this.heroes[r]);

            this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
        }
    },

//--------------------------en cas de victoire ou game over------------------//
    checkEndBattle: function() {
        var victory = true;
//-----------------------si tout les ennemis sont mort----------------------//
        for(var i = 0; i < this.enemies.length; i++) {
            if(this.enemies[i].living)

                victory = false;
        }
        var gameOver = true;
  //-------------------------si game over---------------------------------//
        for(var i = 0; i < this.heroes.length; i++) {

            if(this.heroes[i].living)

                gameOver = false;
        }
        return victory || gameOver;
    },
//-----------------------quand hero attaque---------------------------------//
    receivePlayerSelection: function(action, target) {
        if(action == "attack") {
            this.units[this.index].attack(this.enemies[target]);
            this.add.sprite(500, 400, 'hero').play('hero');
        }

        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
    },


    endBattle: function() {
 //---------------------------destruction des sprite si battut----------------//

        this.heroes.length = 0;
        this.enemies.length = 0;
        for(var i = 0; i < this.units.length; i++) {

            this.units[i].destroy();
            heroText = this.add.text(80, 430, 'rare: 0', { font: 'bold 12pt Arial', fill: '#9b59b6' });
            heroText.setText('vous avez gagné un niveau');
        }
        this.units.length = 0;
//-------------------------------retour au niveau----------------------------//

        this.scene.sleep('UIScene');

        this.scene.switch('World');
    }
});

//-----------------------------stat des personnages---------------------------//

var Unit = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:
    function Unit(scene, x, y, texture, frame, type, hp, damage, xp, level) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage; // default damage
        this.maxXp = this.xp = xp;
        sthis.maxLevel = this.level = level;
        this.living = true;
        this.menuItem = null;

    },

    setMenuItem: function(item) {
        this.menuItem = item;
    },
//------------------------------quand le perso attaque-----------------------//

    attack: function(target) {
        if(target.living) {

            target.takeDamage(this.damage);
            this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + this.damage + " damage");
        }

    },

//---------fonction qui enregistre les stats en base de données--------------//

    takeDamage: function(damage) {

        if(i == 0){
            i = 1;
            this.hp -= damage;

        }else{
            this.hp -= damage;
            i = 0;
            console.log("hp: "+this.hp+"dmg : "+ damage);
            this.hp -= damage;
            this.xp = xp + 50;


            if (this.xp > 100){
            this.level = level + 1;
            xp = 0;
            this.hp += 50;


            }
            getPhaserData(this.hp, this.xp, this.level);

        }
//------------------------------disparition du menu--------------------------//
        if(this.hp <= 0 ) {
            this.hp = 0;
            this.menuItem.unitKilled();
            this.living = false;
            this.visible = false;
            this.menuItem = null;
        }

    },


});

//-------------------------definit les class ennemie et hero------------------//

var Enemy = new Phaser.Class({
    Extends: Unit,

    initialize:
    function Enemy(scene, x, y, texture, frame, type, hp, damage) {
        Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    }
});

var PlayerCharacter = new Phaser.Class({
    Extends: Unit,

    initialize:
    function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage, xp, level) {
        Unit.call(this, scene, x, y, texture, frame, type, hp, damage, xp,level);
        // flip the image so I don"t have to edit it manually
        this.flipX = true;

        this.setScale(2);

    }
});

var MenuItem = new Phaser.Class({
    Extends: Phaser.GameObjects.Text,

    initialize:

    function MenuItem(x, y, text, scene) {
        Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: "#ffffff", align: "left", fontSize: 15});
    },

    select: function() {
        this.setColor("#f8ff38");
    },

    deselect: function() {
        this.setColor("#ffffff");
    },

    unitKilled: function() {
        this.active = false;
        this.visible = false;
    }

});

//--------------------------------base du menu de selection------------------//

var Menu = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,

    initialize:

    function Menu(x, y, scene, heroes) {
        Phaser.GameObjects.Container.call(this, scene, x, y);
        this.menuItems = [];
        this.menuItemIndex = 0;
        this.x = x;
        this.y = y;
        this.selected = false;
    },
    addMenuItem: function(unit) {
        var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
        this.menuItems.push(menuItem);
        this.add(menuItem);
        return menuItem;
    },
    //---------------------------- menu navigation---------------------------//
    moveSelectionUp: function() {
        this.menuItems[this.menuItemIndex].deselect();
        do {
            this.menuItemIndex--;
            if(this.menuItemIndex < 0)
                this.menuItemIndex = this.menuItems.length - 1;
        } while(!this.menuItems[this.menuItemIndex].active);
        this.menuItems[this.menuItemIndex].select();
    },
    moveSelectionDown: function() {
        this.menuItems[this.menuItemIndex].deselect();
        do {
            this.menuItemIndex++;
            if(this.menuItemIndex >= this.menuItems.length)
                this.menuItemIndex = 0;
        } while(!this.menuItems[this.menuItemIndex].active);
        this.menuItems[this.menuItemIndex].select();
    },

//------------------------pour selectionner-------------------------------//

    select: function(index) {
        if(!index)
            index = 0;
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = index;
        while(!this.menuItems[this.menuItemIndex].active) {
            this.menuItemIndex++;
            if(this.menuItemIndex >= this.menuItems.length)
                this.menuItemIndex = 0;
            if(this.menuItemIndex == index)
                return;
        }
        this.menuItems[this.menuItemIndex].select();
        this.selected = true;
    },

//-------------------------------deselectionner------------------------------//

    deselect: function() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = 0;
        this.selected = false;
    },
    confirm: function() {
//-----------------------------confirme la selection--------------------------//
    },

//---------------------------a chaque fois qu'une unité meurt----------------//
    clear: function() {
        for(var i = 0; i < this.menuItems.length; i++) {
            this.menuItems[i].destroy();
        }
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    },

    remap: function(units) {
        this.clear();
        for(var i = 0; i < units.length; i++) {
            var unit = units[i];
            unit.setMenuItem(this.addMenuItem(unit.type));
        }
        this.menuItemIndex = 0;
    }
});

//------------------------------les 3 menus--------------------------------//
var HeroesMenu = new Phaser.Class({
    Extends: Menu,

    initialize:

    function HeroesMenu(x, y, scene) {
        Menu.call(this, x, y, scene);
    }
});

var ActionsMenu = new Phaser.Class({
    Extends: Menu,

    initialize:

    function ActionsMenu(x, y, scene) {
        Menu.call(this, x, y, scene);
        this.addMenuItem("Attack");

    },
    confirm: function() {
//--------------------------------pour confirmer---------------------------//

        this.scene.events.emit("SelectedAction");
    }

});

var EnemiesMenu = new Phaser.Class({
    Extends: Menu,

    initialize:

    function EnemiesMenu(x, y, scene) {
        Menu.call(this, x, y, scene);
    },
    confirm: function() {

//------------------------confirme la selection de l'ennemi-----------------//

        this.scene.events.emit("Enemy", this.menuItemIndex);
    }
});

//------------------------------user interface scene-------------------------//

var UIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: "UIScene" });
    },

//---------------------------------créer le menu-------------------------------//
    create: function ()
    {

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);
        this.graphics.strokeRect(2, 600, 500, 200);
        this.graphics.fillRect(2, 600, 500, 200);
        this.graphics.strokeRect(500, 600, 500, 200);
        this.graphics.fillRect(500, 600, 500, 200);
        this.graphics.strokeRect(800, 600, 500, 200);
        this.graphics.fillRect(800, 600, 500, 200);

//-----------------------ce que contient les cadre------------------------//
        this.menus = this.add.container();

        this.heroesMenu = new HeroesMenu(810, 650, this);
        this.actionsMenu = new ActionsMenu(550, 650, this);
        this.enemiesMenu = new EnemiesMenu(50, 650, this);


        this.currentMenu = this.actionsMenu;

//------------------------------ajouter les menu-----------------------------//

        this.menus.add(this.heroesMenu);
        this.menus.add(this.actionsMenu);
        this.menus.add(this.enemiesMenu);

        this.battleScene = this.scene.get("BattleScene");

//----------------------------evenement clavier----------------------------//

        this.input.keyboard.on("keydown", this.onKeyInput, this);
        this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);
        this.events.on("SelectedAction", this.onSelectedAction, this);
        this.events.on("Enemy", this.onEnemy, this);
        this.sys.events.on('wake', this.createMenu, this);
        this.message = new Message(this, this.battleScene.events);
        this.add.existing(this.message);

        this.createMenu();
    },
    createMenu: function() {

        this.remapHeroes();
        this.remapEnemies();
        this.battleScene.nextTurn();
    },

//------------------deselecte les autre menu-----------------------------//
    onEnemy: function(index) {

        this.heroesMenu.deselect();
        this.actionsMenu.deselect();
        this.enemiesMenu.deselect();
        this.currentMenu = null;
        this.battleScene.receivePlayerSelection("attack", index);

    },
    onPlayerSelect: function(id) {

        this.heroesMenu.select(id);
        this.actionsMenu.select(0);
        this.currentMenu = this.actionsMenu;
    },


    onSelectedAction: function() {
        this.currentMenu = this.enemiesMenu;
        this.enemiesMenu.select(0);
    },
    remapHeroes: function() {
        var heroes = this.battleScene.heroes;
        this.heroesMenu.remap(heroes);
    },
    remapEnemies: function() {
        var enemies = this.battleScene.enemies;
        this.enemiesMenu.remap(enemies);
    },
    onKeyInput: function(event) {
        if(this.currentMenu && this.currentMenu.selected) {
            if(event.code === "ArrowUp") {
                this.currentMenu.moveSelectionUp();
            } else if(event.code === "ArrowDown") {
                this.currentMenu.moveSelectionDown();
            } else if(event.code === "ArrowRight" || event.code === "Shift") {

            } else if(event.code === "Space" || event.code === "ArrowLeft") {
                this.currentMenu.confirm();
            }
        }
    },
});

//--------------------------------créer un message-------------------------//

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
