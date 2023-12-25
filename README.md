***Note: I do not actively develop this tool anymore! Contributions via Pull Requests are still appreciated.***

# NoTeTo

Proof of Concept for a **No**tetaking **Te**mplate **To**ol for the reMarkable tablet.

Try it on **<https://noteto.needleinthehay.de>**.

## Introduction

This application was born from a specific need: I found [many useful templates](#template-resources) for my tablet, but none that included all the features I required. Supposly everyone has different needs, so I built this application for creating custom templates based on a building block principle.

**Features:**

1. Choose a template from the "Gallery" as starting point (or start on empty page)
2. Add predefined template elements ("blocks") 
3. Move, resize and style the "blocks"
4. Adjust texts and labels
5. Export the template as `png`-image
6. Save as `json` to load it later for further adjusments

Copying the `png`-image to the tablet is *not* in the scope of NoTeTo. Use one of the available [tools for transferring templates to tablet](#transfer-tools).

## Contribute templates for the Gallery

**Via Pull Request (preferred):**
1. Create a nice template
2. "Download as PNG" as well as "Export to JSON"
3. Give both files _the_same_ meaningful name (all lower-case, hyphen separated)
4. Fork noteto-repo and put the two files in a new subfolder in [/js/gallery/](https://github.com/dynobo/noteto/tree/main/noteto/js/gallery) with the _same_name_ as your files.
5. Add a new object _at_the_end_ of the `templates`-Array in  [`Gallery.js`](https://github.com/dynobo/noteto/blob/main/noteto/js/gallery/Gallery.js) with the appropriate information
6. Run NoTeTo locally (see section "Development & Contributing") as see if your template shows up as expected
7. Create a Pull Request.

**Via issue:**
1. Create a nice template
2. "Download as PNG" as well as "Export to JSON"
3. Give both files _the_same_ meaningful name (all lower-case, hyphen separated)
5. Open a ticket, upload both files along with the information to be shown in the Gallery:
   - Template Name
   - Contributor Name
   - Short(!) description 

## Development & contributing

The app should be considered as unstable, unfortunately I won't have much time to work on it. Contributions as pull requests are very welcome. 

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

If you plan to contribute a Pull Request, please install and run `eslint` to ensure correct code formatting:

```
npm install
eslint ./noteto/
```

<a name="transfer-tools"></a>
## Tools for transferring templates to tablet

- [Remarkable Assistent](https://github.com/richeymichael/remarkable-assistant)
- [reMarkable HyUtilities](https://github.com/moovida/remarkable-hyutilities)
- [remarkable-tweak](https://github.com/morngrar/remarkable-tweak)
- [rM2 Template Helper](https://www.freeremarkabletools.com/) (Windows)
- [reMarkable Connection Utility (RCU)](http://www.davisr.me/projects/rcu/) (paid)
- [einkpads - Template installer](https://www.einkpads.com/products/remarkable-template-installer-apple-computers) (paid)

<a name="template-resources"></a>
## Other template ressources

- [Download templates created by the community](https://rm.ezb.io/)
- [Online Generator for templates with custom grids](https://templarian.github.io/remarkable/)
- [Getting Things Done templates](https://github.com/BartKeulen/remarkable-gtd-templates)
- [Business related templates](https://github.com/deo-so/reMarkable-Tablet-Templates---Free)

## Further links

- [RemarkableWiki - Templates](https://remarkablewiki.com/tips/templates) (customizing, further templates)
