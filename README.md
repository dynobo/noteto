# NoTeTo  *alpha*

> Notetaking Template Tool for the reMarkable tablet (and maybe others?) 

**Visit the *alpha-state* web-application on: <https://teto.needleinthehay.de>**

## Overview

This application was born from a specific need: I found so many useful templates for my tablet (see next section), but none that included all the features I required. Supposly everyone has different needs, so I built this application for creating custom templates based on the building block principle. 

## Contributing

Unfortunately I probably won't have to much time to work on the app, it might not even make it to beta stage. 

**But I welcome contributions as pull requests!**

## Developing

Development setup is kept minimal, no build is required. Just:
1. Clone the repo
2. In the repo root, start your favorite local webserver
3. Point your browser to the `index.html` on `localhost`

For example run:
```
git clone https://github.com/dynobo/noteto.git
cd noteto
python -m http.server
```
Then open <http://0.0.0.0:8000/noteto/> in your browser.

If you plan to contribute PRs back to this repo, please also install and run `eslint` to ensure correct code formatting etc. In repo root, run:

```
npm install
eslint ./noteto/
```

## Further *free* reMarkable template ressources

- [Download templates created by the community](https://rm.ezb.io/)
- [Online Generator for templates with custom grids](https://templarian.github.io/remarkable/)
- [Getting Things Done templates](https://github.com/BartKeulen/remarkable-gtd-templates)
- [Business related templates](https://github.com/deo-so/reMarkable-Tablet-Templates---Free)