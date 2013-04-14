'use strict';
var emitter = require('emitter'),
    event   = require('event'),
    each    = require('foreach'),
    groupBy = require('group-by'),
    map     = require('map'),
    object  = require('object'),
    matches = require('matches-selector'),
    classes = require('classes'),
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


    var view = options,
        isOwn = claim(view.el = getDomNode());

    view.viewId = randomViewId();
    view.$ = $;

    emitter(view);


    if (view.initialize) { view.initialize.apply(view, arguments); }
    bindEvents();


    /**
     * Gets / Creates the root dom node for the view
     */
    function getDomNode() {
        var node;
        if (options && options.el) {
            return options.el;
        }
        node = document.createElement(view.tagName || 'div');
        if (view.className) { classes(node).add(view.className); }
        return node;
    }

    /**
     * Binds the events handlers
     *
     * Events are all bound on the root element, this allows to
     * replace the .innerHtml without rebinding the event handlers
     */
    function bindEvents() {
        var eventHandlers = parseEventHandlers(view.events || {});
        each(groupBy(eventHandlers, 'name'), function (handlers, eventName) {
            bindEvent(eventName, handlers);
        });
    }

    /**
     * Binds a event handler
     *
     * @param eventName
     * @param handlers
     */
    function bindEvent(eventName, handlers) {
        event.bind(view.el, eventName, function (e) {
            each(handlers, function (handler) {
                var target   = getEventTarget(e),
                    selector = getViewSelector() + ' ' + handler.selector;

                view.el.setAttribute('x-view-id', view.viewId);
                if (matches(target, selector)) {
                    callEventHandler(handler.callback, e);
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
     * @param handler
     * @param event
     */
    function callEventHandler(handler, event) {
        if (typeof handler === 'string') {
            view[handler](event);
        } else {
            handler.call(view, event);
        }
    }

    function getViewSelector () {
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
    function parseEventHandlers() {
        var events = view.events || {},
            callbacks = object.values(events);
        return map(object.keys(events), function (key, index) {
            var match = key.match(/^([^ ]+) (.*)$/);
            return {
                name:       match[1],
                selector:   match[2],
                callback:   callbacks[index]
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
     * @param selector
     * @returns {Array}
     */
    function $(selector) {
        return filterOwnNodes(query.all(selector, view.el));
    }

    /**
     * Filters dom nodes that belong to a view and not to a sub view
     *
     * @param nodes
     * @returns {Array}
     */
    function filterOwnNodes(nodes) {
        var results = [];
        each(nodes, function (el) {
            if (isOwn(el)) {
                results.push(el);
            }
        });
        return results;
    }

    return view;
}
