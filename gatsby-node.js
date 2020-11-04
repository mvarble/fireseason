const { createFilePath } = require('gatsby-source-filesystem');

/**
 * onCreateNode callback
 */
exports.onCreateNode = function ({ node, getNode, actions }) {
  const { createNodeField } = actions;
  if (node.internal.type === 'Mdx') {
    const slug = createFilePath({ node, getNode, basePath: 'pages' })
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
}

/**
 * createPages hook
 */
exports.createPages = function ({ graphql, actions }) {
  const { createPage } = actions;
  return graphql(`
    query {
      allMdx {
        nodes {
          fields {
            slug
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) throw result.errors;
    result.data.allMdx.nodes.forEach(node => createPage({
      path: node.fields.slug,
      component: `${__dirname}/src/template.js`,
      context: {
        slug: node.fields.slug,
      },
    }));
  });
}
