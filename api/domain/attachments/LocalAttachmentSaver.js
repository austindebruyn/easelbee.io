const OptionAttachment = require('./OptionAttachment');
const fs = require('fs');
const path = require('path');

class LocalAttachmentSaver {
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
      engine: OptionAttachment.TYPES.local
    });

    const appRootDir = path.resolve(__dirname, '..', '..', '..');

    const oldPath = path.resolve(appRootDir, relativePath);
    const newPath = path.resolve(appRootDir, 'public', 'uploads', attachment.objectKey);

    await new Promise((resolve, reject) => {
      fs.rename(oldPath, newPath, err => {
        if (err) return reject(err);
        return resolve();
      });
    });

    await attachment.save();
    return attachment;
  }
}

module.exports = LocalAttachmentSaver;
