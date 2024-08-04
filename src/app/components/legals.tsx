import Link from "next/link";

export function LegalLinks() {
  return (
    <div className="fixed bottom-2 right-2 flex flex-row space-x-2 z-10 text-xs">
      <Link href="https://metacube.games/privacy" passHref>
        <span className="text-green-400 hover:text-green-300 cursor-pointer transition duration-300">
          Privacy
        </span>
      </Link>
      <span className="text-green-400">|</span>
      <Link href="https://metacube.games/terms" passHref>
        <span className="text-green-400 hover:text-green-300 cursor-pointer transition duration-300">
          Terms
        </span>
      </Link>
    </div>
  );
}
