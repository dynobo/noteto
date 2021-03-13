import Config from '../config.js';

/**
 * Helper methods for calculation around drag/drop/resize grid
 */

const GridUtils = {
  /**
   * Calculate dimensions used for the SnapGrid.
   * @param {*} paperSvg
   * @return {dict} SnapGrid consisting of width (x), height (y) and offset
   */
  calcGrid(paperSvg) {
    const gridSize = 60;
    const bodyRect = document.body.getBoundingClientRect();
    const rect = paperSvg.getBoundingClientRect();

    const top = Math.round(rect.top - bodyRect.top);
    const left = Math.round(rect.left - bodyRect.left);

    // Define grid dimensions using GCD to ensures a quadratic grid which fills
    // the whole page. Add offset of element.
    return {
      x: gridSize,
      y: gridSize,
      offset: { x: left + Config.pagePadding, y: top + Config.pagePadding },
      padding: Config.pagePadding,
      page: { width: paperSvg.viewBox.baseVal.width, height: paperSvg.viewBox.baseVal.height },
      restriction: {
        top: top + Config.pagePadding,
        left: left + Config.pagePadding,
        bottom: top + paperSvg.viewBox.baseVal.height - Config.pagePadding,
        right: left + paperSvg.viewBox.baseVal.width - Config.pagePadding,
      },
    };
  },

};

export default GridUtils;
