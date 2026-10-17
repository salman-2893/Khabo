import { Restaurant } from '../types';

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'sultans-dine-dhanmondi',
    name: "Sultan's Dine",
    nameBn: "সুলতান'স ডাইন",
    area: 'Dhanmondi',
    areaBn: 'ধানমন্ডি',
    city: 'Dhaka',
    cityBn: 'ঢাকা',
    address: 'Green Akshay Plaza, 1st Floor, Satmasjid Road, Dhanmondi 10/A',
    addressBn: 'গ্রিন অক্ষয় প্লাজা, ১ম তলা, সাতমসজিদ রোড, ধানমন্ডি ১০/এ',
    coordinates: { lat: 23.7508, lng: 90.3756 },
    cuisine: ['Kacchi Biryani', 'Mughlai', 'Traditional'],
    cuisineBn: ['কাচ্চি বিরিয়ানি', 'মুঘলাই', 'ঐতিহ্যবাহী'],
    budgetTier: 'mid',
    avgPricePerPersonBDT: 490,
    rating: 4.6,
    reviewCount: 14200,
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    ],
    exteriorImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'family_dining',
    vibeBn: 'পারিবারিক ও ভোজনরসিক পরিবেশ',
    photogenicScore: 8.2,
    photographyHighlights: {
      en: 'Warm amber brass chandeliers, royal brass platters, great group feast flat-lays.',
      bn: 'উষ্ণ পিতলের ঝাড়বাতি, কাঁসার রাজকীয় থালা ও রাজকীয় বিরিয়ানি পরিবেশনা যা ছবির জন্য চমৎকার।'
    },
    popularDishes: [
      { name: 'Kacchi Platter with Borhani & Jali Kabab', nameBn: 'কাচ্চি প্ল্যাটার বোরহানি ও জালি কাবাব সহ', priceBDT: 520, isPopular: true },
      { name: 'Mutton Kacchi Half', nameBn: 'খাসির কাচ্চি (হাফ)', priceBDT: 450, isPopular: true },
      { name: 'Chui Jhal Beef', nameBn: 'চুই ঝাল গরুর মাংস', priceBDT: 340, isPopular: false },
      { name: 'Shahi Firni', nameBn: 'শাহী ফিরনি', priceBDT: 80, isPopular: true }
    ],
    offers: [
      {
        id: 'fp-sd-1',
        title: 'Foodpanda 20% Off on Pro Delivery',
        titleBn: 'ফুডপ্যান্ডা প্রো অর্ডারে ২০% ছাড়',
        platform: 'Foodpanda',
        discountText: 'Save up to ৳100 with code PRODINE',
        discountTextBn: 'PRODINE কোড ব্যবহারে ১০০৳ পর্যন্ত ছাড়',
        promoCode: 'PRODINE',
        validUntil: 'Live on Foodpanda'
      },
      {
        id: 'bkash-sd-1',
        title: 'bKash 10% Cashback on Payment',
        titleBn: 'বিকাশ পেমেন্টে ১০% ক্যাশব্যাক',
        platform: 'bKash',
        discountText: 'Instant 10% cashback (up to ৳100)',
        discountTextBn: 'সর্বোচ্চ ১০০৳ পর্যন্ত ক্যাশব্যাক',
        validUntil: 'End of Month'
      }
    ],
    reviews: [
      { user: 'Tanvir Hossain', rating: 5, text: 'Tender mutton, perfectly balanced saffron rice and aalu that melts in mouth!', textBn: 'নরম তুলতুলে খাসির মাংস, জাফরানের সুবাস আর মুখে মেল্ট হওয়া আলু!', source: 'Google Maps' },
      { user: 'Nusrat Jahan', rating: 4.5, text: 'The Dhanmondi branch is spacious. Best value kacchi platter in Dhaka.', textBn: 'ধানমন্ডি ব্রাঞ্চ বেশ খোলামেলা। কাচ্চির স্বাদ সবসময় সেরা।', source: 'Foodies Community' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Sultans+Dine+Dhanmondi',
    foodpandaUrl: 'https://www.foodpanda.com.bd/restaurant/s8pk/sultans-dine',
    openingHours: '12:00 PM - 10:30 PM',
    isOwnerVerified: true
  },
  {
    id: 'woodhouse-grill-banani',
    name: 'Woodhouse Grill',
    nameBn: 'উডহাউস গ্রিল',
    area: 'Banani',
    areaBn: 'বনানী',
    city: 'Dhaka',
    cityBn: 'ঢাকা',
    address: 'House 42, Road 11, Block C, Banani',
    addressBn: 'বাড়ি ৪২, রোড ১১, ব্লক সি, বনানী',
    coordinates: { lat: 23.7937, lng: 90.4048 },
    cuisine: ['Steaks', 'Gourmet Burgers', 'Continental'],
    cuisineBn: ['স্টেক', 'বার্গার', 'কন্টিনেন্টাল'],
    budgetTier: 'luxury',
    avgPricePerPersonBDT: 1650,
    rating: 4.7,
    reviewCount: 3800,
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
    ],
    exteriorImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'aesthetic_interior',
    vibeBn: 'রাস্টিক কাঠের ইন্টেরিয়র ও নান্দনিক আলো',
    photogenicScore: 9.6,
    photographyHighlights: {
      en: 'Dark wood brick textures, neon steak signs, dramatic mood lighting perfect for portraits and food photography.',
      bn: 'ডার্ক উডেন টেক্সচার, ব্রিক ওয়াল এবং মুডি সিনেমাটিক আলো যা পোর্ট্রেট এবং ইনস্টাগ্রাম ছবির জন্য অতুলনীয়।'
    },
    popularDishes: [
      { name: 'Ribeye Steak with Truffle Mash', nameBn: 'রিবআই স্টেক ও ট্রাফেল ম্যাশ', priceBDT: 1850, isPopular: true },
      { name: 'Smoked Brisket Burger', nameBn: 'স্মোকড ব্রিসকেট বার্গার', priceBDT: 780, isPopular: true },
      { name: 'Loaded Beef Nachos', nameBn: 'লোডেড বিফ নাচোস', priceBDT: 590, isPopular: false }
    ],
    offers: [
      {
        id: 'card-wg-1',
        title: 'City Bank AMEX 15% Discount',
        titleBn: 'সিটি ব্যাংক অ্যামেক্স কার্ডে ১৫% ছাড়',
        platform: 'Bank Card',
        discountText: '15% instant discount on dinner bill',
        discountTextBn: 'ডিনারে ১৫% ইনস্ট্যান্ট ছাড়'
      }
    ],
    reviews: [
      { user: 'Sabbir Ahmed', rating: 5, text: 'The best steakhouse in Banani without question. Vibe is 10/10.', textBn: 'বনানীর অন্যতম সেরা স্টেকহাউস। পরিবেশ ও খাবার দুটিই অসাধারণ।', source: 'Google Maps' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Woodhouse+Grill+Banani',
    foodpandaUrl: 'https://www.foodpanda.com.bd',
    openingHours: '1:00 PM - 11:30 PM',
    isOwnerVerified: true
  },
  {
    id: 'crimson-cup-gulshan',
    name: 'Crimson Cup Coffee & Tea',
    nameBn: 'ক্রিমসন কাপ কফি ও টি',
    area: 'Gulshan 2',
    areaBn: 'গুলশান ২',
    city: 'Dhaka',
    cityBn: 'ঢাকা',
    address: 'House 14, Road 53, Gulshan 2',
    addressBn: 'বাড়ি ১৪, রোড ৫৩, গুলশান ২',
    coordinates: { lat: 23.7949, lng: 90.4137 },
    cuisine: ['Specialty Coffee', 'Bakery', 'Light Bites'],
    cuisineBn: ['স্পেশালিটি কফি', 'বেকন ও পেস্ট্রি', 'হালকা নাস্তা'],
    budgetTier: 'budget',
    avgPricePerPersonBDT: 450,
    rating: 4.5,
    reviewCount: 5200,
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80'
    ],
    exteriorImages: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'cozy_cafe',
    vibeBn: 'শান্ত ও নিরিবিলি আড্ডা ও ল্যাপটপ ফ্রেন্ডলি',
    photogenicScore: 9.3,
    photographyHighlights: {
      en: 'Sunlit floor-to-ceiling glass windows, red brick walls, pristine latte art and comfortable reading corners.',
      bn: 'প্রচুর প্রাকৃতিক আলো, গ্লাস উইন্ডো, নান্দনিক ল্যাটে আর্ট ও পড়াশোনা বা ছবির জন্য স্নিগ্ধ কোণ।'
    },
    popularDishes: [
      { name: 'Mocha Caramel Freddo', nameBn: 'মোকা ক্যারামেল ফ্রেডো', priceBDT: 480, isPopular: true },
      { name: 'Spanish Latte', nameBn: 'স্প্যানিশ ল্যাটে', priceBDT: 420, isPopular: true },
      { name: 'Smoked Chicken Croissant', nameBn: 'স্মোকড চিকেন ক্রসোয়াঁ', priceBDT: 380, isPopular: false }
    ],
    offers: [
      {
        id: 'student-cc-1',
        title: 'Student ID Card 10% Off',
        titleBn: 'স্টুডেন্ট আইডি কার্ড দেখালে ১০% ছাড়',
        platform: 'Student',
        discountText: 'Valid on beverages from 2 PM to 6 PM weekdays',
        discountTextBn: 'সপ্তাহের কার্যদিবসে দুপুর ২টা - সন্ধ্যা ৬টা'
      }
    ],
    reviews: [
      { user: 'Farhana Yasmin', rating: 5, text: 'Peaceful ambience and the barista knows proper coffee brewing.', textBn: 'শান্ত পরিবেশ এবং ঢাকা শহরের অন্যতম সেরা কফি।', source: 'Google Maps' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Crimson+Cup+Gulshan',
    foodpandaUrl: 'https://www.foodpanda.com.bd',
    openingHours: '8:00 AM - 11:30 PM'
  },
  {
    id: 'shad-tehari-puran-dhaka',
    name: 'Shad Tehari Ghar',
    nameBn: 'স্বাদ তেহারি ঘর',
    area: 'Old Dhaka',
    areaBn: 'পুরান ঢাকা',
    city: 'Dhaka',
    cityBn: 'ঢাকা',
    address: 'Lalbagh Road, Near Lalbagh Fort, Puran Dhaka',
    addressBn: 'লালবাগ রোড, লালবাগ কেল্লার কাছে, পুরান ঢাকা',
    coordinates: { lat: 23.7196, lng: 90.3881 },
    cuisine: ['Mustard Oil Beef Tehari', 'Old Dhaka Traditional'],
    cuisineBn: ['সরিষার তেলের বিফ তেহারি', 'পুরান ঢাকার ঐতিহ্য'],
    budgetTier: 'street',
    avgPricePerPersonBDT: 180,
    rating: 4.8,
    reviewCount: 9600,
    coverImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'heritage',
    vibeBn: 'ঐতিহাসিক পুরান ঢাকা আড্ডা ও খাঁটি ভোজন',
    photogenicScore: 8.5,
    photographyHighlights: {
      en: 'Historic Old Dhaka neighborhood vibe right beside Lalbagh Fort. Steaming brass degh photos with green chilies.',
      bn: 'লালবাগ কেল্লার পাশে ঐতিহাসিক অনুভূতি। বাষ্প ওঠা বড় ডেকচি, কাঁচা মরিচ ও সরিষার তেলের চকচকে চালের দুর্দান্ত দৃশ্য।'
    },
    popularDishes: [
      { name: 'Special Mustard Oil Beef Tehari', nameBn: 'স্পেশাল সরিষার তেলের বিফ তেহারি', priceBDT: 180, isPopular: true },
      { name: 'Special Borhani (Clay Pot)', nameBn: 'মাটির পাত্রে স্পেশাল বোরহানি', priceBDT: 60, isPopular: true },
      { name: 'Peyaj-Kacha Morich Sholuk Salad', nameBn: 'পেঁয়াজ-কাঁচামরিচ সালাদ', priceBDT: 20, isPopular: false }
    ],
    offers: [
      {
        id: 'fp-st-1',
        title: 'Foodpanda ৳50 Off First Order',
        titleBn: 'ফুডপ্যান্ডা প্রথম অর্ডারে ৫০৳ ছাড়',
        platform: 'Foodpanda',
        discountText: 'Use voucher TEHARI50',
        discountTextBn: 'TEHARI50 ভাউচার কোড',
        promoCode: 'TEHARI50'
      }
    ],
    reviews: [
      { user: 'Rafid Al Masud', rating: 5, text: 'Real mustard oil aroma, soft beef pieces and pure Old Dhaka nostalgic taste.', textBn: 'খাঁটি ঝাঁঝালো সরিষার তেল ও নরম মাংস, লালবাগের সেরা তেহারি!', source: 'Foodpanda' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Shad+Tehari+Lalbagh',
    foodpandaUrl: 'https://www.foodpanda.com.bd',
    openingHours: '11:00 AM - 11:00 PM'
  },
  {
    id: 'the-sky-lounge-rooftop-gulshan',
    name: 'Cloud 9 Rooftop & Lounge',
    nameBn: 'ক্লাউড ৯ রুফটপ ও লাউঞ্জ',
    area: 'Gulshan 1',
    areaBn: 'গুলশান ১',
    city: 'Dhaka',
    cityBn: 'ঢাকা',
    address: 'Navana Tower, 21st Floor, Gulshan 1 Avenue',
    addressBn: 'নাভানা টাওয়ার, ২১তম তলা, গুলশান ১ এভিনিউ',
    coordinates: { lat: 23.7785, lng: 90.4182 },
    cuisine: ['Fusion BBQ', 'Mocktails', 'Continental Pasta'],
    cuisineBn: ['ফিউশন বিবিকিউ', 'মকটেল', 'কন্টিনেন্টাল পাস্তা'],
    budgetTier: 'luxury',
    avgPricePerPersonBDT: 1400,
    rating: 4.6,
    reviewCount: 4100,
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&auto=format&fit=crop&q=80'
    ],
    exteriorImages: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'rooftop',
    vibeBn: 'মনোরম রুফটপ ভিউ ও ঢাকা শহরের স্কাইলাইন',
    photogenicScore: 9.9,
    photographyHighlights: {
      en: 'Breathtaking 360-degree sunset and night skyline of Hatirjheel and Gulshan. Fairy lights and glass railing photography spots.',
      bn: 'হাতিরঝিল ও গুলশান স্কাইলাইনের ৩৬০ ডিগ্রি সূর্যাস্ত ও রাতের দৃশ্য। কাঁচের রেলিং ও ফেয়ারি লাইটের দারুণ ফটোস্পট।'
    },
    popularDishes: [
      { name: 'Peri Peri Grilled Chicken Sizzler', nameBn: 'পেরি পেরি গ্রিল চিকেন সিজলার', priceBDT: 680, isPopular: true },
      { name: 'Sunset Tropical Mojito Mocktail', nameBn: 'সানসেট ট্রপিক্যাল মজিটো', priceBDT: 380, isPopular: true },
      { name: 'Creamy Fettuccine Alfredo', nameBn: 'ক্রিমি ফেতুচিনি আলফ্রেডো', priceBDT: 620, isPopular: false }
    ],
    offers: [
      {
        id: 'inhouse-c9-1',
        title: 'Sunset Hour 20% Off Mocktails (5 PM - 7 PM)',
        titleBn: 'সানসেট আওয়ারে মকটেলে ২০% ছাড় (বিকাল ৫টা - সন্ধ্যা ৭টা)',
        platform: 'In-house',
        discountText: 'Special evening photography discount',
        discountTextBn: 'সন্ধ্যাবেলার বিশেষ অফার'
      }
    ],
    reviews: [
      { user: 'Mehnaz Chowdhury', rating: 5, text: 'The sunset view over Dhaka is unmatched. Best place for birthday and couple photos.', textBn: 'ঢাকার সূর্যাস্তের দৃশ্য দেখার সেরা জায়গা। ছবির জন্য একদম পারফেক্ট।', source: 'Google Maps' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Cloud+9+Rooftop+Gulshan',
    foodpandaUrl: 'https://www.foodpanda.com.bd',
    openingHours: '4:30 PM - 12:00 AM'
  },
  {
    id: 'takeout-dhanmondi',
    name: 'Takeout',
    nameBn: 'টেকআউট',
    area: 'Dhanmondi',
    areaBn: 'ধানমন্ডি',
    city: 'Dhaka',
    cityBn: 'ঢাকা',
    address: 'Plot 7A, Satmasjid Road, Dhanmondi',
    addressBn: 'প্লট ৭এ, সাতমসজিদ রোড, ধানমন্ডি',
    coordinates: { lat: 23.7482, lng: 90.3742 },
    cuisine: ['Burgers', 'Fries', 'Fast Food'],
    cuisineBn: ['বার্গার', 'ফ্রাইস', 'ফাস্ট ফুড'],
    budgetTier: 'budget',
    avgPricePerPersonBDT: 380,
    rating: 4.6,
    reviewCount: 16500,
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'cozy_cafe',
    vibeBn: 'ইয়ুথ আড্ডা ও ফাস্ট ক্যাজুয়াল ফুড',
    photogenicScore: 8.4,
    photographyHighlights: {
      en: 'Neon burger art, vibrant urban street dining graphics, towering burger cross-section shots.',
      bn: 'নিয়ন আর্ট ও সিগনেচার বার্গারের চিজি লেয়ারের ছবি তোলার উপযোগী পরিবেশ।'
    },
    popularDishes: [
      { name: 'Beef Cheese Delight Burger', nameBn: 'বিফ চিজ ডিলাইট বার্গার', priceBDT: 370, isPopular: true },
      { name: 'Original Beef Gourmet', nameBn: 'অরিজিনাল বিফ গুরমে বার্গার', priceBDT: 320, isPopular: true },
      { name: 'Crispy Curly Fries with Garlic Mayo', nameBn: 'গার্লিক মেয়ো সহ কার্লি ফ্রাইস', priceBDT: 190, isPopular: false }
    ],
    offers: [
      {
        id: 'fp-to-1',
        title: 'Foodpanda 15% Off Combo Meals',
        titleBn: 'ফুডপ্যান্ডা কম্বো মিলে ১৫% ছাড়',
        platform: 'Foodpanda',
        discountText: 'Code: TAKEOUTMEAL',
        discountTextBn: 'কোড: TAKEOUTMEAL',
        promoCode: 'TAKEOUTMEAL'
      }
    ],
    reviews: [
      { user: 'Sadman Sakib', rating: 5, text: 'Still the benchmark for Dhaka beef burgers! Patty is extremely juicy.', textBn: 'ঢাকার বার্গারের মান এখনও এদের চেয়ে ভালো পাওয়া কঠিন। জুসি প্যাটি!', source: 'Google Maps' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Takeout+Dhanmondi',
    foodpandaUrl: 'https://www.foodpanda.com.bd/restaurant/s7ta/takeout',
    openingHours: '12:00 PM - 11:00 PM',
    isOwnerVerified: true
  },
  {
    id: 'cafe-soi3-dhanmondi',
    name: 'Cafe Soi3 (সৈকত ৩)',
    nameBn: 'ক্যাফে সই ৩',
    area: 'Dhanmondi',
    areaBn: 'ধানমন্ডি',
    city: 'Dhaka',
    cityBn: 'ঢাকা',
    address: 'House 4, Road 3, Dhanmondi R/A',
    addressBn: 'বাড়ি ৪, রোড ৩, ধানমন্ডি আ/এ',
    coordinates: { lat: 23.7412, lng: 90.3821 },
    cuisine: ['Bengali Fusion', 'Tea & Snacks', 'Kebabs'],
    cuisineBn: ['বাঙালি ফিউশন', 'চা ও নাস্তা', 'কাবাব'],
    budgetTier: 'budget',
    avgPricePerPersonBDT: 320,
    rating: 4.5,
    reviewCount: 7800,
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
    ],
    exteriorImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'garden_outdoor',
    vibeBn: 'সবুজ বাগান ও খোলা আকাশের নিচে আড্ডা',
    photogenicScore: 9.5,
    photographyHighlights: {
      en: 'Lush tropical trees, terracotta clay accents, lantern lighting and breezy courtyard garden photoshoot spot.',
      bn: 'সবুজ গাছপালা, মাটির টেরাকোটা ও লণ্ঠনের মায়াবী আলো—ফটোগ্রাফির জন্য ধানমন্ডির অন্যতম প্রিয় প্রাঙ্গণ।'
    },
    popularDishes: [
      { name: 'Khashi Bhuna Khichuri', nameBn: 'খাসি ভুনা খিচুড়ি', priceBDT: 380, isPopular: true },
      { name: 'Matir Haari Special Masala Cha', nameBn: 'মাটির হাঁড়ির স্পেশাল মশলা চা', priceBDT: 60, isPopular: true },
      { name: 'Chicken Boti Kebab with Paratha', nameBn: 'চিকেন বটি কাবাব ও পরোটা', priceBDT: 290, isPopular: false }
    ],
    offers: [
      {
        id: 'nagad-soi3-1',
        title: 'Nagad 10% Cashback',
        titleBn: 'নগদ ১০% ক্যাশব্যাক',
        platform: 'Nagad',
        discountText: 'Scan QR at counter',
        discountTextBn: 'কাউন্টারে কিউআর স্ক্যানে ক্যাশব্যাক'
      }
    ],
    reviews: [
      { user: 'Nazmul Haque', rating: 5, text: 'Serene garden atmosphere inside busy Dhanmondi. Evening tea here is therapeutic.', textBn: 'ধানমন্ডির মাঝেও সুন্দর নিরিবিলি বাগানের ছোঁয়া। সন্ধ্যার চা দারুণ।', source: 'Google Maps' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Cafe+Soi3+Dhanmondi',
    openingHours: '11:00 AM - 11:00 PM'
  },
  {
    id: 'panshi-restaurant-sylhet',
    name: 'Panshi Restaurant',
    nameBn: 'পানসী রেস্টুরেন্ট',
    area: 'Zindabazar',
    areaBn: 'জিন্দাবাজার',
    city: 'Sylhet',
    cityBn: 'সিলেট',
    address: 'Jail Road, Zindabazar, Sylhet',
    addressBn: 'জেল রোড, জিন্দাবাজার, সিলেট',
    coordinates: { lat: 24.8949, lng: 91.8687 },
    cuisine: ['Traditional Bengali', '30+ Varieties of Vorta', 'Duck Curry', 'Fish Curries'],
    cuisineBn: ['ঐতিহ্যবাহী বাঙালি খানা', '৩০ রকমের ভর্তা', 'হাঁসের মাংস', 'মাছের পদ'],
    budgetTier: 'street',
    avgPricePerPersonBDT: 250,
    rating: 4.8,
    reviewCount: 22000,
    coverImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'heritage',
    vibeBn: 'ঐতিহাসিক সিলেটি খানা ও ভর্তার মেলা',
    photogenicScore: 8.8,
    photographyHighlights: {
      en: 'Vibrant rainbow table spreads of 15+ colorful clay bowls of vortas (shutki, chitol, begun, dim) and fragrant aromatic rice.',
      bn: 'মাটির বাটিতে রঙিন ভর্তার পসরা—কালিজিরা, শুঁটকি, সরিষা ইলিশ ও হাঁসের মাংসের চমৎকার সমাহার।'
    },
    popularDishes: [
      { name: 'Assorted Vorta Platter (8 Items)', nameBn: 'নানা পদের ভর্তা থালি (৮ পদ)', priceBDT: 160, isPopular: true },
      { name: 'Sylheti Duck Curry (Haash Bhuna)', nameBn: 'সিলেটি হাঁস ভুনা', priceBDT: 260, isPopular: true },
      { name: 'Khashir Akhni Polao', nameBn: 'খাসির আখনি পোলাও', priceBDT: 240, isPopular: true }
    ],
    offers: [
      {
        id: 'fp-panshi-1',
        title: 'Foodpanda Free Delivery in Sylhet',
        titleBn: 'সিলেট শহরে ফুডপ্যান্ডা ফ্রি ডেলিভারি',
        platform: 'Foodpanda',
        discountText: 'On orders above ৳300',
        discountTextBn: '৩০০৳ এর বেশি অর্ডারে'
      }
    ],
    reviews: [
      { user: 'Dr. Shahriar Kabir', rating: 5, text: 'Must visit whenever you go to Sylhet. Authentic, fresh and unbelievable value.', textBn: 'সিলেটে গেলে পানসীতে না খেলে ভ্রমণ অপূর্ণ থাকে। অসাধারণ স্বাদ!', source: 'Google Maps' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Panshi+Restaurant+Sylhet',
    foodpandaUrl: 'https://www.foodpanda.com.bd',
    openingHours: '6:00 AM - 2:00 AM',
    isOwnerVerified: true
  },
  {
    id: 'barcode-cafe-chittagong',
    name: 'Barcode Cafe',
    nameBn: 'বারকোড ক্যাফে',
    area: 'GEC Circle',
    areaBn: 'জিইসি মোড়',
    city: 'Chattogram',
    cityBn: 'চট্টগ্রাম',
    address: 'GEC Circle, CDA Avenue, Chattogram',
    addressBn: 'জিইসি মোড়, সিডিএ এভিনিউ, চট্টগ্রাম',
    coordinates: { lat: 22.3585, lng: 91.8217 },
    cuisine: ['Italian', 'Continental', 'Burgers & Shakes'],
    cuisineBn: ['ইতালিয়ান', 'কন্টিনেন্টাল', 'বার্গার ও শেকস'],
    budgetTier: 'mid',
    avgPricePerPersonBDT: 650,
    rating: 4.6,
    reviewCount: 6500,
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'aesthetic_interior',
    vibeBn: 'চট্টগ্রামের ঐতিহ্যবাহী আধুনিক ক্যাফে',
    photogenicScore: 9.4,
    photographyHighlights: {
      en: 'Vintage motorcycle installations, barcode industrial art, warm filament bulbs and artistic rustic walls.',
      bn: 'ভিন্টেজ মোটরসাইকেল ডেকোর, ইন্ডাস্ট্রিয়াল আর্ট ও ফিলামেন্ট বাল্বের চোখজুড়ানো আলোর ছটা।'
    },
    popularDishes: [
      { name: 'Barcode Special Monster Burger', nameBn: 'বারকোড স্পেশাল মনস্টার বার্গার', priceBDT: 490, isPopular: true },
      { name: 'Four Cheese Thin Crust Pizza', nameBn: 'ফোর চিজ থিন ক্রাস্ট পিৎজা', priceBDT: 750, isPopular: true },
      { name: 'Nutella Brownie Blast Shake', nameBn: 'নুটেলা ব্রাউনি ব্লাস্ট শেক', priceBDT: 340, isPopular: false }
    ],
    offers: [
      {
        id: 'fp-bc-1',
        title: 'Foodpanda 20% Dine-in Voucher',
        titleBn: 'ফুডপ্যান্ডা ডাইন-ইন ভাউচারে ২০% ছাড়',
        platform: 'Foodpanda',
        discountText: 'Use voucher CTGFOOD',
        discountTextBn: 'CTGFOOD ভাউচারে ডাইন-ইন ছাড়',
        promoCode: 'CTGFOOD'
      }
    ],
    reviews: [
      { user: 'Ishrat Ara', rating: 5, text: 'Iconic cafe in Chittagong. Perfect for friendly hangout and great food.', textBn: 'চট্টগ্রামের আইকনিক ক্যাফে। খাবার ও আড্ডার চমৎকার পরিবেশ।', source: 'Google Maps' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Barcode+Cafe+Chittagong',
    foodpandaUrl: 'https://www.foodpanda.com.bd',
    openingHours: '11:00 AM - 11:30 PM',
    isOwnerVerified: true
  },
  {
    id: 'grand-nawab-old-dhaka',
    name: 'Grand Nawab',
    nameBn: 'গ্র্যান্ড নবাব',
    area: 'Old Dhaka',
    areaBn: 'পুরান ঢাকা',
    city: 'Dhaka',
    cityBn: 'ঢাকা',
    address: 'Near Star Mosque, Armanitola, Old Dhaka',
    addressBn: 'তারা মসজিদের কাছে, আরমানিটোলা, পুরান ঢাকা',
    coordinates: { lat: 23.7161, lng: 90.4042 },
    cuisine: ['Mughlai', 'Morog Polao', 'Kacchi', 'Shahi Tukra'],
    cuisineBn: ['মুঘলাই', 'মোরগ পোলাও', 'কাচ্চি', 'শাহী টুকরা'],
    budgetTier: 'budget',
    avgPricePerPersonBDT: 360,
    rating: 4.7,
    reviewCount: 8400,
    coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'heritage',
    vibeBn: 'নবাবী ঐতিহ্য ও খাঁটি পুরনো ঢাকার আভিজাত্য',
    photogenicScore: 9.1,
    photographyHighlights: {
      en: 'Nawabi arched mirrors, traditional copper surahi pots, vibrant biryani platters with golden boiled eggs.',
      bn: 'নবাবী খিলান, ঐতিহ্যবাহী তামার সুরাহী এবং লালচে-সোনালি ডিম ও মাংসের নবাবী থালা।'
    },
    popularDishes: [
      { name: 'Nawabi Morog Polao with Dim', nameBn: 'নবাবী মোরগ পোলাও ডিম সহ', priceBDT: 340, isPopular: true },
      { name: 'Shahi Kacchi Biryani Full', nameBn: 'শাহী কাচ্চি বিরিয়ানি ফুল', priceBDT: 420, isPopular: true },
      { name: 'Kesar Shahi Tukra', nameBn: 'কেশর শাহী টুকরা', priceBDT: 110, isPopular: false }
    ],
    offers: [
      {
        id: 'bkash-gn-1',
        title: 'bKash ৳50 Instant Cashback',
        titleBn: 'বিকাশ ৫০৳ ক্যাশব্যাক',
        platform: 'bKash',
        discountText: 'On min spend ৳500',
        discountTextBn: 'ন্যূনতম ৫০০৳ বিল পরিশোধে'
      }
    ],
    reviews: [
      { user: 'Zubair Rahman', rating: 5, text: 'The morog polao is rich, aromatic and reminds you of traditional Dhaka weddings.', textBn: 'মোরগ পোলাওয়ের সুবাস ও ঘিয়ের গন্ধ একদম পুরনো ঢাকার বিয়ের মতো!', source: 'Google Maps' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Grand+Nawab+Old+Dhaka',
    foodpandaUrl: 'https://www.foodpanda.com.bd',
    openingHours: '12:00 PM - 11:00 PM'
  },
  {
    id: 'meraki-gulshan-patio',
    name: 'Meraki Dhaka',
    nameBn: 'ম্যারাকি ঢাকা',
    area: 'Gulshan 2',
    areaBn: 'গুলশান ২',
    city: 'Dhaka',
    cityBn: 'ঢাকা',
    address: 'House 18, Road 113, Gulshan 2',
    addressBn: 'বাড়ি ১৮, রোড ১১৩, গুলশান ২',
    coordinates: { lat: 23.7924, lng: 90.4191 },
    cuisine: ['Mediterranean', 'European Steak', 'Fine Dining'],
    cuisineBn: ['ভূমধ্যসাগরীয়', 'ইউরোপীয় স্টেক', 'ফাইন ডাইনিং'],
    budgetTier: 'luxury',
    avgPricePerPersonBDT: 1950,
    rating: 4.8,
    reviewCount: 3100,
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80'
    ],
    exteriorImages: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'aesthetic_interior',
    vibeBn: 'লাক্সারি অন্দরমহল ও রোমান্টিক ডিনার স্পট',
    photogenicScore: 9.8,
    photographyHighlights: {
      en: 'Fairy-lit glass greenhouse patio, marble dining tables, cascading hanging greenery for bridal or fashion shoots.',
      bn: 'কাঁচের গ্রিনহাউস ছাদ, মার্বেল টেবিল, ঝুলন্ত সবুজ লতাপাতা ও নিখুঁত রোমান্টিক আলোকসজ্জা।'
    },
    popularDishes: [
      { name: 'Tenderloin Steak with Herb Butter', nameBn: 'টেন্ডারলয়েন স্টেক হার্ব বাটার সহ', priceBDT: 2150, isPopular: true },
      { name: 'Grilled Norwegian Salmon', nameBn: 'গ্রিলড নরওয়েজিয়ান স্যামন', priceBDT: 2350, isPopular: true },
      { name: 'Molten Belgian Chocolate Cake', nameBn: 'মোল্টেন বেলজিয়ান চকোলেট কেক', priceBDT: 650, isPopular: false }
    ],
    offers: [
      {
        id: 'card-mrk-1',
        title: 'Standard Chartered & BRAC Bank 15% Off',
        titleBn: 'স্ট্যান্ডার্ড চার্টার্ড ও ব্র্যাক ব্যাংকে ১৫% ছাড়',
        platform: 'Bank Card',
        discountText: 'Signature cardholder privilege',
        discountTextBn: 'সিগনেচার ও প্লাটিনাম কার্ডধারীদের জন্য'
      }
    ],
    reviews: [
      { user: 'Samia Faruk', rating: 5, text: 'Top tier aesthetics in Bangladesh. The ambiance made our anniversary unforgettable.', textBn: 'ঢাকার সবচেয়ে নান্দনিক ফাইন ডাইনিং স্পট। খাবারের মান অসাধারণ।', source: 'Google Maps' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Meraki+Gulshan',
    foodpandaUrl: 'https://www.foodpanda.com.bd',
    openingHours: '12:30 PM - 11:30 PM'
  },
  {
    id: 'chillox-uttara',
    name: 'Chillox',
    nameBn: 'চিলক্স',
    area: 'Uttara',
    areaBn: 'উত্তরা',
    city: 'Dhaka',
    cityBn: 'ঢাকা',
    address: 'Sector 3, Rabindra Sarani, Uttara',
    addressBn: 'সেক্টর ৩, রবীন্দ্র সরণি, উত্তরা',
    coordinates: { lat: 23.8681, lng: 90.3986 },
    cuisine: ['Naga Burgers', 'Smash Burgers', 'Wings'],
    cuisineBn: ['নাগা বার্গার', 'স্ম্যাশ বার্গার', 'চিকেন উইংস'],
    budgetTier: 'budget',
    avgPricePerPersonBDT: 340,
    rating: 4.5,
    reviewCount: 11500,
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=80',
    interiorImages: [
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80'
    ],
    vibe: 'cozy_cafe',
    vibeBn: 'ঝালপ্রেমী তরুণদের প্রাণবন্ত আড্ডা',
    photogenicScore: 8.6,
    photographyHighlights: {
      en: 'Graffiti mural walls, signature neon lighting, messy dripping cheese and naga sauce burger closeups.',
      bn: 'গ্রাফিতি দেয়াল, রঙিন স্ট্রিট ভাইব ও উপচে পড়া চিজ ও ঝাল নাগা সসের আকর্ষণীয় ফুড ফটো।'
    },
    popularDishes: [
      { name: 'Double Naga Beef Burger with Cheese', nameBn: 'ডাবল নাগা বিফ বার্গার চিজ সহ', priceBDT: 390, isPopular: true },
      { name: 'Crispy Strips with Smoky Mayo', nameBn: 'স্মোকি মেয়ো সহ ক্রিস্পি স্ট্রিপস', priceBDT: 230, isPopular: false },
      { name: 'Smash Burger Supreme', nameBn: 'স্ম্যাশ বার্গার সুপ্রিম', priceBDT: 360, isPopular: true }
    ],
    offers: [
      {
        id: 'fp-cx-1',
        title: 'Foodpanda 20% Off Everyday Combo',
        titleBn: 'ফুডপ্যান্ডায় ২০% অফ কম্বো',
        platform: 'Foodpanda',
        discountText: 'Code: CHILLOX20',
        discountTextBn: 'কোড: CHILLOX20',
        promoCode: 'CHILLOX20'
      }
    ],
    reviews: [
      { user: 'Imran Nazir', rating: 4.5, text: 'If you can handle authentic spicy Bangladeshi Naga pepper, this is heaven!', textBn: 'আসল নাগার ঝাল যারা পছন্দ করেন তাদের জন্য সেরা বার্গার জয়েন্ট!', source: 'Foodies Community' }
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Chillox+Uttara',
    foodpandaUrl: 'https://www.foodpanda.com.bd',
    openingHours: '12:00 PM - 11:30 PM'
  }
];
