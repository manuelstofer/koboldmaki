# Koboldmaki

![Build status](https://api.travis-ci.org/manuelstofer/koboldmaki.png)

![image](resources/koboldmaki.jpg)

Views inspired by backbone, built with components only.

## Installation

Koboldmaki can be installed with [component](https://github.com/component/component)

```
$ component install manuelstofer/koboldmaki
```

## Usage

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
