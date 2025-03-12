"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "首页", href: "/" },
    { name: "菜单", href: "/menu" },
    { name: "关于我们", href: "/about" },
    { name: "联系我们", href: "/contact" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-[var(--primary)]"
          >
            Brew<span className="text-[var(--accent)]">Haven</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 font-medium"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}

          {/* 购物车图标 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="relative"
          >
            <Link
              href="/cart"
              className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--primary)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="btn-primary"
          >
            立即订购
          </motion.button>
        </nav>

        {/* Mobile Menu Button and Cart Icon */}
        <div className="md:hidden flex items-center space-x-4">
          {/* 移动端购物车图标 */}
          <Link href="/cart" className="text-[var(--foreground)] relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--primary)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* 汉堡菜单按钮 */}
          <button
            className="text-[var(--foreground)] focus:outline-none"
            onClick={toggleMenu}
            aria-label={isOpen ? "关闭菜单" : "打开菜单"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-[#121212] shadow-lg"
          >
            <div className="container-custom py-4 flex flex-col space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="block py-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="btn-primary w-full text-center"
              >
                立即订购
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
