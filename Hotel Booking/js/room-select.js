//
// // Enhanced Hotel Room Booking System with Room Capacity Logic
//
// // Global variables
// let allRooms = [];
// let selectedRooms = {}; // {roomId: quantity}
// const MAX_OCCUPANCY_PER_ROOM = 4; // Maximum adults + children per room
//
// // Get URL parameters
// function getUrlParameter(name) {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(name);
// }
//
// // Get room type name from number
// function getRoomTypeName(roomTypeValue) {
//     const roomTypes = {
//         '1': 'Standard Room',
//         '2': 'Deluxe Room',
//         '3': 'Beach view rooms',
//         '4': 'Family Room'
//     };
//     return roomTypes[roomTypeValue] || '';
// }
//
// // Display booking details from URL
// function displayBookingDetails() {
//     document.getElementById('checkIn').textContent = getUrlParameter('checkIn') || '-';
//     document.getElementById('checkOut').textContent = getUrlParameter('checkOut') || '-';
//     document.getElementById('roomType').textContent = getRoomTypeName(getUrlParameter('roomType'));
//     document.getElementById('promocode').textContent = getUrlParameter('promocode') || '-';
//     document.getElementById('adults').textContent = getUrlParameter('adults') || '-';
//     document.getElementById('children').textContent = getUrlParameter('children') || '-';
// }
//
// // Get guest numbers
// function getGuestNumbers() {
//     const adults = parseInt(getUrlParameter('adults')) || 0;
//     const children = parseInt(getUrlParameter('children')) || 0;
//     return { adults, children, total: adults + children };
// }
//
// // Calculate minimum rooms required
// function calculateMinimumRoomsRequired() {
//     const guests = getGuestNumbers();
//     return Math.ceil(guests.total / MAX_OCCUPANCY_PER_ROOM);
// }
//
// // Fetch rooms from backend
// async function fetchRooms() {
//     try {
//         showLoading();
//
//         const bookingData = {
//             checkIn: getUrlParameter('checkIn'),
//             checkOut: getUrlParameter('checkOut'),
//             adults: getUrlParameter('adults'),
//             children: getUrlParameter('children'),
//             roomType: getUrlParameter('roomType'),
//             promocode: getUrlParameter('promocode')
//         };
//
//         const response = await fetch('/api/rooms/search', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(bookingData)
//         });
//
//         const data = await response.json();
//         allRooms = data.rooms || [];
//
//         hideLoading();
//         displayRooms();
//
//     } catch (error) {
//         console.error('Error fetching rooms:', error);
//         hideLoading();
//         loadSampleData(); // For testing
//     }
// }
//
// // Show loading message
// function showLoading() {
//     document.getElementById('hotel-container').innerHTML = `
//         <div style="text-align: center; padding: 50px;">
//             <div style="border: 3px solid #f3f3f3; border-top: 3px solid #ff6b35; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
//             <h3>Searching Available Rooms...</h3>
//             <p>Please wait while we find the best options for you.</p>
//         </div>
//         <style>
//             @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//             }
//         </style>
//     `;
// }
//
// // Hide loading
// function hideLoading() {
//     // Loading will be replaced by room display
// }
//
// // Sort rooms: selected type first, then others
// function sortRooms() {
//     const selectedType = getRoomTypeName(getUrlParameter('roomType'));
//
//     const selectedTypeRooms = allRooms.filter(room => room.roomType === selectedType);
//     const otherRooms = allRooms.filter(room => room.roomType !== selectedType);
//
//     // Sort by price
//     selectedTypeRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
//     otherRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
//
//     return { selectedTypeRooms, otherRooms };
// }
//
// // Display all rooms with capacity requirements
// function displayRooms() {
//     const container = document.getElementById('hotel-container');
//     const { selectedTypeRooms, otherRooms } = sortRooms();
//     const guests = getGuestNumbers();
//     const minRoomsRequired = calculateMinimumRoomsRequired();
//
//     if (selectedTypeRooms.length === 0 && otherRooms.length === 0) {
//         container.innerHTML = `
//             <div style="text-align: center; padding: 40px; border: 2px dashed #ccc; border-radius: 10px; background: #f9f9f9;">
//                 <h3 style="color: #666;">No Available Rooms</h3>
//                 <p>Sorry, no rooms are available for your selected dates.</p>
//             </div>
//         `;
//         return;
//     }
//
//     container.innerHTML = '';
//
//     // Show capacity requirements info
//     const requirementDiv = document.createElement('div');
//     requirementDiv.innerHTML = `
//         <div style="background: #e8f4f8; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
//             <h4 style="margin: 0 0 10px 0; color: #0c5460;">Booking Requirements:</h4>
//             <p style="margin: 5px 0; color: #0c5460;">
//                 <strong>Total Guests:</strong> ${guests.adults} Adults + ${guests.children} Children = ${guests.total} Guests
//             </p>
//             <p style="margin: 5px 0; color: #0c5460;">
//                 <strong>Minimum Rooms Required:</strong> ${minRoomsRequired} room(s) (Max 4 guests per room)
//             </p>
//             <p style="margin: 5px 0; color: #d63384; font-weight: bold;">
//                 Please select at least ${minRoomsRequired} room(s) to accommodate all guests.
//             </p>
//         </div>
//     `;
//     container.appendChild(requirementDiv);
//
//     // Show selected room type section
//     if (selectedTypeRooms.length > 0) {
//         const selectedType = getRoomTypeName(getUrlParameter('roomType'));
//         const header = document.createElement('div');
//         header.innerHTML = `
//             <h3 style="color: #ff6b35; margin: 20px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #ff6b35;">
//                 <i class="fa fa-star" style="margin-right: 8px;"></i>Your Selected Room Type: ${selectedType}
//             </h3>
//         `;
//         container.appendChild(header);
//
//         selectedTypeRooms.forEach(room => {
//             container.appendChild(createRoomCard(room, true));
//         });
//     }
//
//     // Show other rooms section
//     if (otherRooms.length > 0) {
//         const header = document.createElement('div');
//         header.innerHTML = `
//             <h3 style="color: #666; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
//                 <i class="fa fa-bed" style="margin-right: 8px;"></i>Other Available Rooms
//             </h3>
//         `;
//         container.appendChild(header);
//
//         otherRooms.forEach(room => {
//             container.appendChild(createRoomCard(room, false));
//         });
//     }
//
//     // Show booking summary section
//     const summaryDiv = document.createElement('div');
//     summaryDiv.id = 'booking-summary-section';
//     summaryDiv.style.cssText = 'margin-top: 40px; padding: 20px 0;';
//     container.appendChild(summaryDiv);
//
//     updateBookingSummary();
// }
//
// // Create room card HTML
// function createRoomCard(room, isSelected) {
//     const quantity = selectedRooms[room.roomId] || 0;
//     const totalPrice = room.pricePerNight * quantity;
//
//     const card = document.createElement('div');
//     card.className = 'room-card';
//     card.style.cssText = `
//         border: 2px solid ${isSelected ? '#ff6b35' : '#ddd'};
//         margin: 15px 0;
//         padding: 20px;
//         border-radius: 10px;
//         background: ${isSelected ? '#fff8f5' : '#fff'};
//         box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//         transition: all 0.3s ease;
//     `;
//
//     card.innerHTML = `
//         <div class="room-content" style="display: flex; gap: 20px; align-items: center;">
//             <div class="room-image" style="flex: 0 0 180px;">
//                 <img src="${room.imageUrl || 'images/room-default.jpg'}"
//                      alt="${room.roomType}"
//                      style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;">
//                 ${isSelected ? '<div style="background: #ff6b35; color: white; padding: 4px 8px; border-radius: 12px; display: inline-block; margin-top: 8px; font-size: 11px; font-weight: bold;">YOUR CHOICE</div>' : ''}
//             </div>
//
//             <div class="room-details" style="flex: 1;">
//                 <h4 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">${room.roomType}</h4>
//                 <div style="color: #666; margin: 4px 0; font-size: 14px;">
//                     <i class="fa fa-tag" style="margin-right: 5px;"></i>Room ID: ${room.roomId}
//                 </div>
//                 <div style="color: #666; margin: 4px 0; font-size: 14px;">
//                     <i class="fa fa-users" style="margin-right: 5px;"></i>Capacity: Up to 4 guests per room
//                 </div>
//                 <div style="color: #ff6b35; font-size: 20px; font-weight: bold; margin: 10px 0;">
//                     $${room.pricePerNight} <span style="font-size: 14px; color: #666; font-weight: normal;">/ night</span>
//                 </div>
//             </div>
//
//             <div class="room-selection" style="flex: 0 0 200px; text-align: center;">
//                 <div style="margin-bottom: 10px;">
//                     <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">Select Rooms:</label>
//                     <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
//                         <button onclick="changeQuantity('${room.roomId}', -1)"
//                                 style="width: 40px; height: 40px; border: 2px solid #ff6b35; background: white; color: #ff6b35; cursor: pointer; border-radius: 6px; font-size: 18px; font-weight: bold;">
//                             −
//                         </button>
//                         <span id="qty-${room.roomId}" style="min-width: 30px; text-align: center; font-weight: bold; font-size: 18px;">
//                             ${quantity}
//                         </span>
//                         <button onclick="changeQuantity('${room.roomId}', 1)"
//                                 style="width: 40px; height: 40px; border: 2px solid #ff6b35; background: #ff6b35; color: white; cursor: pointer; border-radius: 6px; font-size: 18px; font-weight: bold;">
//                             +
//                         </button>
//                     </div>
//                 </div>
//                 <div id="price-${room.roomId}" style="color: #ff6b35; font-weight: bold; min-height: 20px;">
//                     ${quantity > 0 ? `Total: $${totalPrice}` : ''}
//                 </div>
//             </div>
//         </div>
//     `;
//
//     return card;
// }
//
// // Change room quantity
// function changeQuantity(roomId, change) {
//     const currentQty = selectedRooms[roomId] || 0;
//     const newQty = Math.max(0, currentQty + change);
//
//     if (newQty === 0) {
//         delete selectedRooms[roomId];
//     } else {
//         selectedRooms[roomId] = newQty;
//     }
//
//     // Update display
//     document.getElementById(`qty-${roomId}`).textContent = newQty;
//
//     // Update price display
//     const room = allRooms.find(r => r.roomId === roomId);
//     const priceElement = document.getElementById(`price-${roomId}`);
//
//     if (newQty > 0) {
//         const totalPrice = room.pricePerNight * newQty;
//         priceElement.textContent = `Total: $${totalPrice}`;
//         priceElement.style.color = '#ff6b35';
//     } else {
//         priceElement.textContent = '';
//     }
//
//     updateBookingSummary();
// }
//
// // Update booking summary
// function updateBookingSummary() {
//     const totalRooms = Object.values(selectedRooms).reduce((sum, qty) => sum + qty, 0);
//     const totalPrice = Object.entries(selectedRooms).reduce((total, [roomId, qty]) => {
//         const room = allRooms.find(r => r.roomId === roomId);
//         return total + (room ? room.pricePerNight * qty : 0);
//     }, 0);
//
//     const minRoomsRequired = calculateMinimumRoomsRequired();
//     const guests = getGuestNumbers();
//     const isValidSelection = totalRooms >= minRoomsRequired;
//
//     const summaryContainer = document.getElementById('booking-summary-section');
//
//     if (totalRooms > 0) {
//         summaryContainer.innerHTML = `
//             <div style="background: ${isValidSelection ? '#d4edda' : '#f8d7da'}; border: 2px solid ${isValidSelection ? '#c3e6cb' : '#f5c6cb'}; padding: 20px; border-radius: 10px; margin: 20px 0;">
//                 <h4 style="margin: 0 0 15px 0; color: ${isValidSelection ? '#155724' : '#721c24'};">
//                     <i class="fa fa-calculator" style="margin-right: 8px;"></i>Booking Summary
//                 </h4>
//
//                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
//                     <div>
//                         <p style="margin: 5px 0; color: #333;"><strong>Selected Rooms:</strong> ${totalRooms}</p>
//                         <p style="margin: 5px 0; color: #333;"><strong>Total Guests:</strong> ${guests.total} (${guests.adults} Adults, ${guests.children} Children)</p>
//                         <p style="margin: 5px 0; color: #333;"><strong>Required Minimum:</strong> ${minRoomsRequired} room(s)</p>
//                     </div>
//                     <div>
//                         <p style="margin: 5px 0; color: #333;"><strong>Check-in:</strong> ${getUrlParameter('checkIn')}</p>
//                         <p style="margin: 5px 0; color: #333;"><strong>Check-out:</strong> ${getUrlParameter('checkOut')}</p>
//                         <p style="margin: 5px 0; font-size: 18px; color: #ff6b35;"><strong>Total Amount: $${totalPrice}</strong></p>
//                     </div>
//                 </div>
//
//                 ${!isValidSelection ?
//             `<div style="background: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0;">
//                         <p style="margin: 0; color: #721c24; font-weight: bold;">
//                             ⚠️ You need to select at least ${minRoomsRequired} room(s) to accommodate ${guests.total} guests.
//                         </p>
//                     </div>` : ''
//         }
//
//                 <div style="text-align: center; margin-top: 20px;">
//                     <button onclick="proceedToBooking()"
//                             ${!isValidSelection ? 'disabled' : ''}
//                             style="background: ${isValidSelection ? '#ff6b35' : '#ccc'};
//                                    color: white;
//                                    border: none;
//                                    padding: 15px 40px;
//                                    border-radius: 8px;
//                                    cursor: ${isValidSelection ? 'pointer' : 'not-allowed'};
//                                    font-size: 18px;
//                                    font-weight: bold;
//                                    transition: all 0.3s ease;">
//                         ${isValidSelection ? 'BOOK NOW' : 'SELECT MORE ROOMS'}
//                     </button>
//                 </div>
//             </div>
//         `;
//     } else {
//         summaryContainer.innerHTML = `
//             <div style="background: #f8f9fa; border: 2px dashed #dee2e6; padding: 20px; border-radius: 10px; text-align: center;">
//                 <h4 style="color: #6c757d; margin: 0;">No Rooms Selected</h4>
//                 <p style="color: #6c757d; margin: 10px 0 0 0;">Please select rooms to see booking summary</p>
//             </div>
//         `;
//     }
// }
//
// // Proceed to booking
// function proceedToBooking() {
//     const totalRooms = Object.values(selectedRooms).reduce((sum, qty) => sum + qty, 0);
//     const minRoomsRequired = calculateMinimumRoomsRequired();
//
//     if (totalRooms < minRoomsRequired) {
//         alert(`Please select at least ${minRoomsRequired} room(s) to accommodate all guests.`);
//         return;
//     }
//
//     if (Object.keys(selectedRooms).length === 0) {
//         alert('Please select at least one room');
//         return;
//     }
//
//     const totalPrice = Object.entries(selectedRooms).reduce((total, [roomId, qty]) => {
//         const room = allRooms.find(r => r.roomId === roomId);
//         return total + (room ? room.pricePerNight * qty : 0);
//     }, 0);
//
//     // Create room IDs array for URL
//     const roomIds = Object.keys(selectedRooms);
//
//     // Create URL parameters
//     const params = new URLSearchParams();
//     params.append('checkIn', getUrlParameter('checkIn'));
//     params.append('checkOut', getUrlParameter('checkOut'));
//     params.append('adults', getUrlParameter('adults'));
//     params.append('children', getUrlParameter('children'));
//     params.append('promocode', getUrlParameter('promocode') || '');
//     params.append('roomIds', roomIds.join(','));
//     params.append('roomQuantities', JSON.stringify(selectedRooms));
//     params.append('totalAmount', totalPrice);
//
//     console.log('Booking Data:', {
//         checkIn: getUrlParameter('checkIn'),
//         checkOut: getUrlParameter('checkOut'),
//         adults: getUrlParameter('adults'),
//         children: getUrlParameter('children'),
//         selectedRooms: selectedRooms,
//         totalAmount: totalPrice,
//         roomIds: roomIds
//     });
//
//     // Navigate to booking page
//     window.location.href = `booking.html?${params.toString()}`;
// }
//
// // Sample data for testing
// function loadSampleData() {
//     allRooms = [
//         {
//             roomId: "R001",
//             roomType: "Standard Room",
//             pricePerNight: 100,
//             imageUrl: "images/room1.jpg"
//         },
//         {
//             roomId: "R002",
//             roomType: "Deluxe Room",
//             pricePerNight: 150,
//             imageUrl: "images/room2.jpg"
//         },
//         {
//             roomId: "R003",
//             roomType: "Family Room",
//             pricePerNight: 200,
//             imageUrl: "images/room3.jpg"
//         },
//         {
//             roomId: "R004",
//             roomType: "Beach view rooms",
//             pricePerNight: 180,
//             imageUrl: "images/room4.jpg"
//         },
//         {
//             roomId: "R005",
//             roomType: "Standard Room",
//             pricePerNight: 120,
//             imageUrl: "images/room5.jpg"
//         }
//     ];
//
//     displayRooms();
// }
//
// // Initialize when page loads
// document.addEventListener('DOMContentLoaded', function() {
//     displayBookingDetails();
//     fetchRooms();
//     console.log('Enhanced hotel booking system initialized');
// });



// Enhanced Hotel Room Booking System with Room Capacity Logic

// Global variables
let allRooms = [];
let selectedRooms = {}; // {roomId: quantity}
const MAX_OCCUPANCY_PER_ROOM = 4; // Maximum adults + children per room

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get room type name from number
function getRoomTypeName(roomTypeValue) {
    const roomTypes = {
        '1': 'Standard Room',
        '2': 'Deluxe Room',
        '3': 'Beach view rooms',
        '4': 'Family Room'
    };
    return roomTypes[roomTypeValue] || '';
}

// Display booking details from URL
function displayBookingDetails() {
    document.getElementById('checkIn').textContent = getUrlParameter('checkIn') || '-';
    document.getElementById('checkOut').textContent = getUrlParameter('checkOut') || '-';
    document.getElementById('roomType').textContent = getRoomTypeName(getUrlParameter('roomType'));
    document.getElementById('promocode').textContent = getUrlParameter('promocode') || '-';
    document.getElementById('adults').textContent = getUrlParameter('adults') || '-';
    document.getElementById('children').textContent = getUrlParameter('children') || '-';
}

// Get guest numbers
function getGuestNumbers() {
    const adults = parseInt(getUrlParameter('adults')) || 0;
    const children = parseInt(getUrlParameter('children')) || 0;
    return { adults, children, total: adults + children };
}

// Calculate minimum rooms required
function calculateMinimumRoomsRequired() {
    const guests = getGuestNumbers();
    return Math.ceil(guests.total / MAX_OCCUPANCY_PER_ROOM);
}

// NEW FUNCTION: Calculate number of nights between check-in and check-out
function calculateNumberOfNights() {
    const checkInDate = new Date(getUrlParameter('checkIn'));
    const checkOutDate = new Date(getUrlParameter('checkOut'));

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return 1; // Default to 1 night if dates are invalid
    }

    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return Math.max(1, daysDifference); // Ensure at least 1 night
}

// NEW FUNCTION: Calculate total cost for selected rooms including nights
function calculateTotalBookingAmount() {
    const numberOfNights = calculateNumberOfNights();
    const dailyTotal = Object.entries(selectedRooms).reduce((total, [roomId, qty]) => {
        const room = allRooms.find(r => r.roomId === roomId);
        return total + (room ? room.pricePerNight * qty : 0);
    }, 0);

    return dailyTotal * numberOfNights;
}

// NEW FUNCTION: Get booking duration info
function getBookingDurationInfo() {
    const checkIn = getUrlParameter('checkIn');
    const checkOut = getUrlParameter('checkOut');
    const nights = calculateNumberOfNights();

    return {
        checkIn,
        checkOut,
        nights,
        isValid: checkIn && checkOut && nights > 0
    };
}

// Fetch rooms from backend
async function fetchRooms() {
    try {
        showLoading();

        const bookingData = {
            checkIn: getUrlParameter('checkIn'),
            checkOut: getUrlParameter('checkOut'),
            adults: getUrlParameter('adults'),
            children: getUrlParameter('children'),
            roomType: getUrlParameter('roomType'),
            promocode: getUrlParameter('promocode')
        };

        const response = await fetch('/api/rooms/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();
        allRooms = data.rooms || [];

        hideLoading();
        displayRooms();

    } catch (error) {
        console.error('Error fetching rooms:', error);
        hideLoading();
        loadSampleData(); // For testing
    }
}

// Show loading message
function showLoading() {
    document.getElementById('hotel-container').innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <div style="border: 3px solid #f3f3f3; border-top: 3px solid #ff6b35; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <h3>Searching Available Rooms...</h3>
            <p>Please wait while we find the best options for you.</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
}

// Hide loading
function hideLoading() {
    // Loading will be replaced by room display
}

// Sort rooms: selected type first, then others
function sortRooms() {
    const selectedType = getRoomTypeName(getUrlParameter('roomType'));

    const selectedTypeRooms = allRooms.filter(room => room.roomType === selectedType);
    const otherRooms = allRooms.filter(room => room.roomType !== selectedType);

    // Sort by price
    selectedTypeRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
    otherRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);

    return { selectedTypeRooms, otherRooms };
}

// Display all rooms with capacity requirements
function displayRooms() {
    const container = document.getElementById('hotel-container');
    const { selectedTypeRooms, otherRooms } = sortRooms();
    const guests = getGuestNumbers();
    const minRoomsRequired = calculateMinimumRoomsRequired();
    const durationInfo = getBookingDurationInfo(); // NEW: Get duration info

    if (selectedTypeRooms.length === 0 && otherRooms.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; border: 2px dashed #ccc; border-radius: 10px; background: #f9f9f9;">
                <h3 style="color: #666;">No Available Rooms</h3>
                <p>Sorry, no rooms are available for your selected dates.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    // Show capacity requirements info (ENHANCED with nights info)
    const requirementDiv = document.createElement('div');
    requirementDiv.innerHTML = `
        <div style="background: #e8f4f8; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #0c5460;">Booking Requirements:</h4>
            <p style="margin: 5px 0; color: #0c5460;">
                <strong>Stay Duration:</strong> ${durationInfo.nights} night(s) (${durationInfo.checkIn} to ${durationInfo.checkOut})
            </p>
            <p style="margin: 5px 0; color: #0c5460;">
                <strong>Total Guests:</strong> ${guests.adults} Adults + ${guests.children} Children = ${guests.total} Guests
            </p>
            <p style="margin: 5px 0; color: #0c5460;">
                <strong>Minimum Rooms Required:</strong> ${minRoomsRequired} room(s) (Max 4 guests per room)
            </p>
            <p style="margin: 5px 0; color: #d63384; font-weight: bold;">
                Please select at least ${minRoomsRequired} room(s) to accommodate all guests.
            </p>
        </div>
    `;
    container.appendChild(requirementDiv);

    // Show selected room type section
    if (selectedTypeRooms.length > 0) {
        const selectedType = getRoomTypeName(getUrlParameter('roomType'));
        const header = document.createElement('div');
        header.innerHTML = `
            <h3 style="color: #ff6b35; margin: 20px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #ff6b35;">
                <i class="fa fa-star" style="margin-right: 8px;"></i>Your Selected Room Type: ${selectedType}
            </h3>
        `;
        container.appendChild(header);

        selectedTypeRooms.forEach(room => {
            container.appendChild(createRoomCard(room, true));
        });
    }

    // Show other rooms section
    if (otherRooms.length > 0) {
        const header = document.createElement('div');
        header.innerHTML = `
            <h3 style="color: #666; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
                <i class="fa fa-bed" style="margin-right: 8px;"></i>Other Available Rooms
            </h3>
        `;
        container.appendChild(header);

        otherRooms.forEach(room => {
            container.appendChild(createRoomCard(room, false));
        });
    }

    // Show booking summary section
    const summaryDiv = document.createElement('div');
    summaryDiv.id = 'booking-summary-section';
    summaryDiv.style.cssText = 'margin-top: 40px; padding: 20px 0;';
    container.appendChild(summaryDiv);

    updateBookingSummary();
}

// Create room card HTML
function createRoomCard(room, isSelected) {
    const quantity = selectedRooms[room.roomId] || 0;
    const numberOfNights = calculateNumberOfNights(); // NEW: Get nights
    const dailyPrice = room.pricePerNight * quantity;
    const totalPrice = dailyPrice * numberOfNights; // NEW: Calculate total with nights

    const card = document.createElement('div');
    card.className = 'room-card';
    card.style.cssText = `
        border: 2px solid ${isSelected ? '#ff6b35' : '#ddd'};
        margin: 15px 0;
        padding: 20px;
        border-radius: 10px;
        background: ${isSelected ? '#fff8f5' : '#fff'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    `;

    card.innerHTML = `
        <div class="room-content" style="display: flex; gap: 20px; align-items: center;">
            <div class="room-image" style="flex: 0 0 180px;">
                <img src="${room.imageUrl || 'images/room-default.jpg'}" 
                     alt="${room.roomType}" 
                     style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;">
                ${isSelected ? '<div style="background: #ff6b35; color: white; padding: 4px 8px; border-radius: 12px; display: inline-block; margin-top: 8px; font-size: 11px; font-weight: bold;">YOUR CHOICE</div>' : ''}
            </div>
            
            <div class="room-details" style="flex: 1;">
                <h4 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">${room.roomType}</h4>
                <div style="color: #666; margin: 4px 0; font-size: 14px;">
                    <i class="fa fa-tag" style="margin-right: 5px;"></i>Room ID: ${room.roomId}
                </div>
                <div style="color: #666; margin: 4px 0; font-size: 14px;">
                    <i class="fa fa-users" style="margin-right: 5px;"></i>Capacity: Up to 4 guests per room
                </div>
                <div style="color: #ff6b35; font-size: 20px; font-weight: bold; margin: 10px 0;">
                    $${room.pricePerNight} <span style="font-size: 14px; color: #666; font-weight: normal;">/ night</span>
                </div>
            </div>
            
            <div class="room-selection" style="flex: 0 0 200px; text-align: center;">
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">Select Rooms:</label>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
                        <button onclick="changeQuantity('${room.roomId}', -1)" 
                                style="width: 40px; height: 40px; border: 2px solid #ff6b35; background: white; color: #ff6b35; cursor: pointer; border-radius: 6px; font-size: 18px; font-weight: bold;">
                            −
                        </button>
                        <span id="qty-${room.roomId}" style="min-width: 30px; text-align: center; font-weight: bold; font-size: 18px;">
                            ${quantity}
                        </span>
                        <button onclick="changeQuantity('${room.roomId}', 1)" 
                                style="width: 40px; height: 40px; border: 2px solid #ff6b35; background: #ff6b35; color: white; cursor: pointer; border-radius: 6px; font-size: 18px; font-weight: bold;">
                            +
                        </button>
                    </div>
                </div>
                <div id="price-${room.roomId}" style="color: #ff6b35; font-weight: bold; min-height: 40px; font-size: 14px;">
                    ${quantity > 0 ? `
                        <div>Daily: $${dailyPrice}</div>
                        <div style="border-top: 1px solid #ff6b35; padding-top: 4px; margin-top: 4px;">
                            ${numberOfNights} nights: <strong>$${totalPrice}</strong>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    return card;
}

// Change room quantity
function changeQuantity(roomId, change) {
    const currentQty = selectedRooms[roomId] || 0;
    const newQty = Math.max(0, currentQty + change);

    if (newQty === 0) {
        delete selectedRooms[roomId];
    } else {
        selectedRooms[roomId] = newQty;
    }

    // Update display
    document.getElementById(`qty-${roomId}`).textContent = newQty;

    // Update price display (ENHANCED with nights calculation)
    const room = allRooms.find(r => r.roomId === roomId);
    const priceElement = document.getElementById(`price-${roomId}`);
    const numberOfNights = calculateNumberOfNights();

    if (newQty > 0) {
        const dailyPrice = room.pricePerNight * newQty;
        const totalPrice = dailyPrice * numberOfNights;
        priceElement.innerHTML = `
            <div>Daily: $${dailyPrice}</div>
            <div style="border-top: 1px solid #ff6b35; padding-top: 4px; margin-top: 4px;">
                ${numberOfNights} nights: <strong>$${totalPrice}</strong>
            </div>
        `;
        priceElement.style.color = '#ff6b35';
    } else {
        priceElement.innerHTML = '';
    }

    updateBookingSummary();
}

// Update booking summary
function updateBookingSummary() {
    const totalRooms = Object.values(selectedRooms).reduce((sum, qty) => sum + qty, 0);
    const dailyTotal = Object.entries(selectedRooms).reduce((total, [roomId, qty]) => {
        const room = allRooms.find(r => r.roomId === roomId);
        return total + (room ? room.pricePerNight * qty : 0);
    }, 0);

    // NEW: Calculate full amount with nights
    const numberOfNights = calculateNumberOfNights();
    const totalAmount = calculateTotalBookingAmount();

    const minRoomsRequired = calculateMinimumRoomsRequired();
    const guests = getGuestNumbers();
    const isValidSelection = totalRooms >= minRoomsRequired;
    const durationInfo = getBookingDurationInfo();

    const summaryContainer = document.getElementById('booking-summary-section');

    if (totalRooms > 0) {
        summaryContainer.innerHTML = `
            <div style="background: ${isValidSelection ? '#d4edda' : '#f8d7da'}; border: 2px solid ${isValidSelection ? '#c3e6cb' : '#f5c6cb'}; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h4 style="margin: 0 0 15px 0; color: ${isValidSelection ? '#155724' : '#721c24'};">
                    <i class="fa fa-calculator" style="margin-right: 8px;"></i>Booking Summary
                </h4>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
                    <div>
                        <p style="margin: 5px 0; color: #333;"><strong>Selected Rooms:</strong> ${totalRooms}</p>
                        <p style="margin: 5px 0; color: #333;"><strong>Total Guests:</strong> ${guests.total} (${guests.adults} Adults, ${guests.children} Children)</p>
                        <p style="margin: 5px 0; color: #333;"><strong>Required Minimum:</strong> ${minRoomsRequired} room(s)</p>
                        <p style="margin: 5px 0; color: #333;"><strong>Stay Duration:</strong> ${numberOfNights} night(s)</p>
                    </div>
                    <div>
                        <p style="margin: 5px 0; color: #333;"><strong>Check-in:</strong> ${durationInfo.checkIn}</p>
                        <p style="margin: 5px 0; color: #333;"><strong>Check-out:</strong> ${durationInfo.checkOut}</p>
                        <p style="margin: 5px 0; color: #666;"><strong>Daily Total:</strong> $${dailyTotal}</p>
                        <p style="margin: 5px 0; font-size: 20px; color: #ff6b35;"><strong>FULL AMOUNT: $${totalAmount}</strong></p>
                    </div>
                </div>
                
                ${!isValidSelection ?
            `<div style="background: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0;">
                        <p style="margin: 0; color: #721c24; font-weight: bold;">
                            ⚠️ You need to select at least ${minRoomsRequired} room(s) to accommodate ${guests.total} guests.
                        </p>
                    </div>` : ''
        }
                
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="proceedToBooking()" 
                            ${!isValidSelection ? 'disabled' : ''}
                            style="background: ${isValidSelection ? '#ff6b35' : '#ccc'}; 
                                   color: white; 
                                   border: none; 
                                   padding: 15px 40px; 
                                   border-radius: 8px; 
                                   cursor: ${isValidSelection ? 'pointer' : 'not-allowed'}; 
                                   font-size: 18px; 
                                   font-weight: bold;
                                   transition: all 0.3s ease;">
                        ${isValidSelection ? `BOOK NOW - $${totalAmount}` : 'SELECT MORE ROOMS'}
                    </button>
                </div>
            </div>
        `;
    } else {
        summaryContainer.innerHTML = `
            <div style="background: #f8f9fa; border: 2px dashed #dee2e6; padding: 20px; border-radius: 10px; text-align: center;">
                <h4 style="color: #6c757d; margin: 0;">No Rooms Selected</h4>
                <p style="color: #6c757d; margin: 10px 0 0 0;">Please select rooms to see booking summary</p>
                <p style="color: #6c757d; margin: 5px 0 0 0; font-size: 14px;">Stay: ${numberOfNights} night(s) from ${durationInfo.checkIn} to ${durationInfo.checkOut}</p>
            </div>
        `;
    }
}

// Proceed to booking
function proceedToBooking() {
    const totalRooms = Object.values(selectedRooms).reduce((sum, qty) => sum + qty, 0);
    const minRoomsRequired = calculateMinimumRoomsRequired();

    if (totalRooms < minRoomsRequired) {
        alert(`Please select at least ${minRoomsRequired} room(s) to accommodate all guests.`);
        return;
    }

    if (Object.keys(selectedRooms).length === 0) {
        alert('Please select at least one room');
        return;
    }

    // NEW: Use the enhanced total calculation
    const totalAmount = calculateTotalBookingAmount();
    const numberOfNights = calculateNumberOfNights();

    // Create room IDs array for URL
    const roomIds = Object.keys(selectedRooms);

    // Create URL parameters (ENHANCED with nights info)
    const params = new URLSearchParams();
    params.append('checkIn', getUrlParameter('checkIn'));
    params.append('checkOut', getUrlParameter('checkOut'));
    params.append('adults', getUrlParameter('adults'));
    params.append('children', getUrlParameter('children'));
    params.append('promocode', getUrlParameter('promocode') || '');
    params.append('roomIds', roomIds.join(','));
    params.append('roomQuantities', JSON.stringify(selectedRooms));
    params.append('numberOfNights', numberOfNights); // NEW
    params.append('totalAmount', totalAmount); // ENHANCED

    console.log('Enhanced Booking Data:', {
        checkIn: getUrlParameter('checkIn'),
        checkOut: getUrlParameter('checkOut'),
        numberOfNights: numberOfNights, // NEW
        adults: getUrlParameter('adults'),
        children: getUrlParameter('children'),
        selectedRooms: selectedRooms,
        dailyAmount: Object.entries(selectedRooms).reduce((total, [roomId, qty]) => {
            const room = allRooms.find(r => r.roomId === roomId);
            return total + (room ? room.pricePerNight * qty : 0);
        }, 0), // NEW
        totalAmount: totalAmount, // ENHANCED
        roomIds: roomIds
    });

    // Navigate to booking page
    window.location.href = `booking.html?${params.toString()}`;
}

// Sample data for testing
function loadSampleData() {
    allRooms = [
        {
            roomId: "R001",
            roomType: "Standard Room",
            pricePerNight: 100,
            imageUrl: "images/room1.jpg"
        },
        {
            roomId: "R002",
            roomType: "Deluxe Room",
            pricePerNight: 150,
            imageUrl: "images/room2.jpg"
        },
        {
            roomId: "R003",
            roomType: "Family Room",
            pricePerNight: 200,
            imageUrl: "images/room3.jpg"
        },
        {
            roomId: "R004",
            roomType: "Beach view rooms",
            pricePerNight: 180,
            imageUrl: "images/room4.jpg"
        },
        {
            roomId: "R005",
            roomType: "Standard Room",
            pricePerNight: 120,
            imageUrl: "images/room5.jpg"
        }
    ];

    displayRooms();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    displayBookingDetails();
    fetchRooms();
    console.log('Enhanced hotel booking system initialized with night calculation');
});