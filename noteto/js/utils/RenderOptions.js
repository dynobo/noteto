/**
 * Helper methods that render and/or insert elements in the DOM
 */
import { DomUtils } from './index.js';

const RenderOptions = {
  // TODO: Refactor, create elements earlier, pairwise
  addFormElements(tab, options, targetElement) {
    // Fill tab content containers with form elments
    let rowsHtml = '';
    let fieldDiv = '';
    let counter = 0;
    Object.entries(options.opts).forEach(([optKey, optVals]) => {
      if (optVals.group !== tab) {
        return;
      }
      counter += 1;
      if (optVals.type !== 'select') {
        fieldDiv += `
          <div class="field">
          <label class="label">${optVals.label}</label>
          <div class="control">
          <input class="input" 
          type="${optVals.type}"
          value="${optVals.value}"
          data-option="${optKey}"
          data-scope="${options.scope}"
          ${optVals.type === 'number' ? 'min="0"' : ''}
          >
          </input>
          </div>
          </div>
      `;
      } else {
        fieldDiv += `
        <div class="field">
        <label class="label">${optVals.label}</label>
          <div class="control select">
            <select type="${optVals.type}" data-option="${optKey}" data-scope="${options.scope}">`;
        Object.entries(optVals.codes).forEach(([desc, code]) => {
          fieldDiv += `<option value="${code}">${desc}</option>`;
        });
        fieldDiv += `
            </select>
          </div>
        </div>`;
      }

      if (counter % 2 === 0) {
        const rowHtml = `<div class="field is-grouped">${fieldDiv}</div>`;
        rowsHtml += rowHtml;
        fieldDiv = '';
      }
    });

    if (fieldDiv.length > 0) {
      const rowHtml = `<div class="field is-grouped">${fieldDiv}</div>`;
      rowsHtml += rowHtml;
    }
    // const tempElement = DomUtils.htmlToElement(rowsHtml);
    targetElement.innerHTML = rowsHtml;
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

  addOptionsToTabContent(tabNames, tabOptions, onOptionChange) {
    tabNames.forEach((name) => {
      const contentDiv = document.querySelector(`div[data-content="${name}"]`);
      this.addFormElements(name, tabOptions, contentDiv);

      // Add event listeners on form elements
      contentDiv.querySelectorAll('input, select').forEach((el) => {
        el.addEventListener('input', onOptionChange);
      });
    });
  },

  renderOptions(options, onOptionChange) {
    let container;
    if (options.scope === 'global') {
      container = document.getElementById('global-options-box');
    } else {
      container = document.getElementById('block-options-box');
    }

    // Get needed tabs
    const tabNames = [];
    Object.values(options.opts).forEach((optValues) => {
      if (tabNames.indexOf(optValues.group) < 0) {
        tabNames.push(optValues.group);
      }
    });

    this.addTabs(tabNames, container, () => {
      this.addOptionsToTabContent(tabNames, options, onOptionChange);
    });
  },

};

export default RenderOptions;
