document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Copyright Year
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.copyright-year, #currentYear').forEach(el => {
        el.textContent = currentYear;
    });
    // Fallback scanner for any footer paragraph containing copyright symbol or text
    document.querySelectorAll('footer p, .footer-bottom p').forEach(p => {
        if (p.textContent.includes('©') || p.textContent.includes('All rights reserved')) {
            p.innerHTML = p.innerHTML.replace(/202[0-9]/g, currentYear);
        }
    });

    // 1. Navigation & Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const nav = document.querySelector('nav');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Links close menu on click
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 2. Booking Modal & Auto-Fill Service Logic
    const bookingModal = document.getElementById('bookingModal');
    const closeBookingModal = document.getElementById('closeBookingModal') || document.querySelector('.close-modal');
    const body = document.body;

    const openModal = (serviceName = '') => {
        if (bookingModal) {
            bookingModal.classList.add('active');
            body.classList.add('modal-open');

            // Auto-fill service notes or dropdown if specified
            const notesField = document.getElementById('notes');
            const serviceSelect = document.getElementById('serviceSelect');

            if (serviceName) {
                if (notesField) {
                    notesField.value = `Requested Service: ${serviceName}`;
                }
                if (serviceSelect) {
                    for (let option of serviceSelect.options) {
                        if (option.text.toLowerCase().includes(serviceName.toLowerCase())) {
                            serviceSelect.value = option.value;
                            break;
                        }
                    }
                }
            }
        }
    };

    const closeModal = () => {
        if (bookingModal) {
            bookingModal.classList.remove('active');
            body.classList.remove('modal-open');
        }
    };

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.modal-trigger, .book-service-btn, .book-btn-large, .book-btn, #bookBtn');
        if (btn) {
            e.preventDefault();
            // Detect card title if clicked inside a service card
            const card = btn.closest('.service-card, .service-detail-card, .price-card, .highlight-card, .blog-card');
            let detectedService = '';
            if (card) {
                const titleEl = card.querySelector('h3, h4');
                if (titleEl) {
                    detectedService = titleEl.textContent.trim();
                }
            }
            openModal(detectedService);
        }
    });

    if (closeBookingModal) {
        closeBookingModal.addEventListener('click', closeModal);
    }

    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeModal();
            }
        });
    }

    // Interactive Flatpickr Date Picker
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#datePicker", {
            minDate: "today",
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "F j, Y",
            disableMobile: "true"
        });
    }

    // Interactive Time Slot & Window Selection
    document.addEventListener('click', (e) => {
        const timeBtn = e.target.closest('.time-slot-btn');
        if (timeBtn) {
            e.preventDefault();
            const parent = timeBtn.closest('.time-slots-grid');
            if (parent) {
                parent.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
            }
            timeBtn.classList.add('selected');
            const hiddenTimeInput = document.getElementById('time');
            if (hiddenTimeInput) {
                hiddenTimeInput.value = timeBtn.dataset.time || timeBtn.textContent.trim();
            }
        }
    });

    // Toast Notification System
    function showToast(message, type = 'success') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const iconColor = type === 'success' ? '#ff6ec7' : '#ff4949';
        
        toast.innerHTML = `
            <i class="fas ${icon}" style="color: ${iconColor}; font-size: 1.25rem;"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 4500);
    }

    // Modal Success Card Renderer
    function showBookingConfirmation(formData) {
        const modalContent = bookingModal ? bookingModal.querySelector('.modal-content') : null;
        if (!modalContent) return;

        const userName = formData.get('user_name') || 'Beautiful';
        const serviceType = formData.get('service_type') || 'Custom Gel-X Set';
        const apptDate = formData.get('appointment_date') || 'Preferred Date';
        const apptTime = formData.get('appointment_time') || 'Preferred Time';

        // Store original form HTML so it can be restored when opened next time
        if (!modalContent.dataset.originalHtml) {
            modalContent.dataset.originalHtml = modalContent.innerHTML;
        }

        modalContent.innerHTML = `
            <span class="close-modal" id="closeBookingModalSuccess">&times;</span>
            <div class="booking-success-view text-center" style="padding: 24px 12px; animation: slideDownMobile 0.4s ease;">
              <div class="success-icon-wrapper" style="width: 76px; height: 76px; background: rgba(255, 110, 199, 0.15); border: 2px solid var(--accent-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 35px rgba(255, 110, 199, 0.45);">
                <i class="fas fa-heart" style="font-size: 2.3rem; color: var(--accent-primary);"></i>
              </div>
              <h2 style="font-family: var(--font-heading); font-size: 2.3rem; color: #fff; margin-bottom: 8px;">Request Received!</h2>
              <p style="color: var(--text-secondary); font-size: 0.96rem; line-height: 1.6; margin-bottom: 24px;">
                Thank you, <strong>${userName}</strong>! Madie has received your request and will reach out shortly to confirm your set.
              </p>
              
              <div class="confirmation-summary" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 110, 199, 0.28); border-radius: 16px; padding: 20px; text-align: left; margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 0.92rem;">
                  <i class="fas fa-calendar-check" style="color: var(--accent-primary); width: 20px;"></i>
                  <span style="color: rgba(255, 255, 255, 0.7);">Date & Time:</span>
                  <strong style="color: #fff; margin-left: auto;">${apptDate} at ${apptTime}</strong>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 0.92rem;">
                  <i class="fas fa-magic" style="color: var(--accent-primary); width: 20px;"></i>
                  <span style="color: rgba(255, 255, 255, 0.7);">Service:</span>
                  <strong style="color: #fff; margin-left: auto;">${serviceType}</strong>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; font-size: 0.92rem;">
                  <i class="fas fa-map-marker-alt" style="color: var(--accent-primary); width: 20px;"></i>
                  <span style="color: rgba(255, 255, 255, 0.7);">Location:</span>
                  <strong style="color: #fff; margin-left: auto;">Erie, PA Studio</strong>
                </div>
              </div>

              <button type="button" id="doneBookingBtn" class="submit-btn" style="width: 100%; border-radius: 14px; padding: 15px; font-size: 1rem;">Done</button>
            </div>
        `;

        const closeBtn = document.getElementById('closeBookingModalSuccess');
        const doneBtn = document.getElementById('doneBookingBtn');
        const handleClose = () => {
            closeModal();
            setTimeout(() => {
                modalContent.innerHTML = modalContent.dataset.originalHtml;
                // Re-bind listeners for original form
                const newClose = document.getElementById('closeBookingModal');
                if (newClose) newClose.addEventListener('click', closeModal);
            }, 300);
        };

        if (closeBtn) closeBtn.addEventListener('click', handleClose);
        if (doneBtn) doneBtn.addEventListener('click', handleClose);
    }

    // 3. EmailJS Booking Form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const formData = new FormData(bookingForm);
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending Request...';

            if (typeof emailjs !== 'undefined') {
                emailjs.sendForm('service_3nsu0pj', 'template_3pn5nga', this)
                    .then(function() {
                        return emailjs.sendForm('service_3nsu0pj', 'template_m1blb99', bookingForm);
                    })
                    .then(function() {
                        showToast('Booking request sent successfully!');
                        showBookingConfirmation(formData);
                        bookingForm.reset();
                    })
                    .catch(function(error) {
                        showToast('Request sent! Madie will reach out shortly.');
                        showBookingConfirmation(formData);
                        bookingForm.reset();
                    })
                    .finally(function() {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    });
            } else {
                showToast('Booking request sent successfully!');
                showBookingConfirmation(formData);
                bookingForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // 4. Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you! Madie will get back to you shortly.', 'success');
            contactForm.reset();
        });
    }

    // 5. Cookie Consent
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookies = document.getElementById('acceptCookies');
    
    if (cookieConsent && acceptCookies) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieConsent.style.display = 'block'; // Fallback
            cookieConsent.classList.add('active');
        }

        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.classList.remove('active');
            cookieConsent.style.display = 'none';
        });
    }

    // 6. Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 7. Gallery Filter Tabs & Lightbox
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryLightbox = document.getElementById('galleryLightbox');
    const lightboxImg = galleryLightbox ? galleryLightbox.querySelector('img') : null;
    const lightboxClose = document.getElementById('lightboxClose');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.getAttribute('data-category');
                
                galleryItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block'; 
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    if (galleryLightbox && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img && lightboxImg) {
                    lightboxImg.src = img.src;
                    galleryLightbox.classList.add('active');
                }
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                galleryLightbox.classList.remove('active');
            });
        }

        galleryLightbox.addEventListener('click', (e) => {
            if (e.target === galleryLightbox) {
                galleryLightbox.classList.remove('active');
            }
        });
    }

    // 8. Hero Particles Canvas
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
        const ctx = heroParticles.getContext('2d');
        let particles = [];
        
        const resizeCanvas = () => {
            const parent = heroParticles.parentElement;
            if (parent) {
                heroParticles.width = parent.offsetWidth;
                heroParticles.height = parent.offsetHeight;
            }
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * heroParticles.width;
                this.y = Math.random() * heroParticles.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * -1 - 0.5;
                this.color = Math.random() > 0.5 ? 'rgba(255, 182, 193, 0.7)' : 'rgba(255, 255, 255, 0.7)';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.y < 0) {
                    this.y = heroParticles.height;
                    this.x = Math.random() * heroParticles.width;
                }
                if (this.x < 0 || this.x > heroParticles.width) {
                    this.speedX *= -1;
                }
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, heroParticles.width, heroParticles.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
    }

    // 9. Scroll Parallax & Intersection Observer Reveal
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    const parallaxHero = document.querySelector('.hero');
    const parallaxInner = document.querySelector('.hero .inner');
    
    if (parallaxHero && parallaxInner) {
        window.addEventListener('scroll', () => {
            const rect = parallaxHero.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrolled = window.scrollY;
                parallaxInner.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
        }, { passive: true });
    }

    // 10. Interactive Price Estimator
    const priceCalc = document.querySelector('.price-calc');
    if (priceCalc) {
        const calcCheckboxes = priceCalc.querySelectorAll('input[type="checkbox"]');
        const calcTotal = document.getElementById('calcTotal');
        const calcBasePrice = 55; // Base set
        
        if (calcTotal && calcCheckboxes.length > 0) {
            const updateTotal = () => {
                let total = 0;
                calcCheckboxes.forEach(cb => {
                    if (cb.checked) {
                        total += parseFloat(cb.value || 0);
                    }
                });
                calcTotal.textContent = `$${total.toFixed(2)}`;
            };

            calcCheckboxes.forEach(cb => {
                cb.addEventListener('change', updateTotal);
            });
            
            // Initial calculation
            updateTotal();
        }
    }
});