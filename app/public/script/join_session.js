document.addEventListener('DOMContentLoaded', () => {
    const connects = document.querySelectorAll('.connectBTN')

    connects.forEach(btn => {
        btn.onclick = async () => {
            const deviceId = btn.getAttribute('data-device-id')
            setDevice(deviceId)
        }
    });
})

const setDevice = async (id) => {
    const requestData = {
        deviceId: id
    };

    try {
        const response = await fetch('/requests/connectDevice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Succes:', data);
            window.location.href = data.link;
        } else {
            console.error(response.statusText);
        }

    } catch (error) {
        console.error(error);
    }
};

