import React, { useState, useEffect, useRef } from 'react';
import { aero } from '../lib/audio';

const INTERESTS = [
  { value: "charter", label: "Charter" },
  { value: "ownership", label: "Ownership" },
  { value: "general", label: "General Inquiry" }
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateForm(values) {
  const errors = {};
  if (values.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }
  if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.interest) {
    errors.interest = "Please choose what you would like to discuss.";
  }
  const msgLen = values.message.trim().length;
  if (msgLen < 10) {
    errors.message = "Please add a few more details (10+ characters).";
  } else if (msgLen > 2000) {
    errors.message = "Please keep your message under 2000 characters.";
  }
  return errors;
}

const INITIAL_FORM = {
  name: "",
  email: "",
  company: "",
  interest: "",
  message: ""
};

export function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const formRef = useRef(null);
  const successRef = useRef(null);

  // Listen for interest selection from elsewhere on the page
  useEffect(() => {
    const handleInterest = (e) => {
      const interestVal = e.detail;
      setForm((prev) => ({ ...prev, interest: interestVal }));
      setSuccess(null);
    };

    window.addEventListener("aero:interest", handleInterest);
    return () => window.removeEventListener("aero:interest", handleInterest);
  }, []);

  useEffect(() => {
    if (success) successRef.current?.focus();
  }, [success]);

  const errors = validateForm(form);
  const showError = (field) => (isSubmitted || touched[field]) && errors[field];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const currentErrors = validateForm(form);
    const firstError = Object.keys(currentErrors)[0];
    if (firstError) {
      formRef.current?.querySelector(`[name="${firstError}"]`)?.focus();
      return;
    }

    setLoading(true);
    aero.transition();

    // Simulate backend response with realistic reference ID
    setTimeout(() => {
      const refId = `AN-${Math.floor(100000 + Math.random() * 900000)}`;
      setSuccess({ reference: refId });
      setForm(INITIAL_FORM);
      setTouched({});
      setIsSubmitted(false);
      setLoading(false);
    }, 600);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden py-28 md:py-40"
    >
      {/* Dynamic Drifting Clouds */}
      <div className="contact-clouds" aria-hidden="true">
        <div className="layer a" />
        <div className="layer b" />
      </div>

      <div className="contact-scrim" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[1300px] gap-14 px-5 sm:px-10 md:grid-cols-[1fr_minmax(0,560px)] md:gap-20 lg:px-16">
        {/* Left Column: Heading & Narrative */}
        <div className="md:pt-6">
          <span className="label text-[color:var(--amber)]">Contact</span>
          <h2
            id="contact-title"
            className="font-display mt-5 text-[46px] font-light leading-[0.96] tracking-[-0.01em] sm:text-[64px] lg:text-[88px]"
          >
            Your Next
            <span className="block">Chapter Begins</span>
            <em className="block font-light italic opacity-90">Above.</em>
          </h2>

          <p className="mt-7 max-w-[380px] text-[14.5px] font-light leading-relaxed text-[color:var(--mist)]">
            Share a few details and a private aviation advisor will respond personally. Every conversation is confidential.
          </p>

          <div className="mt-12 hidden md:flex flex-col gap-4 text-[13px] font-light text-[color:var(--mist)]">
            <p>
              Direct concierge:{" "}
              <a href="mailto:concierge@aeronoir.com" className="text-[color:var(--ivory)] hover:text-[color:var(--amber)] transition-colors">
                concierge@aeronoir.com
              </a>
            </p>
            <p>Discreet operations · Worldwide departures</p>
          </div>
        </div>

        {/* Right Column: Interactive Consultation Card */}
        <div className="contact-card relative">
          {success ? (
            <div
              ref={successRef}
              tabIndex={-1}
              aria-live="polite"
              className="flex min-h-[420px] flex-col justify-center gap-5 p-7 outline-none sm:p-10"
            >
              <span className="label inline-flex items-center gap-3 text-[color:var(--amber)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--amber)] shadow-[0_0_12px_var(--amber)]" />
                Request received
              </span>

              <p className="font-display text-[34px] font-light leading-[1.05] sm:text-[42px]">
                Thank you. We will be in touch shortly.
              </p>

              <p className="text-[14px] font-light leading-relaxed text-[color:var(--mist)]">
                Your reference is{" "}
                <span className="text-[color:var(--ivory)] tabular-nums font-mono font-normal">
                  {success.reference}
                </span>
                . Please quote it in any correspondence.
              </p>

              <div className="pt-4">
                <button
                  type="button"
                  className="btn-ghost label cursor-pointer"
                  onClick={() => setSuccess(null)}
                >
                  <span className="dot" />
                  Send another request
                </button>
              </div>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-7 p-7 sm:p-10"
            >
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full name *"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  onBlur={() => markTouched("name")}
                  aria-invalid={!!showError("name")}
                  className="field"
                />
                {showError("name") && (
                  <p className="field-error mt-2">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address *"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => markTouched("email")}
                  aria-invalid={!!showError("email")}
                  className="field"
                />
                {showError("email") && (
                  <p className="field-error mt-2">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="company"
                  placeholder="Company or family office (optional)"
                  value={form.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  className="field"
                />
              </div>

              {/* Interest Chips */}
              <fieldset aria-invalid={!!showError("interest")}>
                <legend className="label mb-3 text-[10px] text-[color:var(--mist)]">
                  Primary interest *
                </legend>
                <div className="flex flex-wrap gap-2.5">
                  {INTERESTS.map((chip) => {
                    const isSelected = form.interest === chip.value;
                    return (
                      <label
                        key={chip.value}
                        className={`chip ${isSelected ? "on" : ""}`}
                      >
                        <input
                          type="radio"
                          name="interest"
                          value={chip.value}
                          checked={isSelected}
                          onChange={() => {
                            updateField("interest", chip.value);
                            aero.hover();
                          }}
                          className="sr-only"
                        />
                        {chip.label}
                      </label>
                    );
                  })}
                </div>
                {showError("interest") && (
                  <p className="field-error mt-2">{errors.interest}</p>
                )}
              </fieldset>

              <div>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Tell us about the journey, routes or timing you have in mind *"
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  onBlur={() => markTouched("message")}
                  aria-invalid={!!showError("message")}
                  className="field"
                />
                {showError("message") && (
                  <p className="field-error mt-2">{errors.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-ghost label w-full justify-center sm:w-auto cursor-pointer"
                  onMouseEnter={aero.hover}
                >
                  <span className="dot" />
                  {loading ? "Transmitting..." : "Submit Confidential Request"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
