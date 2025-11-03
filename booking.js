document.addEventListener('DOMContentLoaded', function() {
    // Sample car data - in a real app, this would come from an API
    const cars = [
        { id: 1, name: 'BMW M5', location: 'Nairobi', price: 2000, image: 'assets/cars/r1.jpg' },
        { id: 2, name: 'BMW M4 CSL', location: 'Mombasa', price: 2500, image: 'assets/cars/r2.jpg' },
        { id: 3, name: 'Bimmer M2', location: 'Nairobi', price: 1800, image: 'assets/cars/r3.jpg' },
        { id: 4, name: 'Audi RS', location: 'Kisumu', price: 2200, image: 'assets/cars/r4.jpg' },
        { id: 5, name: 'Mercedes Benz', location: 'Nairobi', price: 3500, image: 'assets/cars/r5.jpg' },
        { id: 6, name: 'Audi RS4', location: 'Mombasa', price: 4000, image: 'assets/cars/r6.jpg' },
        { id: 7, name: 'Honda Fit', location: 'Nakuru', price: 2300, image: 'assets/cars/r7.jpg' },
        { id: 8, name: 'Mazda Demio', location: 'Nairobi', price: 2100, image: 'assets/cars/r8.jpg' },
        { id: 9, name: 'Mercedes Benz SEDAN', location: 'Eldoret', price: 4500, image: 'assets/cars/r9.jpg' },
        { id: 10, name: 'Mercedes', location: 'Nairobi', price: 3000, image: 'assets/cars/r10.jpg' },
        { id: 11, name: 'GLE Mercedes', location: 'Mombasa', price: 5000, image: 'assets/cars/r11.jpg' },
        { id: 12, name: 'Mercedes Benz GLC', location: 'Nairobi', price: 4200, image: 'assets/cars/r12.jpg' },
        { id: 13, name: 'TESLA', location: 'Nakuru', price: 8000, image: 'assets/cars/r13.jpg' },
        { id: 14, name: 'M3', location: 'Nairobi', price: 5500, image: 'assets/cars/r14.jpg' },
        { id: 15, name: 'Toyota Rush', location: 'Kisumu', price: 4800, image: 'assets/cars/r15.jpg' },
        { id: 16, name: 'Bmw M4 CS', location: 'Nairobi', price: 5200, image: 'assets/cars/r16.jpg' },
        { id: 17, name: 'E69 BMW', location: 'Mombasa', price: 10000, image: 'assets/cars/r17.jpg' },
        { id: 18, name: 'Audi', location: 'Nairobi', price: 3800, image: 'assets/cars/r18.jpg' },
        { id: 19, name: 'Mercedes Benz', location: 'Eldoret', price: 4200, image: 'assets/cars/r19.jpg' },
        { id: 20, name: 'Bentley', location: 'Nairobi', price: 4700, image: 'assets/cars/r20.jpg' }
    ];

    const carGrid = document.getElementById('carGrid');
    const searchInput = document.querySelector('.search-container input');
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const listingToggle = document.querySelector('.listing-toggle');
    const moreToggle = document.getElementById('moreToggle');
    const moreModal = document.getElementById('moreModal');
    const moreModalOverlay = document.getElementById('moreModalOverlay');
    const closeMoreModal = document.getElementById('closeMoreModal');
    const logoutButton = document.getElementById('logoutButton');
    
    const drivers = [
        { id: 201, name: 'John Maina', location: 'Nairobi CBD', rate: 1800, experience: '5 yrs experience', vehicle: 'Toyota Axio', rating: 4.9 },
        { id: 202, name: 'Sarah Wanjiku', location: 'Westlands', rate: 2000, experience: '7 yrs experience', vehicle: 'Nissan Teana', rating: 4.8 },
        { id: 203, name: 'Peter Otieno', location: 'Kilimani', rate: 2200, experience: '6 yrs experience', vehicle: 'Subaru Forester', rating: 4.7 },
        { id: 204, name: 'Brenda Chebet', location: 'Karen', rate: 2500, experience: '9 yrs experience', vehicle: 'Toyota Prado', rating: 5.0 },
        { id: 205, name: 'Kevin Mwangi', location: 'Thika Road', rate: 1700, experience: '4 yrs experience', vehicle: 'Mazda Demio', rating: 4.6 }
    ];

    let activeMode = 'cars';

    // Display cars in the grid
    function renderCars(carsToDisplay) {
        carGrid.innerHTML = '';

        if (carsToDisplay.length === 0) {
            carGrid.innerHTML = '<p class="no-results">No cars found matching your search.</p>';
            return;
        }

        carsToDisplay.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';
            card.innerHTML = `
                <div class="car-card-content">
                    <div class="car-info">
                        <div class="car-details">
                            <div class="car-header">
                                <h3 class="car-name">${car.name}</h3>
                                <div class="car-price">
                                    KES ${car.price.toLocaleString()}<span>/day</span>
                                </div>
                            </div>
                            <div class="car-specs">
                                <span class="spec-item"><i class="fas fa-car"></i> Sedan</span>
                                <span class="spec-item"><i class="fas fa-users"></i> 5 seats</span>
                                <span class="spec-item"><i class="fas fa-gas-pump"></i> Petrol</span>
                            </div>
                            <div class="car-location">
                                <i class="fas fa-map-marker-alt"></i> ${car.location}
                            </div>
                            <a href="car-details.html?id=${car.id}" class="btn btn-outline view-more">View More</a>
                        </div>
                    </div>
                    <img src="${car.image}" alt="${car.name}" class="car-image-profile" onerror="this.src='https://via.placeholder.com/150?text=Car+Image';">
                </div>`;
            carGrid.appendChild(card);
        });
    }

    function renderDrivers(driversToDisplay) {
        carGrid.innerHTML = '';

        if (driversToDisplay.length === 0) {
            carGrid.innerHTML = '<p class="no-results">No drivers found matching your search.</p>';
            return;
        }

        driversToDisplay.forEach(driver => {
            const card = document.createElement('div');
            card.className = 'car-card driver-card';
            card.innerHTML = `
                <div class="car-card-content">
                    <div class="car-info">
                        <div class="car-details">
                            <div class="car-header">
                                <h3 class="car-name">${driver.name}</h3>
                                <div class="car-price">
                                    KES ${driver.rate.toLocaleString()}<span>/day</span>
                                </div>
                            </div>
                            <div class="car-specs">
                                <span class="spec-item"><i class="fas fa-map-marker-alt"></i> ${driver.location}</span>
                                <span class="spec-item"><i class="fas fa-id-card"></i> ${driver.experience}</span>
                            </div>
                            <div class="car-location">
                                <i class="fas fa-car"></i> Vehicle: ${driver.vehicle}
                            </div>
                            <div class="driver-rating">
                                <i class="fas fa-star"></i> ${driver.rating.toFixed(1)} rating
                            </div>
                            <button class="btn btn-outline view-more" data-driver-id="${driver.id}">Hire Driver</button>
                        </div>
                    </div>
                    <img src="https://i.pravatar.cc/150?u=driver-${driver.id}" alt="${driver.name}" class="car-image-profile" onerror="this.src='https://via.placeholder.com/150?text=Driver';">
                </div>`;
            carGrid.appendChild(card);
        });
    }

    // Show success toast (keeping this in case it's used elsewhere)
    function showSuccessToast() {
        // This function is kept for compatibility
        console.log('Success toast would show here');
    }

    // Search functionality
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();

        if (activeMode === 'cars') {
            const filteredCars = cars.filter(car => 
                car.name.toLowerCase().includes(searchTerm) || 
                car.location.toLowerCase().includes(searchTerm)
            );
            renderCars(filteredCars);
        } else {
            const filteredDrivers = drivers.filter(driver => 
                driver.name.toLowerCase().includes(searchTerm) || 
                driver.location.toLowerCase().includes(searchTerm) || 
                driver.vehicle.toLowerCase().includes(searchTerm)
            );
            renderDrivers(filteredDrivers);
        }
    }

    // Event Listeners
    searchInput.addEventListener('input', handleSearch);

    toggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) return;

            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            toggleButtons.forEach(btn => btn.setAttribute('aria-selected', btn === button ? 'true' : 'false'));

            activeMode = button.dataset.mode;
            handleSearch();
        });
    });

    // More modal handlers
    function openMoreModal() {
        if (!moreModal) return;
        moreModal.classList.add('open');
        document.body.classList.add('more-modal-open');
        moreModal.setAttribute('aria-hidden', 'false');
    }

    function closeMoreModalHandler() {
        if (!moreModal) return;
        moreModal.classList.remove('open');
        document.body.classList.remove('more-modal-open');
        moreModal.setAttribute('aria-hidden', 'true');
    }

    moreToggle?.addEventListener('click', openMoreModal);
    closeMoreModal?.addEventListener('click', closeMoreModalHandler);
    moreModalOverlay?.addEventListener('click', closeMoreModalHandler);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && moreModal?.classList.contains('open')) {
            closeMoreModalHandler();
        }
    });

    logoutButton?.addEventListener('click', () => {
        closeMoreModalHandler();
        alert('You have been logged out.');
    });

    // Initial display of cars
    renderCars(cars);
});
