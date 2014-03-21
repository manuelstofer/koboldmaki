'use strict';
var each    = require('foreach'),
    groupBy = require('group-by'),
    matches = require('matches-selector'),
    claim   = require('claim'),
    query   = require('query');

module.exports = Koboldmaki;

/**
 * Creates a view similar to backbone views
 *
 * @param options
 * @returns {*}
 * @constructor
 */
function Koboldmaki(options) {
    if (!(this instanceof Koboldmaki)) { return new Koboldmaki(options); }
    this.el     = getDomNode(this, options);
    this.viewId = randomViewId();
    this.$      = $.bind(null, this, claim(this.el));

    if (this.initialize) {
        this.initialize.apply(this, arguments);
    }
    bindEvents(this);
}


Koboldmaki.extend = (function extend(Parent, extension, constructor) {
    var next = constructor || function (options) {
        Parent.apply(this, arguments);
    };
    next.prototype = Object.create(Parent.prototype);
    next.prototype.constructor = next;
    next.extend = extend.bind(null, next);

    for (var i in extension) {
        next.prototype[i] = extension[i];
    }
    return next;
}.bind(null, Koboldmaki));


/**
 * Gets/Creates the root dom node for the view
 */
function getDomNode (view, options) {
    var node;
    if (options && options.el) {
        return options.el;
    }
    node = document.createElement(view.tagName || 'div');
    if (view.className) {
        node.classList.add(view.className);
    }
    return node;
}

/**
 * Binds the events handlers
 *
 * Events are all bound on the root element, this allows to
 * replace the .innerHtml without rebinding the event handlers
 */
function bindEvents (view) {
    var eventHandlers = parseEventHandlers(view.events || {});
    each(groupBy(eventHandlers, 'name'), function (handlers, eventName) {
        bindEvent(view, eventName, handlers);
    });
}

/**
 * Binds a event handler
 *
 * @param view
 * @param eventName
 * @param handlers
 */
function bindEvent (view, eventName, handlers) {
    view.el.addEventListener(eventName, function (e) {
        each(handlers, function (handler) {
            var target   = getEventTarget(e),
                selector = getViewSelector(view) + ' ' + handler.selector;

            view.el.setAttribute('x-view-id', view.viewId);
            if (matches(target, selector)) {
                callEventHandler(view, handler.callback, e);
            }
            view.el.removeAttribute('x-view-id');
        });
    });
}

/**
 * Calls a event handler
 *
 * Its supported to use a string containing the name of the
 * event handler method or to register function direct as event handler
 *
 * @param view
 * @param handler
 * @param event
 */
function callEventHandler (view, handler, event) {
    if (typeof handler === 'string') {
        view[handler](event);
    } else {
        handler.call(view, event);
    }
}

function getViewSelector (view) {
    return '[x-view-id="' + view.viewId + '"]';
}

/**
 * Converts the events object
 *
 * from
 *  {
 *      'click .button': 'handler'
 *  }
 *
 * to
 *  {
 *      name: 'click',
 *      selector: '.button',
 *      callback: 'handler',
 *  }
 *
 * @returns {*}
 */
function parseEventHandlers (events) {
    return Object.keys(events).map(function (key) {
        var match = key.match(/^([^ ]+) (.*)$/);
        return {
            name:       match[1],
            selector:   match[2],
            callback:   events[key]
        };
    });
}

/**
 * Generates a random id for the view
 *
 * @returns {string}
 */
function randomViewId() {
    return Math.random().toString(10).replace(/^0\./, '');
}

/**
 * Gets the target of a dom event with IE fallback
 *
 * @param event
 * @returns {*|Object}
 */
function getEventTarget(event) {
    return event.target || event.srcElement;
}

/**
 * Selects all nodes in the view that match the selector and
 * don't belong to a sub view
 *
 * @param view
 * @param isOwn
 * @param selector
 * @returns {Array}
 */
function $(view, isOwn, selector) {
    return filterOwnNodes(isOwn, query.all(selector, view.el));
}

/**
 * Filters dom nodes that belong to a view and not to a sub view
 *
 * @param isOwn
 * @param nodes
 * @returns {Array}
 */
function filterOwnNodes(isOwn, nodes) {
    var results = [];
    each(nodes, function (el) {
        if (isOwn(el)) {
            results.push(el);
        }
    });
    return results;
}

