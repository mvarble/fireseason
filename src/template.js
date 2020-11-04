import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { Helmet } from 'react-helmet';

export default function Template({ data }) {
  // parse the graphql data
  const body = data.mdx.body;
  const title = data.mdx.frontmatter.title;
  const slug = data.mdx.fields.slug;

  // render
  return (
    <>
      <Helmet>
        <title>{
          slug === '/' ? 'Fire Season' : `Fire Season | ${title}`
        }</title>
        <meta name="description" content="A website for a hotsauce company" />
      </Helmet>
      <div className="container">
        <MDXRenderer>
          { body }
        </MDXRenderer>
      </div>
    </>
  );
}

export const query = graphql`
  query MDXQuery($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
