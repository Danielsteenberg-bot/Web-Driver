/* var rellax = new Rellax('.grid-item');
 */const icons = document.querySelectorAll('.icon-item');
 const footerIcons = document.querySelectorAll('.footer-item');
 const footerBottom = document.querySelectorAll('.footer-bottom-item');
 
 
 
 
 
 window.addEventListener('scroll', function() {
     var imageHeader = document.querySelector('.image-header');
     var headerOffset = imageHeader.offsetTop;
     var windowHeight = window.innerHeight;
     var headerHeight = imageHeader.offsetHeight;
     var headerTopPosition = headerOffset - (windowHeight * 0);
 
     if (window.pageYOffset >= headerTopPosition) {
         imageHeader.classList.add('sticky');
     } else {
         imageHeader.classList.remove('sticky');
     }
 });
 
 
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
 
 
 
 for (let i = 0; i < icons.length; i++) {
     ScrollReveal().reveal(icons[i], {
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