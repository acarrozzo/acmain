import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Masthead />
      <main className="home h-top h-404">
        <div className="h-pk"><span>404</span></div>
        <h1 className="h-page-h1">Nothing lives at this address.</h1>
        <p className="h-intro">It may have been archived, or it may never have existed. Both are fine.</p>
        <div className="h-btns"><a href="/">← Back to the front page</a></div>
      </main>
      <Footer />
    </>
  );
}
