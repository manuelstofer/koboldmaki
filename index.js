'use strict';
var emitter = require('emitter'),
    event   = require('event'),
    each    = require('foreach'),
    groupBy = require('group-by'),
    map     = require('map'),
    object  = require('object'),
    matches = require('matches-selector'),
    classes = require('classes');

module.exports = Koboldmaki;

/**
 * Creates a view similar to backbone views
 *
 * @param options
 * @returns {*}
 * @constructor
 */
function Koboldmaki(options) {


    var obj = options;
    getDomNode();
    emitter(obj);

    if (obj.initialize) { obj.initialize.apply(obj, arguments); }
    bindEvents();


    /**
     * Gets / Creates the root dom node for the view
     */
    function getDomNode() {
        if (options && options.el) {
            obj.el = options.el;
        } else {
            obj.el = document.createElement(obj.tagName || 'div');
            if (obj.className) { classes(obj.el).add(obj.className); }
        }
        obj.viewId = randomViewId();
    }

    /**
     * Binds the events handlers
     *
     * Events are all bound on the root element, this allows to
     * replace the .innerHtml without rebinding the event handlers
     */
    function bindEvents() {
        var eventHandlers = parseEventHandlers(obj.events || {});
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
        event.bind(obj.el, eventName, function (e) {
            each(handlers, function (handler) {
                var target   = getEventTarget(e),
                    selector = getViewSelector() + ' ' + handler.selector;

                obj.el.setAttribute('x-view-id', obj.viewId);
                if (matches(target, selector)) {
                    callEventHandler(handler.callback, e);
                }
                obj.el.removeAttribute('x-view-id');
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
            obj[handler](event);
        } else {
            handler.call(obj, event);
        }
    }

    function getViewSelector () {
        return '[x-view-id="' + obj.viewId + '"]';
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
        var events = obj.events || {},
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

    return obj;
}
