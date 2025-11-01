document.addEventListener('DOMContentLoaded', () => {
    const aboutMoreToggle = document.getElementById('aboutMoreToggle');
    const aboutMoreModal = document.getElementById('aboutMoreModal');
    const aboutMoreOverlay = document.getElementById('aboutMoreOverlay');
    const aboutMoreClose = document.getElementById('aboutMoreClose');
    const aboutLogout = document.getElementById('aboutLogout');

    const openMoreModal = () => {
        aboutMoreModal?.classList.add('open');
        aboutMoreModal?.setAttribute('aria-hidden', 'false');
        document.body.classList.add('more-modal-open');
    };

    const closeMoreModal = () => {
        aboutMoreModal?.classList.remove('open');
        aboutMoreModal?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('more-modal-open');
    };

    aboutMoreToggle?.addEventListener('click', openMoreModal);
    aboutMoreOverlay?.addEventListener('click', closeMoreModal);
    aboutMoreClose?.addEventListener('click', closeMoreModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && aboutMoreModal?.classList.contains('open')) {
            closeMoreModal();
        }
    });

    aboutLogout?.addEventListener('click', () => {
        closeMoreModal();
        alert('You have been logged out.');
        window.location.href = 'index.html';
    });
});
