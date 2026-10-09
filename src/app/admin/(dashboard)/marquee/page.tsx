import type { Metadata } from "next";
import { LandingImagesManager } from "@/components/admin/LandingImagesManager";
import { listLandingImages } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Landing carousel" };

/** Below this many tiles the landing page falls back to project covers. */
const MARQUEE_MINIMUM = 3;

export default async function AdminMarqueePage() {
  const images = await listLandingImages();
  const enough = images.length >= MARQUEE_MINIMUM;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-2xl text-fg">Landing carousel</h1>
        <p className="mt-1 text-sm text-faint">
          The scrolling image strip under “Selected Work”. Drag to reorder — the
          order saves automatically.
        </p>
      </header>

      {!enough ? (
        <p className="rounded-card border border-warn/40 bg-warn/10 px-5 py-4 text-sm text-fg">
          The carousel needs at least {MARQUEE_MINIMUM} images before it replaces
          the automatic project-cover strip ({images.length} so far).
        </p>
      ) : null}

      <LandingImagesManager images={images} />
    </div>
  );
}
