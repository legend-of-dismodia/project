var LoupScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function LoupScene ()
    {
        Phaser.Scene.call(this, { key: "LoupScene" });
    },
    preload: function ()
    {
    this.load.spritesheet("player", "../assets/spritesheet/princessfinal clone.png", { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet("loup", "../assets/spritesheet/loup.png", { frameWidth:280, frameHeight: 350});
    this.load.image("fond3", "../assets/spritesheet/nv3.png");
    },
    create: function ()
    {
         this.add.image(650, 300, 'fond3');
        this.startBattle();
    },

    startBattle: function() {
         xp = tbl.xp;
        hp = tbl.life;
       level = tbl.level;
        var warrior = new PlayerCharacter(this, 900, 400, "player", 11, "Warrior", hp, attack, 50,);
        this.add.existing(warrior);


        var loup = new Enemy(this, 500, 400, "loup", 11, "loup", 50, 15);
        this.add.existing(loup);

        this.anims.create({
        key: 'hero',
        frames: this.anims.generateFrameNumbers('hero', { start: 1, end: 15}),
        frameRate: 10,
        repeat: 0

          });

        this.heroes = [ warrior];
        this.enemies = [loup];
        this.units = this.heroes.concat(this.enemies);

        this.index = -1;

        this.scene.run("UIScene3");
    },
    nextTurn: function() {

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
    checkEndBattle: function() {
        var victory = true;
        for(var i = 0; i < this.enemies.length; i++) {
            if(this.enemies[i].living)

                victory = false;
        }
        var gameOver = true;
        for(var i = 0; i < this.heroes.length; i++) {
            if(this.heroes[i].living)
                gameOver = false;
        }
        return victory || gameOver;
    },
    receivePlayerSelection: function(action, target) {
        if(action == "attack") {
            this.units[this.index].attack(this.enemies[target]);
                this.add.sprite(500, 400, 'hero').play('hero');
        }

        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
    },


    endBattle: function() {
        this.heroes.length = 0;
        this.enemies.length = 0;
        for(var i = 0; i < this.units.length; i++) {

            this.units[i].destroy();
        }
        this.units.length = 0;
        this.scene.sleep('UIScene3');
        this.scene.switch('World3');
    }
});


var Unit = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage, xp, level) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage;
        this.maxXp = this.xp = xp;
        this.maxLevel = this.level = level;
        this.living = true;
        this.menuItem = null;
    },
    setMenuItem: function(item) {
        this.menuItem = item;
    },
    attack: function(target) {
        if(target.living) {

            target.takeDamage(this.damage);
            this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + this.damage + " damage");


        }

    },

    magieAttaque: function(target) {
          if(target.living) {
              target.takeMagic(this.magie);
              this.scene.events.emit("Message", this.type + "  magieAttaque " + target.type + " for " + this.magie + " magie");
          }
        },

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
            this.xp = 0;
            this.hp = hp + 50;
            this.level = level + 1;

            }

else {

}
  getPhaserData(this.hp, this.xp, this.level);

}

        if(this.hp <= 0) {
            this.hp = 0;
            this.menuItem.unitKilled();
            this.living = false;
            this.visible = false;
            this.menuItem = null;
        }


    },


    takeMagic: function(magie) {
        this.hp -= magie;
        if(this.hp <= 0) {
            this.hp = 0;
            this.menuItem.unitKilled();
            this.living = false;
            this.visible = false;
            this.menuItem = null;
        }
    }
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
    function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage, level, xp) {
        Unit.call(this, scene, x, y, texture, frame, type, hp, damage, level, xp);
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
    deselect: function() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = 0;
        this.selected = false;
    },
    confirm: function() {
    },
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
        this.scene.events.emit("Enemy", this.menuItemIndex);
    }
});

var UIScene3 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene3 ()
    {
        Phaser.Scene.call(this, { key: "UIScene3" });
    },

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

        this.menus = this.add.container();

        this.heroesMenu = new HeroesMenu(810, 650, this);
        this.actionsMenu = new ActionsMenu(550, 650, this);
        this.enemiesMenu = new EnemiesMenu(50, 650, this);

        this.currentMenu = this.actionsMenu;

        this.menus.add(this.heroesMenu);
        this.menus.add(this.actionsMenu);
        this.menus.add(this.enemiesMenu);

        this.loupScene = this.scene.get("LoupScene");

        this.input.keyboard.on("keydown", this.onKeyInput, this);

        this.loupScene.events.on("PlayerSelect", this.onPlayerSelect, this);

        this.events.on("SelectedAction", this.onSelectedAction, this);

        this.events.on("Enemy", this.onEnemy, this);

        this.sys.events.on('wake', this.createMenu, this);

        this.message = new Message(this, this.loupScene.events);
        this.add.existing(this.message);

        this.createMenu();
    },
    createMenu: function() {
        this.remapHeroes();
        this.remapEnemies();
        this.loupScene.nextTurn();
    },
    onEnemy: function(index) {
        this.heroesMenu.deselect();
        this.actionsMenu.deselect();
        this.enemiesMenu.deselect();
        this.currentMenu = null;
        this.loupScene.receivePlayerSelection("attack", index);
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
        var heroes = this.loupScene.heroes;
        this.heroesMenu.remap(heroes);
    },
    remapEnemies: function() {
        var enemies = this.loupScene.enemies;
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
