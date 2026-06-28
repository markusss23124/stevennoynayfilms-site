/* =======================================
   STEVEN NOYNAY FILMS — VIDEO VAULT JS
======================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- ELEMENTS ---- */
    const playerContainer = document.getElementById('mainPlayerContainer');
    const titleEl          = document.getElementById('activeTitle');
    const catEl             = document.getElementById('activeCategory');
    const descEl            = document.getElementById('activeDescription');
    const archiveCards      = Array.from(document.querySelectorAll('.archive-card'));

    let vimeoPlayer = null; // Holds the active Vimeo.Player instance, if current video is Vimeo

    /* ---- BUILD A VIMEO IFRAME STRING ---- */
    function buildVimeoIframe(vimeoId, title) {
        return `<iframe
                id="featuredTheaterPlayer"
                src="https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&badge=0&autopause=0&app_id=58479&autoplay=1"
                width="100%"
                height="100%"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                title="${title}">
            </iframe>`;
    }

    /* ---- BUILD AN MP4 VIDEO STRING (fallback for videos not yet on Vimeo) ---- */
    function buildMp4Video(videoUrl, title) {
        return `<video
                id="featuredTheaterPlayer"
                controls
                playsinline
                autoplay
                title="${title}">
                <source src="${videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>`;
    }

    /* ---- ATTACH "ENDED" LISTENER SO WE CONTROL WHAT PLAYS NEXT ---- */
    function attachEndedListener(type, clickedCard) {
        const iframeEl = document.getElementById('featuredTheaterPlayer');
        if (!iframeEl) return;

        if (type === 'vimeo' && window.Vimeo && window.Vimeo.Player) {
            vimeoPlayer = new window.Vimeo.Player(iframeEl);
            vimeoPlayer.on('ended', () => {
                playNextCard(clickedCard);
            });
        } else if (type === 'mp4') {
            vimeoPlayer = null;
            iframeEl.addEventListener('ended', () => {
                playNextCard(clickedCard);
            });
        }
    }

    /* ---- PLAY THE NEXT CARD IN THE ARCHIVE LIST ---- */
    function playNextCard(currentCard) {
        const currentIndex = archiveCards.indexOf(currentCard);
        const nextIndex = (currentIndex + 1) % archiveCards.length; // loops back to first after last
        const nextCard = archiveCards[nextIndex];
        if (nextCard) {
            loadCard(nextCard);
        }
    }

    /* ---- MASTER VIDEO SWAP FUNCTION ---- */
    function switchTheaterVideo(type, videoSrc, title, category, description, clickedCard = null) {
        if (!playerContainer) return;

        /* Manage active card border highlights in the grid list below */
        archiveCards.forEach(c => c.classList.remove('active-card'));
        if (clickedCard) clickedCard.classList.add('active-card');

        /* Swap player markup based on source type */
        if (type === 'vimeo') {
            playerContainer.innerHTML = buildVimeoIframe(videoSrc, title);
        } else {
            playerContainer.innerHTML = buildMp4Video(videoSrc, title);
        }

        /* Update meta text to match the video that is actually now loaded */
        if (titleEl) titleEl.textContent = title;
        if (catEl) {
            catEl.textContent = category;
            catEl.style.color = (category === 'PRENUP FILM') ? 'var(--gold)' : 'var(--white)';
        }
        if (descEl) descEl.textContent = description;

        /* Re-attach the ended listener to the freshly created player so autoplay-next keeps working */
        // Small delay ensures the new iframe/video element exists in the DOM before we bind to it
        setTimeout(() => attachEndedListener(type, clickedCard), 50);

        /* Scroll back up to the main theater player smoothly */
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ---- LOAD A CARD'S VIDEO INTO THE PLAYER ---- */
    function loadCard(card) {
        const type = card.getAttribute('data-type');
        const src  = type === 'vimeo'
            ? card.getAttribute('data-vimeo')
            : card.getAttribute('data-video');

        switchTheaterVideo(
            type,
            src,
            card.getAttribute('data-title'),
            card.getAttribute('data-category'),
            card.getAttribute('data-desc'),
            card
        );
    }

    /* ---- CARD CLICK HANDLERS ---- */
    archiveCards.forEach(card => {
        card.addEventListener('click', () => loadCard(card));
    });

    /* ---- MARK FIRST CARD ACTIVE + BIND ENDED LISTENER ON INITIAL LOAD ---- */
    if (archiveCards.length > 0 && !window.location.hash) {
        archiveCards[0].classList.add('active-card');
        setTimeout(() => attachEndedListener('vimeo', archiveCards[0]), 300);
    }

    /* ---- INTELLIGENT DEEP LINKING INTEGRATION ROUTER ---- */
    const currentHash = window.location.hash;

    if (currentHash && playerContainer) {
        let targetCard = null;

        if (currentHash === '#cedrick-danna' || currentHash === '#play-teaser') {
            targetCard = document.getElementById('cedrick-danna');
        } else if (currentHash === '#clyd-adriana') {
            targetCard = document.getElementById('clyd-adriana');
        } else if (currentHash === '#chuckie-rosemarie') {
            targetCard = document.getElementById('chuckie-rosemarie');
        }

        if (targetCard) {
            /* Prevent the browser from staying jumped down at the archive thumbnail item card */
            window.scrollTo(0, 0);
            loadCard(targetCard);
            setTimeout(() => window.scrollTo(0, 0), 100);
        }
    }

    /* ---- HAMBURGER MENU (matches landing page behavior) ---- */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileNav.classList.toggle('open');
        });
        mobileNav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileNav.classList.remove('open');
            });
        });
    }

    /* ---- PROGRESS BAR ---- */
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        if (!progressBar) return;
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
        progressBar.style.width = pct + '%';
    }, { passive: true });

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

});
/*faster loading speed */

document.querySelectorAll("[data-link]").forEach(item => {

    item.style.cursor = "pointer";

    item.addEventListener("click", () => {
        window.location.href = item.dataset.link;
    });

});