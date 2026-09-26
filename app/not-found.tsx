import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Kicker } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <Masthead />
      <main className="container-page">
        <div className="pagehead min-h-[50vh]">
          <Kicker muted>404</Kicker>
          <h1>Nothing lives at this address.</h1>
          <p className="dek">It may have been archived, or it may never have existed. Both are fine.</p>
          <a href="/" className="w-fit text-accent hover:underline">
            ← Back to the front page
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
