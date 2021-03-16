import DomUtils from '../utils/DomUtils.js';

const templates = [
  {
    folder: 'test-template',
    contributor: 'dynobo',
    description: 'Template to test how fonts, dimensions and colors will show up.',
  },
  {
    folder: 'weekplanner-1',
    contributor: 'dynobo',
    description: 'Simple week planner. 3 rows, 2 columns.',
  },
  {
    folder: 'storyboard-four',
    contributor: 'dynobo',
    description: '2 x 2 storyboards. Canvas and rows for descriptions.',
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
          <div class="has-text-weight-bold">${template.description}</div>
          <div class="is-italic gallery-contributor">by ${template.contributor}</div>
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
