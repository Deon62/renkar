document.addEventListener('DOMContentLoaded', function() {
    const loadingState = document.getElementById('loadingState');
    const successState = document.getElementById('successState');
    const progressFill = document.getElementById('progressFill');

    // Simulate verification process
    setTimeout(() => {
        // Start progress bar animation
        progressFill.style.width = '100%';
    }, 500);

    // Transition to success state after 6 seconds
    setTimeout(() => {
        loadingState.style.display = 'none';
        successState.style.display = 'block';
    }, 6000);
});
