
document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar =
        document.getElementById('navbar') ||
        document.querySelector('.contact-navbar');

    const updateNavbar = () => {
        if (navbar) {
            navbar.classList.toggle(
                'scrolled',
                window.scrollY > 50
            );
        }
    };

    updateNavbar();

    window.addEventListener('scroll', updateNavbar, {
        passive: true
    });


    // ===== MOBILE NAVIGATION =====
    // Supports the IDs used by both the main site
    // and the current Akaman Works contact page.
    const hamburger =
        document.getElementById('hamburger') ||
        document.getElementById('menuToggle');

    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {

        // Avoid registering duplicate menu handlers.
        // The contact page already handles its own menu inline.
        if (!hamburger.dataset.menuInitialized) {
            hamburger.dataset.menuInitialized = 'true';

            hamburger.addEventListener('click', () => {
                const isOpen =
                    navLinks.classList.contains('menu-open') ||
                    navLinks.classList.contains('open');

                navLinks.classList.toggle('menu-open', !isOpen);
                navLinks.classList.toggle('open', !isOpen);

                hamburger.classList.toggle('is-open', !isOpen);
                hamburger.classList.toggle('active', !isOpen);

                hamburger.setAttribute(
                    'aria-expanded',
                    String(!isOpen)
                );
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('menu-open', 'open');
                    hamburger.classList.remove('is-open', 'active');
                    hamburger.setAttribute('aria-expanded', 'false');
                });
            });

            document.addEventListener('keydown', event => {
                if (event.key === 'Escape') {
                    navLinks.classList.remove('menu-open', 'open');
                    hamburger.classList.remove('is-open', 'active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }


    // ===== HERO VIDEO FALLBACK =====
    const heroVideo = document.getElementById('heroVideo');

    if (heroVideo) {
        const showFallback = () => {
            heroVideo.style.display = 'none';

            const fallbackImg =
                document.querySelector('.fallback-img');

            if (fallbackImg) {
                fallbackImg.style.display = 'block';
            }
        };

        heroVideo.addEventListener('error', showFallback);

        if (heroVideo.error) {
            showFallback();
        }
    }


    // ===== ALL-PAGES SCROLL REVEAL =====
    // Contact form validation is handled by js/contact.js.
    const revealElements = document.querySelectorAll(
        '.page-banner, .section-heading, .card, ' +
        '.about-layout, .about-layout > div, ' +
        '.contact-layout, .contact-layout > div, ' +
        '.contact-form, .contact-card, .contact-intro, ' +
        '.contact-benefits, .contact-bottom, .cta, ' +
        '.project-card, .contact-detail, .service-icon'
    );

    const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (
        reduceMotion ||
        !('IntersectionObserver' in window)
    ) {
        revealElements.forEach(element => {
            element.classList.add('is-visible');
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add('reveal');
        });

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observerInstance.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -30px 0px'
            }
        );

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }


    // ===== BUTTON HOVER EFFECTS =====
    document.querySelectorAll('.btn, .submit-btn').forEach(button => {

        button.addEventListener('pointerdown', () => {
            button.classList.add('pressed');
        });

        ['pointerup', 'pointerleave', 'pointercancel'].forEach(
            eventName => {
                button.addEventListener(eventName, () => {
                    button.classList.remove('pressed');
                });
            }
        );
    });


    // ===== ACTIVE NAVIGATION LINK =====
    const currentPage =
        window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.navbar a, .nav-menu a').forEach(link => {
        const linkPage =
            link.getAttribute('href')?.split('/').pop();

        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

});
