import {Place} from '../types/places';

export const PLACES: Place[] = [
  // ── Frozen Lakes ──────────────────────────────────────────
  {
    id: 'lake-baikal',
    name: 'Lake Baikal Ice',
    coordinates: '53.5587, 108.1650',
    lat: 53.5587,
    lng: 108.165,
    category: 'frozen-lakes',
    image: require('../assets/into-explorer-lake-baikal-ice.png'),
    description:
      'Lake Baikal in winter turns into one of the most famous natural phenomena on the planet. The deepest lake in the world is covered with transparent ice, through which you can see cracks, air bubbles and underwater structures at considerable depths. The thickness of the ice often exceeds one meter, which allows you to move on its surface over long distances. Baikal is located in Siberia and contains about twenty percent of the world\'s fresh water reserves. In winter, amazing ice caves, grottos and natural sculptures created by wind and frost form here. The region near Olkhon Island is especially popular, where you can see huge blue ice formations.',
  },
  {
    id: 'abraham-lake',
    name: 'Abraham Lake',
    coordinates: '52.2234, -117.2445',
    lat: 52.2234,
    lng: -117.2445,
    category: 'frozen-lakes',
    image: require('../assets/into-explorer-abraham-lake.png'),
    description:
      'Abraham Lake in the Canadian province of Alberta has become famous for its unusual frozen methane bubbles that form under the ice. In winter, the surface of the reservoir turns into a natural gallery, where thousands of white bubbles appear as if frozen in time. They arise from the decomposition of organic matter at the bottom of the lake. As the gas rises, the frost gradually forms new layers of ice, trapping the bubbles inside. The snow-capped peaks of the Canadian Rockies are located around, which add special drama to the landscapes.',
  },
  {
    id: 'lake-bled',
    name: 'Lake Bled Winter',
    coordinates: '46.3625, 14.0937',
    lat: 46.3625,
    lng: 14.0937,
    category: 'frozen-lakes',
    image: require('../assets/into-explorer-lake-bled-winter.png'),
    description:
      'Lake Bled is one of Slovenia\'s most famous natural attractions. In the winter season, this place takes on a special atmosphere thanks to the combination of snow-capped mountains, calm water, and the famous island with a church in the middle of the lake. When the temperature drops, the surrounding forests are covered in snow, and the morning mists create an almost fairy-tale landscape. The medieval Bled Castle, located on a steep cliff, towers over the lake. In winter, there are significantly fewer tourists, so you can enjoy the silence and peaceful atmosphere.',
  },
  {
    id: 'lake-louise',
    name: 'Lake Louise',
    coordinates: '51.4254, -116.1773',
    lat: 51.4254,
    lng: -116.1773,
    category: 'frozen-lakes',
    image: require('../assets/into-explorer-lake-louise.png'),
    description:
      'Lake Louise is located in the heart of the Canadian Rockies and is considered one of the most famous lakes in the world. In winter, the turquoise water is hidden under a thick layer of ice and snow, and the surrounding peaks turn the region into a real winter postcard. The lake is surrounded by majestic mountains, among which Mount Victoria stands out, creating a recognizable silhouette in many photographs. In the cold season, the surface of the lake becomes a natural playground for walks and winter activities.',
  },
  {
    id: 'lake-inari',
    name: 'Lake Inari',
    coordinates: '68.9060, 27.0280',
    lat: 68.906,
    lng: 27.028,
    category: 'frozen-lakes',
    image: require('../assets/into-explorer-lake-inari.png'),
    description:
      'Lake Inari is located far beyond the Arctic Circle in northern Finland. It\'s the country\'s third-largest lake and one of the most important natural sites in Finnish Lapland. In winter, its surface is covered in a thick layer of ice, and the surrounding forests and islands create a harsh but incredibly beautiful Arctic landscape. The lake is home to over three thousand islands, many of which have their own legends. Inari is particularly famous for its ability to observe the Northern Lights.',
  },
  {
    id: 'jokulsarlon',
    name: 'Jökulsárlón Lagoon',
    coordinates: '64.0485, -16.1794',
    lat: 64.0485,
    lng: -16.1794,
    category: 'frozen-lakes',
    image: require('../assets/into-explorer-jokulsarlon-glacier-lagoon.png'),
    description:
      'Jökulsárlón is one of the most famous glacial lagoons in Iceland. In winter, you can see huge blocks of ice breaking off from the Breiðamerkurjökull glacier and slowly drifting across the surface of the lagoon. Some icebergs have a deep blue color due to the high density of the ice, which creates amazing contrasts with the surrounding snow and dark water. Individual ice fragments fall onto the coast, forming the famous Diamond Beach, where ice shines on the black volcanic sand like precious stones.',
  },
  {
    id: 'lake-tekapo',
    name: 'Lake Tekapo Winter',
    coordinates: '-44.0047, 170.4773',
    lat: -44.0047,
    lng: 170.4773,
    category: 'frozen-lakes',
    image: require('../assets/into-explorer-lake-tekapo-winter.png'),
    description:
      'Lake Tekapo is located on the South Island of New Zealand and is known for its unusual water color, which is formed due to glacial particles brought from the mountainous regions. In winter, the surrounding peaks are covered with snow, creating a bright contrast with the blue shades of the lake. The region is part of the Aoraki Mackenzie International Dark Sky Reserve, so after sunset there are some of the best conditions for stargazing in the world.',
  },

  // ── Snow Villages ─────────────────────────────────────────
  {
    id: 'hallstatt',
    name: 'Hallstatt',
    coordinates: '47.5613, 13.6493',
    lat: 47.5613,
    lng: 13.6493,
    category: 'snow-villages',
    image: require('../assets/into-explorer-hallstatt.png'),
    description:
      'Hallstatt is a small Austrian town on the shores of the lake of the same name, often called one of the most beautiful settlements in the world. In winter, its narrow streets, old houses and snow-covered roofs create the atmosphere of a real winter fairy tale. The city is located between the mountain slopes and the water, which makes it especially photogenic at any time of the year. Hallstatt has a history that goes back thousands of years, because it is here that some of the oldest salt mines in Europe are located.',
  },
  {
    id: 'shirakawa-go',
    name: 'Shirakawa-go',
    coordinates: '36.2706, 136.8998',
    lat: 36.2706,
    lng: 136.8998,
    category: 'snow-villages',
    image: require('../assets/into-explorer-shirakawa-go.png'),
    description:
      'Shirakawa-go is a historic Japanese village nestled in the mountains of Gifu Prefecture. It is famous for its traditional gasso-zukuri style houses with steep thatched roofs. This design was created specifically for the region with a lot of snow so that heavy winter precipitation does not accumulate on the roof. In winter, the village looks especially magical: the houses are covered with a thick layer of snow, and the evening illumination creates the atmosphere of an old Christmas card.',
  },
  {
    id: 'reine',
    name: 'Reine',
    coordinates: '67.9329, 13.0896',
    lat: 67.9329,
    lng: 13.0896,
    category: 'snow-villages',
    image: require('../assets/into-explorer-reine.png'),
    description:
      'Reine is a small fishing village in the Lofoten Islands in Norway, considered one of the most beautiful villages in the Arctic. It is located among steep mountain peaks that literally rise from the sea water. In winter, red fishermen\'s houses contrast with white snow and dark rocks, creating a famous landscape that can often be seen on postcards. Due to its proximity to the Arctic Circle, you can observe the Northern Lights here.',
  },
  {
    id: 'zermatt',
    name: 'Zermatt',
    coordinates: '46.0207, 7.7491',
    lat: 46.0207,
    lng: 7.7491,
    category: 'snow-villages',
    image: require('../assets/into-explorer-zermatt.png'),
    description:
      'Zermatt is one of the most famous mountain resorts in Switzerland, located at the foot of the legendary Matterhorn peak. In winter, the town turns into a real center of Alpine atmosphere. The streets are filled with warm light, wooden chalets are covered with snow, and the surrounding slopes become part of one of the largest ski regions in Europe. A feature of Zermatt is the almost complete absence of cars with internal combustion engines, which helps to preserve clean air and a calm atmosphere.',
  },
  {
    id: 'grindelwald',
    name: 'Grindelwald',
    coordinates: '46.6242, 8.0414',
    lat: 46.6242,
    lng: 8.0414,
    category: 'snow-villages',
    image: require('../assets/into-explorer-grindelwald.png'),
    description:
      'Located in the heart of the Swiss Alps, Grindelwald is one of the most picturesque mountain towns in the country. In winter, the valley is covered in snow, and the surrounding peaks of the Eiger, Mönch and Jungfrau create a majestic backdrop for the small town. Traditional wooden houses blend harmoniously into the natural landscape, and the narrow streets retain a cozy atmosphere. Grindelwald is often called one of the most beautiful places in Switzerland due to its location in the midst of a huge natural amphitheater of mountains.',
  },
  {
    id: 'colmar',
    name: 'Colmar',
    coordinates: '48.0790, 7.3585',
    lat: 48.079,
    lng: 7.3585,
    category: 'snow-villages',
    image: require('../assets/into-explorer-colmar.png'),
    description:
      'Colmar is located in the east of France in the historic region of Alsace. The city is known for its colorful half-timbered houses, canals, and medieval architecture. In winter, it takes on a special atmosphere thanks to festive illuminations, snow-covered streets, and an abundance of decorative decorations. Many travelers call Colmar one of the most fairy-tale cities in Europe. Its "Little Venice" quarter looks especially picturesque when the old houses are reflected in the water between light snowdrifts.',
  },
  {
    id: 'rovaniemi',
    name: 'Rovaniemi',
    coordinates: '66.5039, 25.7294',
    lat: 66.5039,
    lng: 25.7294,
    category: 'snow-villages',
    image: require('../assets/into-explorer-rovaniemi.png'),
    description:
      'Rovaniemi is considered the official capital of Finnish Lapland and one of the most famous winter cities in the world. It is located near the Arctic Circle and has become a symbol of the Arctic atmosphere. It is here that the famous Santa Claus Village is located. The city is one of the best places to observe the Northern Lights. On clear nights, the sky is often illuminated by bright green waves of light, which can be seen even near the city.',
  },

  // ── Winter Wonders ────────────────────────────────────────
  {
    id: 'tromso-lights',
    name: 'Northern Lights, Tromsø',
    coordinates: '69.6492, 18.9553',
    lat: 69.6492,
    lng: 18.9553,
    category: 'winter-wonders',
    image: require('../assets/into-explorer-northern-lights-tromso.png'),
    description:
      'Tromsø is often called the capital of the northern lights. Located far above the Arctic Circle in northern Norway, the city is considered one of the best places on earth to see this natural phenomenon. Between September and March, the night sky is regularly illuminated by waves of green, purple and pink light. Tromsø is surrounded by snow-capped mountains, fjords and Arctic islands, creating the perfect backdrop for viewing.',
  },
  {
    id: 'snow-monsters-zao',
    name: 'Snow Monsters, Zao',
    coordinates: '38.1665, 140.4204',
    lat: 38.1665,
    lng: 140.4204,
    category: 'winter-wonders',
    image: require('../assets/into-explorer-snow-monsters-zao.png'),
    description:
      'In the Japanese Zao Mountains in winter, you can see one of the most bizarre natural phenomena in the world — the so-called "snow monsters". In fact, these are trees that are covered with thick layers of ice and snow under the influence of strong winds and low temperatures. Gradually, they acquire fantastic shapes that resemble giant creatures or stone statues. In the evening, part of the slopes are illuminated with multi-colored lights, which makes the snow figures look even more mystical.',
  },
  {
    id: 'icehotel-jukkasjarvi',
    name: 'Icehotel, Jukkasjärvi',
    coordinates: '67.8500, 20.6000',
    lat: 67.85,
    lng: 20.6,
    category: 'winter-wonders',
    image: require('../assets/into-explorer-icehotel-jukkasjarvi.png'),
    description:
      'The Icehotel in the Swedish village of Jukkasjärvi is one of the most famous winter projects in the world. Every year it is recreated from ice mined from the Turneelven River. Architects and artists from different countries work on the design of rooms, corridors and halls, turning ordinary ice into real works of art. Each room has its own design and is never repeated. In the spring, the structure gradually melts and returns to nature, after which the construction process begins again.',
  },
  {
    id: 'mendenhall-caves',
    name: 'Mendenhall Ice Caves',
    coordinates: '58.4357, -134.5348',
    lat: 58.4357,
    lng: -134.5348,
    category: 'winter-wonders',
    image: require('../assets/into-explorer-mendenhall-ice-caves.png'),
    description:
      'The Mendenhall Ice Caves are located under the Mendenhall Glacier in Alaska and are considered one of the most unusual winter places in North America. Inside the caves, light passes through the thickness of the ice and creates a rich blue glow that is almost impossible to see in other natural conditions. The glacier is constantly changing, so the shape of the caves is also gradually transformed. The ice caves resemble the scenery of a fantasy film, although in fact they are created exclusively by the forces of nature.',
  },
  {
    id: 'diamond-beach',
    name: 'Diamond Beach',
    coordinates: '64.0449, -16.1786',
    lat: 64.0449,
    lng: -16.1786,
    category: 'winter-wonders',
    image: require('../assets/into-explorer-diamond-beach.png'),
    description:
      'Diamond Beach is located on the south coast of Iceland, next to the Jökulsárlón glacial lagoon. This place got its name from the ice fragments that the waves carry onto the black volcanic sand. Under the sunlight, they shine like precious stones, creating one of the most famous natural landscapes of the country. Each piece of ice has its own shape and size, so the coast looks new every day. The contrast between the dark sand and the transparent ice makes this place especially popular with photographers.',
  },
  {
    id: 'aletsch-glacier',
    name: 'Aletsch Glacier',
    coordinates: '46.5048, 8.0303',
    lat: 46.5048,
    lng: 8.0303,
    category: 'winter-wonders',
    image: require('../assets/into-explorer-aletsch-glacier.png'),
    description:
      'The Aletsch Glacier is the largest glacier in the Alps and one of Switzerland\'s most spectacular winter destinations. Stretching for over 20 kilometers, it offers breathtaking views of snow-covered peaks, sparkling ice, and deep glacial valleys. As part of the UNESCO World Heritage Site, it attracts nature lovers and photographers from around the world. During winter, visitors can reach panoramic viewpoints by cable car and enjoy unforgettable views across the frozen Alpine landscape.',
  },
  {
    id: 'ilulissat',
    name: 'Frozen Sea, Ilulissat',
    coordinates: '69.2198, -51.0986',
    lat: 69.2198,
    lng: -51.0986,
    category: 'winter-wonders',
    image: require('../assets/into-explorer-frozen-sea-coast-ilulissat.png'),
    description:
      'Ilulissat in Greenland is famous for its ice fjord, which is a UNESCO World Heritage Site. In winter, the coast and the sea around the city are filled with huge icebergs that break off from one of the most active glaciers in the world. Some of them are as tall as a multi-story building and slowly drift along the coast. Due to the harsh climate, the local landscapes look extremely pristine. In winter, the sun rises above the horizon for only a short time, creating a special lighting with soft pink and blue shades.',
  },
];

export const PLACE_CATEGORIES = [
  {key: 'frozen-lakes' as const, label: 'Frozen Lakes'},
  {key: 'snow-villages' as const, label: 'Snow Villages'},
  {key: 'winter-wonders' as const, label: 'Winter Wonders'},
];
