
/// <reference types="vite/client" />

interface Window {
  __IS_CUSTOM_DOMAIN?: boolean;
  __SITE_SETTINGS__?: {
    logoUrl?: string;
    siteId?: string;
    isLiveSite?: boolean;
    customDomain?: string;
    customDomainEnabled?: boolean;
  };
}
