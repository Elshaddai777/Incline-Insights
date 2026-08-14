// A US Letter page rendered at 96 CSS px/in, matching the browser's
// native print resolution so the on-screen "paper" lines up with
// what the browser's Print > Save as PDF produces via the @page rule
// in index.css.
export const DPI = 96;
export const PAGE_WIDTH_IN = 8.5;
export const PAGE_HEIGHT_IN = 11;
export const MARGIN_IN = 1;

export const PAGE_WIDTH_PX = PAGE_WIDTH_IN * DPI;
export const PAGE_HEIGHT_PX = PAGE_HEIGHT_IN * DPI;
export const MARGIN_PX = MARGIN_IN * DPI;
export const CONTENT_HEIGHT_PX = PAGE_HEIGHT_PX - MARGIN_PX * 2;
