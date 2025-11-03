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

    const tabMore = document.getElementById('tabMore');

    const ownerMoreModal = document.getElementById('ownerMoreModal');
    const ownerModalOverlay = document.getElementById('ownerModalOverlay');
    const ownerCloseMore = document.getElementById('ownerCloseMore');
    const profileButton = document.getElementById('profileButton');
    const financesButton = document.getElementById('financesButton');
    const supportButton = document.getElementById('supportButton');
    const ownerLogoutAlt = document.getElementById('ownerLogoutAlt');

    const financesState = {
        currentBalance: 15200,
        totalEarnings: 42500,
        totalWithdrawn: 27300,
        transactions: [
            {
                id: 'txn-304',
                date: 'Nov 1, 2023',
                description: 'Rental Income - Toyota Axio',
                amount: 2500,
                type: 'earning'
            },
            {
                id: 'txn-303',
                date: 'Oct 30, 2023',
                description: 'Withdrawal to M-PESA',
                amount: 5000,
                type: 'withdrawal'
            },
            {
                id: 'txn-302',
                date: 'Oct 29, 2023',
                description: 'Rental Income - Honda Fit',
                amount: 3000,
                type: 'earning'
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
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.setAttribute('role', 'listitem');

        const amountClass = transaction.type === 'earning' ? 'positive' : 'negative';
        const amountSymbol = transaction.type === 'earning' ? '+' : '-';

        item.innerHTML = `
            <div class="transaction-info">
                <span class="transaction-description">${transaction.description}</span>
                <span class="transaction-date">${transaction.date}</span>
            </div>
            <span class="transaction-amount ${amountClass}">${amountSymbol}${formatCurrency(transaction.amount).replace('KES ', '')}</span>
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

    const openOwnerMoreModal = () => {
        if (!ownerMoreModal) return;
        ownerMoreModal.classList.add('open');
        ownerMoreModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('owner-modal-open');
    };

    const closeOwnerMoreModal = () => {
        if (!ownerMoreModal) return;
        ownerMoreModal.classList.remove('open');
        ownerMoreModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('owner-modal-open');
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
            description: `${method} Withdrawal`,
            amount,
            type: 'withdrawal'
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

        if (ownerMoreModal?.classList.contains('open')) {
            closeOwnerMoreModal();
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

    const attachOwnerModalGestures = () => {
        if (!ownerMoreModal) return;
        const modalContent = ownerMoreModal.querySelector('.owner-modal-content');
        if (!modalContent) return;

        let startY = null;

        const onPointerDown = (evt) => {
            startY = getClientY(evt);
        };

        const onPointerUp = (evt) => {
            if (startY == null) return;
            const endY = getClientY(evt);
            if (endY != null && endY - startY > 60) {
                closeOwnerMoreModal();
            }
            startY = null;
        };

        modalContent.addEventListener('pointerdown', onPointerDown);
        modalContent.addEventListener('pointerup', onPointerUp);
        modalContent.addEventListener('touchstart', onPointerDown, { passive: true });
        modalContent.addEventListener('touchend', onPointerUp, { passive: true });
    };

    const attachNavigationListeners = () => {
        tabMore?.addEventListener('click', openOwnerMoreModal);

        ownerModalOverlay?.addEventListener('click', closeOwnerMoreModal);
        ownerCloseMore?.addEventListener('click', closeOwnerMoreModal);

        profileButton?.addEventListener('click', () => {
            closeOwnerMoreModal();
            window.location.href = 'owner-profile.html';
        });

        financesButton?.addEventListener('click', closeOwnerMoreModal);

        supportButton?.addEventListener('click', () => {
            closeOwnerMoreModal();
            alert('Support page coming soon!');
        });

        ownerLogoutAlt?.addEventListener('click', () => {
            closeOwnerMoreModal();
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
    attachOwnerModalGestures();
    attachNavigationListeners();
    renderSummary();
    renderTransactions();
});
