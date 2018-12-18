
getSave();
var i = 0;

var attack = 40;

var tbl = {};
console.log(tbl);

function getSave(){
    $.ajax({
        url: '/game/save',
        method: 'POST',
        dataType: 'json',
        success : successSave,
        error: function(e) {
            console.log(e+" - Désolé, aucun résultat trouvé DataJson.");
        }
    });
}

function successSave(data){
    var saveUser = data;

    tbl.life = saveUser.life;
    tbl.createdAt = saveUser.createdAt;
    tbl.level = saveUser.level;
    tbl.life = saveUser.life;
    tbl.mana = saveUser.mana;
    tbl.xp = saveUser.xp;
    tbl.playtime = saveUser.playtime;
    tbl.inventories = saveUser.inventory;
}

function getPhaserData(life, xp, level) {
tbl.life = life;
tbl.xp = xp;
tbl.level = level;


    var jsonData  = JSON.stringify(tbl);

    $.ajax({
        url: '/game/setSave',
        method: 'POST',
        data: 'tbl='+jsonData,
        success : function(r){
            console.log('ok'+  r);
        },
        error: function(e) {
            console.log(e+" - Désolé, aucun résultat trouvé.");
        }
    });
  }
