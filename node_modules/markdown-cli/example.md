# Markdown-CLI example

This example demonstrates some features of [markdown-cli][1].

## Basic formatting

Donec at condimentum eros, in feugiat quam. Nunc id elit erat. Nunc quis leo a nunc varius convallis. Vestibulum eu.

Basic formatting like *italics*, **bold** and `inline code` is supported ([rendering depends on your shell][2]).

### Formatting in Headings *will* be **rendered**

Except for **bold** (heading are bold already).

## Lists

Ordered and unordered lists are both rendered with dashes. Works even when blank line is missing.
1. Morbi
2. Aenean
3. In molestie
4. Proin

## Code blocks with syntax highlightning

    function fancyAlert(arg) {
      if(arg) {
        $.facebox({div:'#foo'})
      }
    }

## Quote

> Interdum et malesuada fames ac ante ipsum primis in faucibus.

## URLs

Different types of URLs are supported. Footnote links will be resolved to show the link instead of the footnote number:

* Named link to [markdown-cli][1]
* Second named link to [markdown-cli](https://github.com/cilice/markdown-cli)
* Plain URL https://github.com/cilice/markdown-cli
* Embraced URL <https://github.com/cilice/markdown-cli>

## Tables

| Col1 | Col2 | Col3 |
| -- | -- | -- |
| Cell1 | **Cell2** | *Cell3* |
| Cell4 | Cell5 | Cell6 |


  [1]: https://github.com/cilice/markdown-cli
  [2]: https://superuser.com/a/958804/228642


