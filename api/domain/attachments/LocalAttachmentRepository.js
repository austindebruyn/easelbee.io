const OptionAttachment = require('./OptionAttachment');
const fs = require('fs');
const path = require('path');

class LocalAttachmentRepository {
  /**
   * Persists the indicated temporary file to storage and returns a DB
   * model.
   * @param {String} relativePath temp file relative to app root
   * @param {Number} optionId id of the attached option
   * @returns {OptionAttachment} 
   */
  async save(relativePath, optionId) {
    const attachment = new OptionAttachment({
      optionId,
      objectKey: `${+new Date()}`,
      engine: 'local'
    });

    const oldPath = path.resolve(__dirname, relativePath);
    const newPath = path.resolve(__dirname, 'public', 'uploads', attachment.objectKey);

    await new Promise((resolve, reject) => {
      fs.rename(oldPath, newPath, err => {
        if (err) return reject(err);
        return resolve();
      });
    });

    await attachment.save();
    return attachment;
  }

  /**
   * Builds a public URL.
   * @param {OptionAttachment} attachment
   * @returns {String} url
   */
  getPublicURL(attachment) {
    return `/uploads/${attachment.objectKey}`;
  }
}

module.exports = LocalAttachmentRepository;
