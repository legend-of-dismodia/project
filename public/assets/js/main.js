// au chargement de la page
germain();

// changement de taille au clic
$('.toggle').on('click', function () {
    checkCookie()


    // masque les légendes
    $('.navbarText').toggle();

    // petite barre    
    if ($('.sidebar-content aside').css('width') !== '56px') {
        setCookie('minimizedNavbar', 'true')
        $('.sidebar-content aside').css('width', '56px');
        $('.navTitle').html('LOD');
        $('.navTitle').css({
            'font-size': '1.2rem',
            'margin': '0 -8px',
        });
        $('.navActive').css('width', '56px')
        $('.toggle').html('<a><i class="fas fa-caret-right"></i></a>');
    }
    // grosse barre
    else {
        setCookie('minimizedNavbar', 'false')
        $('.sidebar-content aside').css('width', '240px');
        $('.navTitle').html('Legend Of Dismodia');
        $('.navTitle').css({
            'font-size': '1.5rem'
        })
        $('.navActive').css('width', 'initial')
        $('.toggle').html('<a><i class="fas fa-caret-left"></i></a>');
    }
})


// https://stackoverflow.com/questions/1458724/how-do-i-set-unset-a-cookie-with-jquery
function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}


function checkCookie() {
    if (getCookie('minimizedNavbar') == 'false') {
        console.log('checkCookie() : La barre de navigation est déballée');
        return 'false';
    } else if (getCookie('minimizedNavbar') == 'true') {
        console.log('checkCookie() : La barre de navigation est minimisée');
        return 'true';
    } else {
        console.log('getCookie a une valeur de ' + getCookie('minimizedNavbar'))
    }
}

function germain() {
    console.log('Début de la fonction qui se lance au début');
    if (checkCookie() == 'true') {
        $('.navbarText').hide();
        $('.sidebar-content aside').css('width', '56px');
        $('.navTitle').html('LOD');
        $('.navTitle').css({
            'font-size': '1.2rem',
            'margin': '0 -8px',
        });
        $('.navActive').css('width', '56px')
        $('.toggle').html('<a><i class="fas fa-caret-right"></i></a>');
    } else if (checkCookie() == 'false') {
        $('.sidebar-content aside').css('width', '240px');
        $('.navTitle').html('Legend Of Dismodia');
        $('.navTitle').css({
            'font-size': '1.5rem'
        })
        $('.navActive').css('width', 'initial')
        $('.toggle').html('<a><i class="fas fa-caret-left"></i></a>');
    } else {
        console.log('ça marche po');
    }
}