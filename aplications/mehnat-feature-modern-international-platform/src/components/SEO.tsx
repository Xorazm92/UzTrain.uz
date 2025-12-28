import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  type?: 'website' | 'article' | 'video' | 'profile';
  image?: string;
  structuredData?: object;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "SafeDocs - O'zbekiston Temir Yo'llari Xavfsizlik Ta'limi Platformasi",
  description = "Professional xavfsizlik ta'limi va mehnat muhofazasi qoidalari. Elektr xavfsizligi, yong'in xavfsizligi, sanoat xavfsizligi bo'yicha interaktiv video materiallar va sertifikatlashtirish.",
  keywords = "xavfsizlik ta'limi, mehnat muhofazasi, temir yo'l xavfsizligi, elektr xavfsizligi, yong'in xavfsizligi, sanoat xavfsizligi, SafeDocs",
  type = 'website',
  image = "https://safedocs.uz/icons/icon-512x512.png",
  structuredData,
  canonical
}) => {
  const location = useLocation();
  const currentUrl = `https://safedocs.uz${location.pathname}`;
  const finalCanonical = canonical || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);

    // Update canonical link
    updateCanonical(finalCanonical);

    // Add structured data if provided
    if (structuredData) {
      addStructuredData(structuredData);
    }

    // Add breadcrumb structured data
    addBreadcrumbStructuredData(location.pathname);

    return () => {
      // Cleanup structured data when component unmounts
      cleanupStructuredData();
    };
  }, [title, description, keywords, type, image, currentUrl, finalCanonical, structuredData, location.pathname]);

  const updateMetaTag = (attribute: string, value: string, content: string) => {
    let element = document.querySelector(`meta[${attribute}="${value}"]`);
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      element.setAttribute(attribute, value);
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  };

  const updateCanonical = (url: string) => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }
  };

  const addStructuredData = (data: object) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  const addBreadcrumbStructuredData = (pathname: string) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Bosh Sahifa",
          "item": "https://safedocs.uz/"
        }
      ]
    };

    pathSegments.forEach((segment, index) => {
      const position = index + 2;
      const name = getPageNameFromSegment(segment);
      const item = `https://safedocs.uz/${pathSegments.slice(0, index + 1).join('/')}`;
      
      breadcrumbList.itemListElement.push({
        "@type": "ListItem",
        "position": position,
        "name": name,
        "item": item
      });
    });

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-data';
    script.textContent = JSON.stringify(breadcrumbList);
    document.head.appendChild(script);
  };

  const getPageNameFromSegment = (segment: string): string => {
    const pageNames: { [key: string]: string } = {
      'qonunlar': 'Qonunlar va Normativ Hujjatlar',
      'qoidalar': 'Xavfsizlik Qoidalari',
      'video-materiallar': 'Video Materiallar',
      'slaydlar': 'Taqdimotlar va Slaydlar',
      'temir-yol': 'Temir Yo\'l Hujjatlari',
      'bannerlar': 'Banner va Plakatlar',
      'kasb-yoriqnomalari': 'Kasb Yo\'riqnomalari',
      'admin': 'Administrator Panel'
    };
    return pageNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const cleanupStructuredData = () => {
    const structuredDataScript = document.getElementById('structured-data');
    const breadcrumbScript = document.getElementById('breadcrumb-data');
    if (structuredDataScript) structuredDataScript.remove();
    if (breadcrumbScript) breadcrumbScript.remove();
  };

  return null;
};

export default SEO;