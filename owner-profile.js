document.addEventListener('DOMContentLoaded', () => {
    const statusToggle = document.getElementById('listToggle');
    const ownerStatus = document.getElementById('ownerStatus');
    const heroToggleLabel = statusToggle?.querySelector('.toggle-label');
    const heroToggleIndicator = statusToggle?.querySelector('.toggle-indicator');

    const ownerMoreModal = document.getElementById('ownerMoreModal');
    const ownerMoreOverlay = document.getElementById('ownerModalOverlay');
    const ownerMoreClose = document.getElementById('ownerCloseMore');
    const ownerLogout = document.getElementById('ownerLogout');
    const ownerLogoutAlt = document.getElementById('ownerLogoutAlt');
    const tabMore = document.getElementById('tabMore');
    const profileButton = document.getElementById('profileButton');
    const financesButton = document.getElementById('financesButton');

    statusToggle?.addEventListener('click', () => {
        const isActive = statusToggle.classList.toggle('active');
        statusToggle.setAttribute('aria-pressed', String(isActive));
        if (ownerStatus) {
            ownerStatus.textContent = isActive ? 'Cars Listed' : 'No Cars Listed';
        }
        if (heroToggleLabel) {
            heroToggleLabel.textContent = isActive ? 'Unlist Cars' : 'List Cars';
        }
        if (heroToggleIndicator) {
            heroToggleIndicator.style.background = isActive ? '#22c55e' : '#f97316';
            heroToggleIndicator.style.boxShadow = isActive
                ? '0 0 0 4px rgba(34, 197, 94, 0.25)'
                : '0 0 0 4px rgba(249, 115, 22, 0.2)';
        }
    });

    const openMoreModal = () => {
        ownerMoreModal?.classList.add('open');
        ownerMoreModal?.setAttribute('aria-hidden', 'false');
        document.body.classList.add('owner-modal-open');
    };

    const closeMoreModal = () => {
        ownerMoreModal?.classList.remove('open');
        ownerMoreModal?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('owner-modal-open');
    };

    tabMore?.addEventListener('click', openMoreModal);
    ownerMoreOverlay?.addEventListener('click', closeMoreModal);
    ownerMoreClose?.addEventListener('click', closeMoreModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && ownerMoreModal?.classList.contains('open')) {
            closeMoreModal();
        }
    });

    const handleLogout = () => {
        closeMoreModal();
        alert('You have been logged out.');
        window.location.href = 'index.html';
    };

    ownerLogout?.addEventListener('click', handleLogout);
    ownerLogoutAlt?.addEventListener('click', handleLogout);

    profileButton?.addEventListener('click', () => {
        closeMoreModal();
        // Already on profile page
    });

    financesButton?.addEventListener('click', () => {
        closeMoreModal();
        window.location.href = 'owner-finances.html';
    });
});
