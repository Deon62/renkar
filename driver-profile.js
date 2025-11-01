document.addEventListener('DOMContentLoaded', () => {
    const statusToggle = document.getElementById('statusToggle');
    const driverStatus = document.getElementById('driverStatus');
    const heroToggleLabel = statusToggle?.querySelector('.toggle-label');
    const heroToggleIndicator = statusToggle?.querySelector('.toggle-indicator');

    const driverMoreModal = document.getElementById('driverMoreModal');
    const driverMoreOverlay = document.getElementById('driverModalOverlay');
    const driverMoreClose = document.getElementById('driverCloseMore');
    const driverLogout = document.getElementById('driverLogout');
    const driverLogoutAlt = document.getElementById('driverLogoutAlt');
    const tabButtons = document.querySelectorAll('.driver-nav-item[data-target]');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const tabMore = document.getElementById('tabMore');
    const tabOpenRequests = document.getElementById('tabOpenRequests');
    const tabLastBookings = document.getElementById('tabLastBookings');
    const profileButton = document.getElementById('profileButton');
    const financesButton = document.getElementById('financesButton');

    statusToggle?.addEventListener('click', () => {
        const isActive = statusToggle.classList.toggle('active');
        statusToggle.setAttribute('aria-pressed', String(isActive));
        if (driverStatus) {
            driverStatus.textContent = isActive ? 'Currently Online' : 'Currently Offline';
        }
        if (heroToggleLabel) {
            heroToggleLabel.textContent = isActive ? 'Go Offline' : 'Go Online';
        }
        if (heroToggleIndicator) {
            heroToggleIndicator.style.background = isActive ? '#22c55e' : '#f97316';
            heroToggleIndicator.style.boxShadow = isActive
                ? '0 0 0 4px rgba(34, 197, 94, 0.25)'
                : '0 0 0 4px rgba(249, 115, 22, 0.2)';
        }
    });

    const openMoreModal = () => {
        driverMoreModal?.classList.add('open');
        driverMoreModal?.setAttribute('aria-hidden', 'false');
        document.body.classList.add('driver-modal-open');
    };

    const closeMoreModal = () => {
        driverMoreModal?.classList.remove('open');
        driverMoreModal?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('driver-modal-open');
    };

    tabMore?.addEventListener('click', openMoreModal);
    driverMoreOverlay?.addEventListener('click', closeMoreModal);
    driverMoreClose?.addEventListener('click', closeMoreModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && driverMoreModal?.classList.contains('open')) {
            closeMoreModal();
        }
    });

    const setActiveTab = (button) => {
        tabButtons.forEach((btn) => {
            const isActive = btn === button;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
        });

        tabPanels.forEach((panel) => {
            const shouldShow = panel.id === button.dataset.target;
            panel.toggleAttribute('hidden', !shouldShow);
            panel.classList.toggle('active', shouldShow);
        });
    };

    if (tabPanels.length) {
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => setActiveTab(button));
            if (index === 0) {
                setActiveTab(button);
            }
        });
    } else {
        tabMore?.classList.add('active');
        tabMore?.setAttribute('aria-selected', 'true');
    }

    const navigateToDriver = (tab) => {
        const params = new URLSearchParams();
        if (tab) {
            params.set('tab', tab);
        }
        const query = params.toString();
        window.location.href = `driver.html${query ? `?${query}` : ''}`;
    };

    tabOpenRequests?.addEventListener('click', () => navigateToDriver('openRequests'));
    tabLastBookings?.addEventListener('click', () => navigateToDriver('lastBookings'));

    const handleLogout = () => {
        closeMoreModal();
        alert('You have been logged out.');
        window.location.href = 'index.html';
    };

    driverLogout?.addEventListener('click', handleLogout);
    driverLogoutAlt?.addEventListener('click', handleLogout);

    profileButton?.addEventListener('click', () => {
        closeMoreModal();
        window.location.href = 'driver-profile.html';
    });

    financesButton?.addEventListener('click', () => {
        closeMoreModal();
        window.location.href = 'driver-finances.html';
    });
});
