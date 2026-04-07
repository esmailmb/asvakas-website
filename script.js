const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const siteHeader = document.querySelector(".site-header");

navToggle?.addEventListener("click", () => {
  mainNav?.classList.toggle("active");
});

function updateHeaderState() {
  if (!siteHeader) return;
  siteHeader.classList.toggle("scrolled", window.scrollY > 120);
}

// ── Scroll Progress Bar ──
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.prepend(progressBar);

// ── Scroll-to-Top Button ──
const scrollTopBtn = document.createElement("button");
scrollTopBtn.className = "scroll-top-btn";
scrollTopBtn.setAttribute("aria-label", "Back to top");
scrollTopBtn.innerHTML = "&#8593;";
document.body.appendChild(scrollTopBtn);
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function onScroll() {
  updateHeaderState();

  // Progress bar
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = total > 0 ? ((scrolled / total) * 100).toFixed(2) + "%" : "0%";

  // Scroll-to-top visibility
  scrollTopBtn.classList.toggle("visible", scrolled > 400);
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
  link.addEventListener("click", event => {
    if (link.hash.length > 0) {
      event.preventDefault();
      const target = document.querySelector(link.hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (mainNav?.classList.contains("active")) {
        mainNav.classList.remove("active");
      }
    }
  });
});

// ── Featured Projects Slider ──
window.projectData = window.projectData || [
  {
    image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
    alt: "The Grand Oak Mansion",
    caption: "A meticulous restoration of a historic mansion, preserving its classic architecture while integrating modern amenities for a luxurious living experience.",
    tag: "Renovation",
    title: "The Grand Oak<br>Mansion",
    year: "2025",
    client: "Miller Estate"
  },
  {
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1400&q=80",
    alt: "Riverside Office Complex",
    caption: "Full structural design and peer review for a six-story mixed-use commercial building with post-tensioned concrete slabs and moment frames.",
    tag: "Structural Design",
    title: "Riverside Office<br>Complex",
    year: "2024",
    client: "Metro Developers LLC"
  },
  {
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80",
    alt: "Brooklyn Shoring System",
    caption: "Custom temporary shoring and underpinning design for a deep-basement excavation adjacent to occupied buildings in a dense urban block.",
    tag: "Temporary Works",
    title: "Brooklyn Shoring<br>System",
    year: "2024",
    client: "Urban Core Construction"
  },
  {
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80",
    alt: "Hudson Tower Retrofit",
    caption: "Seismic and wind-load retrofit of an occupied high-rise with phased construction planning to keep operations running throughout delivery.",
    tag: "Retrofit",
    title: "Hudson Tower<br>Retrofit",
    year: "2023",
    client: "Hudson Property Group"
  },
  {
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=80",
    alt: "Queens Community Hub",
    caption: "Ground-up community facility engineered with long-span steel framing, efficient foundations, and streamlined permit coordination.",
    tag: "Ground-Up Build",
    title: "Queens Community<br>Hub",
    year: "2023",
    client: "CityWorks Initiative"
  }
];

window.projectDataDefault = window.projectDataDefault || window.projectData;
const slideImg     = document.querySelector(".slide-img");
const slideCaption = document.querySelector(".slide-caption");
const slideTag     = document.querySelector(".slide-tag");
const slideTitle   = document.querySelector(".slide-title");
const slideYear    = document.querySelector(".slide-year");
const slideClient  = document.querySelector(".slide-client");
const navBtns      = document.querySelectorAll(".slide-nav-btn");

let currentSlide = 0;
let autoPlay;

function goToSlide(index) {
  if (index === currentSlide) return;

  const fadeable = [slideImg, slideCaption, slideTag, slideTitle, slideYear, slideClient];
  fadeable.forEach(el => el?.classList.add("fading"));

  setTimeout(() => {
    const p = window.projectData[index];
    if (slideImg)     { slideImg.src = p.image; slideImg.alt = p.alt; }
    if (slideCaption) slideCaption.textContent = p.caption;
    if (slideTag)     slideTag.textContent = p.tag;
    if (slideTitle)   slideTitle.innerHTML  = p.title;
    if (slideYear)    slideYear.textContent = p.year;
    if (slideClient)  slideClient.textContent = p.client;

    fadeable.forEach(el => el?.classList.remove("fading"));
    navBtns.forEach((btn, i) => btn.classList.toggle("active", i === index));
    currentSlide = index;
  }, 400);
}

navBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    clearInterval(autoPlay);
    goToSlide(i);
    startAutoPlay();
  });
});

function startAutoPlay() {
  autoPlay = setInterval(() => {
    goToSlide((currentSlide + 1) % window.projectData.length);
  }, 5000);
}

if (slideImg) startAutoPlay();

// Expose slide control for language switching
window.goToSlideForce = function(idx) {
  if (idx === undefined) idx = currentSlide;
  const p = window.projectData[idx];
  if (!p || !slideImg) return;
  [slideImg, slideCaption, slideTag, slideTitle, slideYear, slideClient]
    .forEach(el => el && el.classList.add('fading'));
  setTimeout(() => {
    if (slideImg)     { slideImg.src = p.image; slideImg.alt = p.alt; }
    if (slideCaption) slideCaption.textContent = p.caption;
    if (slideTag)     slideTag.textContent = p.tag;
    if (slideTitle)   slideTitle.innerHTML = p.title;
    if (slideYear)    slideYear.textContent = p.year;
    if (slideClient)  slideClient.textContent = p.client;
    [slideImg, slideCaption, slideTag, slideTitle, slideYear, slideClient]
      .forEach(el => el && el.classList.remove('fading'));
    navBtns.forEach((btn, i) => btn.classList.toggle('active', i === idx));
    currentSlide = idx;
  }, 400);
};
window.getCurrentSlideIndex = function() { return currentSlide; };

// ── Testimonials Slider ──
const testimonialTrack = document.querySelector(".testimonial-track");
const testimonialCards = Array.from(document.querySelectorAll(".testimonial-card"));
const testimonialPrev = document.querySelector(".testimonial-prev");
const testimonialNext = document.querySelector(".testimonial-next");
const testimonialDots = document.querySelector(".testimonial-dots");

let testimonialIndex = 0;
let testimonialPages = 0;
let testimonialAutoPlay;

function testimonialVisibleCount() {
  return window.matchMedia("(max-width: 1040px)").matches ? 1 : 2;
}

function testimonialMaxIndex() {
  return Math.max(0, testimonialCards.length - testimonialVisibleCount());
}

function buildTestimonialDots() {
  if (!testimonialDots) return;
  testimonialDots.innerHTML = "";
  testimonialPages = testimonialMaxIndex() + 1;

  for (let i = 0; i < testimonialPages; i += 1) {
    const dot = document.createElement("button");
    dot.className = "testimonial-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to testimonial page ${i + 1}`);
    dot.dataset.index = String(i);
    testimonialDots.appendChild(dot);
  }
}

function updateTestimonialSlider() {
  if (!testimonialTrack || testimonialCards.length === 0) return;

  const firstCard = testimonialCards[0];
  const trackStyles = getComputedStyle(testimonialTrack);
  const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || "0");
  const cardWidth = firstCard.getBoundingClientRect().width;
  const translateX = testimonialIndex * (cardWidth + gap);

  testimonialTrack.style.transform = `translateX(-${translateX}px)`;

  const max = testimonialMaxIndex();
  if (testimonialPrev) testimonialPrev.disabled = testimonialIndex <= 0;
  if (testimonialNext) testimonialNext.disabled = testimonialIndex >= max;

  if (testimonialDots) {
    Array.from(testimonialDots.children).forEach((dot, i) => {
      dot.classList.toggle("active", i === testimonialIndex);
    });
  }
}

function startTestimonialAutoPlay() {
  clearInterval(testimonialAutoPlay);
  testimonialAutoPlay = window.setInterval(() => {
    const max = testimonialMaxIndex();
    testimonialIndex = testimonialIndex >= max ? 0 : testimonialIndex + 1;
    updateTestimonialSlider();
  }, 5200);
}

function stopTestimonialAutoPlay() {
  clearInterval(testimonialAutoPlay);
}

if (testimonialTrack && testimonialCards.length > 0) {
  buildTestimonialDots();
  updateTestimonialSlider();
  startTestimonialAutoPlay();

  testimonialPrev?.addEventListener("click", () => {
    testimonialIndex = Math.max(0, testimonialIndex - 1);
    updateTestimonialSlider();
    startTestimonialAutoPlay();
  });

  testimonialNext?.addEventListener("click", () => {
    testimonialIndex = Math.min(testimonialMaxIndex(), testimonialIndex + 1);
    updateTestimonialSlider();
    startTestimonialAutoPlay();
  });

  testimonialDots?.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const index = Number(target.dataset.index);
    if (Number.isNaN(index)) return;
    testimonialIndex = Math.max(0, Math.min(testimonialMaxIndex(), index));
    updateTestimonialSlider();
    startTestimonialAutoPlay();
  });

  testimonialTrack.addEventListener("mouseenter", stopTestimonialAutoPlay);
  testimonialTrack.addEventListener("mouseleave", startTestimonialAutoPlay);

  window.addEventListener("resize", () => {
    const max = testimonialMaxIndex();
    testimonialIndex = Math.min(testimonialIndex, max);
    buildTestimonialDots();
    updateTestimonialSlider();
    startTestimonialAutoPlay();
  });
}

// Scroll reveal for text content only (headlines stay static)
const revealSelectors = [
  "main > section h1",
  "main > section .section-label-pill",
  ".services-section .section-label-pill",
  ".services-section h2",
  ".services-section h3",
  ".services-section .svc-cat-label",
  ".why-section .section-label-pill",
  ".why-section .why-heading",
  ".why-section h4",
  "main > section h2",
  "main > section h3",
  "main > section h4",
  ".process-section .section-label-pill",
  ".process-section h2",
  ".process-section h3",
  ".process-section .process-step",
  ".process-section .process-intro h2",
  "main > section p",
  "main > section li",
  "main > section img",
  "main > section .btn",
  "main > section .stat-card",
  "main > section .why-icon",
  "main > section .svc-num",
  "main > section .slide-tag",
  "main > section .slide-year",
  "main > section .slide-client",
  "main > section .slide-nav",
  "main > section .process-step-count",
  "main > section .testimonial-card",
  "main > section .testimonial-controls",
  "main > section .testimonial-dots",
  ".blog-meta-row time",
  ".blog-pill",
  ".blog-author"
];

const rawRevealTargets = [...new Set(
  revealSelectors.flatMap(selector => Array.from(document.querySelectorAll(selector)))
)];

// Avoid parent+child double animations that can cause text overlap in sections like Process.
const revealTargets = rawRevealTargets.filter(el => {
  if (el.classList.contains("process-step") || el.closest(".process-step")) {
    return false;
  }

  let parent = el.parentElement;

  while (parent) {
    if (rawRevealTargets.includes(parent)) return false;
    parent = parent.parentElement;
  }

  return true;
});

const sectionRevealCounts = new WeakMap();

revealTargets.forEach(el => {
  el.classList.add("reveal-text");
  const section = el.closest("section") || document.body;
  const count = sectionRevealCounts.get(section) || 0;
  const delay = Math.min(count * 70, 420);
  el.style.setProperty("--reveal-delay", `${delay}ms`);
  sectionRevealCounts.set(section, count + 1);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -8% 0px"
  });

  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add("is-visible"));
}

// Process section: reveal-on-scroll + viewport-focus dynamics
const processSteps = Array.from(document.querySelectorAll(".process-step"));

if (processSteps.length > 0) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    const processStepObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px"
    });

    processSteps.forEach(step => processStepObserver.observe(step));
  } else {
    processSteps.forEach(step => step.classList.add("is-visible"));
  }

  let processTicking = false;

  const updateProcessStepDynamics = () => {
    const viewportAnchor = window.innerHeight * 0.45;
    const maxDistance = window.innerHeight * 0.68;

    processSteps.forEach(step => {
      const rect = step.getBoundingClientRect();
      const center = rect.top + (rect.height / 2);
      const distance = Math.abs(center - viewportAnchor);
      const focus = Math.max(0, 1 - (distance / maxDistance));
      const floatY = focus * 14;

      step.style.setProperty("--focus", focus.toFixed(3));
      step.style.setProperty("--float-y", `${floatY.toFixed(2)}px`);
      step.classList.toggle("is-active", focus > 0.72);
    });

    processTicking = false;
  };

  const requestProcessUpdate = () => {
    if (processTicking) return;
    processTicking = true;
    window.requestAnimationFrame(updateProcessStepDynamics);
  };

  updateProcessStepDynamics();
  window.addEventListener("scroll", requestProcessUpdate, { passive: true });
  window.addEventListener("resize", requestProcessUpdate);
}

// -- Stat Counter Animation --------------------------------
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  el.textContent = '0' + suffix;
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));
