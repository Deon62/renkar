document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('carPhotos');
    const photoPreviews = document.getElementById('photoPreviews');

    // Handle photo previews
    photoInput.addEventListener('change', function(event) {
        const files = Array.from(event.target.files).slice(0, 4); // Limit to 4
        photoPreviews.innerHTML = ''; // Clear previous previews

        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('photo-preview');
                    img.alt = `Photo ${index + 1}`;
                    photoPreviews.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    });
});
