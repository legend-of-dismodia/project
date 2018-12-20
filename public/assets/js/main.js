"use strict"
// function end(){
//   document.location.href = "/end";
//   console.log('coucou');
// }
var winSize = window.innerWidth;
// au chargement de la page
checkSize();

// clic sur le bouton toggle
$('.toggle').on('click', function () {
    // masque les légendes
    $('.navbarText').toggle();
    $('.rectangle').toggle();

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

// au redimensionnement de la fenêtre
$(window).on('resize', function () {
    checkSize();
});

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

function checkSize() {
    // pc
    if (window.innerWidth > 765) {
            // petite navbar
        if (getCookie('minimizedNavbar') == 'true') {
            $('.navbarText').hide();
            $('.sidebar-content aside').css('width', '56px');
            $('.navTitle').html('LOD');
            $('.navTitle').css({
                'font-size': '1.2rem',
                'margin': '0 -8px',
            });
            $('.navActive').css('width', '56px')
            $('.toggle').html('<a><i class="fas fa-caret-right"></i></a>');

            // grosse navbar
        } else if (getCookie('minimizedNavbar') == 'false') {
            $('.sidebar-content aside').css('width', '240px');
            $('.navTitle').html('Legend Of Dismodia');
            $('.navTitle').css({
                'font-size': '1.5rem'
            })
            $('.navActive').css('width', 'initial')
            $('.toggle').html('<a><i class="fas fa-caret-left"></i></a>');

            // pas de cookie de taille de navbar
        } else {
            $('.sidebar-content aside').css('width', '240px');
            $('.navTitle').html('Legend Of Dismodia');
        }

    }
    // mobile
    else {
        $('.sidebar-content aside').css('width', '100%');
        $('.navTitle').html('LOD');
    }
}

$(document).ready(function(){
    $("#soundOff").css("display", "none");

    $("#soundUp").on("click", function(){
        $("#soundUp").css("display", "none");
        $("#soundOff").css("display", "block");
        $("#trailer").prop('muted', true);
    })

    $("#soundOff").on("click", function(){
        $("#soundOff").css("display", "none");
        $("#soundUp").css("display", "block");
        $("#trailer").prop('muted', false);

    })
});
