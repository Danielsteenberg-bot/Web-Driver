document.addEventListener("DOMContentLoaded", function () {
    // Get references to the burger menu and navbar
    const burgerMenu = document.getElementById("burger-menu");
    const navbar = document.getElementById("navbar");
  
    // Set initial state
    let isOpen;
    // Add click event listener to the burger menu
    burgerMenu.addEventListener("click", function () {
      // Toggle the isOpen state
      isOpen = !isOpen;
  
      if (isOpen) {
        gsap.to(navbar, { 
          x: 0, duration: 0.1, 
          ease: "power4" 
      });
        console.log("open");
      } else {
        gsap.to(navbar, {
          x: -navbar.clientWidth,
          duration: 0.1,
          ease: "power4",
        });
        console.log("closed");
      }
    });
  });
  