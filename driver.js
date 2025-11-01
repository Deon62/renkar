document.addEventListener('DOMContentLoaded', () => {
    const openRequestsList = document.getElementById('openRequestsList');
    const lastBookingsList = document.getElementById('lastBookingsList');

    const tabButtons = document.querySelectorAll('.driver-nav-item[data-target]');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const moreToggle = document.getElementById('tabMore');
    const modal = document.getElementById('driverMoreModal');
    const modalOverlay = document.getElementById('driverModalOverlay');
    const modalClose = document.getElementById('driverCloseMore');

    const profileButton = document.getElementById('profileButton');
    const financesButton = document.getElementById('financesButton');
    const logoutButton = document.getElementById('logoutButton');

    const openRequests = [
        {
            id: 1,
            car: 'Toyota Axio',
            image: 'assets/cars/r4.jpg',
            location: 'Westlands → Jomo Kenyatta Airport',
            duration: '2 hrs • 14:00 - 16:00',
            payout: 'KES 4,800',
            note: 'Customer needs assistance with luggage'
        },
        {
            id: 2,
            car: 'Nissan Note',
            image: 'assets/cars/r7.jpg',
            location: 'Upper Hill → Karen',
            duration: 'Half day • 09:00 - 14:00',
            payout: 'KES 6,200',
            note: 'Corporate transfer, two passengers'
        },
        {
            id: 3,
            car: 'Mazda CX-5',
            image: 'assets/cars/r12.jpg',
            location: 'CBD → Gigiri',
            duration: 'Full day • 08:00 - 18:00',
            payout: 'KES 8,900',
            note: 'Meet-and-greet at the client office'
        }
    ];

    const lastBookings = [
        {
            id: 101,
            title: 'Jomo Kenyatta Airport Drop',
            details: '2 hrs • 18 km • 28 Oct',
            payout: 'KES 4,500'
        },
        {
            id: 102,
            title: 'Karen Day Hire',
            details: '8 hrs • 63 km • 26 Oct',
            payout: 'KES 11,200'
        },
        {
            id: 103,
            title: 'Corporate Shuttle',
            details: '5 hrs • 42 km • 22 Oct',
            payout: 'KES 7,350'
        }
    ];

    const renderOpenRequests = (requests) => {
        openRequestsList.innerHTML = '';

        if (!requests.length) {
            openRequestsList.innerHTML = '<p class="empty-state">You have no open requests right now. Check back in a few minutes.</p>';
            return;
        }

        requests.forEach((request) => {
            const card = document.createElement('article');
            card.className = 'request-card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-image">
                        <img src="${request.image}" alt="${request.car}" onerror="this.src='https://via.placeholder.com/200x200?text=Car';">
                    </div>
                    <div class="card-info">
                        <h3>${request.car}</h3>
                        <p>${request.location}</p>
                        <div class="card-meta">
                            <span class="meta-pill"><i class="fas fa-clock"></i>${request.duration}</span>
                            <span class="meta-pill"><i class="fas fa-coins"></i>${request.payout}</span>
                        </div>
                    </div>
                </div>
                <div class="request-actions">
                    <p class="earnings-tag"><i class="fas fa-info-circle"></i> ${request.note}</p>
                    <button class="accept-btn" data-request-id="${request.id}">
                        <i class="fas fa-check"></i>
                        Accept Request
                    </button>
                </div>
            `;
            openRequestsList.appendChild(card);
        });
    };

    const renderLastBookings = (bookings) => {
        lastBookingsList.innerHTML = '';

        if (!bookings.length) {
            lastBookingsList.innerHTML = '<p class="empty-state">No completed trips yet. Once you complete trips, they will show here.</p>';
            return;
        }

        bookings.forEach((booking) => {
            const card = document.createElement('article');
            card.className = 'booking-card';
            card.innerHTML = `
                <div class="booking-summary">
                    <h3>${booking.title}</h3>
                    <p>${booking.details}</p>
                </div>
                <div class="booking-footer">
                    <span><i class="fas fa-wallet"></i> Total Earned</span>
                    <strong>${booking.payout}</strong>
                </div>
            `;
            lastBookingsList.appendChild(card);
        });
    };

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

    const openModal = () => {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('driver-modal-open');
    };

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('driver-modal-open');
    };

    const attachEvents = () => {
        tabButtons.forEach((button) => {
            button.addEventListener('click', () => setActiveTab(button));
        });

        moreToggle.addEventListener('click', openModal);
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });

        let startY = null;
        const modalContent = modal.querySelector('.driver-modal-content');

        const onPointerDown = (event) => {
            startY = event.clientY || (event.touches ? event.touches[0].clientY : null);
        };

        const onPointerUp = (event) => {
            if (!startY) return;
            const endY = event.clientY || (event.changedTouches ? event.changedTouches[0].clientY : startY);
            if (endY - startY > 60) {
                closeModal();
            }
            startY = null;
        };

        modalContent.addEventListener('pointerdown', onPointerDown);
        modalContent.addEventListener('pointerup', onPointerUp);
        modalContent.addEventListener('touchstart', onPointerDown, { passive: true });
        modalContent.addEventListener('touchend', onPointerUp, { passive: true });

        openRequestsList.addEventListener('click', (event) => {
            const button = event.target.closest('.accept-btn');
            if (!button) return;

            const requestId = Number(button.dataset.requestId);
            const request = openRequests.find((item) => item.id === requestId);
            if (!request) return;

            button.disabled = true;
            button.classList.add('accepted');
            button.innerHTML = '<i class="fas fa-check-double"></i> Request Accepted';

            setTimeout(() => {
                const card = button.closest('.request-card');
                card?.classList.add('accepted-card');
                card?.addEventListener('animationend', () => {
                    card.remove();
                    const remaining = openRequestsList.querySelectorAll('.request-card').length;
                    if (!remaining) {
                        renderOpenRequests([]);
                    }
                }, { once: true });
            }, 900);
        });

        profileButton?.addEventListener('click', () => {
            closeModal();
            alert('Profile management coming soon.');
        });

        financesButton?.addEventListener('click', () => {
            closeModal();
            window.location.href = 'driver-finances.html';
        });

        logoutButton?.addEventListener('click', () => {
            closeModal();
            alert('You have been logged out.');
            window.location.href = 'index.html';
        });
    };

    renderOpenRequests(openRequests);
    renderLastBookings(lastBookings);
    attachEvents();
});
