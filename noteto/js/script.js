import Options from './blocks/Options.js';
import { globalOptionsConfig, blockTypes, fonts } from './config.js';
import {
  DomUtils,
  GraphicUtils,
  GridUtils,
  RenderLibrary,
  RenderFonts,
  RenderOptions,
  TransferUtils,
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

// TODO: Move to utils
function loadTemplate(data) {
  // Remove existing blocks
  DomUtils.removeElements(svgRoot.querySelectorAll('svg'));
  RenderFonts.addFontsToSvg(fonts, svgRoot);

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
  TransferUtils.uploadJsonFromDisk(onFileLoaded);
}

function onClickSaveFileButton() {
  // Compose object with necessary data
  const data = {};
  data.blocks = blocks;
  data.grid = grid;
  data.globalOptionsConfig = globalOptions.opts;

  TransferUtils.downloadObjectAsJson(data, 'noteto-template.json');
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

  const container = document.getElementById('block-options-box');
  const selectedBlock = document.querySelector('svg.dragit.selected');
  if (selectedBlock) {
    // If a block is select, render and show the options
    const blockOptions = blocks[currentTarget.id].blockOpts;
    RenderOptions.renderOptions(blockOptions, onOptionChange);
    container.setAttribute('data-scope', blockOptions.scope);
    container.classList.remove('hidden');
  } else {
    // Just hide the block options
    container.setAttribute('data-scope', '');
    container.classList.add('hidden');
  }
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
  GraphicUtils.convertSvgToCanvas(svgRoot, (canvas) => {
    TransferUtils.downloadCanvasAsPng(canvas, 'noteto-template.png');
  });
}

/** *******************
 * INIT
 ******************** */
function init() {
  RenderFonts.addFontsToSvg(fonts, svgRoot);

  grid = GridUtils.calcGrid(svgRoot);

  RenderOptions.renderOptions(globalOptions, onOptionChange);

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
    RenderLibrary.renderBlockLibrary(libraryEl, blockTypes, onClickBlockInLibrary);
  });
}

// wait for external resources to load if any
window.addEventListener('load', () => {
  init();
});
