import Config from '../config.js';
import Helpers from './Helpers.js';
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
    const ratio = Helpers.getRatio(paperSvg);

    const gridSize = 12;
    const bodyRect = document.body.getBoundingClientRect();
    const rect = paperSvg.getBoundingClientRect();

    const top = Math.round(rect.top - bodyRect.top);
    const left = Math.round(rect.left - bodyRect.left);

    // Define grid dimensions using GCD to ensures a quadratic grid which fills
    // the whole page. Add offset of element.
    return {
      x: gridSize / ratio,
      y: gridSize / ratio,
      size: gridSize,
      offset: { x: left + Config.pagePadding / ratio, y: top + Config.pagePadding / ratio },
      padding: Config.pagePadding,
      page: { width: paperSvg.viewBox.baseVal.width, height: paperSvg.viewBox.baseVal.height },
      restriction: {
        top: top + Config.pagePadding / ratio,
        left: left + Config.pagePadding / ratio,
        bottom: top + (paperSvg.viewBox.baseVal.height - Config.pagePadding) / ratio,
        right: left + (paperSvg.viewBox.baseVal.width - Config.pagePadding) / ratio,
      },
    };
  },

};

export default GridUtils;
