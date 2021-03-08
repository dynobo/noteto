import DomUtils from './DomUtils.js';
import Options from '../blocks/Options.js';
import { blockTypes } from '../config.js';

const RenderTemplates = {
  loadTemplate(data, svg, grid) {
    // Remove existing blocks
    DomUtils.removeElements(svg.querySelectorAll('svg'));
    // RenderFonts.addFontsToSvg(fonts, svg); // TODO: Needed?

    const blocks = {};
    // Hide block specific options
    const blockOptionsBox = document.getElementById('block-options-box');
    blockOptionsBox.classList.add('hidden');

    // Load options
    const globalOptions = new Options(data.globalOptionsConfig, 'global');
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
        newBlock.add(svg);
        blocks[newBlock.id] = newBlock;
      } catch (error) {
        console.error(`Error loading block ${blockData.id} of type ${blockData.type}. Skipping.`);
        console.error(error);
      }
    });

    return [blocks, globalOptions];
  },
};

export default RenderTemplates;
