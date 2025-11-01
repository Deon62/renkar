document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('historyList');
    const historyEmpty = document.getElementById('historyEmpty');
    const tabs = document.querySelectorAll('.history-tab');
    const moreToggle = document.getElementById('historyMoreToggle');
    const moreModal = document.getElementById('historyMoreModal');
    const moreOverlay = document.getElementById('historyMoreOverlay');
    const closeMore = document.getElementById('historyCloseMore');
    const logoutButton = document.getElementById('historyLogoutButton');

    const carHistory = [
        {
            id: 1,
            vehicle: 'Toyota Axio',
            location: 'Nairobi → Naivasha',
            date: '15 Oct 2025',
            duration: '3 days',
            total: 'KES 7,500',
            status: 'completed',
            image: 'assets/cars/r3.jpg'
        },
        {
            id: 2,
            vehicle: 'Subaru Forester',
            location: 'Westlands → Nanyuki',
            date: '30 Sep 2025',
            duration: 'Weekend',
            total: 'KES 12,000',
            status: 'completed',
            image: 'assets/cars/r12.jpg'
        }
    ];

    const driverHistory = [
        {
            id: 101,
            driver: 'John Maina',
            route: 'Jomo Kenyatta Airport transfers',
            date: '22 Oct 2025',
            duration: 'Half day',
            total: 'KES 2,800',
            status: 'completed',
            avatar: 'https://i.pravatar.cc/150?u=driver-history-1'
        },
        {
            id: 102,
            driver: 'Brenda Chebet',
            route: 'Karen business meetings',
            date: '10 Sep 2025',
            duration: 'Full day',
            total: 'KES 4,500',
            status: 'completed',
            avatar: 'https://i.pravatar.cc/150?u=driver-history-2'
        }
    ];

    let activeMode = 'cars';

    function renderHistory(entries) {
        historyList.innerHTML = '';

        if (!entries.length) {
            historyEmpty.hidden = false;
            return;
        }

        historyEmpty.hidden = true;

        entries.forEach((entry) => {
            const card = document.createElement('article');
            card.className = `history-card${activeMode === 'drivers' ? ' driver' : ''}`;

            if (activeMode === 'cars') {
                card.innerHTML = `
                    <img src="${entry.image}" alt="${entry.vehicle}" onerror="this.src='https://via.placeholder.com/200x200?text=Car';">
                    <div class="card-info">
                        <h3>${entry.vehicle}</h3>
                        <div class="card-meta">
                            <span><i class="fas fa-map-marker-alt"></i>${entry.location}</span>
                            <span><i class="fas fa-calendar"></i>${entry.date}</span>
                            <span><i class="fas fa-clock"></i>${entry.duration}</span>
                        </div>
                        <div class="card-footer">
                            <span>${entry.total}</span>
                            <span class="status completed">Completed</span>
                        </div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <img src="${entry.avatar}" alt="${entry.driver}" onerror="this.src='https://via.placeholder.com/200x200?text=Driver';">
                    <div class="card-info">
                        <h3>${entry.driver}</h3>
                        <div class="card-meta">
                            <span><i class="fas fa-route"></i>${entry.route}</span>
                            <span><i class="fas fa-calendar"></i>${entry.date}</span>
                            <span><i class="fas fa-clock"></i>${entry.duration}</span>
                        </div>
                        <div class="card-footer">
                            <span>${entry.total}</span>
                            <span class="status completed">Completed</span>
                        </div>
                    </div>
                `;
            }

            historyList.appendChild(card);
        });
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;

            tabs.forEach(btn => btn.classList.remove('active'));
            tab.classList.add('active');
            tabs.forEach(btn => btn.setAttribute('aria-selected', btn === tab ? 'true' : 'false'));

            activeMode = tab.dataset.mode;
            renderHistory(activeMode === 'cars' ? carHistory : driverHistory);
        });
    });

    function openMoreModal() {
        if (!moreModal) return;
        moreModal.classList.add('open');
        moreModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('more-modal-open');
    }

    function closeMoreModal() {
        if (!moreModal) return;
        moreModal.classList.remove('open');
        moreModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('more-modal-open');
    }

    moreToggle?.addEventListener('click', openMoreModal);
    closeMore?.addEventListener('click', closeMoreModal);
    moreOverlay?.addEventListener('click', closeMoreModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && moreModal?.classList.contains('open')) {
            closeMoreModal();
        }
    });

    logoutButton?.addEventListener('click', () => {
        closeMoreModal();
        alert('You have been logged out.');
        window.location.href = 'index.html';
    });

    renderHistory(carHistory);
});
