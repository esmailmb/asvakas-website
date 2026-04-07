/* ── Region Picker ── */
(function () {
  const STORAGE_KEY = "asvakas_region";

  const REGIONS = {
    usa:    { flag: "🇺🇸", label: "USA",    heroTag: "NYC Structural Engineering",       heroSub: "Asvakas Engineering helps owners and developers deliver safer, smarter projects across New York City." },
    canada: { flag: "🇨🇦", label: "Canada", heroTag: "Canadian Structural Engineering", heroSub: "Asvakas Engineering helps owners and developers deliver safer, smarter projects across Canada." },
  };

  function applyRegion(region, fromUserClick) {
    const isCanada = window.location.pathname.includes('/canada/');
    const rawFile  = window.location.pathname.split('/').pop();
    const file     = rawFile || 'index.html';

    // Redirect when user actively picks a different region
    if (fromUserClick) {
      if (region === 'canada' && !isCanada) {
        localStorage.setItem(STORAGE_KEY, region);
        window.location.href = 'canada/' + file;
        return;
      }
      if (region === 'usa' && isCanada) {
        localStorage.setItem(STORAGE_KEY, region);
        window.location.href = '../' + file;
        return;
      }
    }

    localStorage.setItem(STORAGE_KEY, region);
    const data = REGIONS[region];

    // Update button display
    document.querySelectorAll(".rp-flag").forEach(el => el.textContent = data.flag);
    document.querySelectorAll(".rp-label").forEach(el => el.textContent = data.label);

    // Mark active option
    document.querySelectorAll(".rp-option").forEach(el => {
      el.classList.toggle("active", el.dataset.region === region);
    });

    // Update hero text (index.html only)
    const heroTag = document.querySelector("[data-region-tag]");
    const heroSub = document.querySelector("[data-region-sub]");
    if (heroTag) heroTag.textContent = data.heroTag;
    if (heroSub) heroSub.textContent = data.heroSub;
  }

  function closeAll() {
    document.querySelectorAll(".rp-dropdown.open").forEach(d => d.classList.remove("open"));
    document.querySelectorAll(".rp-btn").forEach(b => b.setAttribute("aria-expanded", "false"));
  }

  // Toggle dropdown on button click
  document.querySelectorAll(".rp-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const dropdown = btn.nextElementSibling;
      const isOpen = dropdown.classList.contains("open");
      closeAll();
      if (!isOpen) {
        dropdown.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Select option
  document.querySelectorAll(".rp-option").forEach(opt => {
    opt.addEventListener("click", () => {
      applyRegion(opt.dataset.region, true);
      closeAll();
    });
  });

  // Close on outside click
  document.addEventListener("click", closeAll);

  // On load — default to Canada when on /canada/ path, otherwise USA
  const isCanadaPath = window.location.pathname.includes('/canada/');
  const saved = localStorage.getItem(STORAGE_KEY) || (isCanadaPath ? "canada" : "usa");
  applyRegion(saved);
})();
