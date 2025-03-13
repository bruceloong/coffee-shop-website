"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutImage from "@/assets/images/about-image.jpg";
import HeroImage from "@/assets/images/hero-bg.jpg";
import LatteImage from "@/assets/images/latte.jpg";
import MochaImage from "@/assets/images/mocha.jpg";
import CinnamonRollImage from "@/assets/images/cinnamon-roll.jpg";
import ColdBrewImage from "@/assets/images/cold-brew.jpg";
import Image from "next/image";
import { useAuth } from "@/lib/contexts/AuthContext";
import { productApi } from "@/lib/api/productApi";
import { Product } from "@/lib/api/productApi";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero section parallax effect
    if (heroRef.current) {
      gsap.to(".hero-image", {
        y: 100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // About section animation
    if (aboutRef.current) {
      gsap.from(".about-image", {
        x: -50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".about-content", {
        x: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
        },
      });
    }
  }, []);

  // 检查后端健康状态
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/health`
        );
        const data = await response.json();
        setHealthStatus(data.status === "success" ? "正常" : "异常");
      } catch (err) {
        console.error("健康检查失败:", err);
        setHealthStatus("无法连接");
      }
    };

    checkHealth();
  }, []);

  // 获取产品列表
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAllProducts({
          featured: true,
          limit: 6,
        });
        setProducts(response.products);
        setError(null);
      } catch (err: any) {
        console.error("获取产品失败:", err);
        setError(err.message || "获取产品失败");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = [
    {
      id: 1,
      name: "经典拿铁",
      description: "丝滑浓郁的意式浓缩与蒸汽牛奶的完美结合",
      image: LatteImage,
      price: "¥32",
    },
    {
      id: 2,
      name: "冰滴咖啡",
      description: "12小时慢滴工艺，带来清爽顺滑的口感",
      image: ColdBrewImage,
      price: "¥38",
    },
    {
      id: 3,
      name: "摩卡",
      description: "浓郁的巧克力与咖啡的经典搭配",
      image: MochaImage,
      price: "¥36",
    },
    {
      id: 4,
      name: "肉桂卷",
      description: "手工制作，香甜松软，搭配咖啡的绝佳选择",
      image: CinnamonRollImage,
      price: "¥28",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="hero-image absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src={HeroImage}
            alt="咖啡店内景"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="container-custom relative z-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            品味生活的<span className="text-[var(--secondary)]">每一刻</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            在Brew Haven，我们精心挑选全球优质咖啡豆，每一杯都是匠心之作
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/menu" className="btn-primary">
              浏览菜单
            </Link>
            <Link href="/about" className="btn-secondary">
              了解我们
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="animate-bounce"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-[var(--background)]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              特色产品
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "80px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-1 bg-[var(--primary)] mx-auto mb-6"
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-[var(--foreground)]/70 max-w-2xl mx-auto"
            >
              精选优质咖啡豆，每日新鲜烘焙，为您带来极致口感
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onLoad={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.parentElement) {
                        const placeholder =
                          target.parentElement.querySelector(".animate-pulse");
                        if (placeholder) placeholder.classList.add("hidden");
                      }
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <span className="text-[var(--primary)] font-bold">
                      {product.price}
                    </span>
                  </div>
                  <p className="text-[var(--foreground)]/70 text-sm mb-4">
                    {product.description}
                  </p>
                  <button className="w-full py-2 bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)] transition-colors duration-300">
                    加入购物车
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium"
            >
              查看完整菜单
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="section-padding bg-[var(--secondary)]/10"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="about-image relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src={AboutImage}
                alt="我们的咖啡店"
                fill
                className="object-cover"
              />
            </div>

            <div className="about-content">
              <h2 className="text-3xl font-bold mb-6">关于 Brew Haven</h2>
              <div className="h-1 w-20 bg-[var(--primary)] mb-6" />
              <p className="text-[var(--foreground)]/80 mb-6">
                Brew Haven
                成立于2018年，是一家致力于提供高品质咖啡体验的精品咖啡店。我们直接与全球各地的咖啡农场合作，确保每一批咖啡豆都符合我们的高标准。
              </p>
              <p className="text-[var(--foreground)]/80 mb-8">
                我们的咖啡师经过专业培训，精通各种咖啡制作技术，从传统的意式浓缩到创新的冷萃咖啡，每一杯都是匠心之作。
              </p>
              <Link href="/about" className="btn-primary inline-block">
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-[var(--primary)] text-white">
        <div className="container-custom text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            来访或联系我们
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mb-8 text-white/90"
          >
            无论是享用一杯咖啡，还是举办私人活动，我们都期待您的光临
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link href="/contact" className="btn-secondary">
              联系我们
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">咖啡小店</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">系统状态</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">后端API状态</h3>
              <p className="mt-2">
                {healthStatus ? (
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      healthStatus === "正常"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {healthStatus}
                  </span>
                ) : (
                  <span className="text-gray-500">检查中...</span>
                )}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium">认证状态</h3>
              <p className="mt-2">
                {isAuthenticated ? (
                  <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    已登录: {user?.name}
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    未登录
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">产品列表</h2>
          {loading ? (
            <p className="text-gray-500">加载中...</p>
          ) : error ? (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="h-48 bg-gray-200">
                    {product.mainImage && (
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {product.description.substring(0, 100)}...
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-bold text-lg">
                        ¥{product.price.toFixed(2)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock ? "有库存" : "缺货"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">暂无产品</p>
          )}
        </div>
      </div>
    </div>
  );
}
