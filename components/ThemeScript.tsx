/**
 * Runs before paint to set the theme class, preventing a flash of the
 * wrong theme. Reads a saved choice, else falls back to system preference.
 */
export function ThemeScript() {
  const code = `(function(){try{var s=localStorage.getItem('ac-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
