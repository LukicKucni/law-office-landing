const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll("[data-reveal]");
const form = document.querySelector(".contact-form");
const formNote = document.querySelector("#form-note");
const riskForm = document.querySelector("#risk-form");
const riskQuestionsContainer = document.querySelector("#risk-questions");
const riskFormFeedback = document.querySelector("#risk-form-feedback");
const riskResultCard = document.querySelector("#risk-result-card");
const riskResultContent = document.querySelector("#risk-result-content");

const updateHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  form.reset();
  formNote.textContent =
    "Forma je spremna za povezivanje sa vašim sistemom za prijem upita. Trenutno je prikazan demonstracioni prikaz bez slanja podataka.";
});

// Centralized config keeps the calculator easy to edit later.
const riskQuestions = [
  {
    id: "contracts",
    title: "Da li vaša firma koristi standardizovane ugovore sa klijentima i partnerima?",
    options: [
      { label: "Da, za većinu saradnji", score: 0 },
      { label: "Delimično", score: 1 },
      { label: "Ne", score: 2 },
    ],
  },
  {
    id: "claims",
    title: "Da li trenutno imate nenaplaćena potraživanja starija od 30 dana?",
    options: [
      { label: "Ne", score: 0 },
      { label: "Da, manji iznos", score: 1 },
      { label: "Da, značajan iznos", score: 2 },
    ],
  },
  {
    id: "disputes",
    title: "Da li ste u poslednjih 12 meseci imali pravni spor ili ozbiljan pravni problem?",
    options: [
      { label: "Ne", score: 0 },
      { label: "Jedan manji problem", score: 1 },
      { label: "Da", score: 2 },
    ],
  },
  {
    id: "review",
    title: "Da li se važni ugovori i dokumentacija proveravaju pre potpisivanja?",
    options: [
      { label: "Uvek", score: 0 },
      { label: "Povremeno", score: 1 },
      { label: "Retko ili nikada", score: 2 },
    ],
  },
  {
    id: "support",
    title: "Da li imate kontinuiranu pravnu podršku za poslovanje?",
    options: [
      { label: "Da", score: 0 },
      { label: "Povremeno po potrebi", score: 1 },
      { label: "Ne", score: 2 },
    ],
  },
];

const riskResults = [
  {
    key: "low",
    min: 0,
    max: 3,
    title: "Nizak pravni rizik",
    text:
      "Na osnovu unetih odgovora, deluje da je pravni rizik u ovom trenutku pod kontrolom. Ipak, preventivna pravna provera može dodatno doprineti sigurnosti poslovanja.",
  },
  {
    key: "medium",
    min: 4,
    max: 6,
    title: "Srednji pravni rizik",
    text:
      "Postoje pokazatelji da bi dodatna pravna podrška mogla pomoći u smanjenju poslovnog rizika, boljoj zaštiti ugovora i efikasnijem rešavanju potencijalnih problema.",
  },
  {
    key: "high",
    min: 7,
    max: 10,
    title: "Povišen pravni rizik",
    text:
      "Na osnovu odgovora, postoji više faktora koji mogu predstavljati ozbiljan pravni i poslovni rizik. Preporučuje se detaljnija pravna analiza i savetovanje.",
  },
];

const renderRiskQuestions = () => {
  if (!riskQuestionsContainer) {
    return;
  }

  riskQuestionsContainer.innerHTML = riskQuestions
    .map(
      (question) => `
        <fieldset class="risk-question" data-question="${question.id}">
          <legend>${question.title}</legend>
          <div class="risk-options" role="radiogroup" aria-describedby="${question.id}-error">
            ${question.options
              .map(
                (option) => `
                  <label class="risk-option">
                    <input
                      type="radio"
                      name="${question.id}"
                      value="${option.score}"
                    >
                    <span>${option.label}</span>
                  </label>
                `
              )
              .join("")}
          </div>
          <p class="risk-error" id="${question.id}-error">Molimo izaberite jedan odgovor.</p>
        </fieldset>
      `
    )
    .join("");
};

const updateRiskOptionState = (questionElement) => {
  const options = questionElement.querySelectorAll(".risk-option");
  options.forEach((option) => {
    const input = option.querySelector("input");
    option.classList.toggle("is-selected", input.checked);
  });
};

const getAnsweredValue = (questionId) => {
  const selectedOption = riskForm?.querySelector(`input[name="${questionId}"]:checked`);
  return selectedOption ? Number(selectedOption.value) : null;
};

const setRiskResult = (score) => {
  const result = riskResults.find((item) => score >= item.min && score <= item.max);
  if (!result || !riskResultCard || !riskResultContent) {
    return;
  }

  riskResultCard.dataset.state = result.key;
  riskResultContent.innerHTML = `
    <div class="risk-result-body">
      <span class="risk-result-score">Ukupan broj poena: ${score}</span>
      <h3>${result.title}</h3>
      <p>${result.text}</p>
      <div class="risk-result-cta">
        <h3>Želite konkretnu pravnu procenu?</h3>
        <p>Zakažite konsultacije i saznajte koje korake je potrebno preduzeti za veću pravnu sigurnost poslovanja.</p>
        <a class="button button-primary" href="#kontakt">Zakažite konsultacije</a>
      </div>
    </div>
  `;
};

const validateRiskForm = () => {
  let isValid = true;

  riskQuestions.forEach((question) => {
    const questionElement = riskForm?.querySelector(`[data-question="${question.id}"]`);
    const hasValue = getAnsweredValue(question.id) !== null;
    questionElement?.classList.toggle("has-error", !hasValue);
    isValid = isValid && hasValue;
  });

  if (riskFormFeedback) {
    riskFormFeedback.textContent = isValid
      ? ""
      : "Molimo odgovorite na sva pitanja kako bismo prikazali procenu.";
  }

  return isValid;
};

if (riskForm && riskQuestionsContainer) {
  renderRiskQuestions();

  const questionElements = riskForm.querySelectorAll(".risk-question");
  questionElements.forEach((questionElement) => {
    updateRiskOptionState(questionElement);

    questionElement.addEventListener("change", () => {
      questionElement.classList.remove("has-error");
      updateRiskOptionState(questionElement);

      if (riskFormFeedback) {
        const remainingErrors = riskForm.querySelectorAll(".risk-question.has-error").length;
        if (remainingErrors === 0) {
          riskFormFeedback.textContent = "";
        }
      }
    });
  });

  riskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateRiskForm()) {
      const firstError = riskForm.querySelector(".risk-question.has-error");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const totalScore = riskQuestions.reduce(
      (sum, question) => sum + getAnsweredValue(question.id),
      0
    );

    setRiskResult(totalScore);
    riskResultCard?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}
