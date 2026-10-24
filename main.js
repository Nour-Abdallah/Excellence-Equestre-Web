/**
 * Script principal pour le centre équestre "À dos de rêve"
 * Contient toutes les fonctionnalités interactives du site
 */

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // GESTION DE LA BANNIÈRE D'ANNONCE
    // =============================================
    const announcementBar = document.querySelector('.announcement-bar');
    const announcementClose = document.querySelector('.announcement-close');
    
    // Fermer la bannière d'annonce
    if (announcementClose) {
        announcementClose.addEventListener('click', function() {
            announcementBar.style.display = 'none';
            // Stocker en localStorage pour ne pas réafficher
            localStorage.setItem('announcementClosed', 'true');
        });
    }
    
    // Vérifier si l'utilisateur a déjà fermé la bannière
    if (localStorage.getItem('announcementClosed') === 'true') {
        announcementBar.style.display = 'none';
    }
    
    // =============================================
    // MENU MOBILE
    // =============================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            
            // Animation des lignes du bouton hamburger
            this.classList.toggle('active');
        });
    }
    
    // Fermer le menu mobile lorsqu'un lien est cliqué
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                document.body.classList.remove('nav-open');
                mobileNavToggle.classList.remove('active');
            }
        });
    });
    
    // =============================================
    // MENU DÉROULANT
    // =============================================
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const menu = item.querySelector('.dropdown-menu');
        
        // Ouvrir/fermer au clic
        link.addEventListener('click', function(e) {
            if (window.innerWidth > 992) {
                e.preventDefault();
                const isOpen = menu.style.display === 'block';
                
                // Fermer tous les autres menus ouverts
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    if (m !== menu) m.style.display = 'none';
                });
                
                menu.style.display = isOpen ? 'none' : 'block';
            }
        });
        
        // Fermer quand on clique ailleurs
        document.addEventListener('click', function(e) {
            if (!item.contains(e.target) && window.innerWidth > 992) {
                menu.style.display = 'none';
            }
        });
    });
    
    // =============================================
    // LIEN "SAUTER AU CONTENU"
    // =============================================
    const skipLink = document.querySelector('.skip-link');
    
    skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.setAttribute('tabindex', '-1');
            target.focus();
            
            // Retirer le tabindex après le focus pour éviter de le garder dans l'ordre de tabulation
            setTimeout(() => {
                target.removeAttribute('tabindex');
            }, 1000);
        }
    });
    
    // =============================================
    // BOUTON RETOUR EN HAUT
    // =============================================
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // =============================================
    // ANIMATION AU DÉFILEMENT
    // =============================================
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .team-card, .horse-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Exécuter une fois au chargement
    
    // =============================================
    // CARROUSEL DE TÉMOIGNAGES
    // =============================================
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    
    if (testimonialsSlider) {
        let currentIndex = 0;
        const testimonials = document.querySelectorAll('.testimonial-card');
        const totalTestimonials = testimonials.length;
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.transform = `translateX(${100 * (i - index)}%)`;
            });
        }
        
        // Initialisation
        showTestimonial(currentIndex);
        
        // Auto-rotation toutes les 5 secondes
        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalTestimonials;
            showTestimonial(currentIndex);
        }, 5000);
    }
    
    // =============================================
    // WIDGET DE RÉSERVATION
    // =============================================
    const dateArrows = document.querySelectorAll('.date-arrow');
    const dateDisplay = document.querySelector('.date-display');
    
    if (dateArrows && dateDisplay) {
        let currentDate = new Date();
        
        function updateDateDisplay() {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
            
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            const options = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
            const startStr = startOfWeek.toLocaleDateString('fr-FR', options);
            const endStr = endOfWeek.toLocaleDateString('fr-FR', options);
            
            dateDisplay.textContent = `${startStr} - ${endStr}`;
        }
        
        dateArrows.forEach(arrow => {
            arrow.addEventListener('click', function() {
                const direction = this.querySelector('i').classList.contains('fa-chevron-left') ? -1 : 1;
                currentDate.setDate(currentDate.getDate() + (7 * direction));
                updateDateDisplay();
                
                // Ici, vous pourriez ajouter une requête AJAX pour charger les créneaux disponibles
                // pour la nouvelle semaine sélectionnée
            });
        });
        
        // Initialisation
        updateDateDisplay();
    }
    
    // =============================================
    // FORMULAIRE DE CONTACT
    // =============================================
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation simple
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !subject || !message) {
                alert('Veuillez remplir tous les champs du formulaire.');
                return;
            }
            
            // Ici, vous pourriez ajouter une requête AJAX pour envoyer le formulaire
            alert('Merci pour votre message! Nous vous contacterons bientôt.');
            contactForm.reset();
        });
    }
    
    // =============================================
    // NEWSLETTER
    // =============================================
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }
            
            // Ici, vous pourriez ajouter une requête AJAX pour enregistrer l'email
            alert('Merci pour votre inscription à notre newsletter!');
            emailInput.value = '';
        });
    }
    
    // =============================================
    // CHARGEMENT DIFFÉRÉ DES IMAGES
    // =============================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.removeAttribute('loading');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            // Stocker l'URL originale dans data-src si ce n'est pas déjà fait
            if (!img.dataset.src) {
                img.dataset.src = img.src;
                img.src = ''; // Ou une petite image placeholder
            }
            imageObserver.observe(img);
        });
    }
    
    // =============================================
    // AMÉLIORATION DE L'ACCESSIBILITÉ
    // =============================================
    // Gestion du focus pour les éléments interactifs
    document.querySelectorAll('button, a, input, select, textarea').forEach(el => {
        el.addEventListener('focus', function() {
            this.classList.add('focus-visible');
        });
        
        el.addEventListener('blur', function() {
            this.classList.remove('focus-visible');
        });
    });
    
    // Empêcher le focus lors du clic souris (pour ne garder que le focus clavier)
    document.addEventListener('mousedown', function() {
        document.body.classList.add('using-mouse');
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.remove('using-mouse');
        }
    });
});

// =============================================
// FONCTIONS UTILITAIRES
// =============================================

/**
 * Détecte si l'appareil est un appareil mobile
 * @returns {boolean}
 */
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

/**
 * Empêche le comportement par défaut d'un événement
 * @param {Event} e - L'événement
 */
function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
}

/**
 * Désactive le défilement de la page
 */
function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.addEventListener('touchmove', preventDefault, { passive: false });
}

/**
 * Réactive le défilement de la page
 */
function enableScroll() {
    document.body.style.overflow = '';
    document.removeEventListener('touchmove', preventDefault);
}