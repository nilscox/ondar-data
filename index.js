global.Promise = require('bluebird');

const moment = require('moment');
const { exportAll } = require('./export');
const { fetchDataFromWika } = require('./data-wika');
const { fetchYoutubeData } = require('./data-youtube');
const { Humorist } = require('./models');
const cheerio = require('cheerio');

const main = async () => {
  moment.locale('fr');

  // await fetchDataFromWika();
  // await fetchYoutubeData();
  await exportAll();

  return 0;
};

(async () => {
  try {
    process.exit(await main());
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
