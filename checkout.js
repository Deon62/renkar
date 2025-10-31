document.addEventListener('DOMContentLoaded', function() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentInputs = document.getElementById('paymentInputs');
    const mobileInputs = document.getElementById('mobileInputs');
    const cardInputs = document.getElementById('cardInputs');
    const walletInput = document.getElementById('walletInput');
    const cashNote = document.getElementById('cashNote');
    const payButton = document.getElementById('payButton');
    const successMessage = document.getElementById('successMessage');
    const paySection = document.querySelector('.pay-section');
    let selectedMethod = null;

    // Handle payment method selection
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            selectedMethod = this.dataset.method;
            
            // Hide all input groups
            mobileInputs.style.display = 'none';
            cardInputs.style.display = 'none';
            walletInput.style.display = 'none';
            cashNote.style.display = 'none';
            
            // Show payment inputs container
            paymentInputs.style.display = 'block';
            
            // Show relevant input group based on selected method
            switch(selectedMethod) {
                case 'mpesa':
                case 'airtel':
                    mobileInputs.style.display = 'flex';
                    break;
                case 'card':
                    cardInputs.style.display = 'flex';
                    break;
                case 'wallet':
                    walletInput.style.display = 'flex';
                    break;
                case 'cash':
                    cashNote.style.display = 'block';
                    break;
            }
        });
    });

    // Handle Pay Now button click
    payButton.addEventListener('click', function() {
        if (!selectedMethod) {
            alert('Please select a payment method');
            return;
        }

        // Validate inputs based on selected method
        if (selectedMethod === 'mpesa' || selectedMethod === 'airtel') {
            const phoneNumber = document.getElementById('phoneNumber').value;
            const confirmNumber = document.getElementById('confirmNumber').value;
            
            if (!phoneNumber || !confirmNumber) {
                alert('Please enter both phone numbers');
                return;
            }
            
            if (phoneNumber !== confirmNumber) {
                alert('Phone numbers do not match');
                return;
            }
        }
        
        if (selectedMethod === 'card') {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvc = document.getElementById('cvc').value;
            
            if (!cardNumber || !expiryDate || !cvc) {
                alert('Please fill in all card details');
                return;
            }
        }
        
        if (selectedMethod === 'wallet') {
            const walletAddress = document.getElementById('walletAddress').value;
            
            if (!walletAddress) {
                alert('Please enter your wallet address');
                return;
            }
        }

        // Disable button and show loading spinner
        this.disabled = true;
        this.innerHTML = '<div class="spinner"></div>';
        
        // Simulate payment processing
        setTimeout(() => {
            // Hide pay section
            paySection.style.display = 'none';
            
            // Show success message
            successMessage.style.display = 'block';
        }, 2500);
    });

    // Load car details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('carId');
    
    // Sample car data - in a real app, this would come from an API
    const cars = [
        { id: 1, name: 'Toyota Axio', price: 2500, image: 'assets/cars/r1.jpg' },
        { id: 2, name: 'Toyota Fielder', price: 2500, image: 'assets/cars/r2.jpg' },
        { id: 3, name: 'Toyota Vitz', price: 1800, image: 'assets/cars/r3.jpg' },
        { id: 4, name: 'Nissan Note', price: 2200, image: 'assets/cars/r4.jpg' },
        { id: 5, name: 'Subaru Impreza', price: 3500, image: 'assets/cars/r5.jpg' },
        { id: 6, name: 'Toyota RAV4', price: 4000, image: 'assets/cars/r6.jpg' },
        { id: 7, name: 'Honda Fit', price: 2300, image: 'assets/cars/r7.jpg' },
        { id: 8, name: 'Mazda Demio', price: 2100, image: 'assets/cars/r8.jpg' },
        { id: 9, name: 'Toyota Voxy', price: 4500, image: 'assets/cars/r9.jpg' },
        { id: 10, name: 'Toyota Premio', price: 3000, image: 'assets/cars/r10.jpg' },
        { id: 11, name: 'Toyota Harrier', price: 5000, image: 'assets/cars/r11.jpg' },
        { id: 12, name: 'Subaru Forester', price: 4200, image: 'assets/cars/r12.jpg' },
        { id: 13, name: 'Toyota Prado', price: 8000, image: 'assets/cars/r13.jpg' },
        { id: 14, name: 'Mitsubishi Outlander', price: 5500, image: 'assets/cars/r14.jpg' },
        { id: 15, name: 'Toyota Rush', price: 4800, image: 'assets/cars/r15.jpg' },
        { id: 16, name: 'Nissan X-Trail', price: 5200, image: 'assets/cars/r16.jpg' },
        { id: 17, name: 'Toyota Land Cruiser', price: 10000, image: 'assets/cars/r17.jpg' },
        { id: 18, name: 'Subaru Legacy', price: 3800, image: 'assets/cars/r18.jpg' },
        { id: 19, name: 'Toyota Allion', price: 3200, image: 'assets/cars/r19.jpg' },
        { id: 20, name: 'Mazda CX-5', price: 6000, image: 'assets/cars/r20.jpg' }
    ];
    
    // Find the selected car
    const carDetails = cars.find(c => c.id == carId) || cars[0];
    const rentalDuration = '2 Days'; // Default duration
    
    // Update UI with car details
    document.getElementById('carName').textContent = carDetails.name;
    document.getElementById('duration').textContent = rentalDuration;
    
    // Calculate total amount based on duration and price
    const days = parseInt(rentalDuration.split(' ')[0]);
    const totalAmount = days * carDetails.price;
    document.getElementById('totalAmount').textContent = `KSh ${totalAmount.toLocaleString()}`;
    document.getElementById('amountDisplay').value = `KSh ${totalAmount.toLocaleString()}`;
});

