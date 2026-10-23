/* "Popular on CarXprt": the search links the live home page carries above its footer (23 Oct 2026), kept for
   search engines and for people who'd rather browse than ask. */

export type LinkGroup = { name: string; links: [string, string][] };

export const POPULAR: LinkGroup[] = [
  {
    name: "Popular makes", links: [
      ["Toyota Cars for Sale", "/make/toyota-cars"], ["Honda Cars for Sale", "/make/honda-cars"], ["Ford Cars for Sale", "/make/ford-cars"],
      ["Chevrolet Cars for Sale", "/make/chevrolet-cars"], ["BMW Cars for Sale", "/make/bmw-cars"], ["Tesla Cars for Sale", "/make/tesla-cars"],
      ["Jeep Cars for Sale", "/make/jeep-cars"], ["Subaru Cars for Sale", "/make/subaru-cars"], ["Volkswagen Cars for Sale", "/make/volkswagen-cars"],
      ["Lexus Cars for Sale", "/make/lexus-cars"], ["Porsche Cars for Sale", "/make/porsche-cars"], ["All makes", "/search"],
    ],
  },
  {
    name: "Popular models", links: [
      ["Toyota RAV4", "/make/toyota-cars/rav4"], ["Toyota Camry", "/make/toyota-cars/camry"], ["Toyota Highlander", "/make/toyota-cars/highlander"],
      ["Toyota Land Cruiser", "/make/toyota-cars/land-cruiser"], ["Toyota Tacoma", "/make/toyota-cars/tacoma"], ["Toyota Sequoia", "/make/toyota-cars/sequoia"],
      ["Honda Civic", "/make/honda-cars/civic"], ["Honda Accord", "/make/honda-cars/accord"], ["Honda CR-V", "/make/honda-cars/cr-v"],
      ["Jeep Wrangler", "/make/jeep-cars/wrangler"], ["Jeep Cherokee", "/make/jeep-cars/cherokee"], ["Subaru Crosstrek", "/make/subaru-cars/crosstrek"],
      ["Subaru Forester", "/make/subaru-cars/forester"], ["Subaru Outback", "/make/subaru-cars/outback"], ["Subaru Ascent", "/make/subaru-cars/ascent"],
      ["BMW M3", "/make/bmw-cars/m3"], ["BMW X5", "/make/bmw-cars/x5"], ["BMW i8", "/make/bmw-cars/i8"], ["BMW X7", "/make/bmw-cars/x7"],
      ["Chevrolet Equinox", "/make/chevrolet-cars/equinox"], ["Chevrolet Corvette", "/make/chevrolet-cars/corvette"],
      ["Volkswagen Atlas", "/make/volkswagen-cars/atlas"], ["Volkswagen Tiguan", "/make/volkswagen-cars/tiguan"],
      ["Lexus GX 550", "/make/lexus-cars/gx-550"], ["Porsche 911", "/make/porsche-cars/911"], ["Porsche Cayenne", "/make/porsche-cars/cayenne"],
      ["All models", "/search"],
    ],
  },
  {
    name: "By body type", links: [
      ["SUVs for Sale", "/body-type/suvs"], ["Sedans for Sale", "/body-type/sedans"], ["Pickup Trucks for Sale", "/body-type/pickup-trucks"],
      ["Hatchbacks for Sale", "/body-type/hatchbacks"], ["Coupes for Sale", "/body-type/coupes"], ["Minivans for Sale", "/body-type/minivans"],
      ["Crossovers for Sale", "/body-type/crossovers"], ["Convertibles for Sale", "/body-type/convertibles"], ["Vans for Sale", "/body-type/vans"],
      ["All types", "/search"],
    ],
  },
  {
    name: "By fuel and price", links: [
      ["Electric Cars", "/fuel-type/electric-cars"], ["Hybrid Cars", "/fuel-type/hybrid-cars"], ["Gas Cars", "/fuel-type/gas-cars"],
      ["Under $15,000", "/search?price_range=-15000"], ["Under $25,000", "/search?price_range=-25000"], ["Under $35,000", "/search?price_range=-35000"],
      ["See more", "/search"],
    ],
  },
];
