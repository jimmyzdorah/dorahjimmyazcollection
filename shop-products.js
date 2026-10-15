
/*
  DORAH JIMMYZ COLLECTION
  DEMONSTRATION PRODUCT CATALOGUE

  Future admin dashboard fields:
  - Product ID
  - Product name
  - Department
  - Category
  - Selling price
  - Daily hire price
  - Sale/hire availability
  - Stock
  - Sizes
  - Colours
  - Images
  - Description
  - Featured status

  Replace demonstration products with real inventory
  before accepting orders.
*/

window.SHOP_PRODUCTS = [
  {
    id: "DJ001",
    name: "Champagne Evening Gown",
    department: "Women",
    category: "Clothing",
    price: 280000,
    hirePrice: 45000,
    forSale: true,
    forHire: true,
    stock: 4,
    sizes: ["S", "M", "L"],
    colors: ["Champagne", "Black"],
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85",
    description: "An elegant flowing evening gown for unforgettable occasions.",
    featured: true
  },
  {
    id: "DJ002",
    name: "Tailored Gentleman Suit",
    department: "Men",
    category: "Clothing",
    price: 420000,
    hirePrice: 65000,
    forSale: true,
    forHire: true,
    stock: 3,
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Navy"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85",
    description: "Refined tailoring with timeless formal appeal.",
    featured: true
  },
  {
    id: "DJ003",
    name: "Little Celebration Dress",
    department: "Children",
    category: "Clothing",
    price: 120000,
    hirePrice: 22000,
    forSale: true,
    forHire: true,
    stock: 5,
    sizes: ["XS", "S", "M"],
    colors: ["Blush", "Ivory"],
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=85",
    description: "A sweet occasion dress for special childhood memories."
  },
  {
    id: "DJ004",
    name: "Gold-Tone Statement Earrings",
    department: "Women",
    category: "Jewellery",
    price: 65000,
    hirePrice: null,
    forSale: true,
    forHire: false,
    stock: 12,
    sizes: ["One Size"],
    colors: ["Gold"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85",
    description: "Sculptural statement earrings with a warm gold finish."
  },
  {
    id: "DJ005",
    name: "Classic Leather Loafers",
    department: "Men",
    category: "Shoes",
    price: 185000,
    hirePrice: null,
    forSale: true,
    forHire: false,
    stock: 6,
    sizes: ["40", "42", "44"],
    colors: ["Brown", "Black"],
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=85",
    description: "Versatile polished loafers for smart everyday dressing."
  },
  {
    id: "DJ006",
    name: "Satin Occasion Heels",
    department: "Women",
    category: "Shoes",
    price: 165000,
    hirePrice: 28000,
    forSale: true,
    forHire: true,
    stock: 5,
    sizes: ["36", "38", "40"],
    colors: ["Nude", "Black"],
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=900&q=85",
    description: "Elegant heels that finish a formal outfit beautifully."
  },
  {
    id: "DJ007",
    name: "Junior Formal Set",
    department: "Children",
    category: "Clothing",
    price: 145000,
    hirePrice: 26000,
    forSale: true,
    forHire: true,
    stock: 4,
    sizes: ["XS", "S", "M"],
    colors: ["Navy", "Cream"],
    image: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=900&q=85",
    description: "A smart coordinated outfit for little gentlemen."
  },
  {
    id: "DJ008",
    name: "Pearl Accent Necklace",
    department: "Women",
    category: "Jewellery",
    price: 95000,
    hirePrice: null,
    forSale: true,
    forHire: false,
    stock: 8,
    sizes: ["One Size"],
    colors: ["Pearl"],
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85",
    description: "A delicate necklace for timeless sophistication."
  },
  {
    id: "DJ009",
    name: "Minimalist Wristwatch",
    department: "Men",
    category: "Jewellery",
    price: 230000,
    hirePrice: null,
    forSale: true,
    forHire: false,
    stock: 3,
    sizes: ["One Size"],
    colors: ["Silver", "Black"],
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85",
    description: "Clean lines and polished detailing for a classic look."
  },
  {
    id: "DJ010",
    name: "Little Occasion Shoes",
    department: "Children",
    category: "Shoes",
    price: 78000,
    hirePrice: null,
    forSale: true,
    forHire: false,
    stock: 7,
    sizes: ["28", "30", "32", "34"],
    colors: ["Black", "White"],
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=85",
    description: "Comfortable smart shoes for celebrations and outings."
  },
  {
    id: "DJ011",
    name: "Emerald Cocktail Dress",
    department: "Women",
    category: "Clothing",
    price: 235000,
    hirePrice: 38000,
    forSale: true,
    forHire: true,
    stock: 2,
    sizes: ["S", "M", "L"],
    colors: ["Emerald"],
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    description: "A sophisticated occasion dress in a rich jewel tone.",
    featured: true
  },
  {
    id: "DJ012",
    name: "Classic White Sneakers",
    department: "Men",
    category: "Shoes",
    price: 140000,
    hirePrice: null,
    forSale: true,
    forHire: false,
    stock: 9,
    sizes: ["40", "42", "44"],
    colors: ["White"],
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85",
    description: "Everyday sneakers with a clean modern silhouette."
  }
];
