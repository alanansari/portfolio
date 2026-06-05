"use client";

import { useState, useRef, useEffect, type SubmitEventHandler } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { useTheme } from "@/components/ThemeProvider";
import type { Social, Stats } from "@/sanity/types";

type Props = { socials: Social[]; stats: Stats };
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";
const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";
if (!HCAPTCHA_SITE_KEY) {
  throw new Error("NEXT_PUBLIC_HCAPTCHA_SITE_KEY is not set");
}
const IS_DEV = process.env.NODE_ENV === "development";

const numberFormat = new Intl.NumberFormat("en-US");

function githubStatsLine(g: Stats["github"]) {
  return `${numberFormat.format(g.commits)} contrib. · ${g.repos} repos · ${g.prsMerged} PRs merged`;
}

function leetcodeStatsLine(lc: Stats["leetcode"]) {
  const r = lc.rating != null ? numberFormat.format(lc.rating) : "Unrated";
  const rank =
    lc.globalRanking != null
      ? `#${numberFormat.format(lc.globalRanking)} global`
      : "No contest rank";
  return `${r} peak · ${numberFormat.format(lc.totalSolved)} solved · ${rank}`;
}

export function Contact({ socials, stats }: Props) {
  const { theme } = useTheme();
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => setMounted(true), []);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!WEB3FORMS_ACCESS_KEY) {
      setResult("Missing form configuration.");
      return;
    }
    if (!IS_DEV && !captchaToken) {
      setResult("Please complete the captcha.");
      return;
    }

    setIsSubmitting(true);
    setResult("Sending...");

    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    if (captchaToken) formData.append("h-captcha-response", captchaToken);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult("Success!");
        form.reset();
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
      } else {
        setResult("Error sending message. Please try again.");
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
      }
    } catch {
      setResult("Error sending message. Please try again.");
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative border-b border-hairline px-5 py-16 sm:px-7 sm:py-20 md:px-20 md:py-[120px]"
      style={{ background: "var(--bg-sunk)" }}
    >
      <SectionHead number="06 / CONTACT" title="Say hi" />

      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-14">
        <div>
          <Reveal>
            <h2
              className="m-0 mb-6 font-medium leading-[1.05] tracking-[-0.03em]"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              Let&apos;s build something{" "}
              <span className="serif" style={{ color: "var(--accent)" }}>
                worth using.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="m-0 mb-8 max-w-[420px] text-[15px] leading-[1.55] text-fg-mute">
              Open to full-stack roles, interesting contracts, or just a good conversation about
              shipping web software.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mb-6 flex flex-col">
              {socials.map((s, i) => (
                <a
                  key={s._id}
                  href={s.url}
                  target={s.platform === "email" ? undefined : "_blank"}
                  rel={s.platform === "email" ? undefined : "noreferrer"}
                  className={`flex items-center justify-between py-3.5 text-sm transition-colors duration-200 ease-soft border-t border-border ${
                    i === socials.length - 1 ? "border-b" : ""
                  } group`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-widest text-fg-faint">
                    {s.label}
                  </span>
                  <span className="flex max-w-[min(100%,280px)] flex-col items-end gap-1 text-right">
                    <span className="flex items-center gap-2 text-fg transition-all duration-200 ease-soft group-hover:gap-3 group-hover:text-(--accent)">
                      {s.handle} →
                    </span>
                    {s.platform === "github" ? (
                      <span className="font-mono text-[10px] leading-snug tracking-normal text-fg-faint normal-case">
                        {githubStatsLine(stats.github)}
                      </span>
                    ) : s.platform === "leetcode" ? (
                      <span className="font-mono text-[10px] leading-snug tracking-normal text-fg-faint normal-case">
                        {leetcodeStatsLine(stats.leetcode)}
                      </span>
                    ) : null}
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3.5 rounded-lg border border-border bg-bg p-6"
          >
            <Field label="Name">
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors duration-200 ease-soft focus:border-(--accent)"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                className="w-full border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors duration-200 ease-soft focus:border-(--accent)"
              />
            </Field>
            <Field label="Message">
              <textarea
                name="message"
                required
                placeholder="What's on your mind?"
                className="min-h-[90px] w-full resize-y border-0 border-b border-border bg-transparent py-2 font-sans text-sm outline-none transition-colors duration-200 ease-soft focus:border-(--accent)"
              />
            </Field>
            {!IS_DEV && mounted && (
              <HCaptcha
                sitekey={HCAPTCHA_SITE_KEY}
                onVerify={setCaptchaToken}
                ref={captchaRef}
                theme={theme}
              />
            )}
            <button
              type="submit"
              disabled={isSubmitting || (!IS_DEV && (!mounted || !captchaToken))}
              className="btn btn-accent mt-1.5 self-start disabled:opacity-75"
            >
              {isSubmitting ? "Sending..." : "Send message →"}
            </button>
            <p className="text-xs text-fg-mute" aria-live="polite">
              {result}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-widest text-fg-faint">{label}</span>
      {children}
    </label>
  );
}
