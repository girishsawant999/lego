import React from 'react';
import MetaTags from 'react-meta-tags';

export const createMetaTags = (title = null, desc = null, keywords = null) => {
    if (!title && !desc && !keywords)
        return (
            <MetaTags>
                <title>Lego</title>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <meta property="og:title" content="Lego" />
            </MetaTags>)

    return (
        <MetaTags>
            <title>{title}</title>
            <meta name="description" content={desc} />
            <meta name="keywords" content={keywords} />
            <meta property="og:title" content={title} />
        </MetaTags>)
}

