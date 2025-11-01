document.addEventListener('DOMContentLoaded', function() {
    // Get car ID from URL or use a default
    const urlParams = new URLSearchParams(window.location.search);
    const carId = parseInt(urlParams.get('id')) || 1;

    // Sample car data - in a real app, this would come from an API
    const cars = [
        {
            id: 1,
            name: 'BMW 3 Series (2023)',
            vendor: 'Executive Line',
            price: 5500,
            image: 'assets/cars/r1.jpg',
            seats: 5,
            fuel: 'Petrol',
            mileage: '32,000 km',
            color: 'Black',
            engine: '2000cc'
        }
    ];

    // Find the selected car or use the first one as default
    let car = cars.find(c => c.id === carId) || cars[0];

    // Function to get random car images (excluding the current car's image)
    function getRandomCarImages(count, excludeImage) {
        const images = [];
        const totalImages = 20; // r1.jpg to r20.jpg
        
        // Create array of all possible images
        const allImages = [];
        for (let i = 1; i <= totalImages; i++) {
            const imgName = `r${i}.jpg`;
            const imgPath = `./assets/cars/${imgName}`; // Use relative path
            if (imgPath !== excludeImage) {
                allImages.push({
                    name: imgName,
                    path: imgPath
                });
            }
        }
        
        // Shuffle and select required number of images
        for (let i = 0; i < count && allImages.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * allImages.length);
            images.push(allImages.splice(randomIndex, 1)[0]);
        }
        
        return images;
    }

    // Initialize carousel
    function initCarousel() {
        const track = document.getElementById('carouselTrack');
        const dotsContainer = document.getElementById('carouselDots');
        
        if (!track) return;
        
        // Clear any existing content
        track.innerHTML = '';
        if (dotsContainer) dotsContainer.innerHTML = '';
        
        // Get 3 random images plus the current car's image
        const currentCarImage = {
            name: car.image.split('/').pop(),
            path: car.image
        };
        let carImages = [currentCarImage, ...getRandomCarImages(3, car.image)];
        
        // Create slides
        carImages.forEach((imgSrc, index) => {
            // Create slide
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            const img = document.createElement('img');
            img.src = imgSrc.path;
            img.alt = `${car.name} - View ${index + 1}`;
            img.loading = 'lazy';
            
            // Add error handling
            img.onerror = function() {
                console.error('Error loading image:', imgSrc);
                this.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                this.style.objectFit = 'contain';
                this.style.padding = '20px';
                this.style.backgroundColor = '#f5f5f5';
            };
            
            slide.appendChild(img);
            track.appendChild(slide);
            
            // Create indicator
            if (dotsContainer) {
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.className = index === 0 ? 'active' : '';
                indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
                indicator.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(indicator);
            }
        });
        
        // Set up carousel functionality
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const slideCount = slides.length;
        
        function updateCarousel() {
            const offset = -currentSlide * 100;
            track.style.transform = `translateX(${offset}%)`;
            
            // Update active dot
            const indicators = dotsContainer?.querySelectorAll('button') || [];
            indicators.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }
        
        function goToSlide(index) {
            currentSlide = (index + slideCount) % slideCount;
            updateCarousel();
        }
        
        // Auto-advance slides every 5 seconds
        let slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
        
        // Pause auto-slide on hover
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            carousel.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    goToSlide(currentSlide + 1);
                }, 5000);
            });
        }
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            clearInterval(slideInterval);
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
            slideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    goToSlide(currentSlide + 1); // Swipe left - next slide
                } else {
                    goToSlide(currentSlide - 1); // Swipe right - previous slide
                }
            }
        }
    }

    // Update car details in the UI
    function updateCarDetails() {
        const nameEl = document.getElementById('carName');
        const vendorEl = document.getElementById('vendorName');
        const seatsEl = document.getElementById('carSeats');
        const fuelEl = document.getElementById('carFuel');
        const mileageEl = document.getElementById('carMileage');
        const colorEl = document.getElementById('carColor');
        const engineEl = document.getElementById('carEngine');
        const totalEl = document.getElementById('estimatedTotal');

        if (nameEl) nameEl.textContent = car.name;
        if (vendorEl) vendorEl.textContent = car.vendor || '';
        if (seatsEl) seatsEl.textContent = car.seats;
        if (fuelEl) fuelEl.textContent = car.fuel;
        if (mileageEl) mileageEl.textContent = car.mileage;
        if (colorEl) colorEl.textContent = car.color || '';
        if (engineEl) engineEl.textContent = car.engine || '';
        if (totalEl) totalEl.textContent = `KES ${car.price.toLocaleString()}`;
    }

    // Initialize the page
    function init() {
        updateCarDetails();
        initCarousel();
        
        // Set up event listeners
        const proceedBtn = document.getElementById('proceedToRent');
        proceedBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `checkout.html?carId=${car.id}`;
        });

        const backBtn = document.getElementById('backBtn');
        backBtn?.addEventListener('click', () => {
            window.history.back();
        });

        const favoriteBtn = document.getElementById('favoriteBtn');
        favoriteBtn?.addEventListener('click', () => {
            favoriteBtn.classList.toggle('active');
            const icon = favoriteBtn.querySelector('i');
            if (favoriteBtn.classList.contains('active')) {
                icon?.classList.remove('far');
                icon?.classList.add('fas');
            } else {
                icon?.classList.remove('fas');
                icon?.classList.add('far');
            }
        });
    }

    // Start the application
    init();
});
