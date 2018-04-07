
class LocalAttachmentURLBuilder {
  /**
   * Builds a public URL.
   * @param {OptionAttachment} attachment
   * @returns {String} url
   */
  getPublicURL(attachment) {
    return `/uploads/${attachment.objectKey}`;
  }
}

module.exports = LocalAttachmentURLBuilder;
