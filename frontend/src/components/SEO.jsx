import { Helmet } from 'react-helmet-async';

function SEO({ title, description, image, url, type = 'article' }) {
    const siteTitle = 'Van360Sound';
    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDescription = description || 'Tu guía definitiva para encontrar los mejores auriculares, análisis y novedades.';
    const finalImage = image ? (image.startsWith('http') ? image : `https://www.van360sound.com${image}`) : 'https://www.van360sound.com/og-image.jpg';
    const finalUrl = url ? `https://www.van360sound.com${url}` : 'https://www.van360sound.com';

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{finalTitle}</title>
            <meta name='description' content={finalDescription} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />
        </Helmet>
    );
}

export default SEO;
