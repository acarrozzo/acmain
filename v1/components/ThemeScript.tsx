/**
 * Runs before paint to set the theme class, preventing a flash of the
 * wrong theme. Dark is the default; a saved choice wins.
 */
export function ThemeScript() {
  const code = `(function(){try{var e=document.documentElement;var s=localStorage.getItem('ac-theme');var d=s?s==='dark':true;e.classList.toggle('dark',d);e.dataset.theme=d?'dark':'light';}catch(x){document.documentElement.classList.add('dark');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
