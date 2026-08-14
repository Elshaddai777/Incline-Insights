export interface FontOption {
  label: string;
  value: string;
}

export interface FontGroup {
  label: string;
  fonts: FontOption[];
}

export const FONT_GROUPS: FontGroup[] = [
  {
    label: "Sans Serif",
    fonts: [
      { label: "Inter", value: "Inter, sans-serif" },
      { label: "Arial", value: "Arial, sans-serif" },
      { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
      { label: "Verdana", value: "Verdana, sans-serif" },
      { label: "Trebuchet MS", value: '"Trebuchet MS", sans-serif' },
      { label: "Roboto", value: "Roboto, sans-serif" },
      { label: "Lato", value: "Lato, sans-serif" },
      { label: "Montserrat", value: "Montserrat, sans-serif" },
      { label: "Open Sans", value: '"Open Sans", sans-serif' },
    ],
  },
  {
    label: "Serif",
    fonts: [
      { label: "Georgia", value: "Georgia, serif" },
      { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
      { label: "Garamond", value: "Garamond, serif" },
      { label: "Palatino", value: '"Palatino Linotype", Palatino, serif' },
      { label: "Book Antiqua", value: '"Book Antiqua", Palatino, serif' },
      { label: "Merriweather", value: "Merriweather, serif" },
      { label: "Playfair Display", value: '"Playfair Display", serif' },
      { label: "Lora", value: "Lora, serif" },
    ],
  },
  {
    label: "Monospace",
    fonts: [
      { label: "Courier New", value: '"Courier New", monospace' },
      { label: "Roboto Mono", value: '"Roboto Mono", monospace' },
    ],
  },
  {
    label: "Handwriting & Display",
    fonts: [
      { label: "Comic Sans MS", value: '"Comic Sans MS", cursive' },
      { label: "Brush Script MT", value: '"Brush Script MT", cursive' },
      { label: "Papyrus", value: "Papyrus, fantasy" },
      { label: "Impact", value: "Impact, sans-serif" },
      { label: "Pacifico", value: "Pacifico, cursive" },
      { label: "Caveat", value: "Caveat, cursive" },
      { label: "Dancing Script", value: '"Dancing Script", cursive' },
      { label: "Indie Flower", value: '"Indie Flower", cursive' },
    ],
  },
];
