import UploadPhotoButton from './UploadPhotoButton';
import { shallow } from 'avoriaz';
import sinon from 'sinon';

describe('UploadPhotoButton', function () {
  beforeEach(function () {
    this.wrapper = shallow(UploadPhotoButton);
    sinon.spy(this.wrapper.vm, '$emit');
  });

  describe('#handleChange', function () {
    it('should do nothing if file upload is clicked then canceled', function () {
      this.wrapper.vm.handleChange({
        currentTarget: { files: [] }
      });
      expect(this.wrapper.vm.$emit).to.not.have.been.called;
    });

    it('should fire submit when a file is selected', function () {
      this.wrapper.vm.handleChange({
        currentTarget: { files: [{ isFileObject: true }] }
      });
      expect(this.wrapper.vm.$emit).to.have.been.called.once;
      expect(this.wrapper.vm.$emit).to.have.been.calledWith('submit', {
        isFileObject: true
      });
    });
  });
});
