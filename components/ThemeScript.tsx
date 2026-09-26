/** Saved choice wins; otherwise follows the OS `prefers-color-scheme`.
 * Must stay a Server Component (no "use client") so the inline script runs from the document head. */
export const THEME_STORAGE_KEY = "portfolio-theme";

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){var t;try{t=localStorage.getItem('${THEME_STORAGE_KEY}');}catch(e){}if(t!=='dark'&&t!=='light'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);})();`,
      }}
    />
  );
}
