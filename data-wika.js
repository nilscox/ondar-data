const { fetchHumorist } = require('./wika')
const { Humorist, Sketch } = require('./models');

const humorists = [
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Olivier_de_Benoist',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Les_Lascars_Gays',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Jérémy_Ferrari',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Garnier_et_Sentou',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Florent_Peyre',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Arnaud_Tsamere',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Babass',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Constance',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Lamine_Lezghad',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Sacha_Judaszko',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Nicole_Ferroni',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Les_Kicékafessa',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Arnaud_Cosson',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Monsieur_Fraize',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Shirley_Souagnon',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Fary',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Chavari_et_Durand',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Nora',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Arthur_Milchior',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Laurent_et_Enzo',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Artus',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Vérino',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Donel_Jack\'sman',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Pierre_Diot',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Waly_Dia',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Ahmed_Sylla',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Steeven_et_Christopher',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Kevin_Razy',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Paco',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Anthony_Joubert',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Zidani',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Aymeric_Lompret',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Les_Décaféinés',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Cyril_Etesse',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Antonia',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Ben',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Nidhal',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Matthieu_Penchinat',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Les_Escrocs',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Céline_Holynski',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Julie_Rippert',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Julie_Villers',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Nicolas_Meyrieux',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Jean-Marie_Bigard',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Jean-Luc_Moreau',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Jean_Benguigui',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Laurent_Ruquier',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Alexandre_Maublanc',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Laurent_Pit',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Jim',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Eugénie_Anselin',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Ophir',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Alex_Darmon',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Bengui',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Tony_Atlaoui',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Yass',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Yanos',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Antoine_Schoumsky',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Nicolas_Meyrieux',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Zazon',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Aurelia_Decker',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Emmanuel_%26_Jeanne',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Karine_Dubernet',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Gérard_Dubouche',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Laurent_et_Enzo',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Les_Débarqués',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Les_Jumoristes',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Stéphane_Murat',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Philippe_Rambaud',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Alex_Ramirès',
  'http://fr.ondaronndemandequaenrire.wikia.com/wiki/Claudia_Tagbo',
];

const processHumorist = async url => {
  const h = await fetchHumorist(url);

  if (!h.sketchs || !h.sketchs.length)
    throw new Error('no sketchs');

  if (await Humorist.count({ where: { wikaUrl: url } }) > 0)
    return;

  const humorist = Humorist.build({
    name: h.name,
    fullname: h.fullname,
    bio: h.bio,
    birthdate: h.birthdate,
    roles: h.roles,
    image: h.image ? h.image.src : null,
    imageAlt: h.image ? h.image.alt : null,
    wikaUrl: h.wikaUrl,
  });

  await humorist.save();

  for (let i = 0; i < h.sketchs.length; ++i) {
    const s = h.sketchs[i];

    const sketch = Sketch.build({
      number: s.number,
      title: s.title,
      date: s.date,
      total: s.points.total,
      category: s.category,
      wikaUrl: s.link,
      youtubeUrl: null,
      humoristId: humorist.id,
    });

    await sketch.save();
  }
};

const fetchDataFromWika = async () => {
  await Promise.mapSeries(humorists, h => processHumorist(h));
};

module.exports.fetchDataFromWika = fetchDataFromWika;
