document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const flow = urlParams.get('flow') || 'customer';

    const withFlow = (basePath) => {
        if (flow && flow !== 'customer') {
            const separator = basePath.includes('?') ? '&' : '?';
            return `${basePath}${separator}flow=${flow}`;
        }
        return basePath;
    };

    // License Upload Page
    if (document.getElementById('licenseUpload')) {
        const uploadArea = document.getElementById('uploadArea');
        const licenseUpload = document.getElementById('licenseUpload');
        const previewContainer = document.getElementById('previewContainer');
        const licensePreview = document.getElementById('licensePreview');
        const changeImageBtn = document.getElementById('changeImage');
        const continueBtn = document.getElementById('continueBtn');
        let licensePreviewUrl = null;

        const resetLicensePreview = () => {
            if (licensePreviewUrl) {
                URL.revokeObjectURL(licensePreviewUrl);
                licensePreviewUrl = null;
            }
            licensePreview.removeAttribute('src');
            licensePreview.removeAttribute('data-object-url');
        };

        const showUploadArea = () => {
            uploadArea.style.display = 'flex';
            previewContainer.style.display = 'none';
            continueBtn.disabled = true;
        };

        // Handle file upload
        uploadArea.addEventListener('click', () => licenseUpload.click());

        licenseUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];

            resetLicensePreview();

            if (file) {
                licensePreviewUrl = URL.createObjectURL(file);
                licensePreview.setAttribute('data-object-url', licensePreviewUrl);
                licensePreview.src = licensePreviewUrl;
                licensePreview.alt = `Selected license preview for ${file.name}`;
                uploadArea.style.display = 'none';
                previewContainer.style.display = 'block';
                continueBtn.disabled = false;
            } else {
                showUploadArea();
                licenseUpload.value = '';
            }
        });

        // Change image button
        changeImageBtn.addEventListener('click', () => {
            resetLicensePreview();
            showUploadArea();
            licenseUpload.value = '';
        });

        // Continue to selfie capture
        continueBtn.addEventListener('click', () => {
            resetLicensePreview();
            licenseUpload.value = '';
            showUploadArea();
            window.location.href = withFlow('selfie-capture.html');
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
        let selfiePreviewUrl = null;
        
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
        
        const clearSelfiePreview = () => {
            if (selfiePreviewUrl) {
                URL.revokeObjectURL(selfiePreviewUrl);
                selfiePreviewUrl = null;
            }
            selfiePreview.removeAttribute('src');
        };

        const stopStream = () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                stream = null;
            }
            if (video.srcObject) {
                video.srcObject = null;
            }
        };

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
                offsetX, offsetY, size, size,
                0, 0, canvas.width, canvas.height
            );
            context.restore();

            canvas.toBlob((blob) => {
                if (!blob) {
                    alert('Could not capture photo. Please try again.');
                    canvas.width = 0;
                    canvas.height = 0;
                    return;
                }

                clearSelfiePreview();
                selfiePreviewUrl = URL.createObjectURL(blob);
                selfiePreview.src = selfiePreviewUrl;

                stopStream();

                cameraContainer.style.display = 'none';
                selfiePreviewContainer.style.display = 'block';
                takePhotoBtn.style.display = 'none';

                canvas.width = 0;
                canvas.height = 0;
            }, 'image/jpeg', 0.85);
        }
        
        // Retake photo
        retakeSelfieBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Reset the UI
            clearSelfiePreview();
            selfiePreviewContainer.style.display = 'none';
            cameraPlaceholder.style.display = 'flex';
            cameraContainer.style.display = 'block';

            takePhotoBtn.style.display = 'block';
            takePhotoBtn.innerHTML = '<i class="fas fa-camera"></i> Take Photo';

            stopStream();

            takePhotoBtn.onclick = function() {
                initCamera();
            };

            setTimeout(() => {
                initCamera();
            }, 100);
        });
        
        // Initialize camera function
        async function initCamera() {
            try {
                stopStream();

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

                cameraControls.style.display = 'flex';

            } catch (err) {
                console.error('Error accessing camera:', err);
                alert('Could not access the camera. Please make sure you have granted camera permissions.');
            }
        }

        // Continue to verification
        continueToVerifyBtn.addEventListener('click', function() {
            clearSelfiePreview();
            stopStream();
            window.location.href = withFlow('verification-loading.html');
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
                window.location.href = flow === 'driver' ? 'driver.html' : 'booking.html';
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
