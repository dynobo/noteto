import Options from './blocks/Options.js';
import { globalOptionsConfig, blockTypes, fonts } from './config.js';
import {
  DomUtils,
  Graphics,
  GridUtils,
  Render,
  Transfer,
} from './utils/index.js';

/** *******************
 * Global Variables
 ******************** */

/* global interact */

const svgRoot = document.getElementById('paper-svg');
let blocks = {};
let globalOptions = new Options(globalOptionsConfig, 'global');
let grid = {};

/** *******************
 * Renderers
 ******************** */

function getFormRowsHtml(tab, options) {
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
  return rowsHtml;
}

function buildOptionsForm(options) {
  // Select container to use depending on scope
  let container;
  if (options.scope === 'global') {
    container = document.getElementById('global-options-box');
  } else {
    container = document.getElementById('block-options-box');
  }

  // Get needed tabs
  const tabs = [];
  Object.values(options.opts).forEach((optValues) => {
    if (tabs.indexOf(optValues.group) < 0) {
      tabs.push(optValues.group);
    }
  });

  // Create tab selectors
  const tabSelectorContainer = container.querySelector('ul');
  DomUtils.removeChilds(tabSelectorContainer);
  tabs.forEach((tab) => {
    const li = DomUtils.htmlToElement(`
      <li data-tab="${tab}" 
        class="${tabSelectorContainer.children.length === 0 ? 'is-active' : ''}"
      >
        <a>${tab}</a>
      </li>
    `);
    li.addEventListener('click', onClickTabSelector);
    tabSelectorContainer.appendChild(li);
  });

  // Create tab content containers
  const tabContentContainer = container.querySelector('.tabs-content');
  DomUtils.removeChilds(tabContentContainer);
  tabs.forEach((tab) => {
    const contentDiv = DomUtils.htmlToElement(`
    <div data-content="${tab}"
    class="${tabContentContainer.children.length === 0 ? 'is-active' : ''}"
    ></div>
    `);
    contentDiv.innerHTML = getFormRowsHtml(tab, options);
    tabContentContainer.appendChild(contentDiv);
  });

  // Add event listeners on form elements
  container.querySelectorAll('div > div > input, div > div > select').forEach((el) => {
    el.addEventListener('input', onOptionChange);
  });
}

function showOptions(options) {
  if (options.scope !== 'global') {
    // Toggle visibility of block options
    const container = document.getElementById('block-options-box');
    const selectedBlock = document.querySelector('svg.dragit.selected');

    if (selectedBlock) {
      container.setAttribute('data-scope', options.scope);
      container.classList.remove('hidden');
    } else {
      container.setAttribute('data-scope', '');
      container.classList.add('hidden');
      // no need to rebuild options when hiding
    }
  }
  buildOptionsForm(options);
}

/** *******************
 * LISTENERS
 ******************** */
function onClickBlockInLibrary(BlockClass) {
  // Insert new block instance into root svg
  const newBlock = new BlockClass(grid, globalOptions);
  newBlock.add(svgRoot);
  blocks[newBlock.id] = newBlock;
}

function onClickDeleteBlock() {
  const container = document.getElementById('block-options-box');
  const blockId = container.getAttribute('data-scope');

  // Remove SVG
  const svg = document.getElementById(blockId);
  svg.parentElement.removeChild(svg);

  // Remove entry from blocks dict
  delete blocks[blockId];

  // Hide options box
  container.classList.add('hidden');
}

function loadFonts() {
  Object.entries(fonts).forEach(([fontName, fontFile]) => {
    const defs = document.querySelector('#paper-svg > defs.font-defs');
    Render.addStyleWithFontFamilyB64(fontName, fontFile, defs);
  });
}

function loadTemplate(data) {
  // Remove existing blocks
  DomUtils.removeElements(svgRoot.querySelectorAll('svg'));
  loadFonts();
  blocks = {};
  // Hide block specific options
  const blockOptionsBox = document.getElementById('block-options-box');
  blockOptionsBox.classList.add('hidden');

  // Load options
  globalOptions = new Options(data.globalOptionsConfig, 'global');
  const globalOptionsBox = document.getElementById('global-options-box');
  Object.entries(globalOptions.opts).forEach(([optionName, optionProps]) => {
    const field = globalOptionsBox.querySelector(`*[data-option="${optionName}"]`);
    field.value = optionProps.value;
  });

  // Load Blocks
  Object.values(data.blocks).forEach((blockData) => {
    try {
      const newBlock = new blockTypes[blockData.type](grid, globalOptions);
      newBlock.width = blockData.width;
      newBlock.height = blockData.height;
      newBlock.x = blockData.x;
      newBlock.y = blockData.y;
      newBlock.dataX = blockData.dataX;
      newBlock.dataY = blockData.dataY;
      newBlock.blockOpts.opts = blockData.blockOpts.opts;
      newBlock.svg.style.webkitTransform = `translate(${newBlock.dataX}px,${newBlock.dataY}px)`;
      newBlock.svg.style.transform = `translate(${newBlock.dataX}px,${newBlock.dataY}px)`;
      newBlock.add(svgRoot);
      blocks[newBlock.id] = newBlock;
    } catch (error) {
      console.error(`Error loading block ${blockData.id} of type ${blockData.type}. Skipping.`);
      console.error(error);
    }
  });
}

function onFileLoaded(data) {
  let obj;
  try {
    obj = JSON.parse(data);
  } catch (error) {
    console.error('Loading from JSON file failed!');
    console.error(error);
    return;
  }
  if (!('grid' in obj && 'blocks' in obj && 'globalOptionsConfig' in obj)) {
    console.error('JSON file didn\'t contain the expected data.');
    return;
  }
  loadTemplate(obj);
}

function onClickLoadFileButton() {
  Transfer.uploadJsonFromDisk(onFileLoaded);
}

function onClickSaveFileButton() {
  // Compose object with necessary data
  const data = {};
  data.blocks = blocks;
  data.grid = grid;
  data.globalOptionsConfig = globalOptions.opts;

  Transfer.downloadObjectAsJson(data, 'noteto-template.json');
}

function onClickTabSelector(event) {
  // Get root options div
  const optionsBox = event.currentTarget.parentNode.parentNode.parentNode;

  // Set only clicked tab to active
  const tabSelectors = optionsBox.querySelectorAll('.tabs > ul > li');
  tabSelectors.forEach((el) => {
    el.classList.remove('is-active');
  });
  event.currentTarget.classList.add('is-active');

  // Set only corresponding tab content to active
  const tabContentContainers = optionsBox.querySelectorAll('.tabs-content > *');
  tabContentContainers.forEach((el) => {
    el.classList.remove('is-active');
  });
  const clickedTab = event.currentTarget.getAttribute('data-tab');
  const activeContentContainer = optionsBox.querySelector(`div[data-content="${clickedTab}"]`);
  activeContentContainer.classList.add('is-active');
}

function onDragMove(event) {
  const id = event.target.getAttribute('id');

  // keep the dragged position in the data-x/data-y attributes
  const x = (parseFloat(blocks[id].dataX) || 0) + event.dx;
  const y = (parseFloat(blocks[id].dataY) || 0) + event.dy;

  // translate the element
  blocks[id].svg.style.webkitTransform = `translate(${x}px,${y}px)`;
  blocks[id].svg.style.transform = `translate(${x}px,${y}px)`;

  // update the posiion attributes
  blocks[id].dataX = x;
  blocks[id].dataY = y;

  blocks[id].render();
}

function onResizeMove(event) {
  const { target } = event;
  const id = target.getAttribute('id');

  // keep the dragged position in the data-x/data-y attributes
  let x = parseFloat(blocks[id].dataX) || 0;
  let y = parseFloat(blocks[id].dataY) || 0;

  blocks[id].width = event.rect.width;
  blocks[id].height = event.rect.height;

  // translate when resizing from top or left edges
  x += event.deltaRect.left;
  y += event.deltaRect.top;

  blocks[id].svg.style.webkitTransform = `translate(${x}px,${y}px)`;
  blocks[id].svg.style.transform = `translate(${x}px,${y}px)`;

  blocks[id].dataX = x;
  blocks[id].dataY = y;

  blocks[id].render();
}

function onOptionChange(event) {
  const { target } = event;

  const dataType = target.getAttribute('type').toLowerCase();
  const optName = target.getAttribute('data-option');
  const optScope = target.getAttribute('data-scope');
  const optValue = dataType === 'number' ? parseInt(target.value, 10) : target.value;

  // If target provides global scope, apply options to all blocks,
  // else consider scope as blockId and apply option to individual block.
  if (optScope === 'global') {
    globalOptions.opts[optName].value = optValue;
    Object.keys(blocks).forEach((blockKey) => {
      blocks[blockKey].globalOpts = globalOptions;
      blocks[blockKey].render();
    });
  } else {
    blocks[optScope].blockOpts.opts[optName].value = optValue;
    blocks[optScope].render();
  }
}

function onBlockClick(event) {
  const { currentTarget } = event;
  currentTarget.classList.toggle('selected');

  // Clear "selected" from all blocks except the clicked one
  const allBlocks = document.querySelectorAll('svg.dragit');
  for (let i = 0; i < allBlocks.length; i += 1) {
    if (allBlocks[i] !== currentTarget) {
      allBlocks[i].classList.remove('selected');
    }
  }
  const blockOptions = blocks[currentTarget.id].blockOpts;
  showOptions(blockOptions);
}

function onClickToFrontOrBack(event) {
  const container = document.getElementById('block-options-box');
  const blockId = container.getAttribute('data-scope');

  // Reorder SVG
  const svg = document.getElementById(blockId);
  const svgParent = svg.parentElement;
  svgParent.removeChild(svg);
  if (event.currentTarget.getAttribute('id') === 'front-button') {
    svgParent.append(svg);
  } else {
    svgParent.prepend(svg);
  }
}

function onFontsLoaded(callback) {
  window.setTimeout(() => {
    const countFonts = document.querySelectorAll('#paper-svg > defs.font-defs > style').length;
    if (countFonts >= Object.keys(fonts).length) {
      callback();
    } else {
      onFontsLoaded(callback);
    }
  }, 200);
}

function onClickDownloadSvgAsPng() {
  Graphics.convertSvgToCanvas(svgRoot, (canvas) => {
    Transfer.downloadCanvasAsPng(canvas, 'noteto-template.png');
  });
}

/** *******************
 * INIT
 ******************** */
function init() {
  loadFonts();

  grid = GridUtils.calcGrid(svgRoot);

  showOptions(globalOptions);

  // Prevent default events for dragging
  document.addEventListener('dragstart', (event) => event.preventDefault());

  const exportBtn = document.getElementById('export-button');
  exportBtn.addEventListener('click', onClickDownloadSvgAsPng);

  const loadBtn = document.getElementById('load-button');
  loadBtn.addEventListener('click', onClickLoadFileButton);

  const saveBtn = document.getElementById('save-button');
  saveBtn.addEventListener('click', onClickSaveFileButton);

  const deleteBtn = document.getElementById('delete-button');
  deleteBtn.addEventListener('click', onClickDeleteBlock);

  const toFrontBtn = document.getElementById('front-button');
  toFrontBtn.addEventListener('click', onClickToFrontOrBack);

  const toBackBtn = document.getElementById('back-button');
  toBackBtn.addEventListener('click', onClickToFrontOrBack);

  const restrictions = [
    interact.modifiers.snap({
      targets: [interact.snappers.grid(grid)],
      range: Infinity,
      relativePoints: [{ x: 0, y: 0 }],
    }),
    interact.modifiers.restrictSize({
      min: { width: grid.x, height: grid.y },
    }),
    interact.modifiers.restrictEdges({
      outer: 'parent',
    }),
  ];

  interact('.dragit')
    .draggable({
      modifiers: restrictions,
      restrict: {
        restriction: 'parent',
        endOnly: false,
        elementRect: {
          top: 0,
          left: 0,
          bottom: 1,
          right: 1,
        },
      },
      autoScroll: true,
      onmove: onDragMove,
      onend: () => { },
    })
    .resizable({
      edges: {
        left: true,
        right: true,
        bottom: true,
        top: true,
      },
      listeners: {
        move: onResizeMove,
      },
      modifiers: restrictions,
    })
    .on('tap', onBlockClick);

  onFontsLoaded(() => {
    const libraryEl = document.getElementById('library');
    Render.renderBlockLibrary(libraryEl, blockTypes, onClickBlockInLibrary);
  });
}

// wait for external resources to load if any
window.addEventListener('load', () => {
  init();
});
