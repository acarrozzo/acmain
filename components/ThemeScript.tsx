/**
 * Runs before paint to set the theme class, preventing a flash of the
 * wrong theme. Reads a saved choice, else falls back to system preference.
 * Also restores the saved heading font and accent so neither flashes its
 * default before the pickers hydrate.
 */
export function ThemeScript() {
  // The accent restore is parsed in its own try: an earlier build of the
  // picker stored a bare id ("forest"), which JSON.parse throws on. Left
  // unguarded that abort would take the rest of this script with it.
  const code = `(function(){try{var e=document.documentElement;var s=localStorage.getItem('ac-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;e.classList.toggle('dark',d);e.dataset.theme=d?'dark':'light';var f=localStorage.getItem('ac-font');e.dataset.font=f||'fraunces';var a={};try{a=JSON.parse(localStorage.getItem('ac-accent')||'{}')||{};}catch(x){localStorage.removeItem('ac-accent');}var k={light:'l',dark:'d'};for(var t in k){var v=a[t];if(v&&v.hex){e.style.setProperty('--acc-'+k[t],v.hex);e.style.setProperty('--acc-hi-'+k[t],v.hi);e.style.setProperty('--particle-'+k[t],v.particle);}}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
