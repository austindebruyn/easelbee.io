module.exports = {
  up: function (q, Sequelize) {
    return q.sequelize.query('ALTER TABLE deltas DROP FOREIGN KEY deltas_ibfk_1')
      .then(() => {
        return q.sequelize.query('ALTER TABLE deltas DROP KEY optionId');
      })
      .then(() => {
        return q.sequelize.query('ALTER TABLE deltas ADD CONSTRAINT deltas_ibfk_1 FOREIGN KEY (`optionId`) REFERENCES `options` (`id`) ON DELETE CASCADE');
      });
  }
};
