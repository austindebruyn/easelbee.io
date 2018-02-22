import CommissionsListItem from './CommissionsListItem';
import { shallow } from 'avoriaz';
import { buildCommission } from 'fixtures/commissions';

describe('CommissionsListItem', function () {
  beforeEach(function () {
    this.commission = buildCommission({
      id: 145,
      nickname: 'Austin',
      email: 'austin@eslb.io',
      price: 20
    });

    this.wrapper = shallow(CommissionsListItem, { propsData: {
      commission: this.commission
    }});
  });

  it('should render link', function () {
    expect(this.wrapper.first(RouterLink).propsData()).to.include({
      to: '/commissions/145'
    });
  });

  it('should render price', function () {
    expect(this.wrapper.first('.price-bubble').text()).to.eql('$20');
  });

  it('should render customer id', function () {
    expect(this.wrapper.first('.card-text .nickname').text())
      .to.eql('Austin');
    expect(this.wrapper.first('.card-text .email').text())
      .to.eql('austin@eslb.io');
  });

  it('should show image only if not incoming', function () {
    function buildWrapper (status) {
      return shallow(CommissionsListItem, {
        propsData: { commission: buildCommission({ status }) }
      });
    }
    let wrapper = buildWrapper('incoming');
    expect(wrapper.find('.card-img-top')).to.have.length(0);
    wrapper = buildWrapper('inprogress');
    expect(wrapper.find('.card-img-top')).to.have.length(1);
    wrapper = buildWrapper('inreview');
    expect(wrapper.find('.card-img-top')).to.have.length(1);
    wrapper = buildWrapper('finished');
    expect(wrapper.find('.card-img-top')).to.have.length(1);
    wrapper = buildWrapper('canceled');
    expect(wrapper.find('.card-img-top')).to.have.length(1);
  });
});
