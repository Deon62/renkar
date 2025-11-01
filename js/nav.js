document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const navPanel = document.getElementById('navPanel');
    const overlay = document.getElementById('overlay');
    const body = document.body;

    // Toggle menu panel
    function toggleMenu() {
        navPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Toggle body scroll lock when menu is open
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        body.style.overflow = !isExpanded ? 'hidden' : '';
    }

    // Open menu
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close menu
    function closeMenuHandler() {
        navPanel.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
    }

    // Close menu when clicking the close button
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuHandler);
    }

    // Close menu when clicking outside
    overlay.addEventListener('click', closeMenuHandler);

    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenuHandler);
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navPanel.classList.contains('active')) {
            closeMenuHandler();
        }
    });

    // Add scroll effect to navbar
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
            navbar.classList.add('scrolled');
        }
        
        lastScroll = currentScroll;
    });
});
