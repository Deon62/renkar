document.addEventListener('DOMContentLoaded', function() {
    // Sample car data - in a real app, this would come from an API
    const cars = [
        { id: 1, name: 'Toyota Axio', location: 'Nairobi', price: 2000, image: 'assets/cars/r1.jpg' },
        { id: 2, name: 'Toyota Fielder', location: 'Mombasa', price: 2500, image: 'assets/cars/r2.jpg' },
        { id: 3, name: 'Toyota Vitz', location: 'Nairobi', price: 1800, image: 'assets/cars/r3.jpg' },
        { id: 4, name: 'Nissan Note', location: 'Kisumu', price: 2200, image: 'assets/cars/r4.jpg' },
        { id: 5, name: 'Subaru Impreza', location: 'Nairobi', price: 3500, image: 'assets/cars/r5.jpg' },
        { id: 6, name: 'Toyota RAV4', location: 'Mombasa', price: 4000, image: 'assets/cars/r6.jpg' },
        { id: 7, name: 'Honda Fit', location: 'Nakuru', price: 2300, image: 'assets/cars/r7.jpg' },
        { id: 8, name: 'Mazda Demio', location: 'Nairobi', price: 2100, image: 'assets/cars/r8.jpg' },
        { id: 9, name: 'Toyota Voxy', location: 'Eldoret', price: 4500, image: 'assets/cars/r9.jpg' },
        { id: 10, name: 'Toyota Premio', location: 'Nairobi', price: 3000, image: 'assets/cars/r10.jpg' },
        { id: 11, name: 'Toyota Harrier', location: 'Mombasa', price: 5000, image: 'assets/cars/r11.jpg' },
        { id: 12, name: 'Subaru Forester', location: 'Nairobi', price: 4200, image: 'assets/cars/r12.jpg' },
        { id: 13, name: 'Toyota Prado', location: 'Nakuru', price: 8000, image: 'assets/cars/r13.jpg' },
        { id: 14, name: 'Mitsubishi Outlander', location: 'Nairobi', price: 5500, image: 'assets/cars/r14.jpg' },
        { id: 15, name: 'Toyota Rush', location: 'Kisumu', price: 4800, image: 'assets/cars/r15.jpg' },
        { id: 16, name: 'Nissan X-Trail', location: 'Nairobi', price: 5200, image: 'assets/cars/r16.jpg' },
        { id: 17, name: 'Toyota Land Cruiser', location: 'Mombasa', price: 10000, image: 'assets/cars/r17.jpg' },
        { id: 18, name: 'Subaru Legacy', location: 'Nairobi', price: 3800, image: 'assets/cars/r18.jpg' },
        { id: 19, name: 'Toyota Vanguard', location: 'Eldoret', price: 4200, image: 'assets/cars/r19.jpg' },
        { id: 20, name: 'Honda CR-V', location: 'Nairobi', price: 4700, image: 'assets/cars/r20.jpg' }
    ];

    const carGrid = document.getElementById('carGrid');
    const searchInput = document.querySelector('.search-container input');
    const modal = document.getElementById('rentalModal');
    const closeModal = document.getElementById('closeModal');
    const confirmRentalBtn = document.getElementById('confirmRental');
    const successToast = document.getElementById('successToast');
    
    let selectedCar = null;

    // Display cars in the grid
    function displayCars(carsToDisplay) {
        carGrid.innerHTML = '';
        
        if (carsToDisplay.length === 0) {
            carGrid.innerHTML = '<p class="no-results">No cars found matching your search.</p>';
            return;
        }
        
        carsToDisplay.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.innerHTML = `
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
                            <button class="btn btn-primary rent-now" data-id="${car.id}">Rent Now</button>
                        </div>
                    </div>
                    <img src="${car.image}" alt="${car.name}" class="car-image-profile" onerror="this.src='https://via.placeholder.com/150?text=Car+Image';">
                </div>`;
            carGrid.appendChild(carCard);
        });
        
        // Add event listeners to rent buttons
        document.querySelectorAll('.rent-now').forEach(button => {
            button.addEventListener('click', (e) => {
                const carId = parseInt(e.target.getAttribute('data-id'));
                selectedCar = cars.find(car => car.id === carId);
                openModal(selectedCar);
            });
        });
    }

    // Open modal with car details
    function openModal(car) {
        document.getElementById('modalCarImage').style.backgroundImage = `url('${car.image}')`;
        document.getElementById('modalCarName').textContent = car.name;
        document.getElementById('modalCarLocation').textContent = car.location;
        document.getElementById('modalCarPrice').textContent = `KES ${car.price.toLocaleString()} / day`;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    // Close modal
    function closeModalFunc() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Re-enable scrolling
    }

    // Show success toast
    function showSuccessToast() {
        successToast.classList.add('show');
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 3000);
    }

    // Search functionality
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCars = cars.filter(car => 
            car.name.toLowerCase().includes(searchTerm) || 
            car.location.toLowerCase().includes(searchTerm)
        );
        displayCars(filteredCars);
    }

    // Event Listeners
    searchInput.addEventListener('input', handleSearch);
    
    closeModal.addEventListener('click', closeModalFunc);
    
    confirmRentalBtn.addEventListener('click', () => {
        // In a real app, you would handle the booking confirmation here
        closeModalFunc();
        showSuccessToast();
        
        // Redirect to home after a delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // Initial display of cars
    displayCars(cars);
});
