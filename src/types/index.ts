import type { StaticImageData } from "next/image";

/** 菜单分类 */
export type MenuCategory = "coffee" | "tea" | "dessert" | "food";

/** 菜单项（全站唯一数据源） */
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  /** 单价，单位：元 */
  price: number;
  image: StaticImageData;
  category: MenuCategory;
  tags?: string[];
}

/** 购物车商品（可安全序列化到 localStorage） */
export interface CartItem {
  id: number;
  name: string;
  /** 单价，单位：元 */
  price: number;
  /** 图片路径（静态导入的 .src），避免序列化整个图片对象 */
  imageSrc: string;
  quantity: number;
}

export interface Category {
  id: MenuCategory;
  name: string;
}
