# Koboldmaki

[![Build Status](https://travis-ci.org/debianw/koboldmaki.png?branch=master)](https://travis-ci.org/debianw/koboldmaki)

![image](resources/koboldmaki.jpg)

Views inspired by Backbone, built with components only.

## Installation

Koboldmaki can be installed with [component](https://github.com/component/component)

```
$ component install manuelstofer/koboldmaki
```

## Usage

It's very similar to Backbone views. One of the main differences
is that Koboldmaki views are event emitters. The way to instantiate views is different as well. 
Koboldmaki is not class based.

```Javascript
var View = require('koboldmaki');

var makiAlert = View({
    events: {
        'clicked a': 'hideInTree'
    },

    initialize: function () {
        // do something
    },

    hideInTree: function () {
        this.el.innerHTML = 'Go koboldmaki, hide in a tree before they catch you!';
    },

    render: function () {
        this.el.innerHTML = '<div><a>catch a koboldmaki</a></div>';
    }
});

document.body.appendChild(makiAlert.el);
```

Koboldmaki provides a $ method that can query for DOM inside the view's root node
using component/query. The $ method does not return any nodes that belong 
to a nested sub view.

### Destroying a View

```Javascript
makiAlert.destroy();
```
destroy method will unbind all associated events and the remove the element from the DOM.
