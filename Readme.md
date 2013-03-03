# Kobolmaki

![Build status](https://api.travis-ci.org/manuelstofer/koboldmaki)

![image](resources/koboldmaki.jpg)

Views inspired by backbone, built with components only.

## Installation

Koboldmaki can be installed with [component](https://github.com/component/component)
```bash
$ component install manuelstofer/koboldmaki
```

## Usage

```
var View = require('koboldmaki');

var MakiAlert = View({
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

var instance = MakiAlert();
document.body.appendChild(instance.el);


```