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

// Function to update booking (you can customize this)
function updateBooking() {
    const values = getCurrentUrlData();

    // You can process the booking update here
    console.log('Current Booking Details:', values);
    alert('Redirecting to modify booking details...');

    // Redirect back to booking form or another page
    // const params = new URLSearchParams(values);
    // window.location.href = `booking-form.html?${params.toString()}`;
}

// Initialize the display when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Display URL data in spans
    displayUrlDataInSpans();

    console.log('Booking details displayed from URL parameters');
});

