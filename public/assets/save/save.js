
getSave();

var hp = 100;
var attack = 40;
var tbl = [];

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


    hp = saveUser.life;
    createdAt = saveUser.createdAt;
    level= saveUser.level;
    life= saveUser.life;
    mana= saveUser.mana;
    xp= saveUser.xp;
    playtime= saveUser.playtime;

    console.log(hp);

}
