document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Modal functions
    window.openBookingModal = function(bookingId) {
        document.getElementById('bookingModal').classList.add('show');
    };

    window.openMoreModal = function() {
        document.getElementById('moreModal').classList.add('open');
        document.body.classList.add('more-modal-open');
    };

    window.closeModal = function() {
        document.getElementById('bookingModal').classList.remove('show');
        document.getElementById('moreModal').classList.remove('open');
        document.body.classList.remove('more-modal-open');
    };

    // Modal actions (placeholders)
    window.markCompleted = function() {
        alert('Booking marked as completed');
        closeModal();
    };

    window.cancelBooking = function() {
        if (confirm('Are you sure you want to cancel this booking?')) {
            alert('Booking cancelled');
            closeModal();
        }
    };
});
