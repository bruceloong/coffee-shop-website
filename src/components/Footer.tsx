"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "关于我们", href: "/about" },
      { name: "我们的故事", href: "/about#story" },
      { name: "加入我们", href: "/about#careers" },
    ],
    support: [
      { name: "常见问题", href: "/faq" },
      { name: "联系我们", href: "/contact" },
      { name: "隐私政策", href: "/privacy" },
    ],
    social: [
      { name: "微信", href: "#", icon: "wechat" },
      { name: "微博", href: "#", icon: "weibo" },
      { name: "小红书", href: "#", icon: "xiaohongshu" },
    ],
  };

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "wechat":
        return (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295a.328.328 0 0 0 .186-.059l2.114-1.225a.866.866 0 0 1 .276-.087.833.833 0 0 1 .183.022 9.43 9.43 0 0 0 2.865.443c.461 0 .909-.035 1.35-.103a4.933 4.933 0 0 1-.309-1.684c0-3.584 3.392-6.5 7.566-6.5.418 0 .827.035 1.222.103C17.605 4.605 13.518 2.188 8.691 2.188zm-1.75 3.787a1.25 1.25 0 1 1-.001 2.499 1.25 1.25 0 0 1 0-2.5zm5.5 0a1.25 1.25 0 1 1 0 2.499 1.25 1.25 0 0 1 0-2.5zm5.04 3.425c-3.51 0-6.365 2.436-6.365 5.414 0 2.977 2.855 5.414 6.364 5.414.577 0 1.134-.07 1.669-.2a.821.821 0 0 1 .195-.025c.07 0 .136.023.194.046l1.793 1.037a.321.321 0 0 0 .186.06c.16 0 .289-.13.289-.296 0-.07-.023-.128-.046-.195l-.326-1.247a.589.589 0 0 1 .213-.665c1.55-1.139 2.539-2.826 2.539-4.713 0-2.989-2.855-5.425-6.364-5.425l-.341-.005zm-2.803 2.804a1.042 1.042 0 1 1 0 2.083 1.042 1.042 0 0 1 0-2.083zm5.607 0a1.042 1.042 0 1 1 0 2.083 1.042 1.042 0 0 1 0-2.083z" />
          </svg>
        );
      case "weibo":
        return (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439l-.002.004zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-1.01-.406-1.609.379-.6 1.176-.867 1.793-.602.622.27.82.984.442 1.609zm1.741-2.052c-.141.237-.449.348-.685.246-.236-.102-.313-.361-.177-.586.138-.227.436-.336.672-.238.239.098.315.356.19.578zm.356-3.378c-2.067-.215-3.7.738-3.7 2.5 0 1.666 1.873 2.969 4.024 2.969 2.491 0 4.106-1.22 3.933-3.113-.167-1.785-2.174-2.219-4.257-2.356zm7.424-2.055c-.858.66-1.984.861-2.572 1.017.365-.866.301-2.322.301-2.322-.272-2.057-2.738-1.971-5.062-1.917V8.5s-2.844-.59-3.749 2.812c0 0-.43 1.077.355 2.476-1.622-.307-3.318-.913-3.318-3.21 0-3.217 4.18-3.217 4.18-3.217.398-.658 1.225-2.907 5.33-2.907 4.103 0 6.167 1.347 6.167 3.544 0 1.505-1.457 2.552-1.632 2.928v-.062z" />
          </svg>
        );
      case "xiaohongshu":
        return (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm196.1 352.5c-38.2 77.7-98.3 143.9-174 193.7-15.3 10-31.5 18.2-50.4 22-19.3 3.8-39.2 3.7-58-2.9-18.3-6.5-32.8-18.7-45.6-32.6-27.7-30.1-46.6-66.7-58.5-105.2-11.4-36.5-16.9-74.4-18.4-112.4-.3-8.2-.5-16.5-1-24.7-.3-5.7-.1-12.5-4.1-16.8-5.5-5.8-15.7-5.5-22.1-1.6-6.4 4-10.2 10.8-14 17-7.6 12.5-13.6 25.8-19.1 39.2-8.5 20.9-15.7 42.2-21.4 63.9-2.8 10.8-4.9 21.8-7.2 32.7-1.3 6.3-2.5 13.7-6.9 18.5-7.2 7.9-21.1 6.1-29.1-.2-7.8-6.2-10.9-16.5-13.5-25.6-5.7-20.4-9-41.4-11.3-62.4-2.2-20.4-3.5-41-2.8-61.5.7-21.1 4-42.2 15.3-60.2 10.6-17 27.8-28.7 46.4-35.5 24.2-8.8 50.4-9.1 75.8-6.6 25.5 2.5 50.5 9.1 74.6 17.3 48.8 16.5 94.3 42.1 136.9 71.7 20.7 14.4 40.8 30.1 59.4 47.1 10 9.2 19.6 18.9 28.5 29.3 7.8 9.1 15.2 18.8 21 29.3 4.8 8.7 8.8 18 9.5 28 .7 9.5-1.8 18.9-6.8 27z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="bg-[var(--primary-dark)] text-[var(--text-light)]">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="col-span-1"
          >
            <h2 className="text-2xl font-bold mb-4">
              Brew<span className="text-[var(--secondary)]">Haven</span>
            </h2>
            <p className="mb-4 text-sm">
              我们致力于为您提供最优质的咖啡体验，每一杯都充满匠心与温度。
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[var(--text-light)] hover:text-[var(--secondary)] transition-colors duration-300"
                  aria-label={link.name}
                >
                  {renderIcon(link.icon)}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="col-span-1"
          >
            <h3 className="text-lg font-semibold mb-4">公司</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-light)]/80 hover:text-[var(--secondary)] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="col-span-1"
          >
            <h3 className="text-lg font-semibold mb-4">支持</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-light)]/80 hover:text-[var(--secondary)] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="col-span-1"
          >
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <address className="not-italic">
              <p className="mb-2">北京市朝阳区三里屯太古里</p>
              <p className="mb-2">电话: (010) 8888-7777</p>
              <p className="mb-2">邮箱: info@brewhaven.com</p>
              <p>营业时间: 周一至周日 8:00 - 22:00</p>
            </address>
          </motion.div>
        </div>

        <div className="border-t border-[var(--primary-light)]/30 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Brew Haven 咖啡馆. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
