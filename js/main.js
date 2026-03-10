/* ============================================
   MONTE GREEN - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            initAnimations();
        }, 1600);
    });

    // Fallback: remove preloader after 3s
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            initAnimations();
        }
    }, 3000);

    // ---- Navbar Scroll ----
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link
        updateActiveNavLink();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Back to Top ----
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Mobile Menu ----
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- Active Nav Link ----
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- Scroll Animations ----
    function initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    // ---- Counter Animation ----
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    const duration = 2000;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(target * eased);

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            el.textContent = target;
                        }
                    }

                    requestAnimationFrame(update);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounters();

    // ---- Product Filters ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            productCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ---- Testimonial Slider ----
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialDots');

    if (track) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        const totalSlides = cards.length;

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;

            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
        });

        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
        });

        // Auto-play
        let autoPlay = setInterval(() => {
            goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
        }, 5000);

        track.closest('.testimonial-slider').addEventListener('mouseenter', () => {
            clearInterval(autoPlay);
        });

        track.closest('.testimonial-slider').addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
            }, 5000);
        });
    }

    // ---- Hero Particles ----
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 5) + 's';
            particle.style.opacity = Math.random() * 0.15 + 0.05;

            // Floating animation
            particle.style.animation = `floatParticle ${Math.random() * 10 + 15}s ease-in-out infinite`;
            particle.style.animationDelay = `${Math.random() * 5}s`;

            particlesContainer.appendChild(particle);
        }

        // Add floating keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(${rand()}px, ${rand()}px) rotate(90deg); }
                50% { transform: translate(${rand()}px, ${rand()}px) rotate(180deg); }
                75% { transform: translate(${rand()}px, ${rand()}px) rotate(270deg); }
            }
        `;
        document.head.appendChild(style);

        function rand() {
            return (Math.random() - 0.5) * 60;
        }
    }

    // ---- Contact Form ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                </svg>
                Sending...
            `;
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Message Sent!
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #1B5E20, #2E7D32)';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ---- Add spin animation ----
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(spinStyle);
});
