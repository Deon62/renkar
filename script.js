// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

// Handle navbar scroll effect
const handleScroll = () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};

// Carousel functionality
const initCarousel = () => {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    let currentSlide = 0;
    const totalSlides = slides.length;

    const showSlide = (index) => {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        showSlide((currentSlide + 1) % totalSlides);
    };

    const prevSlide = () => {
        showSlide((currentSlide - 1 + totalSlides) % totalSlides);
    };

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance on hover
    const carousel = document.querySelector('.carousel-container');
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Initialize first slide
    showSlide(0);
};

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.carousel-container')) {
        initCarousel();
    }
    
    // Initialize FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Close FAQ when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.faq-item')) {
            faqItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize animations on scroll
const initScrollAnimations = () => {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.step, .card, .cta-content, .cta-image');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
};

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const createObserver = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const handleIntersect = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('step')) {
                    entry.target.style.animationDelay = `${entry.target.dataset.delay || '0s'}`;
                }
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all sections and elements that should animate
    const sections = document.querySelectorAll('section, .step, .card, .car-image');
    sections.forEach((section, index) => {
        if (section.classList.contains('step')) {
            section.dataset.delay = `${0.2 * index}s`;
        }
        observer.observe(section);
    });
};

// Initialize scroll animations for timeline
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTimelineAnimations();
    // Initialize scroll event for navbar
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    // Initialize menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Initialize phone number input formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Handle form submission
    const form = document.querySelector('.phone-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const phoneInput = this.querySelector('input[type="tel"]');
            if (phoneInput && phoneInput.value) {
                // Here you would typically send the OTP
                alert('Verification code sent to ' + phoneInput.value);
                this.reset();
            }
        });
    }
});

// Add button press effect
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    const handlePress = () => {
        button.style.transform = 'translateY(2px)';
    };
    
    const resetPress = () => {
        button.style.transform = 'translateY(0)';
    };
    
    // Mouse events
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', resetPress);
    button.addEventListener('mouseleave', resetPress);
    
    // Touch events
    button.addEventListener('touchstart', handlePress, { passive: true });
    button.addEventListener('touchend', resetPress, { passive: true });
    button.addEventListener('touchcancel', resetPress, { passive: true });
    
    // Add ripple effect
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Performance optimizations
const optimizePerformance = () => {
    const elements = document.querySelectorAll('.step, .card, .cta-content, .cta-image');
    elements.forEach(el => {
        el.style.willChange = 'transform, opacity';
        el.style.backfaceVisibility = 'hidden';
        el.style.perspective = '1000px';
    });
};

// Initialize performance optimizations
if (window.requestAnimationFrame) {
    window.requestAnimationFrame(optimizePerformance);
}
