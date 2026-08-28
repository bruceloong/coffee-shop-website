import type { Category, MenuItem } from "@/types";

import espressoImg from "@/assets/images/espresso.jpg";
import americanoImg from "@/assets/images/americano.jpg";
import latteImg from "@/assets/images/latte.jpg";
import cappuccinoImg from "@/assets/images/cappuccino.jpg";
import mochaImg from "@/assets/images/mocha.jpg";
import caramelMacchiatoImg from "@/assets/images/caramel-macchiato.jpg";
import coldBrewImg from "@/assets/images/cold-brew.jpg";
import pourOverImg from "@/assets/images/pour-over.jpg";
import earlGreyImg from "@/assets/images/earl-grey.jpg";
import jasmineTeaImg from "@/assets/images/jasmine-tea.jpg";
import matchaLatteImg from "@/assets/images/matcha-latte.jpg";
import fruitTeaImg from "@/assets/images/fruit-tea.jpg";
import tiramisuImg from "@/assets/images/tiramisu.jpg";
import cheesecakeImg from "@/assets/images/cheesecake.jpg";
import brownieImg from "@/assets/images/brownie.jpg";
import cinnamonRollImg from "@/assets/images/cinnamon-roll.jpg";
import avocadoToastImg from "@/assets/images/avocado-toast.jpg";
import sandwichImg from "@/assets/images/sandwich.jpg";
import saladBowlImg from "@/assets/images/salad-bowl.jpg";
import breakfastSetImg from "@/assets/images/breakfast-set.jpg";

export const categories: Category[] = [
  { id: "coffee", name: "经典咖啡" },
  { id: "tea", name: "精品茶饮" },
  { id: "dessert", name: "手工甜点" },
  { id: "food", name: "轻食简餐" },
];

export const menuItems: MenuItem[] = [
  // 经典咖啡
  { id: 1, name: "意式浓缩", description: "深度烘焙拼配豆，油脂丰厚，口感浓烈醇厚。", price: 28, image: espressoImg, category: "coffee", tags: ["经典"] },
  { id: 2, name: "美式咖啡", description: "双份浓缩兑纯净水，清爽顺滑，回甘悠长。", price: 30, image: americanoImg, category: "coffee", tags: ["经典"] },
  { id: 3, name: "拿铁", description: "丝滑蒸奶与浓缩咖啡的经典组合，奶泡绵密。", price: 32, image: latteImg, category: "coffee", tags: ["人气"] },
  { id: 4, name: "卡布奇诺", description: "等比浓缩、牛奶与奶泡，口感层次分明。", price: 32, image: cappuccinoImg, category: "coffee", tags: ["经典"] },
  { id: 5, name: "摩卡", description: "浓缩咖啡与比利时黑巧融合，顶部鲜奶油。", price: 36, image: mochaImg, category: "coffee", tags: ["甜"] },
  { id: 6, name: "焦糖玛奇朵", description: "香草糖浆、牛奶与浓缩，焦糖网格点缀。", price: 36, image: caramelMacchiatoImg, category: "coffee", tags: ["甜"] },
  { id: 7, name: "冰滴咖啡", description: "8 小时慢滴冷萃，口感纯净，发酵香气明显。", price: 38, image: coldBrewImg, category: "coffee", tags: ["限定"] },
  { id: 8, name: "手冲单品", description: "每周轮换单一产区豆，手冲呈现产地风味。", price: 42, image: pourOverImg, category: "coffee", tags: ["单品"] },
  // 精品茶饮
  { id: 9, name: "伯爵红茶", description: "佛手柑调味红茶，香气优雅，可配柠檬或牛奶。", price: 28, image: earlGreyImg, category: "tea" },
  { id: 10, name: "茉莉花茶", description: "横县茉莉窨制绿茶，花香清幽，回味甘甜。", price: 28, image: jasmineTeaImg, category: "tea" },
  { id: 11, name: "抹茶拿铁", description: "宇治抹茶与鲜奶调打，茶香浓郁细腻。", price: 34, image: matchaLatteImg, category: "tea", tags: ["人气"] },
  { id: 12, name: "缤纷水果茶", description: "当季鲜果与冷泡茶底，清爽果香四溢。", price: 36, image: fruitTeaImg, category: "tea", tags: ["夏日"] },
  // 手工甜点
  { id: 13, name: "提拉米苏", description: "马斯卡彭与浓缩咖啡手指饼，层层经典。", price: 38, image: tiramisuImg, category: "dessert", tags: ["人气"] },
  { id: 14, name: "纽约芝士蛋糕", description: "重乳酪慢烤，配野生蓝莓酱，浓郁绵密。", price: 36, image: cheesecakeImg, category: "dessert" },
  { id: 15, name: "比利时布朗尼", description: "70% 黑巧克力制成，外脆内润，微苦回甘。", price: 32, image: brownieImg, category: "dessert" },
  { id: 16, name: "肉桂卷", description: "现烤丹麦酥皮，肉桂糖霜饱满，每日限量。", price: 28, image: cinnamonRollImg, category: "dessert", tags: ["每日现烤"] },
  // 轻食简餐
  { id: 17, name: "鳄梨吐司", description: "酸面团吐司配新鲜鳄梨、水波蛋与辣椒片。", price: 42, image: avocadoToastImg, category: "food", tags: ["健康"] },
  { id: 18, name: "火腿芝士三明治", description: "帕尔玛火腿与埃曼塔芝士，酸面包烤制。", price: 38, image: sandwichImg, category: "food" },
  { id: 19, name: "彩虹沙拉碗", description: "藜麦、烤时蔬与牛油果，油醋汁清爽低卡。", price: 46, image: saladBowlImg, category: "food", tags: ["健康"] },
  { id: 20, name: "美式早餐拼盘", description: "太阳蛋、培根、香肠、烤番茄与酸面团吐司。", price: 58, image: breakfastSetImg, category: "food", tags: ["早午市"] },
];

/** 首页精选商品（按 id 引用菜单数据，保证跨页一致） */
export const featuredProductIds = [3, 7, 5, 16];

export function getMenuItem(id: number): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function getFeaturedProducts(): MenuItem[] {
  return featuredProductIds
    .map((id) => getMenuItem(id))
    .filter((item): item is MenuItem => item !== undefined);
}
