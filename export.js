const fs = require('fs-extra');

const { Humorist, Sketch } = require('./models');

const getData = async (Model) => {
  return (await Model.findAll({ order: [['id']] })).map(i => i.get());
};

const exportAll = async () => {
  await fs.writeJson('data.json', {
    humorists: await getData(Humorist),
    sketchs: await getData(Sketch),
  });
};

module.exports.exportAll = exportAll;
