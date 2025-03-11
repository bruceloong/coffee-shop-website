import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建public/images目录（如果不存在）
const imagesDir = path.join(__dirname, "../public");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 图片列表
const images = [
  {
    name: "hero-bg.jpg",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1920&auto=format&fit=crop",
    description: "咖啡店内景",
  },
  {
    name: "about-image.jpg",
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    description: "咖啡店外景",
  },
  {
    name: "story-image.jpg",
    url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
    description: "咖啡豆和咖啡制作",
  },
  {
    name: "team-1.jpg",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    description: "团队成员1",
  },
  {
    name: "team-2.jpg",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
    description: "团队成员2",
  },
  {
    name: "team-3.jpg",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    description: "团队成员3",
  },
  {
    name: "join-team.jpg",
    url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
    description: "加入团队",
  },
  // 咖啡产品图片
  {
    name: "espresso.jpg",
    url: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=600&auto=format&fit=crop",
    description: "意式浓缩",
  },
  {
    name: "americano.jpg",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    description: "美式咖啡",
  },
  {
    name: "latte.jpg",
    url: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop",
    description: "拿铁",
  },
  {
    name: "cappuccino.jpg",
    url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop",
    description: "卡布奇诺",
  },
  {
    name: "mocha.jpg",
    url: "https://images.unsplash.com/photo-1578314675249-a6910f80cc39?q=80&w=600&auto=format&fit=crop",
    description: "摩卡",
  },
  {
    name: "caramel-macchiato.jpg",
    url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop",
    description: "焦糖玛奇朵",
  },
  {
    name: "cold-brew.jpg",
    url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop",
    description: "冰滴咖啡",
  },
  {
    name: "pour-over.jpg",
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop",
    description: "手冲咖啡",
  },
  // 茶饮图片
  {
    name: "earl-grey.jpg",
    url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    description: "伯爵红茶",
  },
  {
    name: "jasmine-tea.jpg",
    url: "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?q=80&w=600&auto=format&fit=crop",
    description: "茉莉花茶",
  },
  {
    name: "matcha-latte.jpg",
    url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop",
    description: "抹茶拿铁",
  },
  {
    name: "fruit-tea.jpg",
    url: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=600&auto=format&fit=crop",
    description: "水果茶",
  },
  // 甜点图片
  {
    name: "tiramisu.jpg",
    url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop",
    description: "提拉米苏",
  },
  {
    name: "cheesecake.jpg",
    url: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?q=80&w=600&auto=format&fit=crop",
    description: "芝士蛋糕",
  },
  {
    name: "brownie.jpg",
    url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop",
    description: "巧克力布朗尼",
  },
  {
    name: "cinnamon-roll.jpg",
    url: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=600&auto=format&fit=crop",
    description: "肉桂卷",
  },
  // 食品图片
  {
    name: "avocado-toast.jpg",
    url: "https://images.unsplash.com/photo-1603046891744-1f76eb10aec1?q=80&w=600&auto=format&fit=crop",
    description: "鳄梨吐司",
  },
  {
    name: "sandwich.jpg",
    url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop",
    description: "三明治",
  },
  {
    name: "salad-bowl.jpg",
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop",
    description: "沙拉碗",
  },
  {
    name: "breakfast-set.jpg",
    url: "https://images.unsplash.com/photo-1533089860892-a9b969df67e3?q=80&w=600&auto=format&fit=crop",
    description: "早餐套餐",
  },
];

// 下载图片函数
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filePath);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log(`✅ 下载成功: ${filename}`);
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {}); // 删除不完整的文件
        console.error(`❌ 下载失败: ${filename}`, err.message);
        reject(err);
      });
  });
}

// 下载所有图片
async function downloadAllImages() {
  console.log("开始下载图片...");

  for (const image of images) {
    try {
      await downloadImage(image.url, image.name);
    } catch (error) {
      console.error(`下载 ${image.name} 时出错:`, error);
    }
  }

  console.log("所有图片下载完成!");
}

downloadAllImages();
