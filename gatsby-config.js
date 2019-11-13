module.exports = {
  siteMetadata: {
    title: `Techkshetra 2k19 - Official Blog`,
    name: `Techkshetra`,
    siteUrl: `https://techkshetra.tech`,
    description: `Techkshetra, this year Techkshetra 2k19, the biennial technical festival of Rajagiri School of Engineering and Technology, Kakkanad, Kerala is a
    treasure trove of a wide range of events that bring together students of all fields for a day like no other.
    With a wide variety of events which encompass every wavelength and aspect of a student, participants
    get a chance to witness and be part of something extraordinary. From drones to artificial intelligence,
    we have it all. Not to mention, the cultural programs that make up a large part of the event. Come, be a
    part of something bigger; a place where all outdated rules go out of the window and you are free to
    create and discover your passion as you please. Techkshetra 2k19`,
    hero: {
      heading: `Techkshetra 2k19 - Official Blog`,
      maxWidth: 652,
    },
    social: [
      {
        name: `instagram`,
        url: `https://instagram.com/techkshetra19?igshid=1uat2j1tm6gpc`,
      }
    ],
  },
  plugins: [
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: true,
        sources: {
          local: true,
          // contentful: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Novela by Narative`,
        short_name: `Novela`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
      },
    },
  ],
};
