/* =============================================================
   CAROLINA INK — Interactions
   ============================================================= */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky / scrolled header ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile navigation ---------- */
  var hamburger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobileNav");
  var mobileNavOverlay = document.getElementById("mobileNavOverlay");
  var mobileNavClose = document.getElementById("mobileNavClose");
  var mobileLinks = document.querySelectorAll(".mobile-nav-link, .mobile-nav .btn-gold");

  function openMobileNav() {
    mobileNav.classList.add("is-open");
    mobileNavOverlay.classList.add("is-open");
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    mobileNav.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    mobileNavOverlay.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  hamburger.addEventListener("click", function () {
    mobileNav.classList.contains("is-open") ? closeMobileNav() : openMobileNav();
  });
  mobileNavClose.addEventListener("click", closeMobileNav);
  mobileNavOverlay.addEventListener("click", closeMobileNav);
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileNav();
  });

  /* ---------- Smooth anchor scrolling (with header offset) ---------- */
  var headerHeight = header.offsetHeight;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - (header.offsetHeight - 1);
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- Active nav highlighting ---------- */
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = Array.prototype.slice.call(navLinks).map(function (link) {
    var id = link.getAttribute("href");
    return document.querySelector(id);
  }).filter(Boolean);

  function updateActiveNav() {
    var scrollPos = window.scrollY + header.offsetHeight + 40;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      link.classList.toggle("active", current && current.id === id);
    });
  }
  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll(".reveal-up");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute("data-reveal-delay");
          if (delay) {
            entry.target.style.transitionDelay = (parseInt(delay, 10) * 0.12) + "s";
          }
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    question.addEventListener("click", function () {
      var isOpen = question.getAttribute("aria-expanded") === "true";

      // close others in same column set for a tidy accordion feel (optional: allow multi-open)
      faqItems.forEach(function (other) {
        if (other !== item) {
          var q = other.querySelector(".faq-question");
          var a = other.querySelector(".faq-answer");
          q.setAttribute("aria-expanded", "false");
          a.style.maxHeight = null;
        }
      });

      if (isOpen) {
        question.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = null;
      } else {
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- Testimonial carousel ---------- */
  var track = document.getElementById("testimonialTrack");
  var slides = track ? track.querySelectorAll(".testimonial-slide") : [];
  var dotsWrap = document.getElementById("testimonialDots");
  var prevBtn = document.getElementById("testPrev");
  var nextBtn = document.getElementById("testNext");
  var current = 0;
  var autoplayTimer;

  if (slides.length) {
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "testimonial-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      dot.addEventListener("click", function () { goToSlide(i); resetAutoplay(); });
      dotsWrap.appendChild(dot);
    });

    function goToSlide(index) {
      slides[current].classList.remove("active");
      dotsWrap.children[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("active");
      dotsWrap.children[current].classList.add("active");
    }

    prevBtn.addEventListener("click", function () { goToSlide(current - 1); resetAutoplay(); });
    nextBtn.addEventListener("click", function () { goToSlide(current + 1); resetAutoplay(); });

    function startAutoplay() {
      if (prefersReducedMotion) return;
      autoplayTimer = setInterval(function () { goToSlide(current + 1); }, 6000);
    }
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }
    startAutoplay();

    var testimonialSection = document.querySelector(".testimonial-section");
    testimonialSection.addEventListener("mouseenter", function () { clearInterval(autoplayTimer); });
    testimonialSection.addEventListener("mouseleave", startAutoplay);
  }

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = document.querySelectorAll(".gallery-item");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  var galleryArr = Array.prototype.slice.call(galleryItems);
  var lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = index;
    var item = galleryArr[lightboxIndex];
    var img = item.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.getAttribute("data-caption") || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function showRelative(delta) {
    openLightbox((lightboxIndex + delta + galleryArr.length) % galleryArr.length);
  }

  galleryArr.forEach(function (item, i) {
    item.addEventListener("click", function () { openLightbox(i); });
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", function () { showRelative(-1); });
  lightboxNext.addEventListener("click", function () { showRelative(1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showRelative(-1);
    if (e.key === "ArrowRight") showRelative(1);
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", function () {
    backToTop.classList.toggle("is-visible", window.scrollY > 700);
  }, { passive: true });
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Custom cursor (desktop only) ---------- */
  var isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (isDesktop && !prefersReducedMotion) {
    var cursor = document.getElementById("customCursor");
    var cursorDot = document.getElementById("customCursorDot");
    var cx = 0, cy = 0, dx = 0, dy = 0;

    window.addEventListener("mousemove", function (e) {
      dx = e.clientX; dy = e.clientY;
      cursorDot.style.left = dx + "px";
      cursorDot.style.top = dy + "px";
    });

    function animateCursor() {
      cx += (dx - cx) * 0.18;
      cy += (dy - cy) * 0.18;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll("a, button, .gallery-item").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("is-active"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("is-active"); });
    });
  } else {
    var cEl = document.getElementById("customCursor");
    var cdEl = document.getElementById("customCursorDot");
    if (cEl) cEl.style.display = "none";
    if (cdEl) cdEl.style.display = "none";
  }
})();