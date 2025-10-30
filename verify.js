document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const phoneForm = document.getElementById('phoneForm');
    const otpForm = document.getElementById('otpForm');
    const phoneVerification = document.getElementById('phoneVerification');
    const otpVerification = document.getElementById('otpVerification');
    const successCheckmark = document.getElementById('successCheckmark');
    const phoneNumberInput = document.getElementById('phone');
    const phoneNumberDisplay = document.getElementById('phoneNumberDisplay');
    const resendLink = document.getElementById('resendLink');
    const countdownElement = document.getElementById('countdown');
    const otpInputs = document.querySelectorAll('.otp-inputs input');
    let countdown;
    let countdownTime = 30;

    // Format phone number as user types
    phoneNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 9) value = value.substring(0, 9);
        
        // Format as 7XX XXX XXX
        if (value.length > 6) {
            value = `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6)}`;
        } else if (value.length > 3) {
            value = `${value.substring(0, 3)} ${value.substring(3)}`;
        }
        
        e.target.value = value;
    });

    // Handle phone form submission
    phoneForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const phoneNumber = phoneNumberInput.value;
        
        // In a real app, you would validate the phone number here
        // and send an OTP via SMS
        
        // Show OTP verification
        showOTPVerification(phoneNumber);
    });

    // Handle OTP form submission
    otpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        verifyOTP();
    });

    // Handle OTP input
    otpInputs.forEach((input, index) => {
        // Handle input
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // If a number was entered, move to next input
            if (value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            // Auto-submit if all fields are filled
            if (index === otpInputs.length - 1 && value.length === 1) {
                verifyOTP();
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
        
        // Handle paste
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const numbers = paste.replace(/\D/g, '').split('');
            
            if (numbers.length === 6) {
                numbers.forEach((num, i) => {
                    if (otpInputs[i]) {
                        otpInputs[i].value = num;
                    }
                });
                // Auto-submit if all fields are filled
                verifyOTP();
            }
        });
    });

    // Handle resend OTP
    resendLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Reset countdown
        clearInterval(countdown);
        countdownTime = 30;
        updateCountdown();
        startCountdown();
        
        // In a real app, you would resend the OTP here
        console.log('Resending OTP...');
    });

    // Show OTP verification
    function showOTPVerification(phoneNumber) {
        // Update phone number display
        phoneNumberDisplay.textContent = `+254 ${phoneNumber}`;
        
        // Hide phone form, show OTP form with animation
        phoneVerification.style.opacity = '0';
        phoneVerification.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            phoneVerification.classList.add('hidden');
            otpVerification.classList.remove('hidden');
            otpVerification.style.opacity = '1';
            otpVerification.style.transform = 'translateY(0)';
            
            // Focus first OTP input
            otpInputs[0].focus();
            
            // Start countdown for resend
            startCountdown();
        }, 300);
    }

    // Verify OTP
    function verifyOTP() {
        // In a real app, you would verify the OTP with your backend
        // For this demo, we'll just show success after a short delay
        
        // Show success animation
        successCheckmark.classList.remove('hidden');
        successCheckmark.classList.add('visible');
        
        // Disable form
        otpForm.querySelector('button').disabled = true;
        otpInputs.forEach(input => input.disabled = true);
        
        // Redirect to home page after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    // Start countdown for resend
    function startCountdown() {
        resendLink.style.pointerEvents = 'none';
        resendLink.style.opacity = '0.7';
        updateCountdown();
        
        countdown = setInterval(() => {
            countdownTime--;
            updateCountdown();
            
            if (countdownTime <= 0) {
                clearInterval(countdown);
                resendLink.style.pointerEvents = 'auto';
                resendLink.style.opacity = '1';
                resendLink.innerHTML = 'Resend code';
            }
        }, 1000);
    }

    // Update countdown display
    function updateCountdown() {
        if (countdownTime > 0) {
            countdownElement.textContent = countdownTime;
        }
    }

    // Add smooth scroll to top on page load
    window.scrollTo(0, 0);
});
