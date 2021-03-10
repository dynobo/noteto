/**
 * Helper methods that render and/or insert elements in the DOM
 */
import DomUtils from './DomUtils.js';
import Helpers from './Helpers.js';

const RenderOptions = {
  generateFormField(optName, optVals) {
    let fieldDiv = '';
    switch (optVals.type) {
      case 'select':
        fieldDiv = `
          <div class="field">
            <label class="label">${optVals.label}</label>
            <div class="control">
              <select
                class="select" 
                type="${optVals.type}" 
                data-option="${optName}" 
              >`;
        Object.entries(optVals.options).forEach(([desc, code]) => {
          fieldDiv += `<option value="${code}">${desc}</option>`;
        });
        fieldDiv += `
              </select>
            </div>
          </div>`;
        break;
      case 'checkbox':
        fieldDiv = `
          <div class="field">
            <label class="label">${optVals.label}</label>
            <div class="control">
              <input class="checkbox" 
              type="${optVals.type}"
              data-option="${optName}"
              ${optVals.value === true ? 'checked' : ''}
              >
              </input>
            </div>
          </div>`;
        break;
      default:
        fieldDiv = `
          <div class="field">
            <label class="label">${optVals.label}</label>
            <div class="control">
              <input class="input" 
              type="${optVals.type}"
              value="${optVals.value}"
              data-option="${optName}"
              ${optVals.type === 'number' ? 'min="0"' : ''}
              >
              </input>
            </div>
          </div>
        `;
    }
    return DomUtils.htmlToElement(fieldDiv);
  },

  generateFormRow(optNameLeft, optValsLeft, optNameRight, optValsRight) {
    const leftField = this.generateFormField(optNameLeft, optValsLeft);
    let rightField;
    if (optNameRight) {
      rightField = this.generateFormField(optNameRight, optValsRight);
    } else {
      rightField = document.createElement('div');
    }

    const formRow = document.createElement('div');
    formRow.setAttribute('class', 'field is-grouped');
    formRow.appendChild(leftField);
    formRow.appendChild(rightField);
    return formRow;
  },

  addTabs(tabNames, container, callback) {
    // Listener triggered when clicked on tab title
    function onClickTabTitle(event) {
      // Set only clicked tab to active
      const tabTitles = container.querySelectorAll('.tabs > ul > li');
      tabTitles.forEach((el) => {
        el.classList.remove('is-active');
      });
      event.currentTarget.classList.add('is-active');

      // Set only corresponding tab content to active
      const tabContents = container.querySelectorAll('.tabs-content > *');
      tabContents.forEach((el) => {
        el.classList.remove('is-active');
      });
      const clickedTab = event.currentTarget.getAttribute('data-tab');
      const activeContentContainer = container.querySelector(`div[data-content="${clickedTab}"]`);
      activeContentContainer.classList.add('is-active');
    }

    // Create tab titles to click on
    const tabTitleContainer = container.querySelector('ul');
    DomUtils.removeChilds(tabTitleContainer);
    tabNames.forEach((name) => {
      const li = DomUtils.htmlToElement(`
        <li data-tab="${name}" 
          class="${tabTitleContainer.children.length === 0 ? 'is-active' : ''}"
        >
          <a>${name}</a>
        </li>
      `);
      li.addEventListener('click', onClickTabTitle);
      tabTitleContainer.appendChild(li);
    });

    // Create tab content containers
    const tabContentContainer = container.querySelector('.tabs-content');
    DomUtils.removeChilds(tabContentContainer);
    tabNames.forEach((name) => {
      const contentDiv = DomUtils.htmlToElement(`
      <div data-content="${name}"
      class="${tabContentContainer.children.length === 0 ? 'is-active' : ''}"
      ></div>
      `);
      tabContentContainer.appendChild(contentDiv);
    });

    callback();
  },

  addOptionsToTabs(tabs, options, onOptionChange) {
    const optionsBox = document.getElementById('options-box');
    Object.entries(tabs).forEach(([tabName, optNames]) => {
      const contentDiv = optionsBox.querySelector(`div[data-content="${tabName}"]`);
      const optNamePairs = Helpers.chunkArray(optNames, 2);
      optNamePairs.forEach(([left, right]) => {
        const formRow = this.generateFormRow(left, options[left], right, options[right]);
        contentDiv.appendChild(formRow);
      });
    });
    // Add event listeners on form elements
    optionsBox.querySelectorAll('input, select').forEach((el) => {
      el.addEventListener('input', onOptionChange);
    });
  },

  renderOptions(options, onOptionChange) {
    // Generate dict: { tabName1: [optName1, optName2], tabName2: [...]}
    let tabs = {};
    Object.entries(options).forEach(([optName, optValues]) => {
      (tabs[optValues.group] = tabs[optValues.group] || []).push(optName);
    });

    // Show options from global scope only if "use global" is deactivated
    if (('useGlobal' in options) && (options.useGlobal.value === true)) {
      tabs = { Block: tabs.Block };
    }

    const optionsBox = document.getElementById('options-box');
    this.addTabs(Object.keys(tabs), optionsBox, () => {
      this.addOptionsToTabs(tabs, options, onOptionChange);
    });
  },
};

export default RenderOptions;
