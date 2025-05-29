// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get(name));
    return urlParams.get(name);
}

// Function to get room type name
function getRoomTypeName(roomTypeValue) {
    const roomTypes = {
        '1': 'Standard ',
        '2': 'Deluxe ',
        '3': 'Suite',
        '4': 'Presidential Suite'
    };
    return roomTypes[roomTypeValue] || '-';
}

// Function to display URL data in spans
function displayUrlDataInSpans() {
    // Get URL parameters
    const checkIn = getUrlParameter('checkIn');
    const checkOut = getUrlParameter('checkOut');
    const roomType = getUrlParameter('roomType');
    const adults = getUrlParameter('adults');
    const children = getUrlParameter('children');

    // Display values in spans
    document.getElementById('checkIn').textContent = checkIn || '-';
    document.getElementById('checkOut').textContent = checkOut || '-';
    document.getElementById('roomType').textContent = getRoomTypeName(roomType);
    document.getElementById('adults').textContent = adults || '-';
    document.getElementById('children').textContent = children || '-';
}

// Function to get current URL parameters as an object
function getCurrentUrlData() {
    return {
        checkIn: getUrlParameter('checkIn'),
        checkOut: getUrlParameter('checkOut'),
        roomType: getUrlParameter('roomType'),
        adults: getUrlParameter('adults'),
        children: getUrlParameter('children')
    };
}

// Function to send data to backend
async function sendData() {
    try {
        const urlData = getCurrentUrlData();

        const response = await fetch('/your-backend-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(urlData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Backend response:', result);

        // Handle the response data here
        handleBackendResponse(result);

    } catch (error) {
        console.error('Error sending data to backend:', error);
    }
}

// Initialize the display when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Display URL data in spans
    displayUrlDataInSpans();
    sendData();

    console.log('Booking details displayed from URL parameters');
});

