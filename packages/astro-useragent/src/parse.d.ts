export interface UserAgent {
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
export declare const parse: (uastring: string | null) => UserAgent;
