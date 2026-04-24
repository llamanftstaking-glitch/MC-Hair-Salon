export const SALON_INFO = {
  name: "MC Hair Salon & Spa",
  tagline: "Upper East Side's Premier Luxury Salon",
  address: "336 East 78th St, New York, NY 10075",
  phone: "(212) 988-5252",
  email: "info@mchairsalon.com",
  instagram: "https://www.instagram.com/mchairsalonspa/",
  facebook: "https://www.facebook.com/mchairsalonandspa/",
  established: 2011,
  hours: [
    { day: "Monday", open: "10:00 AM", close: "5:00 PM" },
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
    items: [
      { name: "Women's Cut & Style", price: 45, description: "Precision cut with blowout finish" },
      { name: "Men's Clip & Cut", price: 30, description: "Classic cut tailored to your style" },
      { name: "Children's Cut (under 7)", price: 20, description: "Gentle cut for our youngest guests" },
      { name: "Girl's Haircut (7–12)", price: 35, description: "Style-forward cuts for young ladies" },
      { name: "Boy's Haircut (7–12)", price: 25, description: "Sharp cuts for growing gentlemen" },
    ],
  },
  {
    category: "Blowouts & Styling",
    icon: "wind",
    items: [
      { name: "Blow Out & Style", price: 33, description: "Full blowout with professional finish" },
      { name: "Blow Out with Iron Work", price: 40, description: "Blowout plus curling or straightening" },
      { name: "Updo & Special Event Styling", price: 75, description: "Weddings, galas, and special occasions" },
    ],
  },
  {
    category: "Color",
    icon: "palette",
    items: [
      { name: "Full Color (L'Oréal Majerel/Inoa)", price: 85, description: "Rich, vibrant full color treatment" },
      { name: "Highlights / Balayage", price: 120, description: "Hand-painted dimensional color" },
      { name: "Corrective Color", price: 200, description: "Expert color correction services" },
      { name: "Hair Treatments", price: 50, description: "Deep conditioning and repair treatments" },
    ],
  },
  {
    category: "Spa Services",
    icon: "sparkles",
    items: [
      { name: "Eyelash Extensions", price: 150, description: "Full, natural-looking lash extensions" },
      { name: "Facial", price: 80, description: "Revitalizing facial treatment" },
    ],
  },
  {
    category: "Makeup",
    icon: "brush",
    items: [
      { name: "Makeup Application", price: 75, description: "Day-to-night glam by our resident makeup artist" },
      { name: "Special Event Makeup", price: 150, description: "Red-carpet ready for galas, parties & milestones" },
      { name: "Bridal Makeup", price: 200, description: "Flawless bridal looks — trial session available" },
      { name: "Airbrush Makeup", price: 125, description: "Ultra-smooth finish, long-wearing formula" },
      { name: "Makeup Lesson (1 hr)", price: 100, description: "Personalized technique coaching, one-on-one" },
    ],
  },
];

export const TEAM = [
  {
    name: "Kato",
    role: "Master Stylist",
    bio: "With over a decade of experience, Kato specializes in precision cuts and advanced color techniques. A client favorite known for attention to detail.",
    specialties: ["Precision Cuts", "Balayage", "Color Correction"],
    image: "/instagram/mchairsalonspa_1550078255_1978522269296608933_509340228.jpg",
  },
  {
    name: "Megan",
    role: "Senior Stylist & Color Expert",
    bio: "Megan brings artistry and technical excellence to every appointment. Her expertise in L'Oréal color systems makes her our go-to for transformational color.",
    specialties: ["Hair Color", "Highlights", "Blowouts"],
    image: "/instagram/mchairsalonspa_1533145637_1836481173825515947_509340228.jpg",
  },
  {
    name: "Sofia",
    role: "Spa Specialist",
    bio: "Sofia creates a serene luxury experience for every guest. Specializing in spa treatments, lash extensions, and makeup artistry.",
    specialties: ["Lash Extensions", "Facials", "Makeup"],
    image: "/instagram/mchairsalonspa_1528578580_1798169924515305526_509340228.jpg",
  },
  {
    name: "Marcus",
    role: "Men's Grooming Expert",
    bio: "Marcus is the Upper East Side's top choice for men's cuts and grooming. Precise, efficient, and always on trend.",
    specialties: ["Men's Cuts", "Fades", "Styling"],
    image: "/instagram/mchairsalonspa_1526678565_1782231439342285913_509340228.jpg",
  },
  {
    name: "Isabella",
    role: "Resident Makeup Artist",
    bio: "Isabella is MC's in-house beauty expert, bringing editorial precision to every look. From subtle everyday glam to showstopping bridal artistry, she tailors every look to your unique features and personal style.",
    specialties: ["Bridal Makeup", "Airbrush", "Special Events", "Makeup Lessons"],
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
}

export const PACKAGES: PackageDef[] = [
  {
    id: "pkg_blowout_5",
    name: "Blowout Bundle",
    tagline: "Your weekly glow, locked in",
    price: 149,
    originalValue: 165,
    sessions: 5,
    services: ["5 × Blow Out & Style"],
    highlight: "Save $16 — perfect for busy New Yorkers",
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
    id: "pkg_glam_3",
    name: "Glam Pack",
    tagline: "Look your best for every occasion",
    price: 199,
    originalValue: 225,
    sessions: 3,
    services: ["3 × Makeup Application by Isabella"],
    highlight: "Save $26 — events, date nights, and more",
    validityDays: 365,
  },
  {
    id: "pkg_bridal_prep",
    name: "Bridal Prep",
    tagline: "Everything you need before the big day",
    price: 449,
    originalValue: 500,
    sessions: 4,
    services: [
      "1 × Bridal Hair Trial",
      "1 × Bridal Updo (wedding day)",
      "1 × Bridal Makeup Trial",
      "1 × Bridal Makeup (wedding day)",
    ],
    highlight: "Save $51 — the complete bridal beauty plan",
    badge: "Most Popular",
    validityDays: 365,
  },
  {
    id: "pkg_full_experience",
    name: "The Full Experience",
    tagline: "Head-to-toe luxury in one package",
    price: 279,
    originalValue: 325,
    sessions: 4,
    services: [
      "1 × Women's Cut & Style",
      "1 × Full Color",
      "1 × Blow Out & Style",
      "1 × Facial",
    ],
    highlight: "Save $46 — the ultimate refresh",
    validityDays: 365,
  },
  {
    id: "pkg_lash_love",
    name: "Lash Love",
    tagline: "Full, lush lashes every month",
    price: 269,
    originalValue: 300,
    sessions: 3,
    services: ["1 × Full Eyelash Extension Set", "2 × Lash Fills"],
    highlight: "Save $31 — always camera-ready",
    validityDays: 180,
  },
  {
    id: "pkg_vip_blowout",
    name: "VIP Year",
    tagline: "A whole year of flawless hair",
    price: 329,
    originalValue: 396,
    sessions: 12,
    services: ["12 × Blow Out & Style (monthly)"],
    highlight: "Save $67 — our best blowout value",
    badge: "Best Value",
    validityDays: 365,
  },
  {
    id: "pkg_wellness",
    name: "Wellness Ritual",
    tagline: "Skincare that transforms",
    price: 210,
    originalValue: 240,
    sessions: 3,
    services: ["3 × Revitalizing Facial"],
    highlight: "Save $30 — glow year-round",
    validityDays: 365,
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
      { name: "Bridal Facial", price: 120, note: "Glow-boosting treatment, 2 weeks before" },
      { name: "Eyelash Extensions (bridal)", price: 150, note: "Full set for a wide-eyed, lush look" },
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
    review: "Isabella's bridal makeup was flawless. We did a trial 6 weeks before and she nailed my vision on the first try. I looked like myself — but the most radiant version. Cannot recommend enough.",
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
  { src: "/instagram/mchairsalonspa_1595346452_2358259426203129087_509340228.jpg", alt: "Makeup artistry by Isabella", label: "Glam" },
  { src: "/instagram/mchairsalonspa_1594335004_2349774783581733215_509340228.jpg", alt: "Special event look", label: "Event" },
  { src: "/instagram/mchairsalonspa_1584025690_2263293995516827575_509340228.jpg", alt: "Bridal makeup", label: "Bridal" },
  { src: "/instagram/mchairsalonspa_1583862336_2261923681251816316_509340228.jpg", alt: "Editorial makeup look", label: "Editorial" },
  { src: "/instagram/mchairsalonspa_1583176666_2256171862533820128_509340228.jpg", alt: "Natural everyday glam", label: "Natural" },
  { src: "/instagram/mchairsalonspa_1581106935_2238809697447493007_509340228.jpg", alt: "Airbrush finish", label: "Airbrush" },
  { src: "/instagram/mchairsalonspa_1579289740_2223565962392628495_509340228.jpg", alt: "Smoky eye look", label: "Glam" },
  { src: "/instagram/mchairsalonspa_1568744468_2135105812317486094_509340228.jpg", alt: "Bold lip and contour", label: "Bold" },
];

export const GALLERY_IMAGES = [
  { src: "/instagram/mchairsalonspa_1774207263_3858649997122708575_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1732646348_3510014434303531709_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1708007392_3303327885522806092_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1672866306_3008543095357388367_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1664479225_2938187155735434916_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1645811757_2781593085253597123_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1618323213_2551002466209372019_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1614205734_2516462548871535754_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1612024016_2498160975418230925_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1605369692_2442340457025232327_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1599674928_2394569313405054579_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1597866646_2379400348672402563_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1595346452_2358259426203129087_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1594335004_2349774783581733215_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1584025690_2263293995516827575_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1583862336_2261923681251816316_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1583176666_2256171862533820128_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1581106935_2238809697447493007_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1579289740_2223565962392628495_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1568744468_2135105812317486094_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1559919918_2061080118428493908_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1553032566_2003304826495864682_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1553032566_2003304826479110483_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1551895791_1993768864262785123_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1550270095_1980131537623873654_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1550078255_1978522269296608933_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1550019410_1978028640350001926_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1549901344_1977038231285177038_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1547565139_1957440724590707010_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1545247659_1938000287139372933_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1545247658_1938000284807356745_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1544907084_1935143342264051954_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1544746741_1933798285762276098_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1539447878_1889348198776309881_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1537975181_1876994322903414349_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1535637640_1857385604482313314_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1534965905_1851750683952556497_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1533159418_1836596778239353805_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1533145639_1836481184940363509_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1533145638_1836481184185441687_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1533145637_1836481173825515947_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1531506312_1822729518219265500_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1531325744_1821214799729933993_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1529625908_1806955543714585334_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1528920371_1801037069880314297_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1528578580_1798169924515305526_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1528478066_1797326749437347128_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1528238192_1795314536774311722_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1527033063_1785205185804273652_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1527033062_1785205176937629694_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1526678565_1782231439342285913_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1524246449_1761829374796274512_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1524246447_1761829357465396670_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1523641819_1756757370506336447_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1523641801_1756757213798938429_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1520467133_1730126170101599113_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1512179175_1660601740579074133_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1511886218_1658144241762478058_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1505510360_1604659664696308889_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1502651881_1580681008570034057_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1498319355_1544337140031648353_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1491509980_1487215965711928298_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1487270582_1451653317423658532_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1486233600_1442954483474615008_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1485020503_1432778286387488313_509340228.jpg", alt: "MC Hair Salon & Spa" },
  { src: "/instagram/mchairsalonspa_1468596641_1295004948530311873_509340228.jpg", alt: "MC Hair Salon & Spa" },
];

export const TESTIMONIALS = [
  {
    name: "Jennifer L.",
    rating: 5,
    text: "Kato is absolutely incredible. I've been coming here for 3 years and always leave looking better than I imagined. The salon has such an elegant atmosphere — truly Upper East Side.",
    service: "Balayage & Cut",
  },
  {
    name: "Amanda R.",
    rating: 5,
    text: "Best color work in all of Manhattan. Megan completely transformed my hair. The team is professional, warm, and the results speak for themselves.",
    service: "Full Color",
  },
  {
    name: "Christine M.",
    rating: 5,
    text: "I had my wedding updo done here and it was absolutely perfect. They also did makeup for my whole bridal party. Cannot recommend enough!",
    service: "Bridal Updo & Makeup",
  },
];
