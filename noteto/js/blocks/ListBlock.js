import LineBlock from './LineBlock.js';

class ListBlock extends LineBlock {
  constructor(grid, globalOptions) {
    super(grid, globalOptions);
    this.type = 'Line Block';
    this.opts.titleText.value = 'To Do';

    // Append options specific to this block
    this.opts.add({
      listType: {
        group: 'Block',
        label: 'List Type',
        type: 'select',
        options: {
          '☐': 'box',
          '1), 2), 3)': 'numeric',
          'a), b), c)': 'alphabetic',
          '🢚': 'arrow',
          '—': 'dash',
          '•': 'bullet',
        },
        value: 'box',
      },
      listFontSize: {
        group: 'Block',
        label: 'Font Size',
        type: 'number',
        value: 32,
      },
    });
  }

  getListChars(index) {
    const type = this.opts.get('listType');
    if (type === 'numeric') return `${index})`;
    if (type === 'alphabetic') return `${String.fromCharCode(96 + index)})`;
    if (type === 'dash') return '—';
    if (type === 'box') return '☐';
    if (type === 'bullet') return '•';
    if (type === 'arrow') return '🢚';
    return '';
  }

  /**
   * Delete all list items from block.
   */
  clearList() {
    const items = this.svg.querySelectorAll('.list-item');
    items.forEach((item) => {
      item.remove();
    });
  }

  /**
   * Add list items to block and style them.
   */
  renderList() {
    const lineDistance = this.opts.get('lineDistance');
    const itemCount = this.innerHeight / lineDistance;

    for (let i = 1; i <= itemCount; i += 1) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'list-item');
      text.setAttribute('font-size', this.opts.get('listFontSize'));
      text.setAttribute('text-anchor', 'start');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('mask', `url(#${this.id}_clip)`);
      text.setAttribute('x', this.xOffset + lineDistance / 8);
      text.setAttribute('y', lineDistance * i + this.yOffset - lineDistance * 0.5);
      text.textContent = this.getListChars(i);
      this.svg.appendChild(text);
    }
  }

  /**
   * Hook that gets execute after rendering of the parents class elements
   */
  onRender() {
    super.onRender();
    this.clearList();
    this.renderList();
  }
}

export default ListBlock;
