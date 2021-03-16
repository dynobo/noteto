import DomUtils from '../utils/DomUtils.js';

const templates = [
  {
    name: 'Weekplanner 1',
    folder: 'weekplanner-1',
    contributor: 'dynobo',
    description: 'Simple week planner. 3 rows, 2 columns.',
  },
  {
    name: 'Workday 1',
    folder: 'workday-1',
    contributor: 'dynobo',
    description: 'Opinionated day planner with toolbar-margin on left side.',
  },
  {
    name: 'Four Storyboards',
    folder: 'storyboard-four',
    contributor: 'dynobo',
    description: '2 x 2 storyboards. Canvas and rows for descriptions.',
  },
  {
    name: 'Test Template',
    folder: 'test-template',
    contributor: 'dynobo',
    description: 'For demonstrating how fonts, dimensions and colors will look like.',
  },
];

const Gallery = {
  renderGallery(target) {
    templates.forEach((template) => {
      const imgUrl = `./js/gallery/${template.folder}/${template.folder}.png`;
      const html = `
      <div class="card">
      <div class="card-image">
      <figure class="image">
        <img src="${imgUrl}">
      </figure>
    </div>
      <div class="card-content">
          <span class="has-text-weight-bold">${template.name}</span> — ${template.description}
          <small class="is-italic has-text-grey">(by&nbsp;${template.contributor})</small>
      </div>
      <footer class="card-footer">
        <a href="${imgUrl}" class="card-footer-item" download>Download</a>
        <a href="#" data-template="${template.folder}" class="card-footer-item edit-json">Edit</a>
      </footer>
    </div>
      `;
      const el = DomUtils.htmlToElement(html);
      target.appendChild(el);
    });
  },
};

export default Gallery;
