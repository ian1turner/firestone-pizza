import Image from "next/image";
import Link from "next/link";

/** Hero photo served from `public/`. */
const HOME_HERO_SRC = "/firestone-home-bg.png";

export default function Home() {
  return (
    <div className="relative isolate min-h-[min(88vh,920px)] w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={HOME_HERO_SRC}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Readability: light wash where copy sits + soft vignette */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[var(--cream)] via-[var(--cream)]/88 to-[var(--cream)]/25 sm:via-[var(--cream)]/75"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--cream)] via-transparent to-stone-900/15"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[var(--cream)] to-transparent"
          aria-hidden
        />
      </div>

      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-28 pt-16 sm:px-6 sm:pt-24">
        <h1 className="font-display max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight drop-shadow-[0_1px_2px_rgba(255,253,249,0.8)] sm:text-5xl lg:text-[3.25rem]">
          <span className="text-[var(--ember)]">Firestone Pizza</span>
          <span className="mt-2 block text-[var(--ink)] sm:mt-3">
            Pizza from the oven,{" "}
            <span className="text-[var(--ember)]">orders on the web.</span>
          </span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--muted)] drop-shadow-[0_1px_1px_rgba(255,253,249,0.9)]">
          Add toppings from the menu, then tell us what to call you. No
          checkout drama — just a clean ticket for the kitchen.
        </p>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full bg-[var(--ember)] px-9 py-4 text-sm font-semibold text-white shadow-lg shadow-[var(--ember)]/25 transition hover:bg-[var(--ember-hover)] hover:shadow-xl hover:shadow-[var(--ember)]/20"
          >
            View menu
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-full border-2 border-[var(--charcoal)]/20 bg-[var(--paper)]/95 px-9 py-4 text-sm font-semibold text-[var(--ink)] shadow-sm backdrop-blur-sm transition hover:border-[var(--charcoal)]/30 hover:bg-white"
          >
            Open cart
          </Link>
        </div>
      </section>
    </div>
  );
}
