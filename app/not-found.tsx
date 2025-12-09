import Link from "next/link";
import { Container } from "@/components/layout/container";
import { HeaderWrapper as Header } from "@/components/layout/header-wrapper";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <>
      <Header />
      <Container className="py-20">
      <div className="bg-card rounded-[2em] p-12 text-center max-w-2xl mx-auto">
        <h1 className="font-architects-daughter text-6xl text-secondary mb-4">404</h1>
        <h2 className="font-architects-daughter text-3xl text-secondary mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Looks like Uncle Bobby can't find what you're looking for. How about heading back home?
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-[2em] font-semibold uppercase tracking-wider text-sm hover:bg-primary-hover transition-colors no-underline"
        >
          Back to Home
        </Link>
      </div>
    </Container>
    </>
  );
}
