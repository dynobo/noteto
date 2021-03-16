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

    const padding = Config.pagePadding;

    const top = Math.round(rect.top - bodyRect.top);
    const left = Math.round(rect.left - bodyRect.left);

    return {
      x: gridSize / ratio,
      y: gridSize / ratio,
      size: gridSize,
      offset: { x: left + padding / ratio, y: top + padding / ratio },
      padding,
      page: { width: paperSvg.viewBox.baseVal.width, height: paperSvg.viewBox.baseVal.height },
      restriction: {
        top: top + padding / ratio,
        left: left + padding / ratio,
        bottom: top + (paperSvg.viewBox.baseVal.height - padding) / ratio,
        right: left + (paperSvg.viewBox.baseVal.width - padding) / ratio,
      },
    };
  },

};

export default GridUtils;
