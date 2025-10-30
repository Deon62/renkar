document.addEventListener('DOMContentLoaded', function() {
    // License Upload Page
    if (document.getElementById('licenseUpload')) {
        const uploadArea = document.getElementById('uploadArea');
        const licenseUpload = document.getElementById('licenseUpload');
        const previewContainer = document.getElementById('previewContainer');
        const licensePreview = document.getElementById('licensePreview');
        const changeImageBtn = document.getElementById('changeImage');
        const continueBtn = document.getElementById('continueBtn');
        
        // Handle file upload
        uploadArea.addEventListener('click', () => licenseUpload.click());
        
        licenseUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    licensePreview.src = event.target.result;
                    uploadArea.style.display = 'none';
                    previewContainer.style.display = 'block';
                    continueBtn.disabled = false;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Change image button
        changeImageBtn.addEventListener('click', function() {
            uploadArea.style.display = 'flex';
            previewContainer.style.display = 'none';
            continueBtn.disabled = true;
            licenseUpload.value = '';
        });
        
        // Continue to selfie capture
        continueBtn.addEventListener('click', function() {
            // In a real app, you would upload the image to your server here
            // For this demo, we'll just proceed to the next page
            window.location.href = 'selfie-capture.html';
        });
    }
    
    // Selfie Capture Page
    if (document.getElementById('takePhotoBtn')) {
        const takePhotoBtn = document.getElementById('takePhotoBtn');
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const cameraPlaceholder = document.getElementById('cameraPlaceholder');
        const selfiePreview = document.getElementById('selfiePreview');
        const selfiePreviewContainer = document.getElementById('selfiePreviewContainer');
        const retakeSelfieBtn = document.getElementById('retakeSelfie');
        const continueToVerifyBtn = document.getElementById('continueToVerifyBtn');
        let stream = null;
        
        // Open camera
        takePhotoBtn.addEventListener('click', async function() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user' 
                    },
                    audio: false 
                });
                
                video.srcObject = stream;
                video.style.display = 'block';
                cameraPlaceholder.style.display = 'none';
                takePhotoBtn.innerHTML = '<i class="fas fa-camera"></i> Take Photo';
                takePhotoBtn.onclick = takePhoto;
                
            } catch (err) {
                console.error('Error accessing camera:', err);
                alert('Could not access the camera. Please make sure you have granted camera permissions.');
            }
        });
        
        // Take photo
        function takePhoto() {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Stop video stream
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            
            // Show preview
            selfiePreview.src = canvas.toDataURL('image/jpeg');
            video.style.display = 'none';
            selfiePreviewContainer.style.display = 'block';
            takePhotoBtn.style.display = 'none';
            continueToVerifyBtn.style.display = 'block';
        }
        
        // Retake photo
        retakeSelfieBtn.addEventListener('click', function() {
            selfiePreviewContainer.style.display = 'none';
            continueToVerifyBtn.style.display = 'none';
            takePhotoBtn.style.display = 'block';
            takePhotoBtn.click(); // Reopen camera
        });
        
        // Continue to verification
        continueToVerifyBtn.addEventListener('click', function() {
            // In a real app, you would upload the selfie to your server here
            // For this demo, we'll just proceed to the verification page
            window.location.href = 'verification-loading.html';
        });
    }
    
    // Verification Loading Page
    if (document.getElementById('loader')) {
        const loader = document.getElementById('loader');
        const successMessage = document.getElementById('successMessage');
        
        // Simulate verification process
        setTimeout(() => {
            loader.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Redirect to booking page after showing success message
            setTimeout(() => {
                window.location.href = 'booking.html';
            }, 2000);
            
        }, 3000); // 3 second delay for demo
    }
    
    // Handle back button to prevent going back to verification steps after completion
    window.addEventListener('popstate', function(event) {
        if (window.location.pathname.includes('verification-loading.html')) {
            window.history.forward();
        }
    });
    
    // Disable right-click context menu on verification pages
    document.addEventListener('contextmenu', function(e) {
        if (window.location.pathname.includes('verification') || 
            window.location.pathname.includes('selfie') || 
            window.location.pathname.includes('license')) {
            e.preventDefault();
        }
    }, false);
});

// Update the phone verification to redirect to license upload
document.addEventListener('DOMContentLoaded', function() {
    // This is for the phone verification page we created earlier
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', function() {
            // In a real app, you would verify the OTP first
            // For this demo, we'll just redirect to the license upload page
            window.location.href = 'license-upload.html';
        });
    }
});
