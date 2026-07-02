/* =========================================================
   EAGLE LOGISTICS & RELOCATIONS — main.js
   Modular, dependency-free site behavior.

   NOTE: Header scroll-state, mobile nav toggle, active-nav-link
   highlighting and the footer year are now handled centrally by
   js/load-components.js (which injects the header/footer markup
   itself). Keeping that logic in one file avoids duplicate event
   listeners / class toggles running against the same elements.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el, i) {
      el.style.setProperty("--i", i % 6);
      observer.observe(el);
    });
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-counter"));
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1400;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        el.textContent = (target % 1 !== 0 ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("is-visible", window.scrollY > 600);
      },
      { passive: true }
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Newsletter (frontend-only) ---------- */
  function initNewsletter() {
    var form = document.querySelector(".footer-newsletter form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input[type=email]");
      if (input && input.checkValidity()) {
        input.value = "";
        input.placeholder = "Subscribed — thank you!";
        setTimeout(function () { input.placeholder = "Your email address"; }, 3500);
      } else if (input) {
        input.reportValidity();
      }
    });
  }

  /* ---------- Contact form: validation + real submission ----------
     Frontend validation runs first. On success, if the form's
     `action` attribute points to a real endpoint (Formspree,
     Netlify Forms, a serverless function, etc.) the data is sent
     there via fetch with proper success/error handling. With no
     `action` attribute set, it falls back to a simulated success
     so the form is demo-able out of the box — no JS changes
     needed once a real backend is wired up. */
  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;

    var status = form.querySelector(".form-status");

    var validators = {
      name: function (v) { return v.trim().length >= 2 || "Please enter your full name."; },
      email: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Please enter a valid email address.";
      },
      phone: function (v) {
        if (!v.trim()) return true;
        return /^[+0-9 ()-]{7,20}$/.test(v.trim()) || "Please enter a valid phone number.";
      },
      service: function (v) { return v.trim().length > 0 || "Please select a service."; },
      message: function (v) { return v.trim().length >= 10 || "Please tell us a little more (10+ characters)."; }
    };

    function showFieldError(field, message) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.toggle("has-error", !!message);
      var err = wrap.querySelector(".field-error");
      if (err) err.textContent = message || "";
    }

    function validateField(field) {
      var rule = validators[field.name];
      if (!rule) return true;
      var result = rule(field.value);
      showFieldError(field, result === true ? "" : result);
      return result === true;
    }

    Array.prototype.forEach.call(form.elements, function (field) {
      if (validators[field.name]) {
        field.addEventListener("blur", function () { validateField(field); });
        field.addEventListener("input", function () {
          if (field.closest(".field").classList.contains("has-error")) validateField(field);
        });
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      Array.prototype.forEach.call(form.elements, function (field) {
        if (validators[field.name] && !validateField(field)) valid = false;
      });

      if (!valid) {
        if (status) {
          status.className = "form-status is-error";
          status.textContent = "Please correct the highlighted fields and try again.";
        }
        var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      var submitBtn = form.querySelector("button[type=submit]");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      function showSuccess() {
        if (status) {
          status.className = "form-status is-success";
          status.textContent = "Thank you — your enquiry has been received. Our team will respond within one business day.";
        }
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Enquiry";
        }
      }

      function showSubmitError() {
        if (status) {
          status.className = "form-status is-error";
          status.textContent = "Something went wrong sending your enquiry. Please try again, or reach us directly by phone or email.";
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Enquiry";
        }
      }

      /* If a real backend is wired up (Formspree, Netlify Forms, a serverless
         function, etc.) via the form's action attribute, actually send the
         data there. Until then -- with no action attribute set -- this falls
         back to a simulated success so the form is demo-able out of the box. */
      var actionUrl = form.getAttribute("action");
      if (actionUrl && actionUrl !== "#") {
        fetch(actionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
          },
          body: new URLSearchParams(new FormData(form)).toString()
        })
          .then(function (response) {
            if (response.ok) {
              showSuccess();
            } else {
              showSubmitError();
            }
          })
          .catch(showSubmitError);
      } else {
        setTimeout(showSuccess, 900);
      }
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initCounters();
    initBackToTop();
    initNewsletter();
    initContactForm();
  });
})();
