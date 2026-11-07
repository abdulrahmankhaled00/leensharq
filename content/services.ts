import type { ServiceCategoryRecord, ServiceItemRecord } from "./types";
import { photo } from "@/lib/photos";

/**
 * Service catalogue — TEMPORARY frontend data, to be replaced by dashboard-managed records.
 *
 * - Categories are the three primary disciplines shown on the home page and at the top of /services.
 * - Items are the detailed services in the /services "What we do" grid; each belongs to one category.
 * - `order` sorts ascending; `visible: false` hides a record without deleting it.
 * - `icon` must be a key of SERVICE_ICONS in components/ui/icons.tsx.
 * - Item `href` is locale-neutral ("/contact"); the component adds the /en prefix for English.
 *
 * Read through getServiceCategories() / getServiceItems() in content/index.ts, never directly.
 */
export const serviceCategories: ServiceCategoryRecord[] = [
  {
    id: "it-services",
    icon: "server",
    image: { src: photo("network-cables"), position: "object-[50%_20%]" },
    name: { ar: "خدمات تقنية المعلومات", en: "IT Services" },
    description: {
      ar: "نهج عملي ودعم مخصص يغطي مجموعة متكاملة من خدمات تقنية المعلومات.",
      en: "Offers a hands-on approach & dedicated assistance on a full range of IT services.",
    },
    order: 1,
    visible: true,
  },
  {
    id: "networking",
    icon: "network",
    name: { ar: "الشبكات", en: "Networking" },
    description: {
      ar: "خبرة في تصميم وتركيب وصيانة البنية التحتية للكابلات.",
      en: "Expert in the design, installation, and maintenance of cabling infrastructure.",
    },
    order: 2,
    visible: true,
  },
  {
    id: "products",
    icon: "box",
    name: { ar: "المنتجات", en: "Products" },
    description: {
      ar: "توريد منتجات تقنية المعلومات والشبكات والطاقة وأجهزة القياس من علامات عالمية رائدة، مع دعم مخصص في اختيارها.",
      en: "Supplies IT, networking, power and test products from leading global brands, with dedicated help choosing the right fit.",
    },
    order: 3,
    visible: true,
  },
];

export const serviceItems: ServiceItemRecord[] = [
  {
    id: "network-design",
    categoryId: "networking",
    icon: "network",
    name: { ar: "تصميم وتنفيذ الشبكات", en: "Network Design & Implementation" },
    description: {
      ar: "شبكات تُخطَّط وتُنفَّذ وفق بنية كل موقع، من الكابلات المهيكلة إلى المعدات النشطة، مع ترقيات تواكب النمو.",
      en: "Networks planned and built around each site's infrastructure, from structured cabling to active equipment, with upgrades that scale with growth.",
    },
    href: "/contact",
    order: 1,
    visible: true,
  },
  {
    id: "network-security",
    categoryId: "it-services",
    icon: "shield",
    name: { ar: "أمن الشبكات والصيانة الاستباقية", en: "Network Security & Maintenance" },
    description: {
      ar: "حماية متينة لشبكات الأعمال، مع مراقبة وصيانة استباقية تكشف المشكلات وتعالجها قبل أن تؤثر على التشغيل.",
      en: "Robust protection for business networks, with proactive monitoring and maintenance that resolves issues before they affect operations.",
    },
    href: "/contact",
    order: 2,
    visible: true,
  },
  {
    id: "wireless",
    categoryId: "networking",
    icon: "wifi",
    name: { ar: "الشبكات اللاسلكية", en: "Wireless Networks" },
    description: {
      ar: "شبكات لاسلكية آمنة وعالية الأداء تغطي أرجاء الموقع وتتيح تنقّلًا سلسًا للمستخدمين والأجهزة.",
      en: "Secure, high-performance wireless coverage across the site, built for seamless mobility of people and devices.",
    },
    href: "/contact",
    order: 3,
    visible: true,
  },
  {
    id: "cctv-access",
    categoryId: "it-services",
    icon: "camera",
    name: { ar: "المراقبة بالفيديو والتحكم بالدخول", en: "CCTV & Access Control" },
    description: {
      ar: "توريد وتركيب أنظمة المراقبة بالفيديو والتحكم بالدخول للمستشفيات والجامعات والجهات الحكومية.",
      en: "Supply and installation of video surveillance and access control systems for hospitals, universities and government sites.",
    },
    href: "/contact",
    order: 4,
    visible: true,
  },
  {
    id: "ups-power",
    categoryId: "products",
    icon: "battery",
    name: { ar: "أنظمة الطاقة اللاانقطاعية والبطاريات", en: "UPS & Battery Systems" },
    description: {
      ar: "أنظمة طاقة لاانقطاعية وبطاريات، مع الأعمال الكهربائية المساندة التي تُبقي المواقع الحساسة تعمل دون توقف.",
      en: "Uninterruptible power and battery systems, with the electrical groundwork that keeps critical sites running without a break.",
    },
    href: "/contact",
    order: 5,
    visible: true,
  },
  {
    id: "test-tools",
    categoryId: "products",
    icon: "tools",
    name: { ar: "أجهزة القياس وأدوات تقنية المعلومات", en: "Test Equipment & IT Tools" },
    description: {
      ar: "أجهزة اختبار دقيقة تتحقق من الأنظمة قبل التشغيل وبعده، وأدوات تمكّن فرق تقنية المعلومات من الإدارة والمراقبة والتحسين.",
      en: "Precision test instruments that verify systems before and after go-live, and the tools IT teams use to manage, monitor and optimize.",
    },
    href: "/contact",
    order: 6,
    visible: true,
  },
];
