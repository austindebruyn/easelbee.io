import FormsListItem from './FormsListItem';
import { shallow } from 'avoriaz';
import formsFixture, { buildForm } from 'fixtures/forms';
import clock from '../../../../api/tests/clock';

function wrapperFactory (form) {
  this.wrapper = shallow(FormsListItem, {
    propsData: { form },
    i18n: this.i18n
  });
}

describe('FormsListItem', function () {
  clock();

  it('should have pencil icon to edit page', function () {
    wrapperFactory.call(this, formsFixture.basic);

    const editLink = this.wrapper.first(RouterLink);
    expect(editLink.propsData().to).to.eql('/forms/1');
    expect(editLink.contains('.fa.fa-pencil')).to.be.true;
  });

  it('should have link icon to public url', function () {
    wrapperFactory.call(this, formsFixture.basic);

    const expectedUrl = 'http://local-easelbee.io:3000/forms/some-form';

    const publicLink = this.wrapper.find('.controls .control-link')[2];
    expect(publicLink.getAttribute('href')).to.eql(expectedUrl);
    expect(publicLink.contains('.fa.fa-external-link')).to.be.true;
  });

  it('should render last updated', function () {
    wrapperFactory.call(this, buildForm({
      updatedAt: '2016-08-31T00:00:00.001Z'
    }));

    const msg = 'Last edited a year ago';
    expect(this.wrapper.first('.subtitle').text()).to.eql(msg);
  });

  it('should render null last updated', function () {
    wrapperFactory.call(this, buildForm({
      submittedAt: null
    }));

    const msg = 'So far, no customers have filled this form out.';
    expect(this.wrapper.text()).to.include(msg);
  });

  it('should render last updated', function () {
    wrapperFactory.call(this, buildForm({
      submittedAt: '2016-08-31T00:00:00.001Z'
    }));

    const msg = 'This form was last filled out a year ago';
    expect(this.wrapper.text()).to.include(msg);
  });
});
