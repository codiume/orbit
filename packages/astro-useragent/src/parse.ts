import { UAParser } from 'ua-parser-js';

export interface UserAgent {
  // The original user agent string.
  readonly source: string;
  readonly deviceType: string | null;
  readonly deviceVendor: string | null;
  readonly os: string;
  readonly osVersion: number;
  readonly browser: string;
  readonly browserVersion: number;
  readonly engine: string;
  readonly engineVersion: number;
  readonly isIphone: boolean;
  readonly isIpad: boolean;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
  readonly isDesktop: boolean;
  readonly isChrome: boolean;
  readonly isFirefox: boolean;
  readonly isSafari: boolean;
  readonly isIE: boolean;
  readonly isEdge: boolean;
  readonly isOpera: boolean;
  readonly isMac: boolean;
  readonly isChromeOS: boolean;
  readonly isWindows: boolean;
  readonly isIos: boolean;
  readonly isAndroid: boolean;
}

export const parse = (ua: string): UserAgent => {
  const result: UAParser.IResult = new UAParser(ua).getResult();

  const browser: string = result.browser.name;
  const deviceType: string = result.device.type || null;
  const os: string = result.os.name;
  const engine: string = result.engine.name;
  const isMobile: boolean = deviceType === 'mobile';
  const isTablet: boolean = deviceType === 'tablet';
  const isIos: boolean = os === 'iOS';

  const userAgent: UserAgent = Object.freeze({
    browser,
    deviceType,
    os,
    engine,
    isMobile,
    isTablet,
    isIos,
    source: ua,
    deviceVendor: result.device.vendor || null,
    osVersion: parseInt(result.os.version, 10),
    browserVersion: parseFloat(result.browser.version),
    engineVersion: parseFloat(result.engine.version),
    isIphone: isMobile && isIos,
    isIpad: isTablet && isIos,
    isDesktop: !isMobile && !isTablet,
    isChrome: browser === 'Chrome',
    isFirefox: browser === 'Firefox',
    isSafari: browser === 'Safari',
    isIE: browser === 'IE',
    isEdge: browser === 'Edge',
    isOpera: browser === 'Opera',
    isMac: os === 'Mac OS',
    isChromeOS: os === 'Chromium OS',
    isWindows: os === 'Windows',
    isAndroid: os === 'Android'
  });

  return userAgent;
};
