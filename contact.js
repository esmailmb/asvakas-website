/* ── Contact form → Formspree direct submission ── */
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    /* Build the data payload */
    const data = {};

    /* (1) Service type — human-readable label */
    const svcSel = document.getElementById("serviceType");
    if (svcSel && svcSel.value) {
      const opt = svcSel.options[svcSel.selectedIndex];
      data["Service Type"] = opt ? opt.text : svcSel.value;
    }

    /* (2) Only the currently-active dyn-group fields */
    const activeGroup = contactForm.querySelector(".dyn-group.dyn-active");
    if (activeGroup) {
      activeGroup.querySelectorAll("input, select, textarea").forEach(function (el) {
        if (!el.name || el.type === "hidden") return;
        const val = (el.value || "").trim();
        if (!val || val === "Select...") return;
        data[el.name.replace(/-/g, " ")] = val;
      });
    }

    /* (3) Always-on contact fields */
    ["fullName", "email", "message"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el && el.value.trim()) {
        data[el.name.replace(/-/g, " ")] = el.value.trim();
      }
    });

    try {
      /* ← After deploying to Render, replace the URL below with your Render service URL */
      const res = await fetch("https://YOUR_RENDER_SERVICE.onrender.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        contactForm.style.display = "none";
        if (formSuccess) formSuccess.classList.add("visible");
      } else {
        throw new Error(json.error || "Submission failed");
      }
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message \u2192";
      }
      alert("Sorry, your message could not be sent. Please email us directly at info@asvakas.com");
    }
  });
}

/* ── Custom service dropdown ── */
(function initSvcDropdown() {
  const dropdown    = document.getElementById("svcDropdown");
  if (!dropdown) return;

  const trigger     = dropdown.querySelector(".svc-trigger");
  const triggerText = dropdown.querySelector(".svc-trigger-text");
  const panel       = dropdown.querySelector(".svc-panel");
  const nativeSel   = document.getElementById("serviceType");
  const opts        = Array.from(dropdown.querySelectorAll(".svc-opt"));
  let focusedIdx    = -1;

  function openPanel() {
    dropdown.setAttribute("aria-expanded", "true");
    const selIdx = opts.findIndex(o => o.getAttribute("aria-selected") === "true");
    focusedIdx = selIdx >= 0 ? selIdx : 0;
    moveFocus(focusedIdx);
  }

  function closePanel() {
    dropdown.setAttribute("aria-expanded", "false");
    opts.forEach(o => o.classList.remove("svc-focused"));
    trigger.focus();
  }

  function moveFocus(idx) {
    opts.forEach((o, i) => o.classList.toggle("svc-focused", i === idx));
    if (opts[idx]) opts[idx].scrollIntoView({ block: "nearest" });
  }

  function pickOption(opt) {
    const val = opt.dataset.value;
    triggerText.textContent = opt.textContent.trim();
    triggerText.classList.remove("svc-placeholder");
    opts.forEach(o => o.setAttribute("aria-selected", "false"));
    opt.setAttribute("aria-selected", "true");
    nativeSel.value = val;
    nativeSel.dispatchEvent(new Event("change", { bubbles: true }));
    closePanel();
  }

  /* Toggle on trigger click */
  trigger.addEventListener("click", () => {
    dropdown.getAttribute("aria-expanded") === "true" ? closePanel() : openPanel();
  });

  /* Click on option */
  opts.forEach((opt, idx) => {
    opt.addEventListener("click", () => pickOption(opt));
    opt.addEventListener("mouseenter", () => { focusedIdx = idx; moveFocus(idx); });
  });

  /* Keyboard */
  trigger.addEventListener("keydown", e => {
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      openPanel();
    }
  });

  dropdown.addEventListener("keydown", e => {
    if (dropdown.getAttribute("aria-expanded") !== "true") return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusedIdx = Math.min(focusedIdx + 1, opts.length - 1);
      moveFocus(focusedIdx);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusedIdx = Math.max(focusedIdx - 1, 0);
      moveFocus(focusedIdx);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusedIdx >= 0) pickOption(opts[focusedIdx]);
    } else if (e.key === "Escape" || e.key === "Tab") {
      closePanel();
    }
  });

  /* Close on outside click */
  document.addEventListener("click", e => {
    if (dropdown.getAttribute("aria-expanded") === "true" && !dropdown.contains(e.target)) {
      closePanel();
    }
  });
})();

/* ── Dynamic service-aware form fields ── */
(function initDynamicForm() {
  const svcSelect = document.getElementById("serviceType");
  if (!svcSelect) return;

  const groups = document.querySelectorAll(".dyn-group");

  /* Save original required state from HTML, then clear them all initially */
  groups.forEach(group => {
    group.querySelectorAll("input, select, textarea").forEach(el => {
      el.dataset.origRequired = el.required ? "1" : "0";
      el.required = false;
    });
  });

  function activateGroup(svcValue) {
    groups.forEach(group => {
      const isMatch = group.dataset.group === svcValue;
      group.classList.toggle("dyn-active", isMatch);

      /* Restore or clear required based on visibility */
      group.querySelectorAll("input, select, textarea").forEach(el => {
        el.required = isMatch && el.dataset.origRequired === "1";

        /* Clear values when group is hidden so stale data isn't sent */
        if (!isMatch && el.type !== "hidden") {
          if (el.tagName === "SELECT") el.selectedIndex = 0;
          else if (el.type !== "submit") el.value = "";
        }
      });
    });
  }

  svcSelect.addEventListener("change", () => activateGroup(svcSelect.value));
  activateGroup(svcSelect.value); /* apply on page load if value pre-selected */
})();

/* ── FAQ accordion ── */
const faqEntries = Array.from(document.querySelectorAll(".faq-entry"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setEntryState = (entry, isOpen) => {
  const trigger = entry.querySelector(".faq-item");
  const icon = entry.querySelector(".icon");

  entry.classList.toggle("open", isOpen);

  if (trigger) {
    trigger.classList.toggle("open", isOpen);
    trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  if (icon) {
    icon.textContent = isOpen ? "⌄" : "⌃";
  }
};

faqEntries.forEach(entry => {
  const trigger = entry.querySelector(".faq-item");
  if (!trigger) return;

  // Respect markup state so items stay closed until clicked.
  setEntryState(entry, entry.classList.contains("open"));

  trigger.addEventListener("click", () => {
    const willOpen = !entry.classList.contains("open");

    faqEntries.forEach(otherEntry => setEntryState(otherEntry, false));
    setEntryState(entry, willOpen);

    if (willOpen) {
      const topOffset = 120;
      const targetY = window.scrollY + trigger.getBoundingClientRect().top - topOffset;

      window.scrollTo({
        top: Math.max(targetY, 0),
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    }
  });
});

const faqScrollItems = Array.from(document.querySelectorAll(".faq-item"));

if (faqScrollItems.length > 0) {
  const reduceMotion = prefersReducedMotion;

  if (!reduceMotion && "IntersectionObserver" in window) {
    const faqObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    });

    faqScrollItems.forEach(item => faqObserver.observe(item));
  } else {
    faqScrollItems.forEach(item => item.classList.add("is-visible"));
  }

  let faqTicking = false;

  const updateFaqDynamics = () => {
    const viewportAnchor = window.innerHeight * 0.55;
    const maxDistance = window.innerHeight * 0.7;

    faqScrollItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const center = rect.top + (rect.height / 2);
      const distance = Math.abs(center - viewportAnchor);
      const focus = Math.max(0, 1 - (distance / maxDistance));
      const floatY = focus * 10;

      item.style.setProperty("--faq-float", `${floatY.toFixed(2)}px`);
      item.classList.toggle("is-active", focus > 0.68);
    });

    faqTicking = false;
  };

  const requestFaqUpdate = () => {
    if (faqTicking) return;
    faqTicking = true;
    window.requestAnimationFrame(updateFaqDynamics);
  };

  updateFaqDynamics();
  window.addEventListener("scroll", requestFaqUpdate, { passive: true });
  window.addEventListener("resize", requestFaqUpdate);
}
