import { transformUrl } from "unpic";

import type { LocalImageService, ExternalImageService, ImageTransform, ImageOutputFormat } from "astro";

import sharpService from "astro/assets/services/sharp";
import squooshService from "astro/assets/services/squoosh";

const getInternalService = (key: string) => {
  return key === "sharp" ? sharpService : (squooshService as LocalImageService);
};

const service: LocalImageService & ExternalImageService = {
  validateOptions(options: ImageTransform, serviceConfig) {
    const service = getInternalService(serviceConfig?.service);
    return typeof service?.validateOptions === "function" ? service.validateOptions(options, serviceConfig) : options;
  },

  parseURL(url: URL, serviceConfig) {
    const service = getInternalService(serviceConfig?.service);
    return service.parseURL(url, serviceConfig);
  },

  async transform(inputBuffer, transformOptions, serviceConfig) {
    const service = getInternalService(serviceConfig?.service);
    return service.transform(inputBuffer, transformOptions, serviceConfig);
  },

  getURL(options, serviceConfig) {
    const url = typeof options?.src === "string" ? options.src : options.src.src;

    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      const generatedURL = transformUrl({
        url: url,
        width: options?.width,
        height: options?.height,
      });

      return String(generatedURL);
    }

    const service = getInternalService(serviceConfig?.service);
    return service.getURL(options, serviceConfig);
  },

  getHTMLAttributes(options, serviceConfig) {
    const service = getInternalService(serviceConfig?.service);
    return typeof service?.getHTMLAttributes === "function" ? service.getHTMLAttributes(options, serviceConfig) : {};
  },
};

export default service;
