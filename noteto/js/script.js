import Options from './blocks/Options.js';
import { blockTypes, fonts } from './config.js';
import RenderFonts from './utils/RenderFonts.js';
import RenderLibrary from './utils/RenderLibrary.js';
import RenderOptions from './utils/RenderOptions.js';
import RenderTemplates from './utils/RenderTemplates.js';
import GraphicUtils from './utils/GraphicUtils.js';
import GridUtils from './utils/GridUtils.js';
import TransferUtils from './utils/TransferUtils.js';

/** *******************
 * Global Variables
 ******************** */

/* global interact */

const paperSvg = document.getElementById('paper-svg');
const sharedOptions = new Options({});
let blocks = {};
let grid = {};

/** *******************
 * LISTENERS
 ******************** */

function onBlockChange() {
  const optionsBox = document.getElementById('options-box');
  const boxTitle = optionsBox.querySelector('p.box-title');
  const selectedBlock = document.querySelector('svg.dragit.selected');
  if (!selectedBlock) {
    RenderOptions.renderOptions(sharedOptions, onOptionChange);
    optionsBox.removeAttribute('data-blockid');
    boxTitle.textContent = 'Shared Options';
  } else {
    optionsBox.setAttribute('data-blockid', selectedBlock.id);
    boxTitle.textContent = `Block ${selectedBlock.id}`;
    RenderOptions.renderOptions(blocks[selectedBlock.id].opts, onOptionChange);
  }
}

function onClickBlockInLibrary(BlockClass) {
  // Insert new block instance into root svg
  const newBlock = new BlockClass(grid);
  newBlock.add(paperSvg);
  sharedOptions.addShared(newBlock.opts);
  blocks[newBlock.id] = newBlock;
  onBlockChange();
}

function onClickDeleteBlockBtn() {
  const optionsBox = document.getElementById('options-box');
  const blockId = optionsBox.getAttribute('data-blockid');

  // Remove SVG
  const svg = document.getElementById(blockId);
  svg.parentElement.removeChild(svg);

  // Remove entry from blocks dict
  delete blocks[blockId];

  onBlockChange();
}

function onFileLoaded(obj) {
  // Validate roughly
  if (!('grid' in obj && 'blocks' in obj && 'globalOptionsConfig' in obj)) {
    console.error('JSON file didn\'t contain the expected data.');
    return;
  }
  [blocks, globalOptions] = RenderTemplates.loadTemplate(obj, paperSvg, grid);
}

function onClickLoadFileBtn() {
  TransferUtils.uploadJsonFromDisk(onFileLoaded);
}

function onClickSaveFileBtn() {
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

  const optionsBox = document.getElementById('options-box');
  const blockId = optionsBox.getAttribute('data-blockid');

  const dataType = target.getAttribute('type').toLowerCase();
  const optName = target.getAttribute('data-option');

  let optValue;
  switch (dataType) {
    case 'number':
      optValue = parseInt(target.value, 10);
      break;
    case 'checkbox':
      optValue = target.checked;
      break;
    default:
      optValue = target.checked;
  }

  // If target provides global scope, apply options to all blocks,
  // else consider scope as blockId and apply option to individual block.
  if (!blockId) {
    sharedOptions[optName].value = optValue;
    Object.keys(blocks).forEach((blockKey) => {
      blocks[blockKey].opts.setShared(optName, optValue);
      blocks[blockKey].render();
    });
  } else {
    blocks[blockId].opts.set(optName, optValue);
    blocks[blockId].render();
  }
}

function onClickBlock(event) {
  const { currentTarget } = event;
  currentTarget.classList.toggle('selected');

  // Clear "selected" from all blocks except the clicked one
  const allBlocks = document.querySelectorAll('svg.dragit');
  for (let i = 0; i < allBlocks.length; i += 1) {
    if (allBlocks[i] !== currentTarget) {
      allBlocks[i].classList.remove('selected');
    }
  }
  onBlockChange();
}

function onClickToFrontOrBackBtn(event) {
  const container = document.getElementById('options-box');
  const blockId = container.getAttribute('data-blockid');

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

function onClickDownloadPngBtn() {
  GraphicUtils.convertSvgToCanvas(paperSvg, (canvas) => {
    TransferUtils.downloadCanvasAsPng(canvas, 'noteto-template.png');
  });
}

/** *******************
 * INIT
 ******************** */
function init() {
  // Add Load font files and add to svg style
  RenderFonts.addFontsToSvg(fonts, paperSvg);
  onFontsLoaded(() => {
    const libraryEl = document.getElementById('library');
    RenderLibrary.renderBlockLibrary(libraryEl, blockTypes, onClickBlockInLibrary);
  });

  // Prevent default events for dragging
  document.addEventListener('dragstart', (event) => event.preventDefault());

  // Various listeners
  document.getElementById('export-button').addEventListener('click', onClickDownloadPngBtn);
  document.getElementById('load-button').addEventListener('click', onClickLoadFileBtn);
  document.getElementById('save-button').addEventListener('click', onClickSaveFileBtn);
  document.getElementById('delete-button').addEventListener('click', onClickDeleteBlockBtn);
  document.getElementById('front-button').addEventListener('click', onClickToFrontOrBackBtn);
  document.getElementById('back-button').addEventListener('click', onClickToFrontOrBackBtn);

  // Calculate grid dimensions and restrictions
  grid = GridUtils.calcGrid(paperSvg);

  const resizeRestrictions = [
    interact.modifiers.snap({
      targets: [interact.snappers.grid(grid)],
      range: Infinity,
      relativePoints: [{ x: 0, y: 0 }],
    }),
    interact.modifiers.restrictSize({
      min: { width: grid.x, height: grid.y },
    }),
    interact.modifiers.restrictEdges({
      outer: grid.restriction,
    }),
  ];

  const dragRestrictions = [
    interact.modifiers.snap({
      targets: [interact.snappers.grid(grid)],
      range: Infinity,
      relativePoints: [{ x: 0, y: 0 }],
    }),
    interact.modifiers.restrictRect({
      restriction: grid.restriction,
    }),
  ];

  // Initialize interact.js for moving/resizing
  interact('.dragit')
    .draggable({
      modifiers: dragRestrictions,
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
      modifiers: resizeRestrictions,
    })
    .on('tap', onClickBlock);
}

// wait for external resources to load if any
window.addEventListener('load', () => {
  init();
});
