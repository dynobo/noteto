/**
 * Helper methods that render and/or insert elements in the DOM
 */
import { GraphicUtils, DomUtils } from './index.js';

const Render = {
  /**
   * Draw resized image on a canvas object.
   * @param {Element} img <img> element containing the image to draw
   * @param {Element} canvas <canvas> element where to draw on
   */
  drawResizedImgOnCanvas(img, canvas) {
    const previewGrid = { x: 93.6, y: 93.6 };
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img,
      0, 0,
      previewGrid.x * 3, previewGrid.y * 3,
      0, 0,
      288, 288);
  },

  /**
   * Append previews for blocks to the target container and adds click listener
   * @param {Element} targetContainer Container element for library to append previews to
   * @param {Object} blockTypes Contains BlockType (Name) and the Class to instanciate
   * @param {Function} onClickListener Listener that gets added to the preview and executed on click
   */
  renderBlockLibrary(targetContainer, blockTypes, onClickListener) {
    // Add preview for every block type
    Object.entries(blockTypes).forEach(([blockType, BlockClass]) => {
      // Create canvas to draw preview on
      const previewCanvas = document.createElement('canvas');
      previewCanvas.setAttribute('id', `library-${blockType}`);
      previewCanvas.setAttribute('width', '288px');
      previewCanvas.setAttribute('height', '288px');
      previewCanvas.setAttribute('class', 'image is-96x96');

      // Canvas needs surrounding div for sizing
      const containerDiv = document.createElement('div');
      containerDiv.append(previewCanvas);
      targetContainer.append(containerDiv);

      // What to do if preview is clicked
      containerDiv.addEventListener('click', () => { onClickListener(BlockClass); });

      // Finally generate the preview image and draw it on the preview canvas
      GraphicUtils.generateBlockPreview(blockType, BlockClass, (tempImg) => {
        Render.drawResizedImgOnCanvas(tempImg, previewCanvas);
      });
    });
  },

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

  // TODO: Refactor, create elements earlier, pairwise
  addFormElements(tab, options, targetElement) {
    // Fill tab content containers with form elments
    let rowsHtml = '';
    let fieldDiv = '';
    let counter = 0;
    Object.entries(options.opts).forEach(([optKey, optVals]) => {
      if (optVals.group !== tab) {
        return;
      }
      counter += 1;
      if (optVals.type !== 'select') {
        fieldDiv += `
          <div class="field">
          <label class="label">${optVals.label}</label>
          <div class="control">
          <input class="input" 
          type="${optVals.type}"
          value="${optVals.value}"
          data-option="${optKey}"
          data-scope="${options.scope}"
          ${optVals.type === 'number' ? 'min="0"' : ''}
          >
          </input>
          </div>
          </div>
      `;
      } else {
        fieldDiv += `
        <div class="field">
        <label class="label">${optVals.label}</label>
          <div class="control select">
            <select type="${optVals.type}" data-option="${optKey}" data-scope="${options.scope}">`;
        Object.entries(optVals.codes).forEach(([desc, code]) => {
          fieldDiv += `<option value="${code}">${desc}</option>`;
        });
        fieldDiv += `
            </select>
          </div>
        </div>`;
      }

      if (counter % 2 === 0) {
        const rowHtml = `<div class="field is-grouped">${fieldDiv}</div>`;
        rowsHtml += rowHtml;
        fieldDiv = '';
      }
    });

    if (fieldDiv.length > 0) {
      const rowHtml = `<div class="field is-grouped">${fieldDiv}</div>`;
      rowsHtml += rowHtml;
    }
    // const tempElement = DomUtils.htmlToElement(rowsHtml);
    targetElement.innerHTML = rowsHtml;
  },

  addTabs(tabNames, container, callback) {
    // Listener triggered when clicked on tab title
    function onClickTabTitle(event) {
      // Set only clicked tab to active
      const tabTitles = container.querySelectorAll('.tabs > ul > li');
      tabTitles.forEach((el) => {
        el.classList.remove('is-active');
      });
      event.currentTarget.classList.add('is-active');

      // Set only corresponding tab content to active
      const tabContents = container.querySelectorAll('.tabs-content > *');
      tabContents.forEach((el) => {
        el.classList.remove('is-active');
      });
      const clickedTab = event.currentTarget.getAttribute('data-tab');
      const activeContentContainer = container.querySelector(`div[data-content="${clickedTab}"]`);
      activeContentContainer.classList.add('is-active');
    }

    // Create tab titles to click on
    const tabTitleContainer = container.querySelector('ul');
    DomUtils.removeChilds(tabTitleContainer);
    tabNames.forEach((name) => {
      const li = DomUtils.htmlToElement(`
        <li data-tab="${name}" 
          class="${tabTitleContainer.children.length === 0 ? 'is-active' : ''}"
        >
          <a>${name}</a>
        </li>
      `);
      li.addEventListener('click', onClickTabTitle);
      tabTitleContainer.appendChild(li);
    });

    // Create tab content containers
    const tabContentContainer = container.querySelector('.tabs-content');
    DomUtils.removeChilds(tabContentContainer);
    tabNames.forEach((name) => {
      const contentDiv = DomUtils.htmlToElement(`
      <div data-content="${name}"
      class="${tabContentContainer.children.length === 0 ? 'is-active' : ''}"
      ></div>
      `);
      tabContentContainer.appendChild(contentDiv);
    });

    callback();
  },

  addOptionsToTabContent(tabNames, tabOptions, onOptionChange) {
    tabNames.forEach((name) => {
      const contentDiv = document.querySelector(`div[data-content="${name}"]`);
      this.addFormElements(name, tabOptions, contentDiv);

      // Add event listeners on form elements
      contentDiv.querySelectorAll('input, select').forEach((el) => {
        el.addEventListener('input', onOptionChange);
      });
    });
  },

  renderOptions(options, onOptionChange) {
    let container;
    if (options.scope === 'global') {
      container = document.getElementById('global-options-box');
    } else {
      container = document.getElementById('block-options-box');
    }

    // Get needed tabs
    const tabNames = [];
    Object.values(options.opts).forEach((optValues) => {
      if (tabNames.indexOf(optValues.group) < 0) {
        tabNames.push(optValues.group);
      }
    });

    this.addTabs(tabNames, container, () => {
      this.addOptionsToTabContent(tabNames, options, onOptionChange);
    });
  },

};

export default Render;
