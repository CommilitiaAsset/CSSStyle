(function () {
  const unicodeFont = "Sarasa UI TC";

  const codeSelector = "progress,meter,datalist,samp,kbd,pre,pre *,code,code *";

  const selector = ":not(i,head *):not([class*='glyph']):not([class*='symbols' i]):not([class*='icon' i]):not([class*='fa-']):not([class*='vjs-'])";

  function rgbToHsl(color) {
    let [ r, g, b ] = color.map(c => c / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min){
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [ h, s, l ];
  }

  function hueToRgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1/6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1/2) {
      return q;
    }
    if (t < 2/3) {
      return p + (q - p) * (2/3 - t) * 6;
    }
    return p;
  }

  function hslToRgb(color) {
    const [ h, s, l ] = color;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToRgb(p, q, h + 1/3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1/3);
    }

    return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
  }

  function rgbToHex(color) {
    return `#${color.map(c => c.toString(16).padStart(2, "0")).join("")}`;
  }

  function parseColor(str) {
    let match;

    if (str.startsWith("rgba")) {
      match = str.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+(\.?\d*)?)\)$/);
      return [ parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseFloat(match[4]) ];
    } else if (str.startsWith("rgb")) {
      match = str.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      return [ parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), 255 ];
    } else if (str.startsWith("#")) {
      switch(str.length) {
        case 9: return [ parseInt(str.slice(1, 3), 16), parseInt(str.slice(3, 5), 16), parseInt(str.slice(5, 7), 16), parseInt(str.slice(7, 9), 16) ];
        case 7: return [ parseInt(str.slice(1, 3), 16), parseInt(str.slice(3, 5), 16), parseInt(str.slice(5, 7), 16), 255 ];
        case 5: return [ parseInt(str[1] + str[1], 16), parseInt(str[2] + str[2], 16), parseInt(str[3] + str[3], 16), parseInt(str[4] + str[4], 16) ];
        case 4: return [ parseInt(str[1] + str[1], 16), parseInt(str[2] + str[2], 16), parseInt(str[3] + str[3], 16), 255 ];
      }
    } else if (str === "transparent") {
      return [ 0, 0, 0, 0 ];
    } else {
      return [ 0, 0, 0, 255 ];
    }

    return [ 0, 0, 0, 255 ];
  }

  function getShadowedColor(node) {
    let [ r, g, b, a ] = parseColor(getComputedStyle(node).color);
    let [ h, s, l ] = rgbToHsl([ r, g, b ]);
    l = 0.486 * l + 0.514;
    a = a * 0.87;

    [ r, g, b ] = hslToRgb([ h, s, l ]);
    return rgbToHex([ r, g, b, a ]);
  }
  
  function applyStyle(node) {
    if (node.matches(codeSelector)) {
      node.style.fontFamily = `'MonoLisa Commilitia', '${unicodeFont}'`;
      node.style.webkitTextStroke = "0.015em";
      node.style.textShadow = `0.75px 0.75px 0 ${getShadowedColor(node)}`;
      return;
    }
    node.style.fontFamily = `'${unicodeFont}'`;
    node.style.webkitTextStroke = "0.015em";
    node.style.textShadow = `0.75px 0.75px 0 ${getShadowedColor(node)}`;
  }

  function executeOnAllChild(node, selector, callback) {
    callback(node);
    node.querySelectorAll(selector).forEach(child => callback(child));
  }

  function onMutation(node) {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    executeOnAllChild(node, selector, applyStyle);
  }

  async function onDomLoaded() {
    await Promise.resolve();
    document.querySelectorAll(selector).forEach(node => {
      if (node instanceof HTMLElement) {
        applyStyle(node);
      }
    });

    new MutationObserver(mutationList => mutationList.forEach(mutation => mutation.addedNodes.forEach(onMutation)))
      .observe(
        document.body,
        { attributes: false, childList: true, subtree: true }
      );
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://cdn.jsdelivr.net/gh/CommilitiaAsset/CSSStyle/fonts.css";
  document.head.appendChild(link);

  document.addEventListener("DOMContentLoaded", onDomLoaded);
})();