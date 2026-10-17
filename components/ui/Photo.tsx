import Image, { type ImageProps } from "next/image";
import blur from "@/lib/photo-blur.json";

const BLUR = blur as Record<string, string>;

/** next/image with a tiny blurred preview for local photos, so a slow image fades in instead of leaving a hole. */
export default function Photo(props: ImageProps) {
  const placeholder = typeof props.src === "string" ? BLUR[props.src] : undefined;
  return <Image quality={72} {...props} {...(placeholder ? { placeholder: "blur" as const, blurDataURL: placeholder } : {})} />;
}
