// Branch contact details per location. Edit these as Maria opens / updates branches.

const HQ = {
  branch: "Nagercoil Branch",
  address: `Maria Glass & Plywood
29/10-B, Beach Road,
Nagercoil, Kanniyakumari,
Tamil Nadu - 629002`,
  mobile: "+91 93619 88208",
  mapLink: "https://maps.app.goo.gl/1QWg7ufRN9ijrDTy5",
};

export const BRANCHES = {
  Nagercoil: HQ,

  "Monday Market": {
    branch: "Monday Market Branch",
    address: `Maria Glass & Plywood
11/85E/1, Near Market,
Thingalnagar,
Kanniyakumari,
Tamil Nadu - 629802`,
    mobile: "+91 75400 22411",
    mapLink: "https://share.google/g4AQZo1Tyn1ss0eJI",
  },

  Valliyoor: {
    branch: "Valliyoor Branch",
    address: `Maria Glass & Plywood
917-C, Annai Velankanni Complex,
Main Road, Near Court,
Valliyoor,
Tirunelveli - 627117`,
    mobile: "+91 99441 09603",
    mapLink: "https://share.google/Syskf2htqrO0fIhc4",
  },

  Thisayanvilai: {
    branch: "Thisayanvilai Branch",
    address: `Maria Glass & Plywood
182 E, Udankudi Road,
Thisayanvilai,
Tirunelveli,
Tamil Nadu - 627657`,
    mobile: "+91 81224 25564",
    mapLink: "https://share.google/EDqlrDtJG2DlKf2gN",
  },
};

export const COMMON = {
  instagram: "https://www.instagram.com/maria_glass_plywoods",
  urgentMobile: "+91 63795 17048",
};

export const getBranch = (location) => BRANCHES[location] || HQ;