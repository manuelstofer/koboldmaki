/*global require, chai*/
var view    = require('koboldmaki'),
    trigger = require('adamsanderson-trigger-event'),
    expect  = chai.expect;


describe('koboldmaki', function () {
    'use strict';

    var exampleView
      , views = []
      , count = 0;

    beforeEach(function () {
        exampleView = view({

            events: {
                'custom-event a.click': 'handleCustomEvent',
                'click a.click': 'onClick',
                'custom-event h1':      'dontCall'
            },

            initialize: function () {
                this.called = false;
                this.clicked = false;
                this.wrongHandler = false;

                count++;
            },

            dontCall: function () {
                this.wrongHandler = true;
            },

            handleCustomEvent: function () {
                this.called = true;

                console.log('custom-event was triggered');
            },

            onClick: function () {
                this.clicked = true;
                alert('click event');
            },

            render: function () {
                this.el.innerHTML = '<div>#'+count+' <a class="click">click here</a></div>';
            }
        });

        document.body.appendChild(exampleView.el);
        exampleView.render();

        views.push(exampleView);
    });

    it('should have optional events', function () {
        var v = view({});
        v.should.not.be.undefined;
    });

    it('should run initialize', function () {
        exampleView.called.should.be.false;
    });

    it('should call the event handler', function () {
        var el = exampleView.el.querySelector('a.click');
        trigger(el, 'custom-event', {bubbles: true});
        exampleView.called.should.be.true;
    });

    it('should not call other event handlers', function () {
        var el = exampleView.el.querySelector('a.click');
        trigger(el, 'custom-event', {bubbles: true});
        expect(exampleView.wrongHandler).to.be.false;
    });

    it('$ should query only for own nodes. nodes from subviews excluded', function () {
        var outer = document.querySelector('.outer-view'),
            inner = document.querySelector('.inner-view'),
            outerView = view({el: outer});

        view({el: inner});

        outerView.$('button').length.should.equal(1);
        outerView.$('button')[0].should.equal(document.querySelector('.outer-button'));
    });

    it('should unbind all events for the first element', function () {
        var el = views[0].el.querySelector('a.click');

        views[0].clicked = false;
        views[0].called = false;

        views[0].unbindAll();

        trigger(el, 'custom-event', {bubbles: true});
        trigger(el, 'click', {bubbles: true});

        views[0].called.should.be.false;
    });

    it('should destroy element #3', function () {
        views[2].destroy();
    });
});

