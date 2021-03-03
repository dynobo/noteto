import Options from './blocks/Options.js';
import { globalOptionsConfig, blockTypes } from './config.js';
import {
  calcGrid, downloadSvgAsPng, htmlToElement, removeChildren,
} from './utils.js';

/** *******************
 * Global Variables
 ******************** */

/* global interact */

const svgRoot = document.getElementById('paper-svg');
const blocks = {};
const globalOptions = new Options(globalOptionsConfig, 'global');
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

  console.log(rowsHtml);
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
  removeChildren(tabSelectorContainer);
  tabs.forEach((tab) => {
    const li = htmlToElement(`
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
  removeChildren(tabContentContainer);
  tabs.forEach((tab) => {
    const contentDiv = htmlToElement(`
    <div data-content="${tab}"
    class="${tabContentContainer.children.length === 0 ? 'is-active' : ''}"
    ></div>
    `);
    contentDiv.innerHTML = getFormRowsHtml(tab, options);
    tabContentContainer.appendChild(contentDiv);
  });

  // Add event listeners on form elements
  container.querySelectorAll('div > div > input').forEach((el) => {
    el.addEventListener('input', onOptionChange);
  });
}

function showOptions(options) {
  if (options.scope !== 'global') {
    // Toggle visibility of block options
    const container = document.getElementById('block-options-box');
    const selectedBlock = document.querySelector('svg.dragit.selected');
    if (selectedBlock) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
      // no need to rebuild options when hiding
      return;
    }
  }
  buildOptionsForm(options);
}

function renderBlockLibrary() {
  // Add preview for every block type
  const library = document.getElementById('library');
  blockTypes.forEach((blockType) => {
    const img = htmlToElement(`
    <div>
      <img src="img/${blockType.thumb}" class="image is-96x96">
    </div>
    `);
    img.addEventListener('click', () => { onClickBlockInLibrary(blockType); });
    library.append(img);
  });
}

/** *******************
 * LISTENERS
 ******************** */
function onClickBlockInLibrary(blockType) {
  // Insert new block instance into root svg
  const newBlock = new blockType.Class(grid, globalOptions);
  newBlock.add(svgRoot);
  blocks[newBlock.id] = newBlock;
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
  const tabContentContainers = optionsBox.querySelector('.tabs-content').children;
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

  const blockKeys = Object.keys(blocks);

  // If target provides global scope, apply options to all blocks,
  // else consider scope as blockId and apply option to individual block.
  if (optScope === 'global') {
    globalOptions.opts[optName].value = optValue;
    blockKeys.forEach((blockKey) => {
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

/** *******************
 * INIT
 ******************** */
function init() {
  grid = calcGrid(svgRoot);

  showOptions(globalOptions);

  // Prevent default events for dragging
  document.addEventListener('dragstart', (event) => event.preventDefault());

  const exportBtn = document.getElementById('export-button');
  exportBtn.addEventListener('click', downloadSvgAsPng);

  const restrictions = [
    interact.modifiers.snap({
      targets: [interact.snappers.grid(grid)],
      range: Infinity,
      relativePoints: [{ x: 0, y: 0 }],
    }),
    /*
    interact.modifiers.restrictRect({
      restriction: 'parent',
    }),
    interact.modifiers.restrict({
      restriction: 'parent',
      elementRect: {
        top: 0, left: 0, bottom: 1, right: 1,
      },
      endOnly: false,
    }),

    /*
    interact.modifiers.snapEdges({
      targets: [
        interact.snappers.grid(snap_grid),
      ],
    }),

    interact.modifiers.restrictEdges({
      outer: 'parent',
    }),

    interact.modifiers.restrictSize({
      min: { width: grid_width, height: grid_height },
    }),

    interact.modifiers.snapSize({
      targets: [
        interact.snappers.grid(snap_grid),
      ],
    }), */
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
  renderBlockLibrary();
}

// wait for external resources to load if any
window.addEventListener('load', () => {
  init();
});
