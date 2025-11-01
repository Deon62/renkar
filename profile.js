document.addEventListener('DOMContentLoaded', () => {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const addPaymentBtn = document.getElementById('addPaymentBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    const moreLogoutBtn = document.getElementById('moreLogout');

    const profileMoreToggle = document.getElementById('profileMoreToggle');
    const profileMoreModal = document.getElementById('profileMoreModal');
    const profileMoreOverlay = document.getElementById('profileMoreOverlay');
    const profileMoreClose = document.getElementById('profileMoreClose');

    const editProfileModal = document.getElementById('editProfileModal');
    const paymentModal = document.getElementById('paymentModal');
    const logoutModal = document.getElementById('logoutModal');

    const modals = [editProfileModal, paymentModal, logoutModal];

    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const attachCloseHandlers = (modal) => {
        modal?.querySelectorAll('[data-close]').forEach((el) => {
            el.addEventListener('click', () => closeModal(modal));
        });
    };

    modals.forEach(attachCloseHandlers);

    editProfileBtn?.addEventListener('click', () => openModal(editProfileModal));
    addPaymentBtn?.addEventListener('click', () => openModal(paymentModal));
    logoutBtn?.addEventListener('click', () => openModal(logoutModal));

    confirmLogoutBtn?.addEventListener('click', () => {
        alert('You have been logged out.');
        window.location.href = 'index.html';
    });

    profileMoreToggle?.addEventListener('click', () => {
        profileMoreModal?.classList.add('open');
        profileMoreModal?.setAttribute('aria-hidden', 'false');
        document.body.classList.add('more-modal-open');
    });

    const closeMoreModal = () => {
        profileMoreModal?.classList.remove('open');
        profileMoreModal?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('more-modal-open');
    };

    profileMoreClose?.addEventListener('click', closeMoreModal);
    profileMoreOverlay?.addEventListener('click', closeMoreModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modals.forEach((modal) => {
                if (modal?.classList.contains('show')) closeModal(modal);
            });
            if (profileMoreModal?.classList.contains('open')) closeMoreModal();
        }
    });

    document.querySelectorAll('.modal').forEach((modal) => {
        modal.addEventListener('click', (event) => {
            if (event.target.matches('[data-close]')) return;
            if (event.target === modal) closeModal(modal);
        });
    });

    document.getElementById('paymentForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Payment method linked successfully.');
        closeModal(paymentModal);
    });

    document.getElementById('editProfileForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Profile updated successfully.');
        closeModal(editProfileModal);
    });

    moreLogoutBtn?.addEventListener('click', () => {
        closeMoreModal();
        openModal(logoutModal);
    });
});
