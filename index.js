'use strict';

var emitter     = require('emitter'),
    delegates   = require('delegates'),
    object      = require('object'),
    each        = require('foreach'),
    classes     = require('classes'),
    claim       = require('claim'),
    query       = require('query');

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

    view.delegates = delegates(view.el, view);
    view.events = view.events || {};

    view.viewId = randomViewId();
    view.$ = $;
    view.unbindAll = unbindAll;
    view.destroy = destroy;

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
        var keys;

        if (object.isEmpty(view.events)) return;

        keys = object.keys(view.events);

        keys.forEach(function (key) {
            bindEvent(key, view.events[key]);
        });
    }

    /**
     * Binds a event handler
     *
     * @param eventName
     * @param handlers
     */
    function bindEvent(eventSelector, method) {
        view.delegates.bind(eventSelector, method);
    }

    /**
     * Unbind all events
     */

    function unbindAll() {
        view.delegates.unbindAll();
    }

    /**
     * Destroys the element from the DOM.
     * Before destroy it unbinds all events associated to the current view.
     */

    function destroy () {
        unbindAll();

        view.el.remove();
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
