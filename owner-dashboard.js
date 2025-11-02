function openMoreModal() {
    document.getElementById('moreModal').classList.add('open');
    document.body.classList.add('more-modal-open');
}

function viewCarDetails(carId) {
    // Placeholder for car details
    document.getElementById('carDetailsModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('moreModal').classList.remove('open');
    document.body.classList.remove('more-modal-open');
    document.getElementById('carDetailsModal').style.display = 'none';
}
