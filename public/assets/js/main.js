
$('.toggle').on('click', function () {
    console.log("salut");

    // masque les légendes
    $('.navbarText').toggle();

    // affichage sur la petite barre
    if ($('.sidebar-content aside').css('width') !== '56px') {
        $('.sidebar-content aside').css('width', '56px');
        $('.navTitle').html('LOD');
        $('.navTitle').css({
            'font-size': '1.2rem',
            'margin': '0 -8px',
        });
        $('.navActive').css('width', '56px')
        $('.toggle').html('<a><i class="fas fa-caret-right"></i></a>');
    }
    // affichage sur la  grosse barre
    else {
        $('.sidebar-content aside').css('width', '240px');
        $('.navTitle').html('Legend of Dismodia');
        $('.navTitle').css({
            'font-size': '1.5rem'
        })
        $('.navActive').css('width', 'initial')
        $('.toggle').html('<a><i class="fas fa-caret-left"></i></a>');
    }

})