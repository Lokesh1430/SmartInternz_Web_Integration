(function() {
  "use strict";

  /**
   * Apply .scrolled class
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');

    if (!selectHeader) return;

    if (
      !selectHeader.classList.contains('scroll-up-sticky') &&
      !selectHeader.classList.contains('sticky-top') &&
      !selectHeader.classList.contains('fixed-top')
    ) return;

    window.scrollY > 100
      ? selectBody.classList.add('scrolled')
      : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn =
    document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {

    document.querySelector('body')
      .classList.toggle('mobile-nav-active');

    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn
      .addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav
   */
  document.querySelectorAll('#navmenu a')
    .forEach(navmenu => {

      navmenu.addEventListener('click', () => {

        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToogle();
        }

      });
    });

  /**
   * Mobile dropdown
   */
  document.querySelectorAll('.navmenu .toggle-dropdown')
    .forEach(navmenu => {

      navmenu.addEventListener('click', function(e) {

        e.preventDefault();

        this.parentNode.classList.toggle('active');

        if(this.parentNode.nextElementSibling){
          this.parentNode.nextElementSibling
            .classList.toggle('dropdown-active');
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

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

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

    GLightbox({
      selector: '.glightbox'
    });

  }

  /**
   * SAFE SWIPER INIT
   */
  function initSwiper() {

    if (typeof Swiper === "undefined") return;

    document.querySelectorAll(".init-swiper")
      .forEach(function(swiperElement) {

        const configEl =
          swiperElement.querySelector(".swiper-config");

        if (!configEl) return;

        let config;

        try {

          config = JSON.parse(
            configEl.innerHTML.trim()
          );

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
  document.querySelectorAll(
    '.faq-item h3, .faq-item .faq-toggle'
  ).forEach((faqItem) => {

    faqItem.addEventListener('click', () => {

      if(faqItem.parentNode){
        faqItem.parentNode.classList.toggle('faq-active');
      }

    });

  });

  /**
   * Skills animation
   */
  document.querySelectorAll('.skills-animation')
    .forEach((item) => {

      if (typeof Waypoint !== "undefined") {

        new Waypoint({

          element: item,

          offset: '80%',

          handler: function() {

            let progress =
              item.querySelectorAll('.progress .progress-bar');

            progress.forEach(el => {

              el.style.width =
                el.getAttribute('aria-valuenow') + '%';

            });

          }

        });

      }
    });

  /**
   * SAFE HASH SCROLL
   */
  window.addEventListener('load', function() {

    if (window.location.hash) {

      const section =
        document.querySelector(window.location.hash);

      if (!section) return;

      setTimeout(() => {

        let scrollMarginTop =
          getComputedStyle(section).scrollMarginTop;

        window.scrollTo({
          top: section.offsetTop - parseInt(scrollMarginTop),
          behavior: 'smooth'
        });

      }, 100);
    }
  });

  /**
   * CONTACT FORM AJAX
   */
  window.addEventListener("load", () => {

    const form =
      document.getElementById("contactForm");

    const popup =
      document.getElementById("successPopup");

    const closeBtn =
      document.getElementById("closePopup");

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
   * Navmenu Scrollspy
   */
  let navmenulinks =
    document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {

    navmenulinks.forEach(navmenulink => {

      if (!navmenulink.hash) return;

      let section =
        document.querySelector(navmenulink.hash);

      if (!section) return;

      let position = window.scrollY + 200;

      if (
        position >= section.offsetTop &&
        position <= (section.offsetTop + section.offsetHeight)
      ) {

        document.querySelectorAll('.navmenu a.active')
          .forEach(link => link.classList.remove('active'));

        navmenulink.classList.add('active');

      } else {

        navmenulink.classList.remove('active');

      }
    });
  }

  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

/* ============================================================
   EV RANGE DASHBOARD — HORIZONTAL DESKTOP FIX
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  const tabs =
    document.querySelectorAll(".range-tab");

  const dashboards =
    document.querySelectorAll(".dashboard-frame");

  if (!tabs.length) return;

  /* =========================================
     FORCE DESKTOP TABLEAU LAYOUT
  ========================================= */

  function forceDesktopLayout(dashboard) {

    const tableauObj =
      dashboard.querySelector(".tableauViz");

    if (!tableauObj) return;

    /* Desktop Horizontal Width */
    tableauObj.style.width = "1800px";

    /* Desktop Height */
    tableauObj.style.height = "1527px";

    /* Prevent Tableau mobile layout */
    tableauObj.style.minWidth = "1800px";

    /* Force redraw */
    window.dispatchEvent(new Event("resize"));
  }

  /* =========================================
     TAB SWITCHING
  ========================================= */

  tabs.forEach(function(tab) {

    tab.addEventListener("click", function () {

      /* Remove active tab */
      tabs.forEach(function(btn) {
        btn.classList.remove("active-tab");
      });

      /* Hide dashboards */
      dashboards.forEach(function(board) {
        board.classList.remove("active-dashboard");
      });

      /* Activate tab */
      this.classList.add("active-tab");

      /* Dashboard ID */
      const dashboardId =
        this.getAttribute("data-dashboard");

      /* Find dashboard */
      const activeDashboard =
        document.getElementById(dashboardId);

      if (activeDashboard) {

        activeDashboard.classList.add("active-dashboard");

        /* Force desktop layout */
        setTimeout(function () {

          forceDesktopLayout(activeDashboard);

        }, 300);
      }

      /* Smooth mobile scroll */
      if (window.innerWidth < 992) {

        const section =
          document.getElementById("range-dashboard");

        if (section) {

          setTimeout(function () {

            section.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }, 100);
        }
      }

    });

  });

  /* =========================================
     INITIAL DASHBOARD FIX
  ========================================= */

  const defaultDashboard =
    document.querySelector(".active-dashboard");

  if (defaultDashboard) {

    setTimeout(function () {

      forceDesktopLayout(defaultDashboard);

    }, 500);
  }

  /* =========================================
     WINDOW RESIZE
  ========================================= */

  window.addEventListener("resize", function () {

    const activeDashboard =
      document.querySelector(".active-dashboard");

    if (activeDashboard) {

      forceDesktopLayout(activeDashboard);

    }

  });

});
