(function () {
  window.dataLayer = window.dataLayer || [];
  const trackEvent = (event, params = {}) => window.dataLayer.push({ event, ...params });
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const leadForm = document.getElementById("leadForm");
  const feedback = document.getElementById("formFeedback");
  const leadProduct = document.getElementById("leadProduct");
  const allowedProducts = ["0800 / 400x", "Omnichannel", "SMS Corporativo", "Aparelhos IP", "PABX em Nuvem", "Rotas de Voz", "White Label"];
  const requestedProduct = new URLSearchParams(window.location.search).get("produto");
  if (leadProduct && allowedProducts.includes(requestedProduct)) leadProduct.value = requestedProduct;

  const productLabels = {
    "0800-400x": "0800 / 400x",
    "omnichannel": "Omnichannel",
    "sms": "SMS Corporativo",
    "aparelho-ip": "Aparelhos IP",
    "pabx-em-nuvem": "PABX em Nuvem",
    "rotas": "Rotas de Voz",
    "white-label": "White Label"
  };
  const pageProduct = document.querySelector("[data-product-page]")?.dataset.productPage;
  const contactProduct = allowedProducts.includes(requestedProduct)
    ? requestedProduct
    : productLabels[pageProduct];
  const whatsappMessage = contactProduct
    ? `Olá! Vim pelo site da Conectel e gostaria de conversar sobre ${contactProduct}.`
    : "Olá! Vim pelo site da Conectel e gostaria de falar com um especialista.";
  const whatsappLink = new URL("https://wa.me/5511999302690");
  whatsappLink.searchParams.set("text", whatsappMessage);

  const whatsappShortcut = document.createElement("a");
  whatsappShortcut.className = "whatsapp-float";
  whatsappShortcut.href = whatsappLink.toString();
  whatsappShortcut.target = "_blank";
  whatsappShortcut.rel = "noopener noreferrer";
  whatsappShortcut.setAttribute("aria-label", contactProduct
    ? `Falar no WhatsApp sobre ${contactProduct}`
    : "Falar com a Conectel pelo WhatsApp");
  whatsappShortcut.title = whatsappShortcut.getAttribute("aria-label");
  whatsappShortcut.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.4-4.9A8.4 8.4 0 1 1 20.5 11.8Z"/><path d="M8.5 8.1c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4 0 .6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .5-.2 1.3-.7 1.7-.5.5-1.2.8-2 .7-1.1-.1-2.5-.7-4-2-1.2-1-2.1-2.4-2.4-3.3-.3-.9-.1-1.8.4-2.5.2-.3.5-.5.8-.5Z"/></svg><span class="sr-only">WhatsApp</span>';
  document.body.append(whatsappShortcut);

  if (contactProduct) {
    trackEvent("view_product", { product_name: contactProduct, page_path: window.location.pathname });
  }

  const solutionFinder = document.getElementById("solutionFinder");
  solutionFinder?.addEventListener("submit", (event) => {
    event.preventDefault();
    const products = {
      "pabx-em-nuvem": { name: "PABX em Nuvem", file: "pabx-em-nuvem.html" },
      "0800-400x": { name: "0800 / 400x", file: "0800-400x.html" },
      omnichannel: { name: "Omnichannel", file: "omnichannel.html" },
      sms: { name: "SMS Corporativo", file: "sms.html" },
      "aparelho-ip": { name: "Aparelhos IP", file: "aparelho-ip.html" },
      rotas: { name: "Rotas de Voz", file: "rotas.html" },
      "white-label": { name: "White Label", file: "white-label.html" }
    };
    const need = document.getElementById("solutionNeed").value;
    const channels = document.getElementById("solutionChannels").value;
    const primary = products[need];
    if (!primary) return;

    let title = primary.name;
    let copy = "Essa solução combina com a necessidade que você selecionou. Converse com a equipe para avaliar os detalhes da sua operação.";
    let companion = null;
    if (need === "pabx-em-nuvem" && ["digital", "voz-digital"].includes(channels)) {
      companion = products.omnichannel;
      copy = "Como sua equipe também atende por canais digitais, vale avaliar PABX em nuvem junto com Omnichannel. A integração e o escopo dependem do projeto.";
    } else if (need === "omnichannel" && ["voz", "voz-digital"].includes(channels)) {
      companion = products["pabx-em-nuvem"];
      copy = "Como o telefone faz parte do atendimento, vale avaliar Omnichannel junto com PABX em nuvem. A integração e o escopo dependem do projeto.";
    } else if (need === "0800-400x" && ["voz", "voz-digital"].includes(channels)) {
      companion = products["pabx-em-nuvem"];
      copy = "Um número profissional pode ser avaliado junto com PABX em nuvem para organizar o encaminhamento das chamadas, conforme o projeto.";
    } else if (need === "sms") {
      copy = "SMS pode apoiar avisos e atualizações. A equipe pode avaliar o uso junto aos canais que sua empresa já utiliza.";
    }
    if (companion) title += ` + ${companion.name}`;

    const recommendation = document.getElementById("solutionRecommendation");
    document.getElementById("solutionRecommendationTitle").textContent = title;
    document.getElementById("solutionRecommendationCopy").textContent = copy;
    document.getElementById("solutionProductLink").href = primary.file;
    document.getElementById("solutionProductLink").textContent = `Conhecer ${primary.name}`;
    document.getElementById("solutionContactLink").href = `?produto=${encodeURIComponent(primary.name)}#contato`;
    recommendation.hidden = false;
    trackEvent("solution_finder_complete", {
      primary_solution: primary.name,
      suggested_companion: companion?.name || "",
      channel_profile: channels,
      page_path: window.location.pathname
    });
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const serviceCard = link.closest(".service-card, .solution-fit-card");
    if (serviceCard) {
      trackEvent("select_service", {
        service_name: serviceCard.querySelector("h3")?.textContent.trim() || "não informado",
        page_path: window.location.pathname
      });
    }

    if (link.href.includes("wa.me/")) {
      trackEvent("whatsapp_click", {
        product_name: contactProduct || "geral",
        link_text: link.getAttribute("aria-label") || link.textContent.trim() || "WhatsApp",
        page_path: window.location.pathname
      });
    } else if (link.href.includes("#contato")) {
      trackEvent("contact_cta_click", {
        product_name: contactProduct || "geral",
        link_text: link.textContent.trim(),
        page_path: window.location.pathname
      });
    }
  });

  function closeMenu() {
    navLinks?.classList.remove("open");
    document.body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }

  navToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });


  const revealTargets = document.querySelectorAll(
    ".section, .service-card, .solution-fit-card, .hero-metric, .step, .check-item, .contact-panel, .solution-media, .product-hero-visual, .product-card, .product-step, .product-use, .product-faq details, .about-principle, .about-service, .about-social-card, .about-metric, .about-logo-panel, .faq-item"
  );
  const canReveal = "IntersectionObserver" in window
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canReveal) document.documentElement.classList.add("is-enhanced");

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    const siblingIndex = Array.from(element.parentElement?.children || []).indexOf(element);
    element.style.transitionDelay = `${Math.min(Math.max(siblingIndex, 0) * 65, 195)}ms`;
  });

  document.querySelectorAll(".solution-media, .about-logo-panel").forEach((element) => {
    element.classList.add("reveal-from-left");
  });
  document.querySelectorAll(".product-hero-visual").forEach((element) => {
    element.classList.add("reveal-from-right");
  });

  if (canReveal) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("visible"));
  }

  const siteHeader = document.querySelector(".site-header");
  const readingProgress = document.createElement("div");
  readingProgress.className = "reading-progress";
  readingProgress.setAttribute("aria-hidden", "true");
  readingProgress.innerHTML = "<span></span>";
  document.body.prepend(readingProgress);

  const backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.type = "button";
  backToTop.setAttribute("aria-label", "Voltar ao topo");
  backToTop.title = "Voltar ao topo";
  backToTop.textContent = "↑";
  backToTop.hidden = true;
  document.body.append(backToTop);
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  });

  let scrollUpdatePending = false;
  const updateScrollUI = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(scrollTop / scrollableHeight, 1) : 0;
    readingProgress.firstElementChild.style.transform = `scaleX(${progress})`;
    siteHeader?.classList.toggle("is-scrolled", scrollTop > 32);
    backToTop.hidden = scrollTop < 480;
  };
  window.addEventListener("scroll", () => {
    if (scrollUpdatePending) return;
    scrollUpdatePending = true;
    window.requestAnimationFrame(() => {
      updateScrollUI();
      scrollUpdatePending = false;
    });
  }, { passive: true });
  window.addEventListener("resize", updateScrollUI, { passive: true });
  updateScrollUI();

  leadForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("leadName").value.trim();
    const email = document.getElementById("leadEmail").value.trim();
    const phone = document.getElementById("leadPhone").value.trim();
    const product = leadProduct?.value.trim();
    const message = document.getElementById("leadMessage").value.trim();
    const text = [
      "Olá! Vim pelo site da Conectel e gostaria de uma proposta.",
      ...(product ? [`Solução de interesse: ${product}`] : []),
      "",
      `Nome: ${name}`,
      `E-mail: ${email || "Não informado"}`,
      `Telefone/WhatsApp: ${phone}`,
      "",
      message
    ].join("\n");
    trackEvent("generate_lead", { method: "whatsapp", product_name: product || contactProduct || "geral", page_path: window.location.pathname });
    const whatsapp = new URL("https://wa.me/5511999302690");
    whatsapp.searchParams.set("text", text);
    if (feedback) feedback.textContent = "Abrindo o WhatsApp para você revisar e enviar a mensagem...";
    window.location.href = whatsapp.toString();
  });
})();


