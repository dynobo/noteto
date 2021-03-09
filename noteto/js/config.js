import BaseBlock from './blocks/BaseBlock.js';
import LineBlock from './blocks/LineBlock.js';
import TimeBlock from './blocks/TimeBlock.js';
import IconBlock from './blocks/IconBlock.js';

const blockTypes = {
  'Base Block': BaseBlock,
  'Line Block': LineBlock,
  'Time Block': TimeBlock,
  'Icon Block': IconBlock,
};

const fonts = {
  CrimsonPro: 'fonts/crimson-pro-v14-latin-regular.woff2',
  FontAwesome: 'fonts/fontawesome-webfont.woff2',
  LoraRegular: 'fonts/lora-v17-latin-regular.woff2',
  RobotoBold: 'fonts/roboto-v20-latin-500.woff2',
  RobotoLight: 'fonts/roboto-v20-latin-300.woff2',
  RobotoRegular: 'fonts/roboto-v20-latin-regular.woff2',
  OpenSansBold: 'fonts/open-sans-v18-latin-600.woff2',
  OpenSansLight: 'fonts/open-sans-v18-latin-300.woff2',
  OpenSansRegular: 'fonts/open-sans-v18-latin-regular.woff2',
  OpenSansCondensedBold: 'fonts/open-sans-condensed-v15-latin-700.woff2',
  OpenSansCondensedLight: 'fonts/open-sans-condensed-v15-latin-300.woff2',
};

export { blockTypes, fonts };
