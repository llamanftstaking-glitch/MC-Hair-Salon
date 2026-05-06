export const SALON_INFO = {
  name: "MC Hair Salon",
  tagline: "Upper East Side's Premier Luxury Salon",
  address: "336 East 78th St, New York, NY 10075",
  phone: "(212) 988-5252",
  email: "hello@mchairsalon.com",
  instagram: "https://www.instagram.com/mchairsalonspa/",
  facebook: "https://www.facebook.com/mchairsalonandspa/",
  established: 2011,
  hours: [
    { day: "Monday", open: "9:30 AM", close: "4:00 PM", note: "By Appointment Only" },
    { day: "Tuesday", open: "10:30 AM", close: "7:30 PM" },
    { day: "Wednesday", open: "10:30 AM", close: "7:30 PM" },
    { day: "Thursday", open: "10:30 AM", close: "7:30 PM" },
    { day: "Friday", open: "10:00 AM", close: "7:00 PM" },
    { day: "Saturday", open: "10:00 AM", close: "7:00 PM" },
    { day: "Sunday", open: "11:00 AM", close: "6:00 PM" },
  ],
};

export const SERVICES = [
  {
    category: "Haircuts",
    icon: "scissors",
    tagline: "Precision cuts tailored to your face shape, texture, and lifestyle — not just the trend.",
    items: [
      { name: "Men's Haircut",    price: 50,  priceLabel: "$50+",  duration: "30 min",  description: "Classic and contemporary men's cuts with precision clipper and scissor work. Tapered neckline, clean lines, and a finish that holds between visits." },
      { name: "Women's Haircut",  price: 120, priceLabel: "$120",  duration: "1 hr",    description: "Precision cut designed around your face shape and daily routine, finished with a professional round-brush blowout for shape and volume. Includes consultation and personalized style advice." },
      { name: "Girl's Haircut",   price: 55,  priceLabel: "$55+",  duration: "1 hr",    description: "Style-forward cuts for young guests — trims, layers, bob cuts, and blunt shapes. Finished with a light blowout and style advice for home maintenance." },
      { name: "Boy's Haircut",    price: 45,  priceLabel: "$45+",  duration: "30 min",  description: "Precision taper and scissor work. Clean lines, fade options, and age-appropriate styling." },
      { name: "Bangs",            price: 20,  priceLabel: "$20+",  duration: "10 min",  description: "Bang trim or reshaping — a quick, precision service to keep your fringe looking fresh between cuts." },
    ],
  },
  {
    category: "Blowouts & Styling",
    icon: "wind",
    tagline: "Salon-quality smoothness and shape — our most popular everyday service.",
    items: [
      { name: "Blowdry",  price: 45,  priceLabel: "$45+",  duration: "45 min",  description: "Professional wash, condition, and blow-dry using a round brush for volume, smoothness, and shape. Our most popular weekday service. Looking to save? We offer blowout packages — visit our Packages page." },
      { name: "Updo",     price: 85,  priceLabel: "$85+",  duration: "1 hr",    description: "Elegant updos, French twists, braided styles, chignons, and event-ready looks designed to last all night. Ideal for galas, weddings, proms, and milestone occasions." },
    ],
  },
  {
    category: "Color",
    icon: "palette",
    tagline: "L'Oréal Majerel and ammonia-free Inoa color — dimensional results that grow out gracefully.",
    items: [
      { name: "Clear Glossy",                      price: 35,  priceLabel: "$35+",           duration: "15 min",   description: "A clear gloss treatment that adds mirror-like shine and seals the cuticle. Perfect as a standalone refresh or after any color service." },
      { name: "Single Process",                    price: 100, priceLabel: "$100+",           duration: "40 min",   description: "All-over color using L'Oréal Majerel for rich pigment or ammonia-free Inoa for scalp-sensitive clients. Includes gray coverage and built-in conditioning agents." },
      { name: "Single Process w/ Moroccan Oil",    price: 120, priceLabel: "$120",            duration: "50 min",   description: "Single process color service enhanced with a professional Moroccan Oil treatment for added hydration, frizz control, and shine." },
      { name: "Partial Highlights",                price: 250, priceLabel: "$250+",           duration: "2 hr",     description: "Foil highlights applied to key sections around the face and crown for natural-looking dimension and brightness." },
      { name: "Full Highlights",                   price: 350, priceLabel: "$350+",           duration: "2 hr 35 min", description: "Full-head foil highlights for all-over lightness, dimension, and contrast. Tailored to your texture and target result." },
      { name: "Face Frame",                        price: 130, priceLabel: "$130",            duration: "1 hr",     description: "Strategic highlights placed around the face to brighten your complexion and add dimension without full-head color." },
      { name: "Toner",                             price: 45,  priceLabel: "$45",             duration: "20 min",   description: "A toning gloss to neutralize brassiness, refine color, and add shine. Commonly used after highlighting or lightening services." },
      { name: "Partial Balayage",                  price: 250, priceLabel: "$250",            duration: "2 hr",     description: "Hand-painted balayage applied to select sections for sun-kissed depth and movement — lower maintenance than full balayage." },
      { name: "Full Balayage",                     price: 400, priceLabel: "$400",            duration: "2 hr 35 min", description: "Full head hand-painted balayage for seamless, natural-looking dimension from root to tip. The gold standard of lived-in color." },
      { name: "Double Process",                    price: 0,   priceLabel: "By Consultation", duration: "2 hr",     description: "Two-step color service for dramatic lightening followed by toning or color deposit. Pricing determined after consultation." },
      { name: "Color Correction",                  price: 0,   priceLabel: "By Consultation", duration: "2 hr 30 min+", description: "Specialized multi-step correction for brassiness, uneven tone, over-processing, or box dye damage. Pricing determined after a thorough consultation and strand test." },
    ],
  },
  {
    category: "Treatments",
    icon: "scissors",
    tagline: "Restorative services that smooth, strengthen, and transform your hair's health.",
    items: [
      { name: "Keratin Treatment",    price: 350, priceLabel: "$350+",           duration: "2 hr 30 min", description: "A professional keratin smoothing treatment that eliminates frizz, reduces curl, and leaves hair silky and manageable for months. Results last 3–5 months." },
      { name: "Hair Botox Treatment", price: 185, priceLabel: "$185+",           duration: "1 hr 30 min", description: "A deep-conditioning, frizz-reducing treatment that fills gaps in the hair fiber with proteins and keratin complex — restoring softness, shine, and elasticity without altering curl pattern." },
      { name: "Relaxer",              price: 180, priceLabel: "$180+",           duration: "2 hr",        description: "Professional chemical relaxer service to permanently straighten and smooth textured hair. Includes a deep conditioning treatment to restore moisture post-process." },
      { name: "Extensions",           price: 0,   priceLabel: "By Consultation", duration: "2 hr+",       description: "Hair extension application by consultation. Pricing depends on method (tape-in, sew-in, fusion), length, and volume. Book a consultation to discuss options." },
      { name: "Extension Removal",    price: 100, priceLabel: "$100+",           duration: "30 min",      description: "Safe, professional removal of existing hair extensions with minimal damage to natural hair." },
    ],
  },
  {
    category: "Makeup",
    icon: "brush",
    tagline: "Editorial precision meets wearable luxury — by Dhariana Suriel, featured on WeddingWire & The Knot.",
    items: [
      { name: "Makeup Application", price: 125, priceLabel: "$125+", duration: "By Consultation", description: "Full face application by Dhariana — foundation matched to your undertone, contouring, eye design, and lip color. Perfect for date nights, professional portraits, events, or simply a night out." },
    ],
  },
];

export const TEAM = [
  {
    name: "Maria",
    role: "Stylist",
    bio: "Maria brings a versatile touch to every appointment at MC Hair Salon. From precision haircuts and curly cuts to advanced color services, relaxers, and highlights, she tailors every look to the client's unique texture, lifestyle, and goals.",
    specialties: ["Color Correction", "Balayage", "Updo", "Curly Haircut", "Highlights", "Relaxer", "Color"],
    image: "/instagram/mchairsalonspa_1523641801_1756757213798938429_509340228.jpg",
  },
  {
    name: "Meagan",
    role: "Stylist",
    bio: "Meagan brings artistry and technical excellence to every appointment. Her expertise in L'Oréal color systems makes her our go-to for transformational color.",
    specialties: ["Hair Color", "Highlights", "Blowouts"],
    image: "/instagram/mchairsalonspa_1533145637_1836481173825515947_509340228.jpg",
  },
  {
    name: "Sally",
    role: "Stylist",
    bio: "Sally is one of MC's most versatile stylists, skilled across all hair types and textures. Her services span women's and men's haircuts, curly cuts, keratin and hair Botox treatments, color, balayage, baby lights, updos, and eyebrow and lip waxing.",
    specialties: ["Women's Haircuts", "Men's Haircuts", "Curly Cuts", "Keratin Treatment", "Balayage", "Baby Lights", "Eyebrow & Lip Wax"],
    image: "/instagram/mchairsalonspa_1732646348_3510014434303531709_509340228.jpg",
  },
  {
    name: "Kato",
    role: "Stylist",
    bio: "With 30 years of experience as a hairdresser, Kato is a true master of the craft. He specializes in hair color, natural highlights, and men's precision cutting — delivering refined results for both men and women.",
    specialties: ["Hair Color", "Natural Highlights", "Men's Hair", "Precision Cutting"],
    image: "/instagram/mchairsalonspa_1550078255_1978522269296608933_509340228.jpg",
  },
  {
    name: "Juany",
    role: "Stylist",
    bio: "Juany specializes in smoothing and restorative hair treatments. Whether you're looking for a polished blowout, a long-lasting keratin treatment, or a hair Botox service to restore softness and shine, Juany delivers flawless results every time.",
    specialties: ["Blow Dry", "Keratin Treatment", "Botox Treatment for Hair"],
    image: "/instagram/mchairsalonspa_1708007392_3303327885522806092_509340228.jpg",
  },
  {
    name: "Nazareth",
    role: "Stylist",
    bio: "Nazareth brings precision and versatility to every chair. Available Tuesday through Friday, she specializes in cuts, color, and styling services for all hair types.",
    specialties: ["Haircuts", "Color", "Balayage", "Blowdry"],
    image: "",
  },
  {
    name: "Nathaly",
    role: "Stylist",
    bio: "Nathaly joins the MC team on weekends, offering precision haircuts, blowouts, and styling for clients looking for a luxury Saturday or Sunday appointment.",
    specialties: ["Haircuts", "Blowdry", "Styling"],
    image: "",
  },
  {
    name: "Dhariana Suriel",
    role: "Professional Makeup Artist",
    bio: "Dhariana Suriel brings 18 years of professional makeup artistry to MC Hair Salon. As our resident bridal specialist — featured on WeddingWire and The Knot — she creates timeless, polished looks that photograph beautifully and last all day. Fluent in English and Spanish.",
    specialties: ["Bridal Makeup", "Contour Makeup", "Eye Makeup", "Lashes", "Makeup Lessons"],
    image: "/instagram/mchairsalonspa_1595346452_2358259426203129087_509340228.jpg",
    isMakeupArtist: true,
  },
];

export interface PackageDef {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalValue: number;
  sessions: number;
  services: string[];
  highlight: string;
  badge?: string;
  validityDays: number;
  baseGuests?: number;
  pricePerGuest?: number;
}

export const PACKAGES: PackageDef[] = [
  {
    id: "pkg_blowout_10",
    name: "Blowout Bundle",
    tagline: "Your weekly glow, locked in",
    price: 350,
    originalValue: 400,
    sessions: 10,
    services: ["10 × Blow Out & Style"],
    highlight: "Save $50 — perfect for busy New Yorkers",
    validityDays: 180,
  },
  {
    id: "pkg_color_3",
    name: "Color Club",
    tagline: "Vibrant, dimensional color all year",
    price: 235,
    originalValue: 255,
    sessions: 3,
    services: ["3 × Full Color (L'Oréal Majerel/Inoa)"],
    highlight: "Save $20 — stay fresh between seasons",
    validityDays: 365,
  },
  {
    id: "pkg_color_6",
    name: "Color Club",
    tagline: "Year-round color, covered",
    price: 475,
    originalValue: 510,
    sessions: 6,
    services: ["6 × Full Color (L'Oréal Majerel/Inoa)"],
    highlight: "Save $35 — the full-year color plan",
    validityDays: 365,
  },
  {
    id: "pkg_glam_5",
    name: "Glam Pack",
    tagline: "Look your best for every occasion",
    price: 500,
    originalValue: 625,
    sessions: 5,
    services: ["5 × Makeup Application by Dhariana"],
    highlight: "Save $125 — events, date nights, and more",
    validityDays: 365,
  },
  {
    id: "pkg_bridal_prep",
    name: "Bridal Prep",
    tagline: "Everything you need before the big day",
    price: 1500,
    originalValue: 1800,
    sessions: 6,
    services: [
      "Hair & Makeup for each guest",
      "Bridal party coordination",
      "Day-of timeline planning",
    ],
    highlight: "$250 per guest — add or remove guests below",
    badge: "Most Popular",
    validityDays: 365,
    baseGuests: 6,
    pricePerGuest: 250,
  },
];

export const WEDDING_SERVICES = [
  {
    category: "Bridal Hair",
    icon: "💍",
    services: [
      { name: "Bridal Updo & Style", price: 150, note: "Day-of styling, includes consultation" },
      { name: "Bridal Hair Trial", price: 120, note: "Recommended 4–8 weeks before the wedding" },
      { name: "Bridesmaid Hair (each)", price: 85, note: "Updo or blowout styling" },
      { name: "Mother of the Bride / Groom", price: 100, note: "Updo or elegant styling" },
      { name: "Flower Girl Style", price: 45, note: "Simple updo or curls, ages 3–12" },
    ],
  },
  {
    category: "Bridal Makeup",
    icon: "✨",
    services: [
      { name: "Bridal Makeup", price: 200, note: "Full glam application, long-lasting" },
      { name: "Bridal Makeup Trial", price: 150, note: "Preview your look before the big day" },
      { name: "Airbrush Bridal Makeup", price: 225, note: "Ultra-smooth, camera-ready finish" },
      { name: "Bridesmaid Makeup (each)", price: 125, note: "Coordinated looks for the whole party" },
      { name: "Mother of the Bride Makeup", price: 125, note: "Elegant, age-appropriate artistry" },
      { name: "Flower Girl Makeup", price: 50, note: "Light, natural look for young ones" },
    ],
  },
  {
    category: "Pre-Wedding Prep",
    icon: "🌿",
    services: [
      { name: "Bridal Balayage / Color", price: 150, note: "Dimensional color for the big day" },
      { name: "Deep Conditioning Treatment", price: 60, note: "Silky, healthy hair for styling day" },
    ],
  },
  {
    category: "On-Location Services",
    icon: "🏨",
    services: [
      { name: "On-Location Travel Fee", price: 150, note: "We come to your venue — NYC area" },
      { name: "On-Location Bridal Style", price: 175, note: "Hair at your venue or hotel" },
      { name: "On-Location Bridal Makeup", price: 225, note: "Makeup at your venue or hotel" },
    ],
  },
];

export const WEDDING_TESTIMONIALS = [
  {
    name: "Alexandra M.",
    wedding: "September 2023",
    review: "MC Hair Salon made my wedding morning absolutely magical. Kato did my updo — I cried happy tears when I saw myself. The entire team was calm, professional, and made every bridesmaid feel beautiful.",
    rating: 5,
  },
  {
    name: "Danielle R.",
    wedding: "June 2023",
    review: "Dhariana's bridal makeup was flawless. We did a trial 6 weeks before and she nailed my vision on the first try. I looked like myself — but the most radiant version. Cannot recommend enough.",
    rating: 5,
  },
  {
    name: "Priya S.",
    wedding: "October 2022",
    review: "We had 8 people in the bridal party and the team handled everything seamlessly. They came to our hotel in the Upper East Side and were done in 3 hours flat. Impeccable service.",
    rating: 5,
  },
  {
    name: "Melissa C.",
    wedding: "April 2024",
    review: "The bridal hair trial was one of the most enjoyable appointments I've ever had. Megan listened to exactly what I wanted and even improved on my inspiration photos. Book them — you won't regret it.",
    rating: 5,
  },
  {
    name: "Kaitie",
    wedding: "March 2026",
    review: "Highly recommend Dhariana's artistry! She was available on a dime for an intimate event and was incredibly accommodating and flexible. Got nothing but amazing feedback from the bride and the mother of the bride. They loved their looks!!",
    rating: 5,
    source: "WeddingWire",
  },
];

export const WEDDING_GALLERY = [
  { src: "/instagram/mchairsalonspa_1774207263_3858649997122708575_509340228.jpg", alt: "Bridal updo" },
  { src: "/instagram/mchairsalonspa_1732646348_3510014434303531709_509340228.jpg", alt: "Wedding day styling" },
  { src: "/instagram/mchairsalonspa_1708007392_3303327885522806092_509340228.jpg", alt: "Bridal hair" },
  { src: "/instagram/mchairsalonspa_1672866306_3008543095357388367_509340228.jpg", alt: "Bridal glam" },
  { src: "/instagram/mchairsalonspa_1664479225_2938187155735434916_509340228.jpg", alt: "Bridal makeup" },
  { src: "/instagram/mchairsalonspa_1645811757_2781593085253597123_509340228.jpg", alt: "Bridal party styling" },
];

export const MAKEUP_GALLERY = [
  { src: "/instagram/mchairsalonspa_1595346452_2358259426203129087_509340228.jpg", alt: "Makeup artistry by Dhariana", label: "Glam" },
  { src: "/instagram/mchairsalonspa_1594335004_2349774783581733215_509340228.jpg", alt: "Special event look", label: "Event" },
  { src: "/instagram/mchairsalonspa_1584025690_2263293995516827575_509340228.jpg", alt: "Bridal makeup", label: "Bridal" },
  { src: "/instagram/mchairsalonspa_1583862336_2261923681251816316_509340228.jpg", alt: "Editorial makeup look", label: "Editorial" },
  { src: "/instagram/mchairsalonspa_1583176666_2256171862533820128_509340228.jpg", alt: "Natural everyday glam", label: "Natural" },
  { src: "/instagram/mchairsalonspa_1581106935_2238809697447493007_509340228.jpg", alt: "Airbrush finish", label: "Airbrush" },
  { src: "/instagram/mchairsalonspa_1579289740_2223565962392628495_509340228.jpg", alt: "Smoky eye look", label: "Glam" },
  { src: "/instagram/mchairsalonspa_1568744468_2135105812317486094_509340228.jpg", alt: "Bold lip and contour", label: "Bold" },
];

export const GALLERY_IMAGES = [
  { src: "/instagram/mchairsalonspa_1774207263_3858649997122708575_509340228.jpg", alt: "Elegant bridal updo at MC Hair Salon & Spa Upper East Side NYC" },
  { src: "/instagram/mchairsalonspa_1732646348_3510014434303531709_509340228.jpg", alt: "Wedding day hair styling at MC Hair Salon & Spa New York" },
  { src: "/instagram/mchairsalonspa_1708007392_3303327885522806092_509340228.jpg", alt: "Balayage color transformation at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1672866306_3008543095357388367_509340228.jpg", alt: "Bridal hair and makeup artistry at MC Hair Salon & Spa NYC" },
  { src: "/instagram/mchairsalonspa_1664479225_2938187155735434916_509340228.jpg", alt: "Eyelash extensions by Sofia at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1645811757_2781593085253597123_509340228.jpg", alt: "Bridal party hair styling at MC Hair Salon & Spa New York" },
  { src: "/instagram/mchairsalonspa_1618323213_2551002466209372019_509340228.jpg", alt: "Dimensional balayage highlights at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1614205734_2516462548871535754_509340228.jpg", alt: "Women's precision haircut and blowout styling NYC salon" },
  { src: "/instagram/mchairsalonspa_1612024016_2498160975418230925_509340228.jpg", alt: "Full color treatment with L'Oréal Inoa at MC Hair Salon NYC" },
  { src: "/instagram/mchairsalonspa_1605369692_2442340457025232327_509340228.jpg", alt: "Sun-kissed balayage highlights result Upper East Side salon" },
  { src: "/instagram/mchairsalonspa_1599674928_2394569313405054579_509340228.jpg", alt: "Professional blowout and style at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1597866646_2379400348672402563_509340228.jpg", alt: "Hair color transformation at MC Hair Salon & Spa Manhattan" },
  { src: "/instagram/mchairsalonspa_1595346452_2358259426203129087_509340228.jpg", alt: "Makeup artistry by Dhariana at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1594335004_2349774783581733215_509340228.jpg", alt: "Special event glam makeup at MC Hair Salon & Spa NYC" },
  { src: "/instagram/mchairsalonspa_1584025690_2263293995516827575_509340228.jpg", alt: "Bridal makeup trial result at MC Hair Salon New York" },
  { src: "/instagram/mchairsalonspa_1583862336_2261923681251816316_509340228.jpg", alt: "Editorial makeup look by Dhariana at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1583176666_2256171862533820128_509340228.jpg", alt: "Natural glam makeup application at MC Hair Salon & Spa NYC" },
  { src: "/instagram/mchairsalonspa_1581106935_2238809697447493007_509340228.jpg", alt: "Airbrush makeup finish for special event at MC Hair Salon" },
  { src: "/instagram/mchairsalonspa_1579289740_2223565962392628495_509340228.jpg", alt: "Smoky eye glam makeup at MC Hair Salon Upper East Side NYC" },
  { src: "/instagram/mchairsalonspa_1568744468_2135105812317486094_509340228.jpg", alt: "Bold makeup and contouring at MC Hair Salon & Spa NYC" },
  { src: "/instagram/mchairsalonspa_1559919918_2061080118428493908_509340228.jpg", alt: "Women's haircut and style at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1553032566_2003304826495864682_509340228.jpg", alt: "Hand-painted balayage technique at MC Hair Salon NYC" },
  { src: "/instagram/mchairsalonspa_1553032566_2003304826479110483_509340228.jpg", alt: "Balayage color result at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1551895791_1993768864262785123_509340228.jpg", alt: "Precision women's cut and blowout at MC Hair Salon NYC" },
  { src: "/instagram/mchairsalonspa_1550270095_1980131537623873654_509340228.jpg", alt: "Balayage toning and gloss treatment Upper East Side salon" },
  { src: "/instagram/mchairsalonspa_1550078255_1978522269296608933_509340228.jpg", alt: "Stylist Kato precision cut at MC Hair Salon Upper East Side NYC" },
  { src: "/instagram/mchairsalonspa_1550019410_1978028640350001926_509340228.jpg", alt: "Rich brunette full color at MC Hair Salon & Spa NYC" },
  { src: "/instagram/mchairsalonspa_1549901344_1977038231285177038_509340228.jpg", alt: "Highlights and toning service at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1547565139_1957440724590707010_509340228.jpg", alt: "Women's luxury cut and style at MC Hair Salon & Spa NYC" },
  { src: "/instagram/mchairsalonspa_1545247659_1938000287139372933_509340228.jpg", alt: "Blowout styling at MC Hair Salon Upper East Side Manhattan" },
  { src: "/instagram/mchairsalonspa_1545247658_1938000284807356745_509340228.jpg", alt: "Blowout with curling iron work at MC Hair Salon NYC" },
  { src: "/instagram/mchairsalonspa_1544907084_1935143342264051954_509340228.jpg", alt: "L'Oréal professional color result at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1544746741_1933798285762276098_509340228.jpg", alt: "Deep conditioning hair treatment at MC Hair Salon & Spa NYC" },
  { src: "/instagram/mchairsalonspa_1539447878_1889348198776309881_509340228.jpg", alt: "Blonde balayage highlights transformation NYC luxury salon" },
  { src: "/instagram/mchairsalonspa_1537975181_1876994322903414349_509340228.jpg", alt: "Color correction specialist result at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1535637640_1857385604482313314_509340228.jpg", alt: "Women's precision cut and styling at MC Hair Salon NYC" },
  { src: "/instagram/mchairsalonspa_1534965905_1851750683952556497_509340228.jpg", alt: "Professional blowout style at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1533159418_1836596778239353805_509340228.jpg", alt: "Hair color specialist Megan at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1533145639_1836481184940363509_509340228.jpg", alt: "Dimensional color highlights and balayage at MC Hair Salon NYC" },
  { src: "/instagram/mchairsalonspa_1533145638_1836481184185441687_509340228.jpg", alt: "Full color treatment at MC Hair Salon & Spa Upper East Side" },
  { src: "/instagram/mchairsalonspa_1533145637_1836481173825515947_509340228.jpg", alt: "Megan balayage color result at MC Hair Salon NYC" },
  { src: "/instagram/mchairsalonspa_1531506312_1822729518219265500_509340228.jpg", alt: "Special event updo styling at MC Hair Salon Upper East Side NYC" },
  { src: "/instagram/mchairsalonspa_1531325744_1821214799729933993_509340228.jpg", alt: "Professional blowout and styling at MC Hair Salon & Spa NYC" },
  { src: "/instagram/mchairsalonspa_1529625908_1806955543714585334_509340228.jpg", alt: "Blonde dimensional balayage at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1528920371_1801037069880314297_509340228.jpg", alt: "Women's luxury cut and style result at MC Hair Salon NYC" },
  { src: "/instagram/mchairsalonspa_1528578580_1798169924515305526_509340228.jpg", alt: "Lash extension service by Sofia at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1528478066_1797326749437347128_509340228.jpg", alt: "Blowout with iron work styling at MC Hair Salon & Spa NYC" },
  { src: "/instagram/mchairsalonspa_1528238192_1795314536774311722_509340228.jpg", alt: "Precision cut women's hair at MC Hair Salon Upper East Side NYC" },
  { src: "/instagram/mchairsalonspa_1527033063_1785205185804273652_509340228.jpg", alt: "Hair color treatment result at MC Hair Salon & Spa Upper East Side" },
  { src: "/instagram/mchairsalonspa_1527033062_1785205176937629694_509340228.jpg", alt: "Luxury hair styling at MC Hair Salon Upper East Side NYC" },
  { src: "/instagram/mchairsalonspa_1526678565_1782231439342285913_509340228.jpg", alt: "Men's precision cut by Marcus at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1524246449_1761829374796274512_509340228.jpg", alt: "Highlights and balayage color at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1524246447_1761829357465396670_509340228.jpg", alt: "Sun-kissed highlights at MC Hair Salon & Spa Upper East Side NYC" },
  { src: "/instagram/mchairsalonspa_1523641819_1756757370506336447_509340228.jpg", alt: "Balayage hand-painted technique at MC Hair Salon NYC" },
  { src: "/instagram/mchairsalonspa_1523641801_1756757213798938429_509340228.jpg", alt: "Color highlights and toning at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1520467133_1730126170101599113_509340228.jpg", alt: "Women's haircut and blowout style at MC Hair Salon NYC" },
  { src: "/instagram/mchairsalonspa_1512179175_1660601740579074133_509340228.jpg", alt: "Hair color treatment at MC Hair Salon & Spa Manhattan NYC" },
  { src: "/instagram/mchairsalonspa_1511886218_1658144241762478058_509340228.jpg", alt: "Formal event updo styling at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1505510360_1604659664696308889_509340228.jpg", alt: "Blowout glam style result at MC Hair Salon & Spa NYC" },
  { src: "/instagram/mchairsalonspa_1502651881_1580681008570034057_509340228.jpg", alt: "Balayage highlights women's hair at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1498319355_1544337140031648353_509340228.jpg", alt: "Women's haircut and blowout at MC Hair Salon & Spa NYC" },
  { src: "/instagram/mchairsalonspa_1491509980_1487215965711928298_509340228.jpg", alt: "Color highlights treatment at MC Hair Salon Upper East Side" },
  { src: "/instagram/mchairsalonspa_1487270582_1451653317423658532_509340228.jpg", alt: "Hair blowout and styling at MC Hair Salon & Spa Manhattan" },
  { src: "/instagram/mchairsalonspa_1486233600_1442954483474615008_509340228.jpg", alt: "Precision women's cut at MC Hair Salon Upper East Side NYC" },
  { src: "/instagram/mchairsalonspa_1485020503_1432778286387488313_509340228.jpg", alt: "Special occasion updo at MC Hair Salon & Spa Upper East Side" },
  { src: "/instagram/mchairsalonspa_1468596641_1295004948530311873_509340228.jpg", alt: "Balayage color result at MC Hair Salon Upper East Side NYC" },
];

export const TESTIMONIALS = [
  {
    name: "Jennifer L.",
    rating: 5,
    text: "I've been seeing Kato for almost four years. He genuinely remembers my hair — the texture, what's worked before, what hasn't. Last month I came in wanting a subtle balayage refresh and he nailed it in one session. No brassiness, no damage, grew out beautifully. I've sent three friends here and they're all regulars now.",
    service: "Balayage & Cut",
    date: "March 2025",
  },
  {
    name: "Amanda R.",
    rating: 5,
    text: "Megan fixed a color correction after a botched job from another salon. I honestly wasn't sure it was salvageable. She looked at my hair, explained exactly what she'd do and what to expect, and three hours later I walked out with the color I'd wanted for two years. Uses L'Oréal Inoa — ammonia-free, my scalp was completely fine. Worth every penny.",
    service: "Color Correction",
    date: "January 2025",
  },
  {
    name: "Christine M.",
    rating: 5,
    text: "Booked MC for my wedding party — five people, hair and makeup. Everything ran on schedule (a genuine miracle), Dhariana matched each bridesmaid's skin tone perfectly, and Kato's updo survived a six-hour reception without a single pin falling. My mother-in-law, who is notoriously hard to impress, asked for the team's card before we left.",
    service: "Bridal Party Hair & Makeup",
    date: "October 2024",
  },
];
