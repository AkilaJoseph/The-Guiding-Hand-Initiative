/* ===================================
   TGHI Portfolio Website - JavaScript
   =================================== */

// ===================================
// 1. INITIALIZE ON DOM LOAD
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-in-out'
    });

    // Initialize all features
    initNavbar();
    initSmoothScroll();
    initScrollTopButton();
    initContactForm();
    initActiveNavigation();
});

// ===================================
// 2. NAVBAR FUNCTIONALITY
// ===================================

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    // Add scroll event listener
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu close on link click
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });
}

// ===================================
// 3. SMOOTH SCROLLING
// ===================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// 4. SCROLL TO TOP BUTTON
// ===================================

function initScrollTopButton() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top on button click
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// 5. ACTIVE NAVIGATION HIGHLIGHTING
// ===================================

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// 6. CONTACT FORM VALIDATION & SUBMISSION
// ===================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        formMessage.textContent = '';
        formMessage.className = 'form-message mt-3';
        
        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate form
        if (!validateForm(name, email, subject, message)) {
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Submit to Formspree using AJAX
        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.classList.add('success');

                // Reset form
                form.reset();

                // Remove success message after 8 seconds
                setTimeout(function() {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message mt-3';
                }, 8000);
            } else {
                return response.json().then(data => {
                    if (data.errors) {
                        formMessage.textContent = data.errors.map(error => error.message).join(', ');
                    } else {
                        formMessage.textContent = 'Oops! There was a problem submitting your form';
                    }
                    formMessage.classList.add('error');
                });
            }
        })
        .catch(error => {
            // Show error message
            formMessage.textContent = 'An error occurred while sending your message. Please try again or contact us directly at info@theguidinghand.org';
            formMessage.classList.add('error');
            console.error('Form submission error:', error);
        })
        .finally(() => {
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    });
}

// ===================================
// 7. FORM VALIDATION FUNCTIONS
// ===================================

function validateForm(name, email, subject, message) {
    const formMessage = document.getElementById('formMessage');
    
    // Validate name
    if (name.length < 2) {
        showError('Please enter a valid name (at least 2 characters).');
        return false;
    }
    
    // Validate email
    if (!validateEmail(email)) {
        showError('Please enter a valid email address.');
        return false;
    }
    
    // Validate subject
    if (subject.length < 3) {
        showError('Please enter a subject (at least 3 characters).');
        return false;
    }
    
    // Validate message
    if (message.length < 10) {
        showError('Please enter a message (at least 10 characters).');
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(message) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.classList.add('error');
    
    // Remove error message after 5 seconds
    setTimeout(function() {
        formMessage.textContent = '';
        formMessage.className = 'form-message mt-3';
    }, 5000);
}

// ===================================
// 8. PROGRAM CARDS HOVER EFFECT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const programCards = document.querySelectorAll('.program-card');
    
    programCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// ===================================
// 9. SDG CARDS FLIP ANIMATION
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const sdgCards = document.querySelectorAll('.sdg-card');
    
    sdgCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'rotateY(5deg) translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'rotateY(0deg) translateY(0)';
        });
    });
});

// ===================================
// 10. VALUE CARDS ANIMATION
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// ===================================
// 11. NAVBAR TRANSPARENCY ON SCROLL (DISABLED)
// ===================================

// Keeping navbar solid white for better readability
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 1)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// ===================================
// 12. TYPING ANIMATION FOR HERO TAGLINE
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const tagline = document.querySelector('.hero-tagline');
    
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        let index = 0;
        
        function typeWriter() {
            if (index < text.length) {
                tagline.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing after a delay
        setTimeout(typeWriter, 1000);
    }
});

// ===================================
// 13. PARALLAX EFFECT FOR HERO (DISABLED - Caused visibility issues)
// ===================================

// Parallax disabled to prevent text disappearing during scroll
// window.addEventListener('scroll', function() {
//     const heroSection = document.querySelector('.hero-section');
//     const scrollPosition = window.scrollY;
//     
//     if (heroSection && scrollPosition < window.innerHeight) {
//         heroSection.style.transform = `translateY(${scrollPosition * 0.5}px)`;
//     }
// });

// ===================================
// 14. COUNTER ANIMATION (if needed in future)
// ===================================

function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(function() {
        start += increment;
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===================================
// 15. LAZY LOADING FOR IMAGES
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ===================================
// 16. SCROLL REVEAL ANIMATION
// ===================================

window.addEventListener('scroll', function() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
});

// ===================================
// 17. NEWSLETTER SIGNUP (if needed)
// ===================================

function initNewsletterSignup() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                alert('Thank you for subscribing to our newsletter!');
                this.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
}

// ===================================
// 18. MODAL FUNCTIONALITY (if needed)
// ===================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===================================
// 19. SEARCH FUNCTIONALITY (if needed)
// ===================================

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            
            if (query.length > 0) {
                // Implement search functionality
                console.log('Searching for:', query);
            }
        });
    }
}

// ===================================
// 20. LOADING SCREEN (Optional)
// ===================================

window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    
    if (loader) {
        setTimeout(function() {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// ===================================
// 21. MOBILE MENU ENHANCEMENTS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navbarCollapse.contains(event.target) || navbarToggler.contains(event.target);
        
        if (!isClickInside && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        }
    });
});

// ===================================
// 22. ACCESSIBILITY ENHANCEMENTS
// ===================================

// Skip to main content
document.addEventListener('DOMContentLoaded', function() {
    const skipLink = document.querySelector('.skip-link');
    
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.querySelector('main') || document.querySelector('#about');
            
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// ===================================
// 23. PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(function() {
    // Your scroll handling code here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// ===================================
// 24. CONSOLE MESSAGE
// ===================================

// Add SVG gradient for volunteer circle
document.addEventListener('DOMContentLoaded', function() {
    const svg = document.querySelector('.count-progress');
    if (svg) {
        // Create gradient definition
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'countGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', 'stop-color:#1E5A8E;stop-opacity:1');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', 'stop-color:#F9A826;stop-opacity:1');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
        
        // Animate on scroll
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    svg.querySelector('.count-fill').style.animation = 'fillCircle 2s ease-out forwards';
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(svg);
    }
});

// ===================================
// 25. PARTNER CAROUSEL ANIMATION ENHANCEMENTS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const carouselWrappers = document.querySelectorAll('.partners-carousel-wrapper');

    carouselWrappers.forEach(wrapper => {
        const carouselRow = wrapper.querySelector('.partners-carousel-row');

        // Pause animation on hover for better UX
        wrapper.addEventListener('mouseenter', function() {
            carouselRow.style.animationPlayState = 'paused';
        });

        wrapper.addEventListener('mouseleave', function() {
            carouselRow.style.animationPlayState = 'running';
        });
    });

    // Add shimmer effect on scroll into view
    const partnerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.partner-logo-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = 'partnerShimmer 1s ease-out';
                    }, index * 100);
                });
                partnerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    carouselWrappers.forEach(wrapper => {
        partnerObserver.observe(wrapper);
    });
});

// ===================================
// 26. TEAM MEMBER PHOTO CARDS ANIMATION
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const teamCards = document.querySelectorAll('.team-member-photo-card');

    // Animate on scroll with stagger effect
    const teamObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 150);
                teamObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    teamCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.95)';
        card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        teamObserver.observe(card);
    });
});

// ===================================
// 27. VOLUNTEER COUNT ANIMATION
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const countCircle = document.querySelector('.count-circle');

    if (countCircle) {
        const countObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger the circle fill animation
                    const fillCircle = entry.target.querySelector('.count-fill');
                    if (fillCircle) {
                        fillCircle.style.animation = 'fillCircle 2s ease-out forwards';
                    }

                    // Animate the count number
                    const countNumber = entry.target.querySelector('.count-number');
                    if (countNumber) {
                        const targetNumber = parseInt(countCircle.dataset.count) || 15;
                        animateCountUp(countNumber, 0, targetNumber, 2000);
                    }

                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        countObserver.observe(countCircle);
    }
});

// Animate count up function
function animateCountUp(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===================================
// 28. FOOTER ANIMATIONS ON SCROLL
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const footer = document.querySelector('.footer');
    const footerBgLogos = document.querySelector('.footer-bg-logos');

    if (footer && footerBgLogos) {
        const footerObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger the background logos reveal animation
                    footerBgLogos.style.animation = 'revealRewards 1s ease-out 0.5s forwards';
                    footerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        footerObserver.observe(footer);
    }

    // Add pulse effect to footer social icons on hover
    const socialIcons = document.querySelectorAll('.footer-social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.5s ease-in-out';
        });
        icon.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
});

console.log('%c TGHI - The Guiding Hand Initiative ', 'background: linear-gradient(135deg, #1E5A8E 0%, #F9A826 100%); color: white; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Building Futures, Healing Lives ', 'color: #F9A826; font-size: 16px; font-weight: bold;');
console.log('%c Website developed with ❤️ for empowering youth ', 'color: #1E5A8E; font-size: 14px;');

// ===================================
// 29. EXPORT FUNCTIONS (if using modules)
// ===================================

// Uncomment if using ES6 modules
// export { validateEmail, openModal, closeModal, animateCounter };