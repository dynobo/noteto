import DomUtils from '../utils/DomUtils.js';

const templates = [
  {
    folder: 'day-planner',
    contributor: 'dynobo',
    description: 'Some test description',
  },
  {
    folder: 'day-planner2',
    contributor: 'dynobo2',
    description: `Some test description Some test description Some test description Some test description 
    Some test description Some test description`,
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
          <div>${template.description}</div>
          <div class="has-text-weight-bold is-italic">by ${template.contributor}</div>
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
