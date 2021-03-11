/**
 * Helper methods for calculation around drag/drop/resize grid
 */

const GridUtils = {
  /**
   * Calculate dimensions used for the SnapGrid.
   * @param {*} root
   * @return {dict} SnapGrid consisting of width (x), height (y) and offset
   */
  calcGrid(root) {
    const gridSize = 60;
    const pagePadding = 4;
    const rect = root.getBoundingClientRect();
    // Define grid dimensions using GCD to ensures a quadratic grid which fills
    // the whole page. Add offset of element.
    return {
      x: gridSize,
      y: gridSize,
      offset: { x: rect.left + pagePadding, y: rect.top + pagePadding },
      padding: pagePadding,
      page: { width: root.viewBox.baseVal.width, height: root.viewBox.baseVal.height },
      restriction: {
        top: rect.top + pagePadding,
        left: rect.left + pagePadding,
        bottom: rect.top + root.viewBox.baseVal.height - pagePadding,
        right: rect.left + root.viewBox.baseVal.width - pagePadding,
      },
    };
  },

};

export default GridUtils;
