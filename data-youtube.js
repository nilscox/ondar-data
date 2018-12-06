const { getYoutubeData } = require('./youtube');
const { Humorist, Sketch } = require('./models');

const aggregateWithYoutubeData = async (sketch) => {
  let ytdata = null;

  try {
    ytdata = await getYoutubeData(sketch.title, sketch.humorist.name, sketch.number);
  } catch (e) {
    console.log(`${sketch.id}: ERROR: ${e}`);
    return;
  }

  if (!ytdata) {
    console.log(`${sketch.id}: no video found`);
    return;
  }

  const data = {};

  if (ytdata.points)
    data.totalyt = ytdata.points;

  if (ytdata.date)
    data.date = ytdata.date;

  if (ytdata.video)
    data.youtubeUrl = ytdata.video;

  await sketch.update(data);
};

const fetchYoutubeData = async () => {
  const sketchs = await Sketch.findAll({
    where: {
      youtubeUrl: null,
      humoristId: 14,
    },
    order: [['id']],
    include: [Humorist],
  });

  for (let i = 0; i < sketchs.length; ++i) {
    const sketch = sketchs[i];

    await aggregateWithYoutubeData(sketch);
  }
};

module.exports.fetchYoutubeData = fetchYoutubeData;
