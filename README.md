# NoTeTo  *Proof of Concept*

> **No**tetaking **Te**mplate **To**ol for the reMarkable tablet (and maybe others?) 

**View the web-application on <https://noteto.needleinthehay.de> *(Alpha Stage!)*.**

## Overview

This application was born from a specific need: I found [many useful templates](#template-resources) for my tablet, but none that included all the features I required. Supposly everyone has different needs, so I built this application for creating custom templates based on a building block principle.

1. Start with an empty paper *or* choose a template from the "Gallery" as starting point.
2. Add/remove/resize elements, adjust labels and styles.
3. Export the template as `png`-image.

The *import* of the created `png`-image into the reMarkable is *not* in the scope of NoTeTo. Please use [one of the tools that are already available](#import-tools).

## Development & Contributing

The app should be considered as unstable, and unfortunately I probably won't have much time to work on the app. **Contributions as pull requests are very welcome.**

Development setup is kept minimal, no build is required:

1. Clone the repository
2. In the repositories root, start your favorite local webserver
3. Point your browser to the `index.html` on `localhost`

E.g., you can run:

```
git clone https://github.com/dynobo/noteto.git
cd noteto
python -m http.server
```
Then open <http://127.0.0.1:8000/noteto/> in your browser.

If you plan to contribute a Pull Request, please also install and run `eslint` to ensure correct code formatting:

```
npm install
eslint ./noteto/
```

<a name="import-tools"></a>
## Tools for importing templates to the tablet
*(not in any specific order)*

- [Remarkable Assistent](https://github.com/richeymichael/remarkable-assistant)
- [reMarkable HyUtilities](https://github.com/moovida/remarkable-hyutilities)
- [remarkable-tweak](https://github.com/morngrar/remarkable-tweak)
- [reMarkable Connection Utility (RCU)](http://www.davisr.me/projects/rcu/)

<a name="template-resources"></a>
## Other *free* reMarkable template ressources

- [Download templates created by the community](https://rm.ezb.io/)
- [Online Generator for templates with custom grids](https://templarian.github.io/remarkable/)
- [Getting Things Done templates](https://github.com/BartKeulen/remarkable-gtd-templates)
- [Business related templates](https://github.com/deo-so/reMarkable-Tablet-Templates---Free)
