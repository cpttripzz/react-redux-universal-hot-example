import {expect} from 'chai';
import load from '../widget/loadMocks';
import sinon from 'sinon';

describe('widget loadMocks', () => {

  afterEach(()=> {
    if ('restore' in Math.random) {
      Math.random.restore(); // reset the Math.random fixture
    }
  });

  describe('successful', () => {

    beforeEach(()=> {
      sinon.stub(Math, 'random').returns(0.4);
    });

    it('uses the widgets from the session', () => {
      return load({session: {widgets: ['a', 'b', 'c']}}).then(widgets => {
        expect(widgets.length).to.equal(3);
      });
    });

    it('initializes the widgets ', () => {
      return load({session: {}}).then(widgets => {
        expect(widgets.length).to.equal(4);
        expect(widgets[0].color).to.equal('Red');
      });
    });

  });


  describe('unsuccessful', () => {

    beforeEach(()=> {
      sinon.stub(Math, 'random').returns(0.2);
    });

    it('rejects the call', () => {
      return load({session: {}}).
      then(
        ()=> {
        },
        (err)=> {
          expect(err).to.equal('Widget loadMocks fails 33% of the time. You were unlucky.');
        });
    });

  });
});
