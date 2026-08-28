import type { SiteTheme } from "@/lib/site-config";

export type ThemeClasses = {
  shell: string;
  header: string;
  headerBrand: string;
  navLink: string;
  dropdownPanel: string;
  dropdownItem: string;
  dropdownSectionLabel: string;
  mobileItem: string;
  mobileLink: string;
  mobileSubLink: string;
  mobileBorder: string;
  mobileSubBorder: string;
  menuButton: string;
  footer: string;
  footerTitle: string;
  footerHover: string;
  footerDisclosure: string;
  articleSection: string;
  articleHeading: string;
  articleLink: string;
  articleList: string;
  disclosureText: string;
  disclosureLink: string;
};

const THEME_CLASSES: Record<SiteTheme, ThemeClasses> = {
  default: {
    shell: "flex flex-1 flex-col",
    header: "sticky top-0 z-50 border-b border-slate-200 bg-white",
    headerBrand: "block truncate text-lg font-semibold text-slate-900",
    navLink:
      "text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 group-hover:text-blue-600 group-focus-within:text-blue-600",
    dropdownPanel:
      "min-w-64 rounded-lg border border-slate-200 bg-white py-2 shadow-lg",
    dropdownItem:
      "block px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600",
    dropdownSectionLabel:
      "mt-1 border-t border-slate-100 px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-400",
    mobileItem:
      "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600",
    mobileLink:
      "block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600",
    mobileSubLink:
      "block rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600",
    mobileBorder: "border-t border-slate-200 md:hidden",
    mobileSubBorder: "mb-2 ml-2 border-l border-slate-200 pl-2",
    menuButton:
      "inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden",
    footer: "mt-auto border-t border-slate-200 bg-slate-900 py-10 text-slate-400",
    footerTitle: "text-base font-semibold text-white",
    footerHover: "hover:text-white",
    footerDisclosure: "mt-8 border-t border-slate-800 pt-6 text-xs leading-relaxed",
    articleSection: "border-t border-slate-200 bg-slate-50 py-16 md:py-20",
    articleHeading:
      "text-2xl font-bold tracking-tight text-slate-900 md:text-3xl",
    articleLink: "text-sm font-medium text-blue-600 hover:text-blue-700",
    articleList: "mt-6 border-t border-slate-200",
    disclosureText: "text-ss-ink/70",
    disclosureLink:
      "font-medium text-ss-navy underline-offset-2 hover:underline",
  },
  paper: {
    shell: "flex flex-1 flex-col bg-ss-paper text-ss-ink",
    header:
      "sticky top-0 z-50 border-b border-ss-navy/10 bg-ss-paper/90 backdrop-blur-sm",
    headerBrand: "block truncate text-lg font-semibold text-ss-navy",
    navLink:
      "text-sm font-medium text-ss-navy/75 transition-colors hover:text-ss-blue group-hover:text-ss-blue group-focus-within:text-ss-blue",
    dropdownPanel: "min-w-64 border border-ss-navy/10 bg-ss-paper py-2 shadow-lg",
    dropdownItem:
      "block px-4 py-2.5 text-sm text-ss-ink transition-colors hover:bg-ss-mist hover:text-ss-navy",
    dropdownSectionLabel:
      "mt-1 border-t border-ss-navy/10 px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-ss-navy/45",
    mobileItem:
      "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-ss-navy transition-colors hover:bg-ss-mist hover:text-ss-blue",
    mobileLink:
      "block rounded-lg px-3 py-3 text-sm font-medium text-ss-navy transition-colors hover:bg-ss-mist hover:text-ss-blue",
    mobileSubLink:
      "block rounded-lg px-3 py-2.5 text-sm text-ss-ink/80 transition-colors hover:bg-ss-mist hover:text-ss-navy",
    mobileBorder: "border-t border-ss-navy/10 md:hidden",
    mobileSubBorder: "mb-2 ml-2 border-l border-ss-navy/15 pl-2",
    menuButton:
      "inline-flex items-center justify-center rounded-lg p-2 text-ss-navy transition-colors hover:bg-ss-mist md:hidden",
    footer: "mt-auto bg-ss-navy py-10 text-ss-mist/70",
    footerTitle: "text-base font-semibold text-white",
    footerHover: "hover:text-white",
    footerDisclosure: "mt-8 border-t border-slate-800 pt-6 text-xs leading-relaxed",
    articleSection: "border-t border-ss-navy/10 bg-ss-mist/60 py-16 md:py-20",
    articleHeading:
      "text-2xl font-bold tracking-tight text-ss-navy md:text-3xl",
    articleLink: "text-sm font-medium text-ss-navy hover:text-ss-blue",
    articleList: "mt-6 border-t border-ss-navy/10",
    disclosureText: "text-ss-ink/70",
    disclosureLink:
      "font-medium text-ss-navy underline-offset-2 hover:underline",
  },
  "editorial-dark": {
    shell: "flex flex-1 flex-col bg-fwn-void text-fwn-ivory",
    header:
      "sticky top-0 z-50 border-b border-fwn-gold/20 bg-fwn-void/90 backdrop-blur-sm",
    headerBrand:
      "block truncate text-lg font-semibold tracking-[0.08em] text-fwn-ivory",
    navLink:
      "text-sm font-medium tracking-wide text-fwn-sand transition-colors hover:text-fwn-gold group-hover:text-fwn-gold group-focus-within:text-fwn-gold",
    dropdownPanel:
      "min-w-64 border border-fwn-gold/20 bg-fwn-panel py-2 shadow-lg",
    dropdownItem:
      "block px-4 py-2.5 text-sm text-fwn-ivory transition-colors hover:bg-fwn-gold/10 hover:text-fwn-gold",
    dropdownSectionLabel:
      "mt-1 border-t border-fwn-gold/15 px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-fwn-gold/70",
    mobileItem:
      "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-fwn-ivory transition-colors hover:bg-fwn-gold/10 hover:text-fwn-gold",
    mobileLink:
      "block rounded-lg px-3 py-3 text-sm font-medium text-fwn-ivory transition-colors hover:bg-fwn-gold/10 hover:text-fwn-gold",
    mobileSubLink:
      "block rounded-lg px-3 py-2.5 text-sm text-fwn-sand transition-colors hover:bg-fwn-gold/10 hover:text-fwn-gold",
    mobileBorder: "border-t border-fwn-gold/15 md:hidden",
    mobileSubBorder: "mb-2 ml-2 border-l border-fwn-gold/20 pl-2",
    menuButton:
      "inline-flex items-center justify-center rounded-lg p-2 text-fwn-ivory transition-colors hover:bg-fwn-gold/10 hover:text-fwn-gold md:hidden",
    footer:
      "mt-auto border-t border-fwn-gold/20 bg-fwn-void py-10 text-fwn-sand",
    footerTitle:
      "text-base font-semibold tracking-[0.08em] text-fwn-ivory",
    footerHover: "hover:text-fwn-gold",
    footerDisclosure:
      "mt-8 border-t border-fwn-gold/15 pt-6 text-xs leading-relaxed text-fwn-sand/80",
    articleSection: "border-t border-slate-200 bg-slate-50 py-16 md:py-20",
    articleHeading:
      "text-2xl font-bold tracking-tight text-slate-900 md:text-3xl",
    articleLink: "text-sm font-medium text-blue-600 hover:text-blue-700",
    articleList: "mt-6 border-t border-slate-200",
    disclosureText: "text-fwn-sand/80",
    disclosureLink:
      "font-medium text-fwn-gold underline-offset-2 hover:underline",
  },
};

export function getThemeClasses(theme: SiteTheme): ThemeClasses {
  return THEME_CLASSES[theme];
}
