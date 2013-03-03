var view = require('koboldmaki'),
    expect = chai.expect;


describe('koboldmaki', function () {

    var exampleView;
    beforeEach(function () {
         var ExampleView = view({

            events: {
                'custom-event a.click': 'handleCustomEvent',
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
            },

            render: function () {
                this.el.innerHTML = '<div><a class="click">click</a></div>';
            }
        });
        exampleView = ExampleView();

        document.body.appendChild(exampleView.el);
        exampleView.render();
    });

    it('should run initialize', function () {
        exampleView.called.should.be.false;
    });

    it('should call the event handler', function () {
        var el = exampleView.el.querySelector('a.click');
        triggerEvent(el, 'custom-event');
        exampleView.called.should.be.true;
    });

    it('should not call other event handlers', function () {
        var el = exampleView.el.querySelector('a.click');
        triggerEvent(el, 'custom-event');
        expect(exampleView.wrongHandler).to.be.false;
    });
});

function triggerEvent (element, event) {
    var evt = document.createEvent('Event');
    evt.initEvent(event, true, true);
    element.dispatchEvent(evt);
}
