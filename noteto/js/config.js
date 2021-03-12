const Fonts = {
  fontDict: {
    CrimsonPro: {
      file: 'fonts/crimson-pro-v14-latin-regular.woff2',
      label: 'Crimson Pro',
    },
    FontAwesome: {
      file: 'fonts/fontawesome-webfont.woff2',
      label: 'FontAwesome',
    },
    LoraRegular: {
      file: 'fonts/lora-v17-latin-regular.woff2',
      label: 'Lora',
    },
    RobotoBold: {
      file: 'fonts/roboto-v20-latin-500.woff2',
      label: 'Roboto Bold',
    },
    RobotoLight: {
      file: 'fonts/roboto-v20-latin-300.woff2',
      label: 'Roboto Light',
    },
    RobotoRegular: {
      file: 'fonts/roboto-v20-latin-regular.woff2',
      label: 'Roboto',
    },
    OpenSansBold: {
      file: 'fonts/open-sans-v18-latin-600.woff2',
      label: 'OpenSans Bold',
    },
    OpenSansLight: {
      file: 'fonts/open-sans-v18-latin-300.woff2',
      label: 'OpenSans Light',
    },
    OpenSansRegular: {
      file: 'fonts/open-sans-v18-latin-regular.woff2',
      label: 'OpenSans',
    },
    OpenSansCondensedBold: {
      file: 'fonts/open-sans-condensed-v15-latin-700.woff2',
      label: 'OpenSansCondensed Bold',
    },
    OpenSansCondensedLight: {
      file: 'fonts/open-sans-condensed-v15-latin-300.woff2',
      label: 'OpenSansCondensed Light',
    },
  },
  getOptions() {
    const options = {};
    Object.entries(this.fontDict).forEach(([key, values]) => {
      options[values.label] = key;
    });
    return options;
  },
};
export default Fonts;
