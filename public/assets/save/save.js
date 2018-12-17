
getSave();

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
            console.log(e+" - Désolé, aucun résultat trouvé.");
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

}

function getPhaserData(life) {
    tbl.life = life;

    var lala  = JSON.stringify(tbl);   

    $.ajax({
        url: '/game/setSave',
        method: 'POST',        
        data: 'tbl='+lala,
        success : function(r){
            console.log('ok'+  r);
        },
        error: function(e) {
            console.log(e+" - Désolé, aucun résultat trouvé.");
        }
    });
}
