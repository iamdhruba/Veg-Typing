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
  const baseUrl = 'https://vegtypewriter.com';
  const fullUrl = `${baseUrl}${path}`;
  const defaultKeywords = 'Nepali typing test, Preeti typing, Unicode typing, typing speed, नेपाली टाइपिङ';

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

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
