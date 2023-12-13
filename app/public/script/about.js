



const writeData = document.querySelector(".data-container");
    const generateDummyData = () => {
        const dummyData = [
            {
                name: "Max Doe",
                title: "IoT Engineer",
                age: 19,
                imgURL: "/images/company/thom2.jpg",
                email: "Maxvanmoorsel2@gmail.com",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            },
            {
                name: "Richard Smith",
                title: "Backend Developer",
                age: 18,
                imgURL: "/images/company/thom.jpg",
                email: "rvullings8@gmail.com",
                description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
                name: "Kasper Korthesen",
                title: "Backend Developer",
                age: 26,
                imgURL: "/images/company/kasper.jpg",
                email: "Kalletheman@live.dk ",
                description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                name: "Thom Williams",
                title: "Captain",
                age: 18,
                imgURL: "/images/company/thom.jpg",
                email: "thomvandervorst@gmail.com",
                description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            },
            {
                name: "Daniel Steenberg",
                title: "Frontend",
                age: 26,
                imgURL: "/images/company/daniel.jpeg",
                description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            }
        ];

        return dummyData;
    };

    const dummyData = generateDummyData();


    dummyData.forEach(data => {
        const template = `
            <div class="about-box-container">
                <div class="about-box-wrapper">
                    <div class="about-box-image">
                        <img src="${data.imgURL}" alt="">
                    </div>
                    <div class="about-box-text">
                        <div class="name-container box-info">
                            <h6>Name: ${data.name}</h6>
                        </div>
                        <div class="title-container box-info">
                            <h6>Title: ${data.title}</h6>
                        </div>
                        <div class="age-container box-info">
                            <h6>Age: ${data.age}</h6>
                        </div>
                        <div class="info-description-container box-desc">
                            <h6>${data.description}</h6>
                        </div>
                        <div class="about-btn-container">
                            <button class="about-btn">
                                Contact
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="between-lines">

        `
        console.log(data.imgURL);

        writeData.innerHTML += template;
    });

    const box = document.querySelectorAll(".about-box-container");
    const boxInfo = document.querySelectorAll(".box-info");
    const boxDesc = document.querySelectorAll(".box-desc");
    const aboutBTN = document.querySelectorAll(".about-btn-container");
    const landWords = document.querySelectorAll(".reveal-word");


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
