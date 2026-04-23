export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: "MC Hair Salon & Spa",
    url: "https://mchairsalon.com",
    telephone: "+12129885252",
    description:
      "Upper East Side's premier luxury hair salon and spa. Expert cuts, color, balayage, eyelash extensions, and spa services since 2011.",
    image: "https://mchairsalon.com/mc-logo-gold.png",
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card",
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
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday"],                                    opens: "10:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday"],          opens: "10:30", closes: "19:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"],                        opens: "10:00", closes: "19:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"],                                    opens: "11:00", closes: "18:00" },
    ],
    hasMap: "https://maps.google.com/?q=336+East+78th+St+New+York+NY+10075",
    acceptsReservations: true,
    foundingDate: "2011",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Hair Color", value: true },
      { "@type": "LocationFeatureSpecification", name: "Balayage", value: true },
      { "@type": "LocationFeatureSpecification", name: "Eyelash Extensions", value: true },
      { "@type": "LocationFeatureSpecification", name: "Facial", value: true },
      { "@type": "LocationFeatureSpecification", name: "Makeup Application", value: true },
    ],
    sameAs: [
      "https://www.instagram.com/mchairsalonspa",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
