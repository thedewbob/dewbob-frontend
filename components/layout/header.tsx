"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "./container";
import { useState, useEffect } from "react";

interface MenuItem {
  id: string;
  label: string;
  url: string;
  target: '_self' | '_blank';
}

interface Category {
  category_id: number;
  category_name: string;
  category_slug: string | null;
}

interface HeaderProps {
  menu: { menu_items?: MenuItem[] } | null;
  settings: any;
  categories: Category[];
}

export function Header({ menu, settings, categories }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#CCCCCC] sticky top-0 z-50">
      <Container>
        <div className="grid grid-cols-[20%_60%_20%] items-center py-4 gap-4">
          {/* Logo Section - 20% */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="DewBob Logo"
                width={80}
                height={80}
                className="h-auto"
                priority
              />
            </Link>
          </div>

          {/* Navigation - 60% */}
          <nav className="hidden md:flex items-center justify-center gap-6">
            {menu?.menu_items?.map((item) => {
              // Check if this is "Ask Uncle Bobby" - show categories dropdown
              const isAskUB = item.label === 'Ask Uncle Bobby' || item.url.includes('ask-uncle-bobby');

              if (isAskUB && categories && categories.length > 0) {
                return (
                  <div key={item.id} className="relative group">
                    <Link
                      href={item.url}
                      target={item.target}
                      className="text-[#336B66] hover:text-[#2D2D3F] transition-colors text-[1.2em] whitespace-nowrap font-bold"
                      style={{ fontFamily: "var(--font-architects-daughter)", textDecoration: 'none' }}
                    >
                      {item.label}
                    </Link>
                    <div className="absolute left-0 mt-2 w-56 bg-white shadow-[8px_12px_20px_rgba(0,0,0,0.15)] rounded-[20px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      {categories.map((category) => (
                        <Link
                          key={category.category_id}
                          href={`/ask-uncle-bobby/category/${category.category_slug || category.category_id}`}
                          className="block px-6 py-3 text-[#2D2D3F] hover:bg-[#FDF8F3] transition-colors first:rounded-t-[20px] last:rounded-b-[20px]"
                          style={{ fontFamily: "var(--font-architects-daughter)", textDecoration: 'none' }}
                        >
                          {category.category_name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.url}
                  target={item.target}
                  className="text-[#336B66] hover:text-[#2D2D3F] transition-colors text-[1.2em] whitespace-nowrap font-bold"
                  style={{ fontFamily: "var(--font-architects-daughter)", textDecoration: 'none' }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Social Icons - 25% */}
          <div className="hidden md:flex items-center justify-end gap-4">
            {settings?.social_facebook_url && (
              <a
                href={settings.social_facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2D2D3F] hover:text-[#336B66] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            {settings?.social_twitter_url && (
              <a
                href={settings.social_twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2D2D3F] hover:text-[#336B66] transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#2D2D3F] ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#CCCCCC]">
            <nav className="flex flex-col gap-4">
              {menu?.menu_items?.map((item) => {
                const isAskUB = item.label === 'Ask Uncle Bobby' || item.url.includes('ask-uncle-bobby');

                if (isAskUB && categories && categories.length > 0) {
                  return (
                    <div key={item.id} className="flex flex-col gap-2">
                      <Link
                        href={item.url}
                        target={item.target}
                        className="text-[#336B66] hover:text-[#2D2D3F] transition-colors text-[1.2em] font-bold"
                        style={{ fontFamily: "var(--font-architects-daughter)", textDecoration: 'none' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                      <div className="ml-4 flex flex-col gap-2">
                        {categories.map((category) => (
                          <Link
                            key={category.category_id}
                            href={`/ask-uncle-bobby/category/${category.category_slug || category.category_id}`}
                            className="text-[#2D2D3F] hover:text-[#336B66] transition-colors text-[1em]"
                            style={{ fontFamily: "var(--font-architects-daughter)", textDecoration: 'none' }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {category.category_name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    target={item.target}
                    className="text-[#336B66] hover:text-[#2D2D3F] transition-colors text-[1.2em] font-bold"
                    style={{ fontFamily: "var(--font-architects-daughter)", textDecoration: 'none' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Social Icons in Mobile Menu */}
            <div className="flex items-center gap-4 mt-6">
              {settings?.social_facebook_url && (
                <a
                  href={settings.social_facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2D2D3F] hover:text-[#336B66] transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {settings?.social_twitter_url && (
                <a
                  href={settings.social_twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2D2D3F] hover:text-[#336B66] transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
