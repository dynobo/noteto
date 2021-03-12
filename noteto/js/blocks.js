import BaseBlock from './blocks/BaseBlock.js';
import LineBlock from './blocks/LineBlock.js';
import TimeBlock from './blocks/TimeBlock.js';
import IconBlock from './blocks/IconBlock.js';
import TextBlock from './blocks/TextBlock.js';
import ListBlock from './blocks/ListBlock.js';

const BlockTypes = {
  'Base Block': BaseBlock,
  'Line Block': LineBlock,
  'Time Block': TimeBlock,
  'Icon Block': IconBlock,
  'Text Block': TextBlock,
  'List Block': ListBlock,
};

export default BlockTypes;
