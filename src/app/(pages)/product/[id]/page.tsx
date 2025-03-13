"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { productAPI, reviewAPI } from "@/services/api";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// 产品接口
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags?: string[];
  stock: number;
}

// 评价接口
interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  // 评价表单状态
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewFormErrors, setReviewFormErrors] = useState<
    Record<string, string>
  >({});

  // 当前用户ID
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 获取产品信息
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!params.id) return;

      try {
        setLoading(true);

        // 获取产品信息
        const productResponse = await productAPI.getProduct(
          params.id as string
        );
        setProduct(productResponse.data.product);

        // 获取产品评价
        const reviewsResponse = await reviewAPI.getProductReviews(
          params.id as string
        );
        setReviews(reviewsResponse.data.reviews);

        // 获取当前用户信息
        try {
          const user = localStorage.getItem("user");
          if (user) {
            const userData = JSON.parse(user);
            setCurrentUserId(userData._id);
          }
        } catch (err) {
          console.error("Failed to get current user:", err);
        }

        setError("");
      } catch (err: any) {
        console.error("Failed to fetch product:", err);
        setError(err.response?.data?.message || "无法加载产品信息");
        toast.error("加载产品信息失败，请刷新页面重试");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [params.id]);

  // 添加到购物车
  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error(`${product.name} 已售罄`);
      return;
    }

    if (quantity > product.stock) {
      toast.error(`库存不足，当前库存: ${product.stock}`);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        category: product.category,
      });
    }

    toast.success(`已添加 ${quantity} 件 ${product.name} 到购物车`);
  };

  // 处理数量变化
  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.stock) {
      toast.error(`库存不足，当前库存: ${product.stock}`);
      return;
    }
    setQuantity(value);
  };

  // 处理评价表单输入变化
  const handleReviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReviewFormData((prev) => ({ ...prev, [name]: value }));

    // 清除错误
    if (reviewFormErrors[name]) {
      setReviewFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 处理评分变化
  const handleRatingChange = (rating: number) => {
    setReviewFormData((prev) => ({ ...prev, rating }));
  };

  // 验证评价表单
  const validateReviewForm = () => {
    const errors: Record<string, string> = {};

    if (!reviewFormData.comment.trim()) {
      errors.comment = "请输入评价内容";
    }

    setReviewFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 提交评价
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    if (!validateReviewForm()) {
      return;
    }

    try {
      setReviewLoading(true);

      // 检查用户是否已登录
      if (!currentUserId) {
        toast.error("请先登录后再评价");
        router.push("/login");
        return;
      }

      // 提交评价
      const response = await reviewAPI.createReview({
        productId: product._id,
        rating: reviewFormData.rating,
        comment: reviewFormData.comment,
      });

      // 更新评价列表
      setReviews((prev) => [response.data.review, ...prev]);

      // 重置表单
      setReviewFormData({
        rating: 5,
        comment: "",
      });

      setShowReviewForm(false);
      toast.success("评价提交成功");
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      toast.error(err.response?.data?.message || "评价提交失败，请重试");
    } finally {
      setReviewLoading(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 计算平均评分
  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">产品信息加载失败</h1>
          <p className="text-gray-600 mb-8">{error || "找不到该产品"}</p>
          <button
            onClick={() => router.push("/menu")}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            返回菜单
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          返回
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* 产品图片 */}
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* 产品信息 */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      star <= Math.round(parseFloat(averageRating))
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">
                {averageRating} ({reviews.length} 条评价)
              </span>
            </div>

            <p className="text-2xl font-bold text-primary mb-4">
              ¥{product.price.toFixed(2)}
            </p>

            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                库存:{" "}
                <span
                  className={
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {product.stock > 0 ? `${product.stock} 件` : "已售罄"}
                </span>
              </p>
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-orange-500 text-sm">
                  库存紧张，仅剩 {product.stock} 件
                </p>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex items-center mb-6">
                <span className="mr-4">数量:</span>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-1 border-r hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-1 border-l hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`px-6 py-3 rounded-md text-white ${
                  product.stock > 0
                    ? "bg-primary hover:bg-primary-dark"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {product.stock > 0 ? "加入购物车" : "已售罄"}
              </button>
              <button
                onClick={() => router.push("/menu")}
                className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                继续购物
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 评价部分 */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">用户评价 ({reviews.length})</h2>
          {currentUserId && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              写评价
            </button>
          )}
        </div>

        {/* 评价表单 */}
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h3 className="text-lg font-semibold mb-4">写下您的评价</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">评分</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="mr-1 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-8 w-8 ${
                          star <= reviewFormData.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="comment" className="block text-gray-700 mb-2">
                  评价内容
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={reviewFormData.comment}
                  onChange={handleReviewChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md ${
                    reviewFormErrors.comment
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="请分享您对这个产品的看法..."
                />
                {reviewFormErrors.comment && (
                  <p className="mt-1 text-sm text-red-500">
                    {reviewFormErrors.comment}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {reviewLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="small" color="#ffffff" />
                      <span className="ml-2">提交中...</span>
                    </div>
                  ) : (
                    "提交评价"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* 评价列表 */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-gray-500">暂无评价</p>
            {currentUserId && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                成为第一个评价的人
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mr-2">
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{review.user.name}</span>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
