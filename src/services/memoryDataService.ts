import { ProductCategory } from "../models/productModel";
import { OrderStatus, PaymentMethod } from "../models/orderModel";
import { UserRole } from "../models/userModel";

// 内存数据存储
class MemoryDataStore {
  private static instance: MemoryDataStore;
  private users: any[] = [];
  private products: any[] = [];
  private orders: any[] = [];
  private payments: any[] = [];
  private reviews: any[] = [];

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): MemoryDataStore {
    if (!MemoryDataStore.instance) {
      MemoryDataStore.instance = new MemoryDataStore();
    }
    return MemoryDataStore.instance;
  }

  private initializeData() {
    // 初始化用户数据
    this.users = [
      {
        _id: "user1",
        name: "管理员",
        email: "admin@example.com",
        password:
          "$2a$12$q7GzXfDb9w.qCpx8MgB7aeOX.QUlvTJ9QvTJ9yvR9ELxRjJLZzHSa", // password: admin123
        role: UserRole.ADMIN,
        active: true,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      },
      {
        _id: "user2",
        name: "测试用户",
        email: "user@example.com",
        password:
          "$2a$12$q7GzXfDb9w.qCpx8MgB7aeOX.QUlvTJ9QvTJ9yvR9ELxRjJLZzHSa", // password: admin123
        role: UserRole.USER,
        active: true,
        createdAt: new Date("2023-01-02"),
        updatedAt: new Date("2023-01-02"),
      },
    ];

    // 初始化产品数据
    this.products = [
      {
        _id: "product1",
        name: "拿铁咖啡",
        description: "经典意式浓缩咖啡与丝滑牛奶的完美结合",
        price: 28,
        category: ProductCategory.COFFEE,
        images: ["/images/products/latte1.jpg", "/images/products/latte2.jpg"],
        mainImage: "/images/products/latte1.jpg",
        inStock: true,
        quantity: 100,
        featured: true,
        discount: 0,
        reviews: [],
        averageRating: 4.5,
        ratingsCount: 12,
        createdAt: new Date("2023-01-10"),
        updatedAt: new Date("2023-01-10"),
      },
      {
        _id: "product2",
        name: "美式咖啡",
        description: "清爽醇厚的黑咖啡，唤醒你的每一天",
        price: 22,
        category: ProductCategory.COFFEE,
        images: ["/images/products/americano.jpg"],
        mainImage: "/images/products/americano.jpg",
        inStock: true,
        quantity: 150,
        featured: false,
        discount: 0,
        reviews: [],
        averageRating: 4.2,
        ratingsCount: 8,
        createdAt: new Date("2023-01-11"),
        updatedAt: new Date("2023-01-11"),
      },
      {
        _id: "product3",
        name: "提拉米苏",
        description: "意大利经典甜点，口感细腻，层次丰富",
        price: 38,
        category: ProductCategory.DESSERT,
        images: ["/images/products/tiramisu.jpg"],
        mainImage: "/images/products/tiramisu.jpg",
        inStock: true,
        quantity: 30,
        featured: true,
        discount: 10,
        reviews: [],
        averageRating: 4.8,
        ratingsCount: 15,
        createdAt: new Date("2023-01-12"),
        updatedAt: new Date("2023-01-12"),
      },
      {
        _id: "product4",
        name: "绿茶",
        description: "清新淡雅的绿茶，富含抗氧化物质",
        price: 18,
        category: ProductCategory.TEA,
        images: ["/images/products/green-tea.jpg"],
        mainImage: "/images/products/green-tea.jpg",
        inStock: true,
        quantity: 80,
        featured: false,
        discount: 0,
        reviews: [],
        averageRating: 4.0,
        ratingsCount: 5,
        createdAt: new Date("2023-01-13"),
        updatedAt: new Date("2023-01-13"),
      },
      {
        _id: "product5",
        name: "咖啡杯套装",
        description: "精美陶瓷咖啡杯套装，包含4个杯子和托盘",
        price: 128,
        category: ProductCategory.MERCHANDISE,
        images: ["/images/products/coffee-cups.jpg"],
        mainImage: "/images/products/coffee-cups.jpg",
        inStock: true,
        quantity: 20,
        featured: true,
        discount: 15,
        reviews: [],
        averageRating: 4.7,
        ratingsCount: 9,
        createdAt: new Date("2023-01-14"),
        updatedAt: new Date("2023-01-14"),
      },
    ];

    // 初始化订单数据
    this.orders = [
      {
        _id: "order1",
        orderNumber: "ORD-2023-0001",
        user: "user2",
        items: [
          {
            product: "product1",
            quantity: 2,
            price: 28,
          },
          {
            product: "product3",
            quantity: 1,
            price: 38,
          },
        ],
        totalAmount: 94,
        status: OrderStatus.COMPLETED,
        paymentMethod: PaymentMethod.ALIPAY,
        contactInfo: {
          name: "测试用户",
          phone: "13800138000",
          address: "北京市朝阳区某某街道1号",
        },
        createdAt: new Date("2023-02-01"),
        updatedAt: new Date("2023-02-03"),
      },
      {
        _id: "order2",
        orderNumber: "ORD-2023-0002",
        user: "user2",
        items: [
          {
            product: "product2",
            quantity: 1,
            price: 22,
          },
        ],
        totalAmount: 22,
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.WECHAT,
        contactInfo: {
          name: "测试用户",
          phone: "13800138000",
          address: "北京市朝阳区某某街道1号",
        },
        createdAt: new Date("2023-02-10"),
        updatedAt: new Date("2023-02-10"),
      },
    ];

    // 初始化支付数据
    this.payments = [
      {
        _id: "payment1",
        orderId: "order1",
        amount: 94,
        method: PaymentMethod.ALIPAY,
        status: "success",
        transactionId: "ALI123456789",
        createdAt: new Date("2023-02-01"),
        updatedAt: new Date("2023-02-01"),
      },
    ];

    // 初始化评论数据
    this.reviews = [
      {
        _id: "review1",
        product: "product1",
        user: "user2",
        rating: 5,
        comment: "非常好喝的咖啡，每天必备！",
        createdAt: new Date("2023-02-05"),
        updatedAt: new Date("2023-02-05"),
      },
      {
        _id: "review2",
        product: "product3",
        user: "user2",
        rating: 4,
        comment: "甜点很美味，但是有点甜。",
        createdAt: new Date("2023-02-06"),
        updatedAt: new Date("2023-02-06"),
      },
    ];

    // 将评论添加到产品中
    this.products.forEach((product) => {
      const productReviews = this.reviews.filter(
        (review) => review.product === product._id
      );
      product.reviews = productReviews;
    });
  }

  // 用户相关方法
  public getUsers() {
    return this.users;
  }

  public getUserById(id: string) {
    return this.users.find((user) => user._id === id);
  }

  public getUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  public createUser(userData: any) {
    const newUser = {
      _id: `user${this.users.length + 1}`,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  public updateUser(id: string, userData: any) {
    const index = this.users.findIndex((user) => user._id === id);
    if (index !== -1) {
      this.users[index] = {
        ...this.users[index],
        ...userData,
        updatedAt: new Date(),
      };
      return this.users[index];
    }
    return null;
  }

  public deleteUser(id: string) {
    const index = this.users.findIndex((user) => user._id === id);
    if (index !== -1) {
      const deletedUser = this.users[index];
      this.users.splice(index, 1);
      return deletedUser;
    }
    return null;
  }

  // 产品相关方法
  public getProducts() {
    return this.products;
  }

  public getProductById(id: string) {
    return this.products.find((product) => product._id === id);
  }

  public createProduct(productData: any) {
    const newProduct = {
      _id: `product${this.products.length + 1}`,
      ...productData,
      reviews: [],
      averageRating: 0,
      ratingsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  public updateProduct(id: string, productData: any) {
    const index = this.products.findIndex((product) => product._id === id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...productData,
        updatedAt: new Date(),
      };
      return this.products[index];
    }
    return null;
  }

  public deleteProduct(id: string) {
    const index = this.products.findIndex((product) => product._id === id);
    if (index !== -1) {
      const deletedProduct = this.products[index];
      this.products.splice(index, 1);
      return deletedProduct;
    }
    return null;
  }

  // 订单相关方法
  public getOrders() {
    return this.orders;
  }

  public getOrderById(id: string) {
    return this.orders.find((order) => order._id === id);
  }

  public getOrdersByUser(userId: string) {
    return this.orders.filter((order) => order.user === userId);
  }

  public createOrder(orderData: any) {
    const newOrder = {
      _id: `order${this.orders.length + 1}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${(this.orders.length + 1)
        .toString()
        .padStart(4, "0")}`,
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  public updateOrder(id: string, orderData: any) {
    const index = this.orders.findIndex((order) => order._id === id);
    if (index !== -1) {
      this.orders[index] = {
        ...this.orders[index],
        ...orderData,
        updatedAt: new Date(),
      };
      return this.orders[index];
    }
    return null;
  }

  public deleteOrder(id: string) {
    const index = this.orders.findIndex((order) => order._id === id);
    if (index !== -1) {
      const deletedOrder = this.orders[index];
      this.orders.splice(index, 1);
      return deletedOrder;
    }
    return null;
  }

  // 支付相关方法
  public getPayments() {
    return this.payments;
  }

  public getPaymentById(id: string) {
    return this.payments.find((payment) => payment._id === id);
  }

  public getPaymentByOrderId(orderId: string) {
    return this.payments.find((payment) => payment.orderId === orderId);
  }

  public createPayment(paymentData: any) {
    const newPayment = {
      _id: `payment${this.payments.length + 1}`,
      ...paymentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.payments.push(newPayment);
    return newPayment;
  }

  public updatePayment(id: string, paymentData: any) {
    const index = this.payments.findIndex((payment) => payment._id === id);
    if (index !== -1) {
      this.payments[index] = {
        ...this.payments[index],
        ...paymentData,
        updatedAt: new Date(),
      };
      return this.payments[index];
    }
    return null;
  }

  // 评论相关方法
  public getReviews() {
    return this.reviews;
  }

  public getReviewById(id: string) {
    return this.reviews.find((review) => review._id === id);
  }

  public getReviewsByProduct(productId: string) {
    return this.reviews.filter((review) => review.product === productId);
  }

  public getReviewsByUser(userId: string) {
    return this.reviews.filter((review) => review.user === userId);
  }

  public createReview(reviewData: any) {
    const newReview = {
      _id: `review${this.reviews.length + 1}`,
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.reviews.push(newReview);

    // 更新产品的评论
    const productIndex = this.products.findIndex(
      (product) => product._id === reviewData.product
    );
    if (productIndex !== -1) {
      this.products[productIndex].reviews.push(newReview);

      // 重新计算平均评分
      const productReviews = this.reviews.filter(
        (review) => review.product === reviewData.product
      );
      const totalRating = productReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / productReviews.length;

      this.products[productIndex].averageRating =
        Math.round(averageRating * 10) / 10;
      this.products[productIndex].ratingsCount = productReviews.length;
    }

    return newReview;
  }

  public updateReview(id: string, reviewData: any) {
    const index = this.reviews.findIndex((review) => review._id === id);
    if (index !== -1) {
      this.reviews[index] = {
        ...this.reviews[index],
        ...reviewData,
        updatedAt: new Date(),
      };

      // 更新产品的评论
      const productId = this.reviews[index].product;
      const productIndex = this.products.findIndex(
        (product) => product._id === productId
      );
      if (productIndex !== -1) {
        const reviewIndex = this.products[productIndex].reviews.findIndex(
          (review: any) => review._id === id
        );
        if (reviewIndex !== -1) {
          this.products[productIndex].reviews[reviewIndex] =
            this.reviews[index];
        }

        // 重新计算平均评分
        const productReviews = this.reviews.filter(
          (review) => review.product === productId
        );
        const totalRating = productReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating = totalRating / productReviews.length;

        this.products[productIndex].averageRating =
          Math.round(averageRating * 10) / 10;
        this.products[productIndex].ratingsCount = productReviews.length;
      }

      return this.reviews[index];
    }
    return null;
  }

  public deleteReview(id: string) {
    const index = this.reviews.findIndex((review) => review._id === id);
    if (index !== -1) {
      const deletedReview = this.reviews[index];
      this.reviews.splice(index, 1);

      // 更新产品的评论
      const productId = deletedReview.product;
      const productIndex = this.products.findIndex(
        (product) => product._id === productId
      );
      if (productIndex !== -1) {
        this.products[productIndex].reviews = this.products[
          productIndex
        ].reviews.filter((review: any) => review._id !== id);

        // 重新计算平均评分
        const productReviews = this.reviews.filter(
          (review) => review.product === productId
        );
        const totalRating = productReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating =
          productReviews.length > 0 ? totalRating / productReviews.length : 0;

        this.products[productIndex].averageRating =
          Math.round(averageRating * 10) / 10;
        this.products[productIndex].ratingsCount = productReviews.length;
      }

      return deletedReview;
    }
    return null;
  }
}

export default MemoryDataStore.getInstance();
