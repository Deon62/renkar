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
        const cameraContainer = document.getElementById('cameraContainer');
        const selfiePreview = document.getElementById('selfiePreview');
        const selfiePreviewContainer = document.getElementById('selfiePreviewContainer');
        const retakeSelfieBtn = document.getElementById('retakeSelfie');
        const continueToVerifyBtn = document.getElementById('continueToVerifyBtn');
        const cameraControls = document.querySelector('.camera-controls');
        let stream = null;
        
        // Open camera
        takePhotoBtn.addEventListener('click', async function() {
            await initCamera();
        });
        
        // Initialize camera on page load if we're on the selfie capture page
        if (window.location.pathname.includes('selfie-capture')) {
            // Show the camera controls
            cameraControls.style.display = 'flex';
            cameraControls.style.justifyContent = 'center';
        }
        
        // Take photo
        function takePhoto() {
            const context = canvas.getContext('2d');
            const size = Math.min(video.videoWidth, video.videoHeight);
            const offsetX = (video.videoWidth - size) / 2;
            const offsetY = (video.videoHeight - size) / 2;
            
            // Set canvas to the size of the circular preview
            canvas.width = 500;
            canvas.height = 500;
            
            // Draw the circular mask
            context.save();
            context.beginPath();
            context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
            context.closePath();
            context.clip();
            
            // Draw the video frame centered and cropped to a circle
            context.drawImage(
                video, 
                offsetX, offsetY, size, size,  // source rectangle
                0, 0, canvas.width, canvas.height  // destination rectangle
            );
            context.restore();
            
            // Stop video stream
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            
            // Show preview and hide camera
            selfiePreview.src = canvas.toDataURL('image/jpeg');
            cameraContainer.style.display = 'none';
            selfiePreviewContainer.style.display = 'block';
            takePhotoBtn.style.display = 'none'; // Hide the take photo button
        }
        
        // Retake photo
        retakeSelfieBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Reset the UI
            selfiePreviewContainer.style.display = 'none';
            cameraPlaceholder.style.display = 'flex';
            cameraContainer.style.display = 'block';
            
            // Reset the take photo button
            takePhotoBtn.style.display = 'block';
            takePhotoBtn.innerHTML = '<i class="fas fa-camera"></i> Take Photo';
            
            // Reinitialize camera
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                stream = null;
            }
            
            // Reopen camera
            takePhotoBtn.onclick = function() {
                initCamera();
            };
            
            // Force a small delay to ensure camera is properly reset
            setTimeout(() => {
                initCamera();
            }, 100);
        });
        
        // Initialize camera function
        async function initCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        width: { ideal: 1280 },
                        height: { ideal: 1280 },
                        aspectRatio: 1,
                        facingMode: 'user' 
                    },
                    audio: false 
                });
                
                video.srcObject = stream;
                video.style.display = 'block';
                cameraPlaceholder.style.display = 'none';
                takePhotoBtn.innerHTML = '<i class="fas fa-camera"></i> Take Photo';
                takePhotoBtn.onclick = takePhoto;
                
                // Show the camera controls
                cameraControls.style.display = 'flex';
                
            } catch (err) {
                console.error('Error accessing camera:', err);
                alert('Could not access the camera. Please make sure you have granted camera permissions.');
            }
        }
        
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
