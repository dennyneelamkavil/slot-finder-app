import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm text-center">
        <h1 className="text-4xl font-bold">Check Participant Availability</h1>
        <p className="mt-4">
          Click{" "}
          <a
            href="/participant/availability"
            className="text-blue-500 underline"
          >
            here
          </a>{" "}
          to check availability.
        </p>
      </div>
    </main>
  );
}
