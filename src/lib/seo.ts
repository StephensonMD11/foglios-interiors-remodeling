import type { Metadata } from "next";
import { getSiteUrl, siteConfig } from "./site";

export const DEFAULT_OG_IMAGE = "/projects/newark-bath-lvp.png";

const ogImage = {
  url: DEFAULT_OG_IMAGE,
  width: 1600,
  height: 1200,
  alt: `${siteConfig.name} — bathroom and flooring project in South Jersey`,
};

function pageUrl(path: string) {
  return `${getSiteUrl()}${path === "/" ? "" : path}`;
}

function shareTitle(title: string) {
  return `${title} | ${siteConfig.shortName}`;
}

/** Per-page metadata with matching Open Graph and Twitter cards. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = pageUrl(path);
  const socialTitle = shareTitle(title);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

/** Homepage uses a full title (no template suffix). */
export function homeMetadata(): Metadata {
  const title = `Bathroom Remodeling & Flooring in South Jersey | ${siteConfig.name}`;
  const description = siteConfig.description;
  const url = pageUrl("/");

  return {
    title: { absolute: title },
    description,
    keywords: [...siteConfig.keywords],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
