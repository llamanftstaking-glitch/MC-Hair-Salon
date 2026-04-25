export default function JsonLd() {
  const siteUrl = "https://mchairsalon.com";

  // Primary: HairSalon (HealthAndBeautyBusiness)
  const salonSchema = {
    "@context": "https://schema.org",
    "@type": ["HairSalon", "HealthAndBeautyBusiness", "LocalBusiness"],
    "@id": `${siteUrl}/#business`,
    name: "MC Hair Salon & Spa",
    alternateName: "MC Hair Salon",
    url: siteUrl,
    telephone: "+12129885252",
    email: "info@mchairsalon.com",
    description:
      "Upper East Side's premier luxury hair salon and spa since 2011. Expert cuts, color, balayage, eyelash extensions, facials, and makeup artistry at 336 East 78th St, New York.",
    image: `${siteUrl}/opengraph-image`,
    logo: `${siteUrl}/mc-logo-gold.png`,
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Debit Card, Gift Card",
    foundingDate: "2011",
    hasMap: "https://maps.google.com/?q=336+East+78th+St+New+York+NY+10075",
    acceptsReservations: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: "336 East 78th St",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10075",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.7734,
      longitude: -73.9534,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday"],                           opens: "10:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday"], opens: "10:30", closes: "19:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"],               opens: "10:00", closes: "19:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"],                           opens: "11:00", closes: "18:00" },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      reviewCount: "150",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        author: { "@type": "Person", name: "Jennifer L." },
        reviewBody: "Kato is absolutely incredible. I've been coming here for 3 years and always leave looking better than I imagined. The salon has such an elegant atmosphere — truly Upper East Side.",
        name: "Balayage & Cut",
      },
      {
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        author: { "@type": "Person", name: "Amanda R." },
        reviewBody: "Best color work in all of Manhattan. Megan completely transformed my hair. The team is professional, warm, and the results speak for themselves.",
        name: "Full Color",
      },
      {
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        author: { "@type": "Person", name: "Christine M." },
        reviewBody: "I had my wedding updo done here and it was absolutely perfect. They also did makeup for my whole bridal party. Cannot recommend enough!",
        name: "Bridal Updo & Makeup",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Hair & Spa Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Women's Cut & Style" },    price: "45",  priceCurrency: "USD" },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Men's Clip & Cut" },        price: "30",  priceCurrency: "USD" },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Blow Out & Style" },        price: "33",  priceCurrency: "USD" },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Highlights / Balayage" },   price: "120", priceCurrency: "USD" },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Full Color" },              price: "85",  priceCurrency: "USD" },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Eyelash Extensions" },      price: "150", priceCurrency: "USD" },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Facial" },                  price: "80",  priceCurrency: "USD" },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Makeup Application" },      price: "75",  priceCurrency: "USD" },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bridal Updo & Style" },     price: "150", priceCurrency: "USD" },
      ],
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Online Booking",     value: true },
      { "@type": "LocationFeatureSpecification", name: "Hair Color",          value: true },
      { "@type": "LocationFeatureSpecification", name: "Balayage",            value: true },
      { "@type": "LocationFeatureSpecification", name: "Eyelash Extensions",  value: true },
      { "@type": "LocationFeatureSpecification", name: "Facials",             value: true },
      { "@type": "LocationFeatureSpecification", name: "Makeup Application",  value: true },
      { "@type": "LocationFeatureSpecification", name: "Bridal Services",     value: true },
      { "@type": "LocationFeatureSpecification", name: "Gift Cards",          value: true },
    ],
    sameAs: [
      "https://www.instagram.com/mchairsalonspa",
      "https://www.facebook.com/mchairsalonandspa",
      "https://www.weddingwire.com/biz/mc-hair-salon-and-spa/a3991b6360a5145a.html",
    ],
    keywords: "hair salon, Upper East Side, NYC, balayage, hair color, blowout, eyelash extensions, facial, makeup, bridal hair, wedding hair",
  };

  // Website schema with sitelinks searchbox signal
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "MC Hair Salon & Spa",
    description: "Upper East Side's premier luxury hair salon and spa",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/services` },
      "query-input": "required name=search_term_string",
    },
  };

  // BreadcrumbList for key sections
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",     item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
      { "@type": "ListItem", position: 3, name: "Book",     item: `${siteUrl}/book` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(salonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
