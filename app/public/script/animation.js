const iconSection = document.querySelectorAll('.icon-item');
const footerIcons = document.querySelectorAll('.footer-item');
const footerBottom = document.querySelectorAll('.footer-bottom-item');
const box = document.querySelectorAll(".about-box-container");
const boxInfo = document.querySelectorAll(".box-info");
const boxDesc = document.querySelectorAll(".box-desc");
const aboutBTN = document.querySelectorAll(".about-btn-container");
const landWords = document.querySelectorAll(".reveal-word");

 
 ScrollReveal().reveal('.txt-spacer', {
    delay: 200,
    duration: 500,
    distance: '100px',
    origin: 'bottom',
    easing: 'ease-in-out',
    reset: true
});

ScrollReveal().reveal('.image-header', {
    delay: 200,
    duration: 500,
    distance: '100px',
    origin: 'top',
    easing: 'ease-in-out',
    reset: true
});



ScrollReveal().reveal('.grid-item', {
    delay: 0,
    duration: 500,
    distance: '100px',
    origin: 'bottom',
    easing: 'ease-in-out',
    reset: true
});

ScrollReveal().reveal('.icon-txt', {
    delay: 100,
    duration: 1000,
    distance: '300px',
    origin: 'top',
    easing: 'ease-in-out',
    reset: true
});



for (let i = 0; i < iconSection.length; i++) {
    ScrollReveal().reveal(iconSection[i], {
        delay: 100 + (i * 100),
        duration: 1000,
        distance: '100px',
        origin: 'bottom',
        easing: 'ease-in-out',
        reset: true
    });
}

for (let i = 0; i < footerIcons.length; i++) {
    ScrollReveal().reveal(footerIcons[i], {
        delay: 100 + (i * 100),
        duration: 1500,
        distance: '50px',
        origin: 'top',
        easing: 'ease-in-out',
        reset: true
    });
}


ScrollReveal().reveal('.footer-icon-left', {
    delay: 500,
    duration: 1500,
    distance: '50px',
    origin: 'left',
    easing: 'ease-in-out',
    reset: true
});

ScrollReveal().reveal('.footer-icon-right', {
    delay: 500,
    duration: 1500,
    distance: '50px',
    origin: 'right',
    easing: 'ease-in-out',
    reset: true
});


for (let i = 0; i < footerBottom.length; i++) {
    ScrollReveal().reveal(footerBottom[i], {
        delay: 100 + (i * 100),
        duration: 1500,
        distance: '100px',
        origin: 'bottom',
        easing: 'ease-in-out',
        reset: true
    });
}

ScrollReveal().reveal('.copy-container', {
    delay: 1500,
    duration: 500,
    distance: '10px',
    origin: 'right',
    easing: 'ease-in-out',
    reset: true
});



for (let i = 0; i < landWords.length; i++) {
    ScrollReveal().reveal(landWords[i], {
        delay: 300 * i,
        duration: 500,
        reset: true


    });
}


for (let i = 0; i < box.length; i++) {
    ScrollReveal().reveal(box[i], {
        delay: 100,
        duration: 500,
        distance: '10px',
        origin: 'bottom',
        easing: 'ease-in-out',
        reset: true
    });
}


for (let i = 0; i < boxInfo.length; i++) {
    ScrollReveal().reveal(boxInfo[i], {
        delay: 100 + (i * 100),
        duration: 500,
        distance: '50px',
        origin: 'bottom',
        easing: 'ease-in-out',
        reset: true
    });
}

