const apartmentData = [
  { title: "Студия Horizon", area: 34, price: 3890000, image: "assets/aura-about-1.jpg", plan: "assets/floorplan-01.png" },
  { title: "1-комнатная Lumiere", area: 35.5, price: 4180000, image: "assets/hero-aura-full.jpg", plan: "assets/floorplan-02.png" },
  { title: "1-комнатная Riviera", area: 35.6, price: 4320000, image: "assets/aura-architecture.jpg", plan: "assets/floorplan-03.png" },
  { title: "Евро-2 Azure", area: 50, price: 5780000, image: "assets/hero-aura-full.jpg", plan: "assets/floorplan-08.png" },
  { title: "2-комнатная Coastline", area: 56.5, price: 5990000, image: "assets/aura-about-1.jpg", plan: "assets/floorplan-04.png" },
  { title: "2-комнатная Signature", area: 61, price: 6480000, image: "assets/aura-architecture.jpg", plan: "assets/floorplan-09.png" },
  { title: "2-комнатная Seaview", area: 64.2, price: 6890000, image: "assets/hero-aura-full.jpg", plan: "assets/floorplan-05.png" },
  { title: "1-комнатная Vista", area: 36.1, price: 4460000, image: "assets/aura-architecture.jpg", plan: "assets/floorplan-06.png" },
  { title: "1-комнатная Frame", area: 36.1, price: 4590000, image: "assets/aura-about-1.jpg", plan: "assets/floorplan-07.png" },
  { title: "2-комнатная Grand Bay", area: 64.7, price: 7120000, image: "assets/hero-aura-full.jpg", plan: "assets/floorplan-10.png" },
  { title: "Инвест-лот Marina", area: 57.8, price: 6240000, image: "assets/aura-about-1.jpg", plan: "assets/floorplan-04.png" },
  { title: "Семейная Residence", area: 62.4, price: 6760000, image: "assets/aura-architecture.jpg", plan: "assets/floorplan-09.png" },
];

const formatter = new Intl.NumberFormat("ru-RU");
const currency = (value) => `${formatter.format(Math.round(value))} ₽`;
const areaFormat = (value) => `${String(value).replace(".", ",")} м²`;

function calculateLoanBreakdown(price, annualRate = 2, years = 30) {
  const downPaymentRate = 0.101;
  const ownFunds = price <= 6000000 ? price * downPaymentRate : price - 6000000;
  const loanAmount = price <= 6000000 ? price - ownFunds : 6000000;
  const monthlyRate = annualRate / 100 / 12;
  const payments = years * 12;

  let monthlyPayment = 0;

  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / payments;
  } else {
    monthlyPayment =
      loanAmount *
      (monthlyRate / (1 - (1 + monthlyRate) ** -payments));
  }

  return {
    ownFunds,
    loanAmount,
    monthlyPayment,
  };
}

function renderCatalog() {
  const grid = document.querySelector("[data-catalog-grid]");
  const template = document.querySelector("#catalog-card-template");

  if (!grid || !template) return;

  apartmentData.forEach((apartment) => {
    const breakdown = calculateLoanBreakdown(apartment.price);
    const card = template.content.firstElementChild.cloneNode(true);

    card.querySelector(".catalog-card__photo").src = apartment.image;
    card.querySelector(".catalog-card__photo").alt = apartment.title;
    card.querySelector(".catalog-card__plan-image").src = apartment.plan;
    card.querySelector(".catalog-card__plan-image").alt = `Планировка ${apartment.title}`;
    card.querySelector(".catalog-card__title").textContent = apartment.title;
    card.querySelector("[data-area]").textContent = areaFormat(apartment.area);
    card.querySelector("[data-price]").textContent = currency(apartment.price);
    card.querySelector("[data-own]").textContent = currency(breakdown.ownFunds);
    card.querySelector("[data-loan]").textContent = currency(breakdown.loanAmount);
    card.querySelector("[data-payment]").textContent = currency(breakdown.monthlyPayment);

    grid.appendChild(card);
  });
}

function setupCalculator() {
  const form = document.querySelector("[data-calculator-form]");
  if (!form) return;

  const own = document.querySelector("[data-result-own]");
  const loan = document.querySelector("[data-result-loan]");
  const payment = document.querySelector("[data-result-payment]");

  const update = () => {
    const price = Number(form.elements.price.value) || 0;
    const rate = Number(form.elements.rate.value) || 0;
    const years = Number(form.elements.years.value) || 1;
    const breakdown = calculateLoanBreakdown(price, rate, years);

    own.textContent = currency(breakdown.ownFunds);
    loan.textContent = currency(breakdown.loanAmount);
    payment.textContent = currency(breakdown.monthlyPayment);
  };

  form.addEventListener("input", update);
  update();
}

function setupBeforeAfter() {
  const block = document.querySelector("[data-before-after]");
  if (!block) return;

  const range = block.querySelector(".before-after__range");
  const after = block.querySelector(".before-after__image--after");
  const line = block.querySelector(".before-after__line");

  const update = () => {
    const value = Number(range.value);
    after.style.clipPath = `inset(0 0 0 ${value}%)`;
    line.style.left = `${value}%`;
  };

  range.addEventListener("input", update);
  update();
}

function setupLeadForms() {
  const forms = document.querySelectorAll("[data-lead-form]");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const success = form.querySelector("[data-form-success]");

      if (success) {
        success.hidden = false;
      }

      form.reset();
    });
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((item) => observer.observe(item));
}

renderCatalog();
setupCalculator();
setupBeforeAfter();
setupLeadForms();
setupReveal();
