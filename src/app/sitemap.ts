import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pulsorede.com.br";

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date("2026-11-20"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#cenario`,
      lastModified: new Date("2026-11-20"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#solucao`,
      lastModified: new Date("2026-11-20"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#como-funciona`,
      lastModified: new Date("2026-11-20"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#segmentos`,
      lastModified: new Date("2026-11-20"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#lideranca`,
      lastModified: new Date("2026-11-20"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#visao`,
      lastModified: new Date("2026-11-20"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#contato`,
      lastModified: new Date("2026-11-20"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
