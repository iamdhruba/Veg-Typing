import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  path = '/',
  keywords = '',
  type = 'website'
}) => {
  const siteName = 'VEG Typewriter';
  const baseUrl = 'https://veg-typing.vercel.app';
  const fullUrl = `${baseUrl}${path}`;
  const ogImage = `${baseUrl}/og-image.png`;
  const defaultKeywords = 'nepali typing online, online nepali typing, Nepali typing test, Preeti typing online, Romanized Unicode typing, typing speed, नेपाली टाइपिङ';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`${defaultKeywords}${keywords ? ', ' + keywords : ''}`} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="ne_NP" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
