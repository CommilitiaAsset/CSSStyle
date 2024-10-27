(function() {
  const link = document.createElement("link");
  link.rel = "stylesheet";

  const lang = document.documentElement.lang?.toLowerCase() || "en";
  if (!lang.startsWith("zh")) {
    link.href = "https://cdn.jsdelivr.net/gh/CommilitiaAsset/CSSStyle/apply_font_ui_tc.css";
  } else if (lang.includes("hant") || [ "tw", "hk", "mo" ].some(l => lang.endsWith(l))) {
    link.href = "https://cdn.jsdelivr.net/gh/CommilitiaAsset/CSSStyle/apply_font_ui_tc.css";
  } else {
    link.href = "https://cdn.jsdelivr.net/gh/CommilitiaAsset/CSSStyle/apply_font_ui_sc.css";
  }

  document.head.appendChild(link);
})()