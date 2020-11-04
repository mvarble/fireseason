module.exports = {
  siteMetadata: {
    title: 'Fire Season',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/pages`,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        remarkPlugins: [[require('remark-disable-tokenizers'), { block: ['indentedCode'] }]],
      },
    },
  ],
}
