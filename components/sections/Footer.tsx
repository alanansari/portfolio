export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 px-7 py-7 font-mono text-[12px] tracking-[0.04em] text-fg-faint md:px-20">
      <span>© {year} ALAN ANSARI · BUILT WITH ♥️ AND ☕!</span>
      <div className="flex gap-5">
        <a href="#hero" className="transition-colors hover:text-fg">
          BACK TO TOP ↑
        </a>
        <a
          href="https://github.com/alanansari/portfolio"
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-fg"
        >
          SOURCE
        </a>
      </div>
    </footer>
  );
}
