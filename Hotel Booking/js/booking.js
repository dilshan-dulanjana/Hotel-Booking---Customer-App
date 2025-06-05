// Function to parse URL parameters
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        checkIn: urlParams.get('checkIn'),
        checkOut: urlParams.get('checkOut'),
        adults: parseInt(urlParams.get('adults')) || 0,
        children: parseInt(urlParams.get('children')) || 0,
        roomIds: urlParams.get('roomIds')?.split(',') || [],
        roomQuantities: urlParams.get('roomQuantities') ? JSON.parse(urlParams.get('roomQuantities')) : {},
        totalAmount: parseFloat(urlParams.get('totalAmount')) || 0
    };
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return {
        day: day,
        monthYear: `${month}, ${year}`,
        weekday: weekday
    };
}

// Function to calculate nights between dates
function calculateNights(checkIn, checkOut) {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// Function to update reservation display
function updateReservation() {
    const params = getUrlParams();
    if (params.checkIn && params.checkOut) {
        // Update check-in date
        const checkInFormatted = formatDate(params.checkIn);
        document.getElementById('checkin-day').textContent = checkInFormatted.day;
        document.getElementById('checkin-date').innerHTML = `${checkInFormatted.monthYear}<br>${checkInFormatted.weekday}`;

        // Update check-out date
        const checkOutFormatted = formatDate(params.checkOut);
        document.getElementById('checkout-day').textContent = checkOutFormatted.day;
        document.getElementById('checkout-date').innerHTML = `${checkOutFormatted.monthYear}<br>${checkOutFormatted.weekday}`;

        // Calculate and update nights
        const nights = calculateNights(params.checkIn, params.checkOut);
        document.getElementById('total-nights').textContent = nights;

        // Update total guests
        const totalGuests = params.adults + params.children;
        document.getElementById('total-guests').textContent = totalGuests;

        // Update reservation table
        const tbody = document.getElementById('reservation-details');
        tbody.innerHTML = '';

        // Calculate total rooms
        const totalRooms = Object.values(params.roomQuantities).reduce((sum, qty) => sum + qty, 0) || params.roomIds.length;

        // Add room details
        if (totalRooms > 0 && params.totalAmount > 0) {
            tbody.innerHTML = `
                <tr>
                    <td>${totalRooms} Room${totalRooms > 1 ? 's' : ''} x ${nights} Night${nights > 1 ? 's' : ''}</td>
                    <td>$${params.totalAmount.toFixed(2)}</td>
                </tr>
            `;
        }

        // Update total amount
        if (params.totalAmount > 0) {
            document.getElementById('total-amount').textContent = `$${params.totalAmount.toFixed(2)}`;
        }
    }
}

// Function to collect personal information
function getPersonalInfo() {
    const form = document.querySelector('.personal-info form');
    const inputs = form.querySelectorAll('input, textarea');
    const personalInfo = {};

    inputs.forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder && input.value.trim()) {
            const fieldName = placeholder.toLowerCase().replace(/\s+/g, '_');
            personalInfo[fieldName] = input.value.trim();
        }
    });

    return personalInfo;
}

// Function to collect payment information
function getPaymentInfo() {
    const form = document.querySelector('.card-info form');
    const inputs = form.querySelectorAll('input[type="text"]');
    const radios = form.querySelectorAll('input[type="radio"]:checked');
    const paymentInfo = {};

    inputs.forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder && input.value.trim()) {
            const fieldName = placeholder.toLowerCase().replace(/\s+/g, '_');
            paymentInfo[fieldName] = input.value.trim();
        }
    });

    // Get selected payment method
    if (radios.length > 0) {
        paymentInfo.payment_method = radios[0].parentElement.textContent.trim();
    }

    return paymentInfo;
}

// Function to validate user details (personal information)
function validateUserDetails(personalInfo) {
    const errors = [];

    if (!personalInfo.first_name) {
        errors.push('First name is required');
    }
    if (!personalInfo.last_name) {
        errors.push('Last name is required');
    }
    if (!personalInfo.email) {
        errors.push('Email is required');
    }
    if (!personalInfo.phone) {
        errors.push('Phone number is required');
    }

    // Validate terms and conditions
    const termsCheckbox = document.querySelector('.card-info input[type="checkbox"]');
    if (!termsCheckbox.checked) {
        errors.push('You must agree to the terms and conditions');
    }

    return errors;
}

// Function to check if payment details are provided
function hasPaymentDetails(paymentInfo) {
    return !!(paymentInfo.card_number &&
        paymentInfo.card_holder_name &&
        paymentInfo.cvc);
}

// Function to validate payment details
function validatePaymentDetails(paymentInfo) {
    const errors = [];

    if (!paymentInfo.card_number) {
        errors.push('Card number is required');
    }
    if (!paymentInfo.card_holder_name) {
        errors.push('Card holder name is required');
    }
    if (!paymentInfo.cvc) {
        errors.push('CVC is required');
    }

    return errors;
}

// Function to show loading state
function showLoading(show = true) {
    const button = document.querySelector('.card-btn .btn');
    if (show) {
        button.textContent = 'PROCESSING...';
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.7';
    } else {
        button.textContent = 'CONFIRM BOOKING';
        button.style.pointerEvents = 'auto';
        button.style.opacity = '1';
    }
}

// Function to show error messages
function showErrors(errors) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.booking-error, .booking-message');
    existingMessages.forEach(message => message.remove());

    if (errors.length > 0) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'booking-error';
        errorDiv.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            margin-bottom: 20px;
        `;

        const errorList = document.createElement('ul');
        errorList.style.margin = '0';
        errorList.style.paddingLeft = '20px';

        errors.forEach(error => {
            const errorItem = document.createElement('li');
            errorItem.textContent = error;
            errorList.appendChild(errorItem);
        });

        errorDiv.appendChild(errorList);

        // Insert before the confirm button
        const cardBtn = document.querySelector('.card-btn');
        cardBtn.parentNode.insertBefore(errorDiv, cardBtn);

        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Function to show payment warning message
function showPaymentWarningMessage() {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.booking-message, .booking-error');
    existingMessages.forEach(message => message.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = 'booking-message';
    messageDiv.style.cssText = `
        background-color: #fff3cd;
        color: #856404;
        padding: 20px;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    messageDiv.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #856404; font-size: 18px;">
            Booking Pending Payment
        </h3>
        <p style="margin: 0; font-size: 16px; color: #d63384; font-weight: 500;">
            Your booking will be cancelled after today 7 PM if payment is not completed.
        </p>
    `;

    // Insert before the confirm button
    const cardBtn = document.querySelector('.card-btn');
    cardBtn.parentNode.insertBefore(messageDiv, cardBtn);

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Function to show success message
function showSuccess() {
    alert('Booking confirmed successfully! Redirecting to confirmation page...');
}

// Function to send booking data without payment (for reservation hold)
async function sendBookingWithoutPayment(bookingData) {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Sending booking without payment (attempt ${attempt}/${maxRetries}):`, bookingData);

            const response = await fetch('/api/bookings/hold', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...bookingData,
                    status: 'pending_payment',
                    cancellation_time: new Date(new Date().setHours(19, 0, 0, 0)).toISOString()
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage;

                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || `Server error: ${response.status}`;
                } catch {
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }

                throw new Error(errorMessage);
            }

            const result = await response.json();

            console.log('Booking hold successful:', result);
            return {
                success: true,
                booking_id: result.booking_id || result.bookingId || result.id,
                message: result.message || 'Booking held successfully',
                data: result
            };

        } catch (error) {
            console.error(`Booking hold attempt ${attempt} failed:`, error);
            lastError = error;

            if (attempt === maxRetries) {
                break;
            }

            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error(`Failed to hold booking after ${maxRetries} attempts: ${lastError.message}`);
}

// Function to send complete booking data with payment
async function sendCompleteBooking(bookingData) {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Sending complete booking (attempt ${attempt}/${maxRetries}):`, bookingData);

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...bookingData,
                    status: 'confirmed'
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage;

                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || `Server error: ${response.status}`;
                } catch {
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }

                throw new Error(errorMessage);
            }

            const result = await response.json();

            if (!result.booking_id && !result.bookingId && !result.id) {
                console.warn('Warning: Backend response missing booking ID:', result);
                result.booking_id = result.booking_id || result.bookingId || result.id || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }

            console.log('Complete booking successful:', result);
            return {
                success: true,
                booking_id: result.booking_id || result.bookingId || result.id,
                message: result.message || 'Booking confirmed successfully',
                data: result
            };

        } catch (error) {
            console.error(`Complete booking attempt ${attempt} failed:`, error);
            lastError = error;

            if (attempt === maxRetries) {
                break;
            }

            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error(`Failed to complete booking after ${maxRetries} attempts: ${lastError.message}`);
}

// Main function to handle booking confirmation
async function confirmBooking() {
    try {
        // Collect all booking data
        const urlParams = getUrlParams();
        const personalInfo = getPersonalInfo();
        const paymentInfo = getPaymentInfo();

        const bookingData = {
            reservation_details: {
                check_in: urlParams.checkIn,
                check_out: urlParams.checkOut,
                adults: urlParams.adults,
                children: urlParams.children,
                room_ids: urlParams.roomIds,
                room_quantities: urlParams.roomQuantities,
                total_amount: urlParams.totalAmount,
                nights: calculateNights(urlParams.checkIn, urlParams.checkOut)
            },
            personal_info: personalInfo,
            payment_info: paymentInfo,
            booking_date: new Date().toISOString()
        };

        // Step 1: Validate user details first
        const userErrors = validateUserDetails(personalInfo);
        if (userErrors.length > 0) {
            showErrors(userErrors);
            return;
        }

        // Step 2: Check if payment details are provided
        const hasPayment = hasPaymentDetails(paymentInfo);

        if (!hasPayment) {
            // Payment details not provided - send booking without payment
            console.log('Payment details not provided, creating booking hold...');

            showLoading(true);

            try {
                showPaymentWarningMessage();
                const result = await sendBookingWithoutPayment(bookingData);
                showLoading(false);
                // showPaymentWarningMessage();
                console.log('Booking hold created:', result.booking_id);
            } catch (error) {
                showLoading(false);
                showErrors(['Failed to create booking hold. Please try again.']);
                console.error('Booking hold error:', error);
            }

            return;
        }

        // Step 3: Validate payment details if provided
        const paymentErrors = validatePaymentDetails(paymentInfo);
        if (paymentErrors.length > 0) {
            showErrors(paymentErrors);
            return;
        }

        // Step 4: Send complete booking with payment
        console.log('Processing complete booking with payment...');

        showLoading(true);

        const result = await sendCompleteBooking(bookingData);

        // Handle success
        showSuccess();

        // Create URL parameters for confirmation page
        const confirmationParams = new URLSearchParams({
            bookingId: result.booking_id,
            checkIn: urlParams.checkIn,
            checkOut: urlParams.checkOut,
            totalAmount: urlParams.totalAmount,
            guests: urlParams.adults + urlParams.children
        });

        // Redirect to confirmation page with booking ID
        const confirmationUrl = `confirmation.html?${confirmationParams.toString()}`;
        console.log('Redirecting to:', confirmationUrl);

        setTimeout(() => {
            window.location.href = confirmationUrl;
        }, 1500);

    } catch (error) {
        showLoading(false);

        let errorMessage = 'An error occurred while processing your booking. Please try again.';

        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (error.message.includes('401')) {
            errorMessage = 'Authentication failed. Please refresh the page and try again.';
        } else if (error.message.includes('400')) {
            errorMessage = 'Invalid booking data. Please check your information and try again.';
        } else if (error.message.includes('500')) {
            errorMessage = 'Server error. Please try again in a few minutes or contact support.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        showErrors([errorMessage]);
        console.error('Booking error:', error);
    }
}

// Function to setup form event listeners
function setupEventListeners() {
    // Handle confirm booking button click
    const confirmButton = document.querySelector('.card-btn .btn');
    if (confirmButton) {
        confirmButton.addEventListener('click', function(e) {
            e.preventDefault();
            confirmBooking();
        });
    }

    // Handle form submission
    const cardForm = document.querySelector('.card-info form');
    if (cardForm) {
        cardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmBooking();
        });
    }

    // Clear messages when user starts typing in any field
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const messages = document.querySelectorAll('.booking-message, .booking-error');
            messages.forEach(message => message.remove());
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateReservation();
    setupEventListeners();
});