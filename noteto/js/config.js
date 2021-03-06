import BaseBlock from './blocks/BaseBlock.js';
import LineBlock from './blocks/LineBlock.js';
import TimeBlock from './blocks/TimeBlock.js';
import IconBlock from './blocks/IconBlock.js';

const blockTypes = {
  BaseBlock: { Class: BaseBlock },
  LineBlock: { Class: LineBlock },
  TimeBlock: { Class: TimeBlock },
  IconBlock: { Class: IconBlock },
};

const globalOptionsConfig = {
  borderMargin: {
    group: 'Borders',
    label: 'Border Margin',
    type: 'number',
    value: 2,
  },
  borderStrokeWidth: {
    group: 'Borders',
    label: 'Border Width',
    type: 'number',
    value: 2,
  },
  borderStrokeColor: {
    group: 'Borders',
    label: 'Border Color',
    type: 'color',
    value: '#000000',
  },
  borderRadius: {
    group: 'Borders',
    label: 'Border Radius',
    type: 'number',
    value: 8,
  },
  lineStrokeWidth: {
    group: 'Lines',
    label: 'Line Width',
    type: 'number',
    value: 1,
  },
  lineDistance: {
    group: 'Lines',
    label: 'Line Distance',
    type: 'number',
    value: 50,
  },
  lineStrokeColor: {
    group: 'Lines',
    label: 'Line Color',
    type: 'color',
    value: '#999999',
  },
  titleFontSize: {
    group: 'Titles',
    label: 'Font Size',
    type: 'number',
    value: 16,
  },
  titleFontColor: {
    group: 'Titles',
    label: 'Text Color',
    type: 'color',
    value: '#000000',
  },
  titlePadding: {
    group: 'Titles',
    label: 'Title Padding',
    type: 'number',
    value: 16,
  },
  titleBackgroundColor: {
    group: 'Titles',
    label: 'Title BG Color',
    type: 'color',
    value: '#dddddd',
  },
  fontFamily: {
    group: 'Titles',
    label: 'Font Family',
    type: 'select',
    codes: {
      Roboto: 'RobotoRegular',
      'Roboto Light': 'RobotoLight',
      'Roboto Bold': 'RobotoBold',
      'Crimson Pro': 'CrimsonPro',
      Lora: 'LoraRegular',
      OpenSans: 'OpenSansRegular',
      'OpenSans Light': 'OpenSansLight',
      'OpenSans Bold': 'OpenSansBold',
      'OpenSansCondensed Light': 'OpenSansCondensedLight',
      'OpenSansCondensed Bold': 'OpenSansCondensedBold',
    },
    value: 'RobotoRegular',
  },
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

const preview = false;
if (preview) {
  globalOptionsConfig.borderMargin.value = 2;
  globalOptionsConfig.borderStrokeWidth.value = 2;
  globalOptionsConfig.borderRadius.value = 16;
  globalOptionsConfig.lineStrokeWidth.value = 2;
  globalOptionsConfig.lineDistance.value = 42;
  globalOptionsConfig.titleFontSize.value = 32;
}

export { globalOptionsConfig, blockTypes, fonts };
