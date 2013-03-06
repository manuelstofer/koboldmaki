'use strict';
var emitter = require('emitter'),
    event   = require('event'),
    each    = require('each'),
    groupBy = require('group-by'),
    map     = require('map'),
    object  = require('object'),
    matches = require('matches-selector'),
    classes = require('classes');

module.exports = function (options) {


    var obj = options;
    createDomNode(obj);
    emitter(obj);

    if (obj.initialize) { obj.initialize.apply(obj, arguments); }
    bindEvents();

    return obj;

    function createDomNode () {
        if (options && options.el) {
            obj.el = options.el;
        } else {
            obj.el = document.createElement(obj.tagName || 'div');
            if (obj.className) { classes(obj.el).add(obj.className); }
        }
        obj.viewId = randomViewId();
        obj.el.setAttribute('x-view-id', obj.viewId);
    }

    function bindEvents () {
        var eventHandlers = parseEventHandlers(obj.events);
        each(groupBy(eventHandlers, 'name'), function (handlers, eventName) {
            bindEvent(eventName, handlers);
        });
    }

    function bindEvent (eventName, handlers) {
        event.bind(obj.el, eventName, function (e) {
            each(handlers, function (handler) {
                var target   = getEventTarget(e),
                    selector = getViewSelector() + ' ' + handler.selector;

                if (matches(target, selector)) {
                    callEventHandler(handler.callback, e);
                }
            });
        });
    }

    function callEventHandler(handler, e) {
        if (typeof handler == 'string') {
            obj[handler](e)
        } else {
            handler.call(obj, e);
        }
    }

    function getViewSelector () {
        return '[x-view-id="' + obj.viewId + '"]';
    }

    function parseEventHandlers () {
        var callbacks = object.values(obj.events);
        return map(object.keys(obj.events), function (key, index) {
            var match = key.match(/^([^ ]+) (.*)$/);
            return {
                name:       match[1],
                selector:   match[2],
                callback:   callbacks[index]
            }
        });
    }

    function randomViewId () {
        return Math.random().toString(10).replace(/^0\./, '');
    }

    function getEventTarget (event) {
        return event.target || event.srcElement;
    }
};
