'use strict';

var Emitter     = require('emitter'),
    delegates   = require('delegates'),
    object      = require('object'),
    each        = require('foreach'),
    classes     = require('classes'),
    claim       = require('claim'),
    query       = require('query');

/**
 * Expose.
 */

module.exports = Koboldmaki;

/**
 * Mixin option methods.
 */

function mixin(obj, options) {
  var keys = Object.keys(options)
    , proto = obj.constructor.prototype;

  keys.forEach(function (key) {
    if ('function' === typeof options[key]) {
      proto[key] = options[key];
    }
    else {
      obj[key] = options[key];
    }
  });
}

/**
 * Generates a random id for the view
 *
 * @returns {string}
 */

function randomViewId () {
  return Math.random().toString(10).replace(/^0\./, '');
}

/**
 * Creates a view similar to backbone views
 *
 * @param options
 * @returns {*}
 * @constructor
 */

function Koboldmaki(options) {
  if (!(this instanceof Koboldmaki)) return new Koboldmaki(options);
  
  // mixin
  mixin(this, options);

  this.events = this.events || {};

  this.el = this.getDomNode();
  this.delegates = delegates(this.el, this);
  this.isOwn = claim(this.el);

  // uuid
  this.viewId = randomViewId();

  // run initialize
  if (this.initialize) { this.initialize(); }

  this.bindEvents();
}

// mixin
Emitter(Koboldmaki);

/**
 * Gets / Creates the root dom node for the view
 */

Koboldmaki.prototype.getDomNode = function () {
  var node;

  if (this.el) {
      return this.el;
  }

  node = document.createElement(this.tagName || 'div');
  if (this.className) { 
    classes(node).add(this.className); 
  }

  return node;
};

/**
 * Binds the events handlers
 *
 * Events are all bound on the root element, this allows to
 * replace the .innerHtml without rebinding the event handlers
 */

Koboldmaki.prototype.bindEvents = function () {
  var self = this
    , events = this.events
    , keys;

  if (object.isEmpty(events)) return;

  keys = object.keys(events);

  keys.forEach(function (key) {
      self.bindEvent(key, events[key]);
  });
};

/**
 * Binds a event handler
 *
 * @param eventName
 * @param handlers
 */

Koboldmaki.prototype.bindEvent = function (eventSelector, method) {
  this.delegates.bind(eventSelector, method);
};

/**
 * Unbind all events
 */

Koboldmaki.prototype.unbindAll = function () {
  this.delegates.unbindAll();
};

/**
 * Destroys the element from the DOM.
 * Before destroy it unbinds all events associated to the current view.
 */

Koboldmaki.prototype.destroy = function () {
  var el = this.el
    , parent;

  this.unbindAll();

  parent = el.parentNode;
  parent.removeChild(el);
};

/**
 * Selects all nodes in the view that match the selector and
 * don't belong to a sub view
 *
 * @param selector
 * @returns {Array}
 */

Koboldmaki.prototype.$ = function (selector) {
  return this.filterOwnNodes(query.all(selector, this.el));
};

/**
 * Filters dom nodes that belong to a view and not to a sub view
 *
 * @param nodes
 * @returns {Array}
 */

Koboldmaki.prototype.filterOwnNodes = function (nodes) {
  var self = this
    , results = [];

  each(nodes, function (el) {
      if (self.isOwn(el)) {
          results.push(el);
      }
  });

  return results;
};
