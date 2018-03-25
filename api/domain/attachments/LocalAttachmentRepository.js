const OptionAttachment = require('./OptionAttachment');

class LocalAttachmentRepository {
  /**
   * Persists the indicated temporary file to storage and returns a DB
   * model.
   * @param {String} filename temp file
   * @param {Number} optionId id of the attached option
   * @returns {OptionAttachment} 
   */
  async save(filename, optionId) {
    const attachment = new OptionAttachment();

    return attachment;
  }
}

module.exports = LocalAttachmentRepository;
