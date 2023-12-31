



const writeData = document.querySelector(".data-container");
    const generateDummyData = () => {
        const dummyData = [
            {
                name: "Max Van Moorsel",
                title: "IoT Engineer",
                age: 19,
                imgURL: "/images/company/thom2.jpg",
                email: "Maxvanmoorsel2@gmail.com",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            },
            {
                name: "Richard Vullings",
                title: "Backend Developer",
                age: 18,
                imgURL: "/images/company/richard.png",
                email: "rvullings8@gmail.com",
                description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                class: "richardIMG"
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
                name: "Thom van der Vorst",
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
                        <img class="${data.class}" src="${data.imgURL}" alt="">
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
        writeData.innerHTML += template;
    });


