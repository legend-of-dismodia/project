var BossBattle = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function BossBattle ()
    {
        Phaser.Scene.call(this, { key: "BossBattle" });
    },
    preload: function ()
    {
        // load resources
    this.load.spritesheet("player", "../assets/spritesheet/princessfinal clone.png", { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet("boss", "../assets/spritesheet/boss.png",  { frameWidth: 374, frameHeight: 354});
      this.load.spritesheet("boss1", "../assets/spritesheet/boss.png",  { frameWidth: 374, frameHeight: 354});
    this.load.image("fond1", "../assets/spritesheet/nv4.png");
    },
    create: function ()
    {
        // change the background to green
        this.add.image(650, 300, 'fond1');
        this.startBattle();
        // on wake event we call startBattle too
        // this.sys.events.on('wake', this.startBattle, this);
    },

    startBattle: function() {
        hp = tbl.life;
        xp = tbl.xp;
        level = tbl.level;


        var warrior = new PlayerCharacter(this, 900, 400, "player", 11, "Kalhanne", hp, attack, 50, xp, level);
        this.add.existing(warrior);


        var boss = new Enemy(this, 500, 400, "", 1, "Dipsos", 100, 30);
        this.add.existing(boss);


        this.anims.create({
          key: 'boss1',
         frames: this.anims.generateFrameNumbers('boss1', { start: 1, end: 46}),
          frameRate: 10,
          repeat: -1
      });

      this.anims.create({
      key: 'hero',
      frames: this.anims.generateFrameNumbers('hero', { start: 1, end: 15}),
      frameRate: 10,
      repeat: 0

        });

      this.add.sprite(500, 400, 'boss1').play('boss1');
        // array with heroes
        this.heroes = [ warrior];
        // array with enemies
        this.enemies = [boss];
        // array with both parties, who will attack
        this.units = this.heroes.concat(this.enemies);

        this.index = -1; // currently active unit

        this.scene.run("UIScene2");
    },
    nextTurn: function() {
        // if we have victory or game over
        if(this.checkEndBattle()) {
            this.endBattle();

            return;
        }
        do {
            // currently active unit
            this.index++;
            // if there are no more units, we start again from the first one
            if(this.index >= this.units.length) {
                this.index = 0;
            }
        } while(!this.units[this.index].living);
        // if its player hero
        if(this.units[this.index] instanceof PlayerCharacter) {
            // we need the player to select action and then enemy
            this.events.emit("PlayerSelect", this.index);
        } else { // else if its enemy unit
            // pick random living hero to be attacked
            var r;
            do {
                r = Math.floor(Math.random() * this.heroes.length);
            } while(!this.heroes[r].living)
            // call the enemy's attack function
            this.units[this.index].attack(this.heroes[r]);
            // add timer for the next turn, so will have smooth gameplay
            this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
        }
    },
    // check for game over or victory
    checkEndBattle: function() {
        var victory = true;
        // if all enemies are dead we have victory
        for(var i = 0; i < this.enemies.length; i++) {
            if(this.enemies[i].living)

                victory = false;
        }
        var gameOver = true;
        // if all heroes are dead we have game over
        for(var i = 0; i < this.heroes.length; i++) {
            if(this.heroes[i].living)
                gameOver = false;
        }
        return victory || gameOver;
    },
    // when the player have selected the enemy to be attacked
    receivePlayerSelection: function(action, target) {
        if(action == "attack") {
            this.units[this.index].attack(this.enemies[target]);
                this.add.sprite(500, 400, 'hero').play('hero');
        }

        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
    },


    endBattle: function() {
        // clear state, remove sprites
        this.heroes.length = 0;
        this.enemies.length = 0;
        for(var i = 0; i < this.units.length; i++) {

            this.units[i].destroy();
        }
        this.units.length = 0;
        // sleep the UI
        this.scene.sleep('UIScene2');
        // return to WorldScene and sleep current BossBattle
        this.scene.switch('WorldScene');
    }
});


// base class for heroes and enemies
var Unit = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage, xp, level) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage; // default damage
        this.maxXp = this.xp = xp;
        this.maxLevel = this.level = level;
        this.living = true;
        this.menuItem = null;
        i = 0;
    },
    // we will use this to notify the menu item when the unit is dead
    setMenuItem: function(item) {
        this.menuItem = item;
    },
    // attack the target unit
    attack: function(target) {
        if(target.living) {

            target.takeDamage(this.damage);
            this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + this.damage + " damage");


        }

    },


    takeDamage: function(damage) {
        if(i == 0){
            i = 1;
            this.hp -= damage;
            console.log("hp1: "+this.hp+" dmg1: "+ damage);

        }else{

            console.log("hp: "+this.hp+"dmg : "+ damage);
            this.hp -= damage;
            this.xp = xp + 50;

            if (this.xp > 100){
            this.xp = 0;
            this.hp = hp + 50;
            this.level = level + 1;
            }
            // hpText = this.add.text(160, 70, 'hp: 0', { fontSize: '24px', fill: 'white' });
            // heroText.setText('vous avez gagné un niveau');
            getPhaserData(this.hp, this.xp, this.level);
            i = 0;
        }

        if(this.hp <= 0) {
            this.hp = 0;
            this.menuItem.unitKilled();
            this.living = false;
            this.visible = false;
            this.menuItem = null;
        }


    },


});

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
    function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage,  xp, level) {
        Unit.call(this, scene, x, y, texture, frame, type, hp, damage, xp,  level);
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
    // when the associated enemy or player unit is killed
    unitKilled: function() {
        this.active = false;
        this.visible = false;
    }

});

// base menu class, container for menu items
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
    // menu navigation
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
    // select the menu as a whole and highlight the choosen element
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
    // deselect this menu
    deselect: function() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = 0;
        this.selected = false;
    },
    confirm: function() {
        // when the player confirms his slection, do the action
    },
    // clear menu and remove all menu items
    clear: function() {
        for(var i = 0; i < this.menuItems.length; i++) {
            this.menuItems[i].destroy();
        }
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    },
    // recreate the menu items
    remap: function(units) {
        this.clear();
        for(var i = 0; i < units.length; i++) {
            var unit = units[i];
            unit.setMenuItem(this.addMenuItem(unit.type));
        }
        this.menuItemIndex = 0;
    }
});

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
        // this.addMenuItem("Attack");

    },
    confirm: function() {
        // we select an action and go to the next menu and choose from the enemies to apply the action
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
        // the player has selected the enemy and we send its id with the event
        this.scene.events.emit("Enemy", this.menuItemIndex);
    }
});

// User Interface scene
var UIScene2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene2 ()
    {
        Phaser.Scene.call(this, { key: "UIScene2" });
    },

    create: function ()
    {
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(10, 0x795548);
        this.graphics.fillStyle(0x1e4363, 1);

        // x,y - w,h
        //panneau 1
        this.graphics.strokeRect(5, 600, 500, 195);
        this.graphics.fillRect(5, 600, 500, 195);
        //panneau 2
        this.graphics.strokeRect(500, 600, 500, 195);
        this.graphics.fillRect(500, 600, 500, 195);
        //panneau 3
        this.graphics.strokeRect(800, 600, 475, 195);
        this.graphics.fillRect(800, 600, 475, 195);

//-----------------------ce que contient les cadre------------------------//
        this.menus = this.add.container();

        this.heroesMenu = new HeroesMenu(850, 650, this);
        this.actionsMenu = new ActionsMenu(550, 650, this);
        this.enemiesMenu = new EnemiesMenu(50, 650, this);

        // the currently selected menu
        this.currentMenu = this.actionsMenu;

        // add menus to the container
        this.menus.add(this.heroesMenu);
        this.menus.add(this.actionsMenu);
        this.menus.add(this.enemiesMenu);

        this.BossBattle = this.scene.get("BossBattle");

        // listen for keyboard events
        this.input.keyboard.on("keydown", this.onKeyInput, this);

        // when its player cunit turn to move
        this.BossBattle.events.on("PlayerSelect", this.onPlayerSelect, this);

        // when the action on the menu is selected
        // for now we have only one action so we dont send and action id
        this.events.on("SelectedAction", this.onSelectedAction, this);

        // an enemy is selected
        this.events.on("Enemy", this.onEnemy, this);

        // when the scene receives wake event
        this.sys.events.on('wake', this.createMenu, this);

        // the message describing the current action
        this.message = new Message(this, this.BossBattle.events);
        this.add.existing(this.message);

        this.createMenu();
    },
    createMenu: function() {
        // map hero menu items to heroes
        this.remapHeroes();
        // map enemies menu items to enemies
        this.remapEnemies();
        // first move
        this.BossBattle.nextTurn();
    },
    onEnemy: function(index) {
        // when the enemy is selected, we deselect all menus and send event with the enemy id
        this.heroesMenu.deselect();
        this.actionsMenu.deselect();
        this.enemiesMenu.deselect();
        this.currentMenu = null;
        this.BossBattle.receivePlayerSelection("attack", index);
        // this.BossBattle.receivePlayerSelection2("magie", index);
    },
    onPlayerSelect: function(id) {
        // when its player turn, we select the active hero item and the first action
        // then we make actions menu active
        this.heroesMenu.select(id);
        this.actionsMenu.select(0);
        this.currentMenu = this.actionsMenu;
    },
    // we have action selected and we make the enemies menu active
    // the player needs to choose an enemy to attack
    onSelectedAction: function() {
        this.currentMenu = this.enemiesMenu;
        this.enemiesMenu.select(0);
    },
    remapHeroes: function() {
        var heroes = this.BossBattle.heroes;
        this.heroesMenu.remap(heroes);
    },
    remapEnemies: function() {
        var enemies = this.BossBattle.enemies;
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

// the message class extends containter
var Message = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,

    initialize:
    function Message(scene, events) {
        Phaser.GameObjects.Container.call(this, scene, 95, 20);
        var graphics = this.scene.add.graphics();
        this.add(graphics);

        graphics.lineStyle(10, 0x795548, 1);
        graphics.fillStyle(0x1e4363, 1);

        graphics.strokeRect(-90, -15, 1270, 50);
        graphics.fillRect(-90, -15, 1270, 50);

        this.text = new Phaser.GameObjects.Text(scene, 160, 10, "", { color: "#ffffff", align: "left", font: "20px Arial"});
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
