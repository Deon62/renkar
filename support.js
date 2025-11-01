document.addEventListener('DOMContentLoaded', () => {
    const chatThread = document.getElementById('chatThread');
    const chatForm = document.getElementById('chatForm');
    const chatMessageInput = document.getElementById('chatMessage');
    const typingIndicator = document.getElementById('typingIndicator');
    const handoffBtn = document.getElementById('handoffBtn');
    const callSupportBtn = document.getElementById('callSupport');
    const attachBtn = document.getElementById('attachBtn');

    const supportMoreToggle = document.getElementById('supportMoreToggle');
    const supportMoreModal = document.getElementById('supportMoreModal');
    const supportMoreOverlay = document.getElementById('supportMoreOverlay');
    const supportMoreClose = document.getElementById('supportMoreClose');
    const supportLogout = document.getElementById('supportLogout');

    let typingTimeout;

    const scrollToBottom = () => {
        chatThread?.scrollTo({ top: chatThread.scrollHeight, behavior: 'smooth' });
    };

    const appendMessage = ({ message, sender }) => {
        if (!chatThread) return;
        const wrapper = document.createElement('div');
        wrapper.className = `chat-message ${sender}`;
        wrapper.innerHTML = `
            <div class="bubble">${message}</div>
            <time>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
        `;
        chatThread.appendChild(wrapper);
        scrollToBottom();
    };

    const showAgentReply = () => {
        if (!typingIndicator) return;
        typingIndicator.hidden = false;
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            typingIndicator.hidden = true;
            appendMessage({
                message: 'Thanks for the update! I’ve alerted your driver and will confirm their ETA shortly.',
                sender: 'agent'
            });
        }, 1800);
    };

    chatForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = chatMessageInput?.value.trim();
        if (!value) return;
        appendMessage({ message: value, sender: 'user' });
        chatMessageInput.value = '';
        showAgentReply();
    });

    chatMessageInput?.addEventListener('input', () => {
        clearTimeout(typingTimeout);
        if (typingIndicator) typingIndicator.hidden = true;
    });

    handoffBtn?.addEventListener('click', () => {
        appendMessage({
            message: 'No problem — I’ll connect you with a senior specialist in just a moment.',
            sender: 'agent'
        });
        showAgentReply();
    });

    attachBtn?.addEventListener('click', () => {
        alert('File attachments will be supported soon. For now, share details in the chat.');
    });

    callSupportBtn?.addEventListener('click', () => {
        window.location.href = 'tel:+254711234567';
    });

    const openMoreModal = () => {
        supportMoreModal?.classList.add('open');
        supportMoreModal?.setAttribute('aria-hidden', 'false');
        document.body.classList.add('more-modal-open');
    };

    const closeMoreModal = () => {
        supportMoreModal?.classList.remove('open');
        supportMoreModal?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('more-modal-open');
    };

    supportMoreToggle?.addEventListener('click', openMoreModal);
    supportMoreClose?.addEventListener('click', closeMoreModal);
    supportMoreOverlay?.addEventListener('click', closeMoreModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && supportMoreModal?.classList.contains('open')) {
            closeMoreModal();
        }
    });

    supportLogout?.addEventListener('click', () => {
        closeMoreModal();
        alert('You have been logged out.');
        window.location.href = 'index.html';
    });
});
