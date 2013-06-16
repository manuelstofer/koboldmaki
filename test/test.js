/*global require, chai*/
var view    = require('koboldmaki'),
    trigger = require('adamsanderson-trigger-event'),
    expect  = chai.expect;


describe('koboldmaki', function () {
    'use strict';

    var exampleView;
    beforeEach(function () {
        exampleView = view({

            events: {
                'custom-event a.click': 'handleCustomEvent',
                'click a.click': 'onClick',
                'custom-event h1':      'dontCall'
            },

            initialize: function () {
                this.called = false;
                this.wrongHandler = false;
            },

            dontCall: function () {
                this.wrongHandler = true;
            },

            handleCustomEvent: function () {
                this.called = true;

                console.log('custom-event was triggered');
            },

            onClick: function () {
                console.log('click event: ', arguments);
            },

            render: function () {
                this.el.innerHTML = '<div><a class="click">click</a></div>';
            }
        });

        document.body.appendChild(exampleView.el);
        exampleView.render();
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
});

