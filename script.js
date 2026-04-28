/* ============================================================
   RAGA DESIGNERS — script.js   (Clean & Optimised)
   ============================================================ */

/* Hoisted so dynamic renderers can observe new elements */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

/* ---- Wait for DOM + Lucide icons to be ready ---- */
document.addEventListener('DOMContentLoaded', () => {

    // Initialise Lucide icons
    if (window.lucide) lucide.createIcons();

    /* ========================================================
       1. THEME TOGGLE
       ======================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon   = document.getElementById('theme-icon');
    const body        = document.body;

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('raga-theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = currentThemeName() === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('raga-theme', newTheme);
    });

    function applyTheme(theme) {
        // Dark is default (no attribute). Light needs the attribute to override.
        if (theme === 'light') {
            body.setAttribute('data-theme', 'light');
        } else {
            body.removeAttribute('data-theme');
        }
        themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
        if (window.lucide) lucide.createIcons();
    }

    function currentThemeName() {
        return body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }


    /* ========================================================
       2. HAMBURGER MOBILE MENU
       ======================================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        // Prevent body scroll when menu is open
        body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside (overlay tap)
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            closeMenu();
        }
    });

    function closeMenu() {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
    }


    /* ========================================================
       3. SCROLL-REVEAL (using IntersectionObserver)
       ======================================================== */
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    /* ========================================================
       4. ACTIVE NAV LINK ON SCROLL
       ======================================================== */
    const sections    = document.querySelectorAll('section[id]');
    const navAnchors  = document.querySelectorAll('.nav-links li a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => sectionObserver.observe(s));


    /* ========================================================
       5. HERO BACKGROUND SLIDER
       ======================================================== */
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }


    /* ========================================================
       6. HERO PARALLAX  (only on devices that can hover = desktop)
         — skip on touch/mobile for better performance
       ======================================================== */
    const heroContent = document.querySelector('.hero-content');
    const prefersMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;

    if (heroContent && prefersMotion && !isTouch) {
        window.addEventListener('scroll', () => {
            const scrollVal = window.scrollY;
            heroContent.style.transform = `translateY(${scrollVal * 0.35}px)`;
            heroContent.style.opacity   = Math.max(0, 1 - scrollVal / 550);
        }, { passive: true });
    }


    /* ========================================================
       7. DYNAMIC CONTENT — loaded from data.json
       ======================================================== */
    async function loadData() {
        try {
            const res  = await fetch('data.json');
            if (!res.ok) throw new Error('Failed to fetch data.json');
            const data = await res.json();

            renderPortfolio(data.portfolio);
            renderTestimonials(data.testimonials);

        } catch (err) {
            console.error('Data load error:', err);
            document.querySelector('.portfolio-loading').textContent  = 'Could not load projects.';
            document.querySelector('.portfolio-loading').textContent  = 'Could not load testimonials.';
        }
    }

    /* -- Portfolio renderer -- */
    function renderPortfolio(items) {
        const grid = document.getElementById('portfolio-grid');

        grid.innerHTML = items.map(item => `
            <div class="portfolio-item reveal" data-category="${item.category}">
                <div class="portfolio-img">
                    <img src="${item.image}" alt="${item.alt}" loading="lazy">
                    <div class="portfolio-overlay">
                        <div class="overlay-content">
                            <span class="cat">${item.label}</span>
                            <h3>${item.title}</h3>
                            <a href="${item.link}" class="view-link">
                                View Project <i data-lucide="arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Re-init icons & observers for new DOM nodes
        if (window.lucide) lucide.createIcons();
        grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

        // Wire up filter buttons now that items exist
        initPortfolioFilter();
    }

    /* -- Portfolio filter -- */
    function initPortfolioFilter() {
        const filterBtns    = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                portfolioItems.forEach(item => {
                    const match = filter === 'all' || item.getAttribute('data-category') === filter;
                    item.classList.toggle('hide', !match);
                });
            });
        });
    }

    /* -- Testimonials  -- */
    function renderTestimonials(items) {
        const container = document.getElementById('testimonial-container');

        const stars = `<div class="stars" aria-label="5 stars">
            ${'<i data-lucide="star"></i>'.repeat(5)}
        </div>`;

        container.innerHTML = items.map((item, i) => `
            <div class="testimonial-card ${i === 0 ? 'active' : ''}">
                <div class="quote-icon"><i data-lucide="quote"></i></div>
                <p class="testimonial-text">"${item.text}"</p>
                <div class="testimonial-user">
                    <img src="${item.avatar}" alt="${item.name}" loading="lazy">
                    <div class="user-info">
                        <h4>${item.name}</h4>
                        <span>${item.role}</span>
                        ${stars}
                    </div>
                </div>
            </div>
        `).join('') + `
            <div class="testimonial-controls">
                <button id="prev-test" aria-label="Previous testimonial">
                    <i data-lucide="chevron-left"></i>
                </button>
                <button id="next-test" aria-label="Next testimonial">
                    <i data-lucide="chevron-right"></i>
                </button>
            </div>
        `;

        if (window.lucide) lucide.createIcons();

        // Boot slider after rendering
        initTestimonialSlider();
    }

    /* -- Testimonial slider -- */
    function initTestimonialSlider() {
        const testCards = document.querySelectorAll('.testimonial-card');
        let currentTest = 0;
        let testInterval;

        function showTestimonial(index) {
            testCards[currentTest].classList.remove('active');
            currentTest = (index + testCards.length) % testCards.length;
            testCards[currentTest].classList.add('active');
        }

        function startInterval() {
            testInterval = setInterval(() => showTestimonial(currentTest + 1), 5000);
        }

        function resetInterval() {
            clearInterval(testInterval);
            startInterval();
        }

        document.getElementById('next-test').addEventListener('click', () => { showTestimonial(currentTest + 1); resetInterval(); });
        document.getElementById('prev-test').addEventListener('click', () => { showTestimonial(currentTest - 1); resetInterval(); });

        startInterval();
    }

    // Kick off data loading
    loadData();


    /* ========================================================
       9. CONTACT FORM (Formspree async submit)
       ======================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus  = document.getElementById('form-status');
    const submitBtn   = document.getElementById('submit-btn');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalHTML  = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending…';
        submitBtn.disabled  = true;
        formStatus.textContent = '';

        try {
            const res = await fetch(contactForm.action, {
                method:  'POST',
                body:    new FormData(contactForm),
                headers: { 'Accept': 'application/json' },
            });

            if (res.ok) {
                setStatus('✅ Message sent successfully!', '#22c55e');
                submitBtn.innerHTML = 'Message Sent!';
                submitBtn.style.background = '#22c55e';
                contactForm.reset();
            } else {
                const data = await res.json();
                const msg  = data.errors?.map(e => e.message).join(', ') || 'Oops! Something went wrong.';
                setStatus(msg, '#ef4444');
                submitBtn.innerHTML = 'Try Again';
                submitBtn.disabled  = false;
            }
        } catch {
            setStatus('Connection error. Please try again.', '#ef4444');
            submitBtn.innerHTML = 'Try Again';
            submitBtn.disabled  = false;
        }

        // Reset button after 5 s
        setTimeout(() => {
            submitBtn.innerHTML    = originalHTML;
            submitBtn.disabled     = false;
            submitBtn.style.background = '';
            formStatus.textContent = '';
            if (window.lucide) lucide.createIcons();
        }, 5000);
    });

    function setStatus(msg, color) {
        formStatus.textContent  = msg;
        formStatus.style.color  = color;
    }


    /* ========================================================
       10. FOOTER YEAR
       ======================================================== */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ========================================================
       11. TYPEWRITER — powered by Typed.js
       ======================================================== */
    new Typed('#typewriter', {
        strings:       ['Masterpieces', 'Experiences', 'Solutions', 'Innovation'],
        typeSpeed:     80,
        backSpeed:     40,
        backDelay:     2000,
        loop:          true,
        cursorChar:    '|',
    });

}); // end DOMContentLoaded


// for chatbot 


const chatTrigger = document.getElementById('chat-trigger');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatBody = document.getElementById('chat-body');

// Toggle Chat Window
chatTrigger.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
});

closeChat.addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

// Chat Logic
function handleChatOption(option) {
    let userMsg = "";
    let botMsg = "";

    // Set messages based on choice
    switch(option) {
        case 'services':
            userMsg = "Tell me about your services.";
            botMsg = "We specialize in Web Design, Mobile Apps, E-Commerce, and SEO. Which one interests you?";
            break;
        case 'portfolio':
            userMsg = "I want to see your work.";
            botMsg = "Awesome! You can see our latest masterpieces in the 'Work' section of the homepage. We've worked with global brands!";
            break;
        case 'support':
            userMsg = "I need support.";
            botMsg = "Our support team is active 24/7. You can email us at info@ragadesigners.com or use the contact form below.";
            break;
        case 'career':
            userMsg = "Are you hiring?";
            botMsg = "We are always looking for creative talent! Send your resume to careers@ragadesigners.com.";
            break;
    }

    addMessage(userMsg, 'user');
    
    // Simulate bot thinking
    setTimeout(() => {
        addMessage(botMsg, 'bot');
    }, 600);
}

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    
    // Auto scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
}