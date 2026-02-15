/**
* Template Name: Arsha
* Updated & Stabilized for Flask + Render
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;

    if (!selectHeader.classList.contains('scroll-up-sticky') &&
        !selectHeader.classList.contains('sticky-top') &&
        !selectHeader.classList.contains('fixed-top')) return;

    window.scrollY > 100
      ? selectBody.classList.add('scrolled')
      : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Mobile dropdown
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      if(this.parentNode.nextElementSibling){
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      }
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => preloader.remove());
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (!scrollTop) return;
    window.scrollY > 100
      ? scrollTop.classList.add('active')
      : scrollTop.classList.remove('active');
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * AOS animation
   */
  function aosInit() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * GLightbox
   */
  if (typeof GLightbox !== "undefined") {
    GLightbox({ selector: '.glightbox' });
  }

  /**
   * SAFE SWIPER INIT  (🔥 FIXED)
   */
  function initSwiper() {
    if (typeof Swiper === "undefined") return;

    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {

      const configEl = swiperElement.querySelector(".swiper-config");
      if (!configEl) return;   // prevent crash

      let config;
      try {
        config = JSON.parse(configEl.innerHTML.trim());
      } catch(e) {
        console.warn("Invalid swiper config");
        return;
      }

      new Swiper(swiperElement, config);
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * FAQ toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      if(faqItem.parentNode){
        faqItem.parentNode.classList.toggle('faq-active');
      }
    });
  });

  /**
   * Skills animation
   */
  document.querySelectorAll('.skills-animation').forEach((item) => {
    if (typeof Waypoint !== "undefined") {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: function() {
          let progress = item.querySelectorAll('.progress .progress-bar');
          progress.forEach(el => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          });
        }
      });
    }
  });

  /**
   * Isotope layout SAFE
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {

    if (typeof Isotope === "undefined" || typeof imagesLoaded === "undefined") return;

    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    const container = isotopeItem.querySelector('.isotope-container');
    if(!container) return;

    imagesLoaded(container, function() {
      initIsotope = new Isotope(container, {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        const active = isotopeItem.querySelector('.filter-active');
        if(active) active.classList.remove('filter-active');
        this.classList.add('filter-active');

        if(initIsotope){
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
        }

        aosInit();
      });
    });
  });

  /**
   * SAFE HASH SCROLL (🔥 FIXED)
   */
  window.addEventListener('load', function() {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (!section) return;

      setTimeout(() => {
        let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
        window.scrollTo({
          top: section.offsetTop - parseInt(scrollMarginTop),
          behavior: 'smooth'
        });
      }, 100);
    }
  });

  /**
   * CONTACT FORM AJAX (🔥 RENDER SAFE)
   */
  window.addEventListener("load", () => {

    const form = document.getElementById("contactForm");
    const popup = document.getElementById("successPopup");
    const closeBtn = document.getElementById("closePopup");

    if (!form) return;

    form.addEventListener("submit", async function(e){
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await fetch("/contact", {
          method: "POST",
          body: formData
        });

        if(!response.ok){
          throw new Error("Server Error");
        }

        const data = await response.json();

        if(data.status === "success"){
          if(popup) popup.style.display = "flex";
          form.reset();
        } else {
          alert("Failed to send message ❌");
        }

      } catch(err){
        console.log("Mail Error:", err);
      }
    });

    if(closeBtn){
      closeBtn.onclick = () => {
        popup.style.display = "none";
      };
    }

  });

  /**
   * Navmenu Scrollspy SAFE
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {

      if (!navmenulink.hash) return;

      let section = document.querySelector(navmenulink.hash);
      if (!section) return;

      let position = window.scrollY + 200;

      if (position >= section.offsetTop &&
          position <= (section.offsetTop + section.offsetHeight)) {

        document.querySelectorAll('.navmenu a.active')
          .forEach(link => link.classList.remove('active'));

        navmenulink.classList.add('active');

      } else {
        navmenulink.classList.remove('active');
      }
    })
  }

  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
