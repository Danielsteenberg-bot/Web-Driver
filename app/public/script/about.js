
const writeData = document.querySelector(".data-container");
    const generateDummyData = () => {
        const dummyData = [
            {
                name: "Max Doe",
                title: "IoT Engineer",
                age: 30,
                imgURL: "/images/company/max.png",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            },
            {
                name: "Richard Smith",
                title: "Backend Developer",
                age: 25,
                imgURL: "/images/company/gutterne1.png",
                description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
                name: "Kasper Johnson",
                title: "Backend Developer",
                age: 35,
                imgURL: "/images/company/gutterne2.png",
                description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                name: "Thom Williams",
                title: "Captain",
                age: 28,
                imgURL: "/images/company/thom.png",
                description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            },
            {
                name: "Daniel Brown",
                title: "Frontend",
                age: 32,
                imgURL: "/images/company/guys1.jpeg",
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
                        <div class="info-description-container">
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
