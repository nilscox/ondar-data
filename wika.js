const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const args = require('node-args');
const moment = require('moment');

const fetchHtml = async (uri) => {
  const filepath = path.join('pages', uri.replace(/^.*\//, '') + '.html');

  const loaded = await loadHtml(filepath);

  if (loaded)
    return cheerio.load(loaded);

  console.log(`fetching ${uri}...`);
  const res = await fetch(uri);

  if (res.status !== 200)
    throw new Error(`fetch(${uri}) => ${res.status}`);

  const html = await res.text();

  await saveHtml('pages/' + uri.replace(/^.*\//, '') + '.html', html);

  return cheerio.load(html);
};

const loadHtml = async (filename) => {
  try {
    return await fs.readFile(filename);
  } catch (e) {
    if (e.code !== 'ENOENT')
      throw e;

    return null;
  }
};

const saveHtml = async (filename, html) => {
  await fs.ensureDir(path.dirname(filename));
  await fs.writeFile(filename, html);
};

const normalizeText = (str) => {
  return str.replace(/\s\s+/g, ' ').trim();
};

const getHeaderText = ($, h) => {
  $(h).find('.editsection').each(function() { $(this).remove(); });

  return normalizeText($(h).text()).toLowerCase();
};

const parseInfobox = ($, infobox) => {
  const keys = {
    nom: 'fullname',
    naissance: 'birthdate',
    professions: 'profession',
    profession: 'profession',
    'métier': 'profession',
    'rôle': 'role',
    'affiliation': 'role',
    'statut': 'role',
    'première apparition': 'firstAppearance',
    'résidence': 'location',
    'site web': false,
    'galerie': false,
    'famille': false,
    'alias': false,
    'galerie d\'images': false,
    'galerie': false,
    'galerie=': false,
  };

  const info = {};

  infobox.find('tr').each(function() {
    const th = $(this).find('th');
    const td = $(this).find('td');

    let key = null;
    let value = null;

    if (td.length === 2) {
      key = $(td[0]).text().toLowerCase().trim();
      value = $(td[1]);
    } else if (th.length === 1 && td.length === 1) {
      key = $(th[0]).text().toLowerCase().trim().replace(/=$/, '');
      value = $(td[0]);
    }

    if (!key)
      return;

    if (keys[key] === undefined)
      throw new Error(`warn: no key found for infobox "${key}"`);

    if (!keys[key])
      return;

    key = keys[key];

    const br = $(value.find('br'));
    const li = $(value.find('li'));

    if (li.length) {
      value = li.map(function() {
        return $(this).text();
      }).get();
    } else if (br.length) {
      br.replaceWith('\n');
      value = value.text()
        .split('\n');
    } else {
      value = [value.text()];
    }

    value = value
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (key === 'birthdate') {
      value = value[0] && value[0].replace(/\(\d+ ans\)/, '');

      const date = moment(value, 'D MMMM YYYY');

      if (date.isValid())
        value = [date.toDate()];
      else
        value = [null];
    }

    info[key] = value.length === 1 ? value[0] : value;
  });

  infobox.find('img').each(function() {
    let src = $(this).attr('data-src') || $(this).attr('src');

    if (src) {
      info.image = {
        src,
        alt: cheerio.load($(this).parents('td').text()).text().replace('\n', '').trim(),
      };
    }
  });

  if (Array.isArray(info.fullname) && info.fullname.length === 0)
    info.fullname = null;

  return info;
};

const parsePassages = ($, passages) => {
  const sketchs = [];

  const getPassageNumber = (text) => {
    const keys = {
      1:  'premier',
      2:  'deuxième',
      3:  'troisième',
      4:  'quatrième',
      5:  'cinquième',
      6:  'sixième',
      7:  'septième',
      8:  'huitième',
      9:  'neuvième',
      10: 'dixième',
    };

    const match = text.match(/(\d+)[e|è]me/);

    if (match)
      return match[1];

    const idx = Object.values(keys).findIndex(re => text.match(re));

    if (idx < 0)
      return null;

    return Object.keys(keys)[idx];
  };

  const parsePassage = (number, title, points, date) => {
    const passage = {};

    passage.number = number ? ~~getPassageNumber(number.text().toLowerCase().trim()) : null;
    passage.title = title ? normalizeText(title.text()) : null;

    const match = points && points.text().match(/(\d+) points/);

    if (match)
      passage.points = { total: ~~match[1] };
    else
      passage.points = {};

    const link = title.find('a');

    if (link)
      passage.link = link.attr('href');
    else
      passage.link = null;

    if (date) {
      const m = moment(normalizeText(date.text()), 'DD/MM/YYYY');

      if (m.isValid())
        passage.date = m.toDate();
      else
        passage.date = null;
    }

    return passage;
  };

  const parseSeason = (table) => {
    const season = [];

    if (table.length > 1)
      table = $(table[0]);

    table.find('tr').each(function(i, tr) {
      const td = $(tr).children('td');

      if (td.length === 1) {
        season.push(parsePassage(null, $(td[0])));
      } else if (td.length === 2) {
        season.push(parsePassage(null, $(td[0]), $(td[1])));
      } else {
        season.push(parsePassage($(td[0]), $(td[1]), $(td[2]), $(td[3])));
      }
    });

    return season;
  };

  const getCategory = (text) => {
    if (text.startsWith('saison '))
      return 'season' + text.replace('saison ', '');
    else if (text.match(/spécial vacances/))
      return 'spécial vacances';
    else if (text.match(/prime time/))
      return text.replace(/prime time du (.*)/, 'prime time $1');
    else if (text.match(/le best of/))
      return 'bestof';
    else if (text.match(/les humoristes/))
      return false;
    else if (text.match(/rémi deval/))
      return false;
    else if (text.match(/les décaféinés/))
      return false;
    else
      throw new Error('no category for h3 ' + text);
  };

  ['h3', 'h4'].forEach(h => {
    passages.filter(h).each(function(i, elem) {
      const category = getCategory(getHeaderText($, elem));

      if (!category)
        return;

      const season = parseSeason($(elem).nextUntil(h));

      season.forEach(sketch => {
        sketch.category = category;
        sketchs.push(sketch);
      });
    });
  });

  if (sketchs.length)
    return sketchs;

  passages.filter('table').each(function(i, elem) {
    const category = getCategory($(elem).text().split('\n').filter(s => s.length)[0].toLowerCase());

    if (!category)
      return;

    const season = parseSeason($(elem));

    season.forEach(sketch => {
      if (!sketch.title.length)
        return;

      sketch.category = category;
      sketchs.push(sketch);
    });
  });

  return sketchs;
};

const parseHumorist = ($) => {
  const humorist = {};

  const art = $('#WikiaMainContent');
  let infobox = art.find('.infobox');

  if (!infobox.length)
    infobox = $(art.find('table')[0]);

  humorist.name = $('.page-header__title').text();

  Object.assign(humorist, parseInfobox($, infobox));

  const processSection = (h2, section) => {
    if (h2 === 'biographie')
      humorist.bio = section.text().trim();
    else if (h2 === 'passages' || h2 === 'passage')
      humorist.sketchs = parsePassages($, section);
  }

  art.find('#mw-content-text').children('h2').each(function(i, elem) {
    processSection(getHeaderText($, elem), $(elem).nextUntil('h2'));
  });

  return humorist;
};

const fetchHumorist = async (uri) => {
  const $ = await fetchHtml(uri);
  const data = parseHumorist($);

  data.wikaUrl = uri;

  return data;
};

module.exports.fetchHumorist = fetchHumorist;
