"use client";

import Image, { ImageProps } from "next/image";
import { getImageUrl } from "@/utils/imageUtils";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

/**
 * 优化的图片组件，自动处理图片路径
 * 使用方式与Next.js的Image组件相同，但会自动处理图片路径
 */
export default function OptimizedImage({ src, ...props }: OptimizedImageProps) {
  // 使用getImageUrl处理图片路径
  const optimizedSrc = getImageUrl(src);

  return <Image src={optimizedSrc} {...props} alt={props.alt || ""} />;
}
