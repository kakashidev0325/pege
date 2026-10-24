const CONFIG = {
  tokenAddress: "",
  pumpFunUrl: "",
  twitter: "https://x.com/solpege_x",
  telegram: "https://t.me/solpege_tg",
};

function getPumpFunUrl() {
  if (CONFIG.pumpFunUrl) return CONFIG.pumpFunUrl;
  if (CONFIG.tokenAddress) return `https://pump.fun/coin/${CONFIG.tokenAddress}`;
  return "https://pump.fun";
}

function initContract() {
  const display = document.getElementById("ca-display");
  const copyBtn = document.getElementById("copy-ca");
  const toast = document.getElementById("copy-toast");
  const address = CONFIG.tokenAddress;

  if (!address) {
    display.textContent = "TBA";
    copyBtn.disabled = true;
    copyBtn.title = "Contract address coming soon";
    return;
  }

  display.textContent = address;

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(address);
      copyBtn.classList.add("copied");
      copyBtn.textContent = "Copied";
      toast.textContent = "Contract address copied.";
      toast.classList.add("show");

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.textContent = "Copy";
        toast.classList.remove("show");
      }, 2500);
    } catch {
      toast.textContent = "Copy failed — select and copy manually.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initSocialLinks() {
  const pumpUrl = getPumpFunUrl();

  document.querySelectorAll("[data-pumpfun]").forEach((el) => {
    el.href = pumpUrl;
  });

  document.querySelectorAll("[data-telegram]").forEach((el) => {
    if (CONFIG.telegram) el.href = CONFIG.telegram;
  });

  document.querySelectorAll("[data-twitter]").forEach((el) => {
    if (CONFIG.twitter) el.href = CONFIG.twitter;
  });
}

function initMotion() {
  const header = document.querySelector(".site-header");
  const bar = document.querySelector(".scroll-progress");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 16);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const groups = [
    ".proof-bar p",
    ".section-head",
    ".section-lede",
    ".banner-frame",
    ".meme-card",
    ".x-card",
    ".about-visual",
    ".about-copy",
    ".ca-box",
    ".token-board article",
    ".steps li",
    ".buy-cta",
  ];

  document.querySelectorAll(groups.join(",")).forEach((el) => {
    el.classList.add("reveal");
  });

  document.querySelectorAll(".meme-wall .meme-card, .token-board article, .steps li, .proof-bar p").forEach((el) => {
    const siblings = [...el.parentElement.children];
    el.style.setProperty("--d", `${siblings.indexOf(el) * 80}ms`);
  });

  if (reduce || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

initContract();
initNav();
initSocialLinks();
initMotion();
