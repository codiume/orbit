import {
  UAParser,
  type IBrowser,
  type ICPU,
  type IDevice,
  type IEngine,
  type IOS
} from 'ua-parser-js';

import {
  isAIBot,
  isAppleSilicon,
  isBot,
  isChromeFamily
} from 'ua-parser-js/helpers';

// mostly ported from https://github.com/tokuda109/next-useragent
export interface UserAgent {
  readonly source: string | null; // The original user agent string.
  readonly browser: string | null;
  readonly browserVersion: number;
  readonly cpu: string | null;
  readonly deviceType: string | null;
  readonly deviceVendor: string | null;
  readonly engine: string | null;
  readonly engineVersion: number | null;
  readonly os: string | null;
  readonly osVersion: number | null;
  readonly isAndroid: boolean;
  readonly isChrome: boolean;
  readonly isChromeOS: boolean;
  readonly isDesktop: boolean;
  readonly isEdge: boolean;
  readonly isFirefox: boolean;
  readonly isIE: boolean;
  readonly isIos: boolean;
  readonly isIpad: boolean;
  readonly isIphone: boolean;
  readonly isMac: boolean;
  readonly isMobile: boolean;
  readonly isOpera: boolean;
  readonly isSafari: boolean;
  readonly isTablet: boolean;
  readonly isWindows: boolean;
  readonly isBot: boolean;
  readonly isAIBot: boolean;
  readonly isChromeFamily: boolean;
  readonly isAppleSilicon: boolean;
  getUA(): string;
  getBrowser(): IBrowser;
  getCPU(): ICPU;
  getDevice(): IDevice;
  getEngine(): IEngine;
  getOS(): IOS;
}

export const parse = (ua: string | null): UserAgent => {
  const uap = new UAParser(ua ?? '');

  const browser = uap.getBrowser();
  const cpu = uap.getCPU();
  const device = uap.getDevice();
  const engine = uap.getEngine();
  const os = uap.getOS();

  const userAgent: UserAgent = Object.freeze({
    source: ua,
    browser: browser.name || null,
    browserVersion: parseFloat(browser.version || '0'),
    cpu: cpu.architecture || null,
    deviceType: device.type || 'mobile',
    deviceVendor: device.vendor || null,
    engine: engine.name || null,
    engineVersion: parseFloat(engine.version || '0'),
    os: os.name || null,
    osVersion: parseInt(os.version || '0', 10),
    isAndroid: os.is('Android') || os.is('Android-x86'),
    isChrome: browser.is('Chrome') || browser.is('Chrome Mobile'),
    isChromeOS: os.is('Chrome OS'),
    isDesktop: !device.is('mobile') && !device.is('tablet'),
    isEdge: browser.is('Edge'),
    isFirefox: browser.is('Firefox') || browser.is('Firefox Mobile'),
    isIE: browser.is('IE') || browser.is('IEMobile'),
    isIos: os.is('iOS'),
    isIpad: device.is('tablet') && os.is('iOS'),
    isIphone: device.is('mobile') && os.is('iOS'),
    isMac: os.is('macOS'),
    isMobile: device.is('mobile'),
    isOpera:
      browser.is('Opera') ||
      browser.is('Opera GX') ||
      browser.is('Opera Mini') ||
      browser.is('Opera Mobi') ||
      browser.is('Opera Tablet'),
    isSafari: browser.is('Safari') || browser.is('Safari Mobile'),
    isTablet: device.is('tablet'),
    isWindows:
      os.is('Windows') || os.is('Windows Phone') || os.is('Windows Mobile'),
    isBot: isBot(ua ?? ''),
    isAIBot: isAIBot(ua ?? ''),
    isChromeFamily: isChromeFamily(ua ?? ''),
    isAppleSilicon: isAppleSilicon(ua ?? ''),

    // methods
    getBrowser: uap.getBrowser,
    getCPU: uap.getCPU,
    getDevice: uap.getDevice,
    getEngine: uap.getEngine,
    getOS: uap.getOS,
    getUA: uap.getUA
  });

  return userAgent;
};
