const { google } = require('googleapis');
const moment = require('moment');
const levenshtein = require('levenshtein');

const API_KEY = 'NOPENOPENOPENOPE';
const service = google.youtube('v3');

const searchVideos = async (search, humorist, number) => {
  const list = await new Promise((resolve, reject) => {
    service.search.list({
      auth: API_KEY,
      part: 'snippet',
      q: search,
    }, (err, response) => {
      if (err)
        reject(err);
      else
        resolve(response.data);
    });
  });

  const collectif = list.items.filter(v => v.snippet.title.toLowerCase().match('collectif'));

  if (collectif.length > 0)
    return collectif[0];

  let videos = list.items.filter(v => v.snippet.title.toLowerCase().match(humorist.toLowerCase()));

  if (humorist.match(/ et /))
    videos = [...videos, ...list.items.filter(v => v.snippet.title.toLowerCase().match(humorist.toLowerCase().replace(' et ', ' & ')))];

  // 1er [Pp]assage( !+)?
  if (number)
    videos = videos.filter(v => v.snippet.title.match(`\\[${number}\\]`));

  if (!videos.length)
    return null;

  return videos[0];
};

const getYoutubeData = async (title, humorist, number) => {
  let video = await searchVideos(`${humorist} ${number ? ` [${number}]` : ''}${title} ondar`, humorist, number);

  if (!video)
    video = await searchVideos(`${title} ${humorist}`, humorist, number);

  if (!video && number)
    video = await searchVideos(`ondar ${humorist} [${number}]`, humorist, number);

  if (!video || !video.id.videoId)
    return null;

  const result = await new Promise((resolve, reject) => {
    service.videos.list({
      auth: API_KEY,
      part: 'snippet',
      id: video.id.videoId,
    }, (err, response) => {
      if (err)
        reject(err);
      else
        resolve(response.data);
    });
  });

  if (result.items.length === 0)
    return null;

  const data = {};

  const item = result.items[0];
  const desc = item.snippet.description.split('\n');

  data.video = 'https://youtube.com/watch?v=' + item.id;

  const match = /\[(\d+)\]/.exec(item.snippet.title);

  if (match)
    data.number = ~~match[1];

  const date = desc.map(s => moment(s, 'DD/MM/YYYY')).filter(d => d.isValid())[0];

  if (date)
    data.date = date.toDate();

  const points = desc.map(s => s.match(/(\d+) points/)).filter(m => m).map(m => m[1])[0];

  if (points)
    data.points = ~~points;

  return data;
};

module.exports.getYoutubeData = getYoutubeData;
