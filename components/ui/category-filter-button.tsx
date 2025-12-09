"use client";

import Link from "next/link";

interface CategoryFilterButtonProps {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}

export function CategoryFilterButton({ href, isActive = false, children }: CategoryFilterButtonProps) {
  return (
    <Link
      href={href}
      className="transition-colors inline-block"
      style={{
        borderRadius: '999px',
        padding: '0.25em 0.75em',
        fontWeight: '600',
        textTransform: 'uppercase',
        fontSize: '1em',
        letterSpacing: '0.05em',
        backgroundColor: 'hsl(var(--secondary))',
        color: isActive ? '#FDF8F3' : 'hsl(var(--surface))',
        border: 'solid',
        borderColor: '#FDF8F3',
        textDecoration: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#FDF8F3';
        e.currentTarget.style.color = '#2D2D3F';
        e.currentTarget.style.borderColor = '#FDF8F3';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'hsl(var(--secondary))';
        e.currentTarget.style.color = isActive ? '#FDF8F3' : 'hsl(var(--surface))';
        e.currentTarget.style.borderColor = '#FDF8F3';
      }}
    >
      {children}
    </Link>
  );
}
