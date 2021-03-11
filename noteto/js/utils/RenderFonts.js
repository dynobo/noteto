/**
 * Helper methods that render and/or insert elements in the DOM
 */
const RenderFonts = {
  /**
   * Load a font file from an URL, encode it as Base64 and append it as style to an Element.
   * @param {str} fontName Desired name of the font. Will be post-fixed by 'B64'
   * @param {str} fileUrl Url to font file
   * @param {Element} element DOM element to which the <style> tag is appended
   */
  addStyleWithFontFamilyB64(fontName, fileUrl, element) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', fileUrl, true);
    xhr.onerror = (() => { console.error('Error occurred while loading the font file.'); });
    xhr.onload = function onload() {
      if (this.status === 200) {
        const codes = new Uint8Array(this.response);
        const bin = String.fromCharCode.apply(null, codes);
        const fontBase64 = btoa(bin);
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.innerHTML = `
        @font-face {
          font-family: '${fontName}b64';
          src: url(data:font/woff2;base64,${fontBase64});
        }`;
        element.appendChild(style);
      }
    };
    xhr.send();
  },

  addFontsToSvg(fonts, svg) {
    Object.entries(fonts).forEach(([fontName, fontFile]) => {
      const defs = svg.getElementById('font-defs');
      RenderFonts.addStyleWithFontFamilyB64(fontName, fontFile, defs);
    });
  },
};

export default RenderFonts;
