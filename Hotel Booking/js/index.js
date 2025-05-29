// booking-form.js

function checkAvailability() {
    // Get form values
    const checkIn = document.getElementById('date-range2').value;
    const checkOut = document.getElementById('date-range3').value;
    const roomType = document.getElementById('room-type').value;
    const adults = document.getElementById('adults').value;
    const children = document.getElementById('children').value;

    // Validate each field and show specific messages
    const validationResult = validateForm(checkIn, checkOut, roomType, adults, children);

    if (!validationResult.isValid) {
        alert(validationResult.message);
        return;
    }
    // Create URL parameters
    const params = new URLSearchParams({
        checkIn: checkIn,
        checkOut: checkOut,
        roomType: roomType,
        adults: adults,
        children: children
    });

    // Navigate to room select page with parameters
    window.location.href = `room-select.html?${params.toString()}`;
}



// Enhanced validation function
function validateForm(checkIn, checkOut, roomType, adults, children) {
    const missingFields = [];

    // Check each required field
    if (!checkIn || checkIn.trim() === '') {
        missingFields.push('Check-in date');
    }

    if (!checkOut || checkOut.trim() === '') {
        missingFields.push('Check-out date');
    }

    if (!roomType || roomType === '' || roomType === 'select') {
        missingFields.push('Room type');
    }

    if (!adults || adults === '' || adults === 'select') {
        missingFields.push('Number of adults');
    }

    if (!children || children === '' || children === 'select') {
        missingFields.push('Number of children');
    }

    // If any fields are missing, return error
    if (missingFields.length > 0) {
        let message = 'Please fill in the following required field';
        message += missingFields.length > 1 ? 's:\n' : ':\n';
        message += '• ' + missingFields.join('\n• ');

        return {
            isValid: false,
            message: message
        };
    }

    // Validate dates if both are provided
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if check-in date is not in the past
        if (checkInDate < today) {
            return {
                isValid: false,
                message: 'Check-in date cannot be in the past. Please select today or a future date.'
            };
        }

        // Check if check-out is after check-in
        if (checkOutDate <= checkInDate) {
            return {
                isValid: false,
                message: 'Check-out date must be at least one day after the check-in date.'
            };
        }

        // Check if the stay is not too long (optional - you can adjust or remove this)
        const daysDifference = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        if (daysDifference > 30) {
            return {
                isValid: false,
                message: 'Maximum stay duration is 30 days. Please select a shorter period.'
            };
        }
    }

    return {
        isValid: true,
        message: 'All fields are valid'
    };
}