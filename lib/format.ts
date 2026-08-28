/**
 * 格式化价格：整数不带小数（¥32），非整数保留两位（¥32.5 → ¥32.50）
 */
export function formatPrice(price: number, exact = false): string {
  if (exact || !Number.isInteger(price)) {
    return `¥${price.toFixed(2)}`;
  }
  return `¥${price}`;
}

/** 手机号校验（中国大陆） */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone.trim());
}

/** 生成订单号：BH + 时间戳 + 3 位随机数 */
export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `BH${timestamp}${random}`;
}
