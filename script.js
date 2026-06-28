/* =======================================
   STEVEN NOYNAY FILMS — SCRIPT
======================================= */

/* ---- LOADER ---- */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => loader.classList.add('hide'), 2200);
    }
});

/* ---- CURSOR GLOW ---- */
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
    });
} else if (glow) {
    glow.style.display = 'none';
}

/* ---- PROGRESS BAR ---- */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = pct + '%';
}, { passive: true });

/* ---- HEADER SCROLL STYLE ---- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- MOBILE NAVIGATION MENU (hamburger) ---- */
const hamburger = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileNav.classList.remove('open');
        });
    });
}

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const allSections = document.querySelectorAll('section[id]');
const desktopNavLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    allSections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    desktopNavLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
}, { passive: true });

/* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ---- COUNTER ANIMATION ---- */
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = +el.dataset.target;
        const step   = target / 100;
        let count    = 0;
        const tick = () => {
            count = Math.min(count + step, target);
            el.textContent = Math.ceil(count);
            if (count < target) requestAnimationFrame(tick);
        };
        tick();
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ---- BUTTON RIPPLE EFFECT ---- */
document.querySelectorAll('.btn-primary, .nav-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const existing = this.querySelector('.ripple');
        if (existing) existing.remove();
        const r    = document.createElement('span');
        const d    = Math.max(this.clientWidth, this.clientHeight);
        const rect = this.getBoundingClientRect();
        r.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d/2}px;top:${e.clientY - rect.top - d/2}px;`;
        r.classList.add('ripple');
        this.appendChild(r);
        setTimeout(() => r.remove(), 700);
    });
});

/* ---- PORTFOLIO AUTO-ANIMATION WITH SMART DRAG LOGIC ---- */
const sliderContainer = document.querySelector('.portfolio-slider');
const portfolioTrack = document.getElementById('portfolioTrack');

if (sliderContainer && portfolioTrack) {
    // Clone elements to allow continuous wrapping loops while sliding
    const originalItems = Array.from(portfolioTrack.children);
    originalItems.forEach(item => portfolioTrack.appendChild(item.cloneNode(true)));
    originalItems.forEach(item => portfolioTrack.appendChild(item.cloneNode(true)));

    let isDragging = false;
    let startX = 0;
    let baseTranslate = 0;
    let currentTranslate = 0;
    let draggedDistance = 0; // Tracks motion offset threshold

    function getXPosition(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }

    function getCurrentTransformX() {
        const style = window.getComputedStyle(portfolioTrack);
        const matrix = style.transform || style.webkitTransform;
        if (matrix && matrix !== 'none') {
            const matrixValues = matrix.split('(')[1].split(')')[0].split(',');
            return parseFloat(matrixValues[4]);
        }
        return 0;
    }

    // Capture Drag Activation
    sliderContainer.addEventListener('mousedown', dragStart);
    sliderContainer.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);

    sliderContainer.addEventListener('touchstart', dragStart, { passive: true });
    sliderContainer.addEventListener('touchmove', dragMove, { passive: true });
    window.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        isDragging = true;
        draggedDistance = 0;
        portfolioTrack.classList.add('is-dragging');

        baseTranslate = getCurrentTransformX();
        startX = getXPosition(e);

        portfolioTrack.style.animation = 'none';
        portfolioTrack.style.transform = `translateX(${baseTranslate}px)`;
    }

    function dragMove(e) {
        if (!isDragging) return;

        const currentX = getXPosition(e);
        const deltaX = currentX - startX;
        draggedDistance = Math.abs(deltaX); // Measure how far the mouse has moved
        currentTranslate = baseTranslate + deltaX;

        const singleSetWidth = portfolioTrack.scrollWidth / 3;

        if (currentTranslate > 0) {
            currentTranslate -= singleSetWidth;
            startX = currentX;
            baseTranslate = currentTranslate;
        } else if (Math.abs(currentTranslate) >= (singleSetWidth * 2)) {
            currentTranslate += singleSetWidth;
            startX = currentX;
            baseTranslate = currentTranslate;
        }

        portfolioTrack.style.transform = `translateX(${currentTranslate}px)`;
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        portfolioTrack.classList.remove('is-dragging');

        const singleSetWidth = portfolioTrack.scrollWidth / 3;
        let currentPosOffset = currentTranslate % singleSetWidth;
        if (currentPosOffset > 0) {
            currentPosOffset -= singleSetWidth;
        }

        portfolioTrack.style.transform = 'none';
        void portfolioTrack.offsetWidth;

        portfolioTrack.style.animation = 'portfolioMove 45s linear infinite';
        portfolioTrack.style.animationDelay = `${(currentPosOffset / singleSetWidth) * 45}s`;

        /* ---- FIXED CLICK ROUTING ENGINE ---- */
        // If movement was minimal (less than 5 pixels), treat it as an intentional click!
        if (draggedDistance < 5) {
            const pathTarget = e.target.closest('.portfolio-item');
            if (pathTarget) {
                const imgElement = pathTarget.querySelector('img');
                const imgSrc = imgElement ? imgElement.getAttribute('src') : '';

                if (imgSrc.includes('Timeline 2.mov.jpg')) {
                    window.location.href = "videos.html#cedrick-danna";
                } else if (imgSrc.includes('2 clyd and adriana')) {
                    window.location.href = "videos.html#clyd-adriana";
                } else if (imgSrc.includes('FB_VID_1383564251581538065.jpg')) {
                    window.location.href = "videos.html#chuckie-rosemarie";
                } else if (pathTarget.dataset.link) {
                    window.location.href = pathTarget.dataset.link;
                }
            }
        }
    }
}

/*FEATURED */

document.querySelector('.featured-image-wrap').addEventListener('click', function() {
    const link = this.getAttribute('data-link');
    if (link) {
        window.location.href = link;
    }
});

/* ---- FAQ ACCORDION ---- */
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.faq-q').forEach(b => {
            b.setAttribute('aria-expanded', 'false');
            b.nextElementSibling.classList.remove('open');
        });
        if (!isOpen) {
            btn.setAttribute('aria-expanded', 'true');
            btn.nextElementSibling.classList.add('open');
        }
    });
});

/* ---- DEV CREDIT POPUP ---- */
const devBtn   = document.getElementById('devBtn');
const devPopup = document.getElementById('devPopup');
if (devBtn && devPopup) {
    devBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = devPopup.classList.toggle('open');
        devBtn.classList.toggle('active', isOpen);
    });
    document.addEventListener('click', (e) => {
        if (!devPopup.contains(e.target) && e.target !== devBtn) {
            devPopup.classList.remove('open');
            devBtn.classList.remove('active');
        }
    });
}