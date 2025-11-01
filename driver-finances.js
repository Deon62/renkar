'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const currentBalanceEl = document.getElementById('currentBalance');
    const totalEarningsEl = document.getElementById('totalEarnings');
    const totalWithdrawnEl = document.getElementById('totalWithdrawn');
    const transactionsListEl = document.getElementById('transactionsList');
    const withdrawButton = document.getElementById('withdrawButton');
    const viewAllButton = document.getElementById('viewAllTransactions');

    const withdrawModal = document.getElementById('withdrawModal');
    const withdrawOverlay = document.getElementById('withdrawOverlay');
    const withdrawClose = document.getElementById('withdrawClose');
    const withdrawForm = document.getElementById('withdrawForm');

    const tabOpenRequests = document.getElementById('tabOpenRequests');
    const tabLastBookings = document.getElementById('tabLastBookings');
    const tabMore = document.getElementById('tabMore');

    const driverMoreModal = document.getElementById('driverMoreModal');
    const driverModalOverlay = document.getElementById('driverModalOverlay');
    const driverCloseMore = document.getElementById('driverCloseMore');
    const profileButton = document.getElementById('profileButton');
    const financesButton = document.getElementById('financesButton');
    const logoutButton = document.getElementById('logoutButton');

    const financesState = {
        currentBalance: 42500,
        totalEarnings: 92400,
        totalWithdrawn: 36800,
        transactions: [
            {
                id: 'txn-204',
                date: '31 Oct 2025',
                label: 'Airport Transfer - JKIA',
                amount: 6500,
                type: 'earning',
                status: 'completed'
            },
            {
                id: 'txn-203',
                date: '28 Oct 2025',
                label: 'Weekly Withdrawal',
                amount: 15000,
                type: 'withdrawal',
                status: 'completed'
            },
            {
                id: 'txn-202',
                date: '26 Oct 2025',
                label: 'Corporate Shuttle',
                amount: 8700,
                type: 'earning',
                status: 'completed'
            },
            {
                id: 'txn-201',
                date: '23 Oct 2025',
                label: 'Fuel Reimbursement',
                amount: 3200,
                type: 'earning',
                status: 'processing'
            }
        ]
    };

    const formatCurrency = (value) => `KES ${value.toLocaleString('en-KE')}`;

    const renderSummary = () => {
        currentBalanceEl.textContent = formatCurrency(financesState.currentBalance);
        totalEarningsEl.textContent = formatCurrency(financesState.totalEarnings);
        totalWithdrawnEl.textContent = formatCurrency(financesState.totalWithdrawn);
    };

    const buildTransactionItem = (transaction) => {
        const item = document.createElement('article');
        item.className = 'transaction-item';
        item.setAttribute('role', 'listitem');

        const amountClass = transaction.type === 'earning' ? 'positive' : 'negative';
        const amountSymbol = transaction.type === 'earning' ? '+' : '-';

        item.innerHTML = `
            <div class="transaction-main">
                <h3>${transaction.label}</h3>
                <p class="transaction-date">${transaction.date}</p>
            </div>
            <div class="transaction-meta">
                <span class="transaction-amount ${amountClass}">${amountSymbol}${formatCurrency(transaction.amount).replace('KES ', '')}</span>
                <span class="transaction-status status-${transaction.status}">${transaction.status}</span>
            </div>
        `;

        return item;
    };

    const renderTransactions = () => {
        transactionsListEl.innerHTML = '';

        if (!financesState.transactions.length) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'You have no transactions yet. Earnings and withdrawals will appear here once available.';
            transactionsListEl.appendChild(empty);
            viewAllButton.hidden = true;
            return;
        }

        financesState.transactions.forEach((transaction) => {
            transactionsListEl.appendChild(buildTransactionItem(transaction));
        });

        viewAllButton.hidden = false;
    };

    const navigateToDriver = (tab) => {
        const params = new URLSearchParams();
        if (tab) {
            params.set('tab', tab);
        }
        const query = params.toString();
        window.location.href = `driver.html${query ? `?${query}` : ''}`;
    };

    const openDriverMoreModal = () => {
        if (!driverMoreModal) return;
        driverMoreModal.classList.add('open');
        driverMoreModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('driver-modal-open');
    };

    const closeDriverMoreModal = () => {
        if (!driverMoreModal) return;
        driverMoreModal.classList.remove('open');
        driverMoreModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('driver-modal-open');
    };

    const openWithdrawModal = () => {
        withdrawModal.classList.add('open');
        withdrawModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('withdraw-open');
        const firstInput = withdrawForm.querySelector('input[name="method"]');
        firstInput?.focus({ preventScroll: true });
    };

    const closeWithdrawModal = () => {
        withdrawModal.classList.remove('open');
        withdrawModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('withdraw-open');
        withdrawForm.reset();
    };

    const handleWithdrawSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(withdrawForm);
        const method = formData.get('method');
        const number = formData.get('number');
        const amount = Number(formData.get('amount'));

        if (!method || !number || Number.isNaN(amount) || amount <= 0) {
            alert('Please complete all fields with valid details.');
            return;
        }

        if (amount > financesState.currentBalance) {
            alert('Withdrawal amount cannot exceed your current balance.');
            return;
        }

        financesState.currentBalance -= amount;
        financesState.totalWithdrawn += amount;
        financesState.transactions.unshift({
            id: `txn-${Date.now()}`,
            date: new Date().toLocaleDateString('en-KE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            label: `${method} Withdrawal`,
            amount,
            type: 'withdrawal',
            status: 'processing'
        });

        renderSummary();
        renderTransactions();
        closeWithdrawModal();
        alert(`Withdrawal of ${formatCurrency(amount)} requested. We will notify you once it is processed.`);
    };

    const handleKeydown = (event) => {
        if (event.key !== 'Escape') return;

        if (withdrawModal.classList.contains('open')) {
            closeWithdrawModal();
        }

        if (driverMoreModal?.classList.contains('open')) {
            closeDriverMoreModal();
        }
    };

    const getClientY = (evt) => {
        if (evt.touches && evt.touches.length) {
            return evt.touches[0].clientY;
        }
        if (evt.changedTouches && evt.changedTouches.length) {
            return evt.changedTouches[0].clientY;
        }
        return evt.clientY ?? null;
    };

    const attachWithdrawModalGestures = () => {
        const modalContent = withdrawModal.querySelector('.modal-content');
        if (!modalContent) return;
        let startY = null;

        const onPointerDown = (evt) => {
            startY = getClientY(evt);
        };

        const onPointerUp = (evt) => {
            if (startY == null) return;
            const endY = getClientY(evt);
            if (endY != null && endY - startY > 60) {
                closeWithdrawModal();
            }
            startY = null;
        };

        modalContent.addEventListener('pointerdown', onPointerDown);
        modalContent.addEventListener('pointerup', onPointerUp);
        modalContent.addEventListener('touchstart', onPointerDown, { passive: true });
        modalContent.addEventListener('touchend', onPointerUp, { passive: true });
    };

    const attachDriverModalGestures = () => {
        if (!driverMoreModal) return;
        const modalContent = driverMoreModal.querySelector('.driver-modal-content');
        if (!modalContent) return;

        let startY = null;

        const onPointerDown = (evt) => {
            startY = getClientY(evt);
        };

        const onPointerUp = (evt) => {
            if (startY == null) return;
            const endY = getClientY(evt);
            if (endY != null && endY - startY > 60) {
                closeDriverMoreModal();
            }
            startY = null;
        };

        modalContent.addEventListener('pointerdown', onPointerDown);
        modalContent.addEventListener('pointerup', onPointerUp);
        modalContent.addEventListener('touchstart', onPointerDown, { passive: true });
        modalContent.addEventListener('touchend', onPointerUp, { passive: true });
    };

    const attachNavigationListeners = () => {
        tabOpenRequests?.addEventListener('click', () => navigateToDriver('openRequests'));
        tabLastBookings?.addEventListener('click', () => navigateToDriver('lastBookings'));
        tabMore?.addEventListener('click', openDriverMoreModal);

        driverModalOverlay?.addEventListener('click', closeDriverMoreModal);
        driverCloseMore?.addEventListener('click', closeDriverMoreModal);

        profileButton?.addEventListener('click', () => {
            closeDriverMoreModal();
            window.location.href = 'driver-profile.html';
        });

        financesButton?.addEventListener('click', closeDriverMoreModal);

        logoutButton?.addEventListener('click', () => {
            closeDriverMoreModal();
            alert('You have been logged out.');
            window.location.href = 'index.html';
        });
    };

    withdrawButton.addEventListener('click', openWithdrawModal);
    withdrawOverlay.addEventListener('click', closeWithdrawModal);
    withdrawClose.addEventListener('click', closeWithdrawModal);
    withdrawForm.addEventListener('submit', handleWithdrawSubmit);
    document.addEventListener('keydown', handleKeydown);
    viewAllButton.addEventListener('click', () => {
        alert('Viewing the full transaction history will be available soon.');
    });

    attachWithdrawModalGestures();
    attachDriverModalGestures();
    attachNavigationListeners();
    renderSummary();
    renderTransactions();
});
