import Link from "next/link";
import DesignSystemShowcase from "@/components/design-system/DesignSystemShowcase";

export default function DesignSystemPage() {
  return (
    <>
      <div className="sticky top-0 z-50 border-b border-[#F0E4D8] bg-cream/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold tracking-wide text-espresso-soft underline-offset-4 hover:text-terra hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
      <DesignSystemShowcase />
    </>
  );
}
