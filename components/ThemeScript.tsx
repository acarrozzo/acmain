/**
 * Runs before paint to set the theme class, preventing a flash of the
 * wrong theme. Reads a saved choice, else falls back to system preference.
 */
export function ThemeScript() {
  const code = `(function(){try{var e=document.documentElement;var s=localStorage.getItem('ac-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;e.classList.toggle('dark',d);e.dataset.theme=d?'dark':'light';var f=localStorage.getItem('ac-font');e.dataset.font=f||'fraunces';}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
