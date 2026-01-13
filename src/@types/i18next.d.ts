// @types/i18next.d.ts
import 'i18next';
// Import file bahasa utama (Inggris) sebagai patokan tipe
import common from '../public/locales/en/common.json';

interface I18nNamespaces {
  common: typeof common;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: I18nNamespaces;
  }
}