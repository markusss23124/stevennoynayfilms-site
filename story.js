/* =======================================
   STEVEN NOYNAY FILMS — STORY PAGE JS
======================================= */

gsap.registerPlugin(ScrollTrigger);

/* ---- PROGRESS BAR ---- */
window.addEventListener("scroll", () => {
    const bar = document.getElementById("progress-bar");
    if(!bar) return;
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + "%";
});

/* ---- HERO ENTRANCE ---- */
const heroTl = gsap.timeline({ delay: 0.2 });

heroTl
    .to(".hero-eyebrow-line", {
        scaleX: 1,
        duration: 0.8,
        ease: "power3.out"
    })
    .to(".hero-tag", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out"
    }, "-=0.3")
    .to(".hero h1", {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out"
    }, "-=0.5")
    .to(".hero-scroll", {
        opacity: 1,
        duration: 0.7,
        ease: "power2.out"
    }, "-=0.2");

/* ---- HERO PARALLAX ---- */
window.addEventListener("scroll", () => {
    const hero = document.querySelector(".hero");
    if(!hero || window.scrollY > window.innerHeight) return;
    hero.style.backgroundPositionY = `calc(50% + ${window.scrollY * 0.3}px)`;
});

/* ---- STORY SECTION ---- */
gsap.from(".story-text", {
    scrollTrigger: { trigger: ".story", start: "top 78%" },
    x: -60, opacity: 0, duration: 1.1, ease: "power3.out"
});

gsap.from(".story-image", {
    scrollTrigger: { trigger: ".story", start: "top 78%" },
    x: 60, opacity: 0, duration: 1.1, delay: 0.12, ease: "power3.out"
});

/* ---- TIMELINE ---- */
gsap.from(".timeline-item", {
    scrollTrigger: { trigger: ".timeline-section", start: "top 72%" },
    y: 55, opacity: 0, stagger: 0.18, duration: 1, ease: "power3.out"
});

// Highlight years as they enter view
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if(e.isIntersecting) e.target.classList.add("in-view");
    });
}, { threshold: 0.35 });

document.querySelectorAll(".timeline-item").forEach(el => timelineObserver.observe(el));

/* ---- QUOTE ---- */
gsap.from(".quote-inner", {
    scrollTrigger: { trigger: ".quote-section", start: "top 75%" },
    y: 40, opacity: 0, duration: 1.2, ease: "power3.out"
});

/* ---- CTA ---- */
gsap.from(".cta-group", {
    scrollTrigger: { trigger: ".back-home", start: "top 82%" },
    y: 30, opacity: 0, duration: 0.9, ease: "power3.out"
});

/* ---- STORY IMAGE SLIDER ---- */
(function(){
    const slides = document.querySelectorAll(".story-slide");
    const counter = document.querySelector(".slide-counter");
    if(!slides.length) return;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "slide-dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => { goTo(i); resetTimer(); });
        counter.appendChild(dot);
    });

    let current = 0;
    let timer;

    function goTo(i){
        slides[current].classList.remove("active");
        document.querySelectorAll(".slide-dot")[current].classList.remove("active");
        current = (i + slides.length) % slides.length;
        slides[current].classList.add("active");
        document.querySelectorAll(".slide-dot")[current].classList.add("active");
    }

    function resetTimer(){
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 3800);
    }

    const imageEl = document.querySelector(".story-image");
    if(imageEl){
        imageEl.addEventListener("mouseenter", () => clearInterval(timer));
        imageEl.addEventListener("mouseleave", resetTimer);
    }

    resetTimer();
})();

/* ---- CURSOR GLOW (desktop only) ---- */
if(window.matchMedia("(pointer:fine)").matches){
    const glow = document.createElement("div");
    glow.style.cssText = "position:fixed;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,.07),transparent 70%);pointer-events:none;z-index:1;transform:translate(-50%,-50%);transition:left .15s ease,top .15s ease;will-change:left,top;";
    document.body.appendChild(glow);
    window.addEventListener("mousemove", e => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
    });
}