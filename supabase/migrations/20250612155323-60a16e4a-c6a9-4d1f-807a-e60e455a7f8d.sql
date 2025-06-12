
-- Update the beauty template with expanded content and additional pages
UPDATE templates 
SET template_data = '{
  "content": [
    {
      "id": "navbar-1",
      "type": "navbar",
      "content": "",
      "props": {
        "siteName": "GLOW ESSENTIALS",
        "links": [
          {"text": "Home", "url": "#"},
          {"text": "Shop", "url": "#shop"},
          {"text": "Skincare", "url": "#skincare"},
          {"text": "Makeup", "url": "#makeup"},
          {"text": "About", "url": "#about"}
        ],
        "variant": "minimal"
      }
    },
    {
      "id": "hero-1",
      "type": "hero",
      "content": "",
      "props": {
        "title": "Natural Beauty Redefined",
        "subtitle": "Discover our clean beauty collection made with sustainable ingredients",
        "buttonText": "Shop Collection",
        "buttonLink": "#products",
        "alignment": "center",
        "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1480&auto=format&fit=crop",
        "overlay": true,
        "height": "large"
      }
    },
    {
      "id": "section-1",
      "type": "section",
      "content": "",
      "props": {
        "padding": "large",
        "backgroundColor": "bg-white"
      },
      "children": [
        {
          "id": "heading-1",
          "type": "heading",
          "content": "Bestsellers",
          "props": {
            "level": "h2",
            "className": "text-4xl font-light text-center mb-12"
          }
        },
        {
          "id": "products-1",
          "type": "productsList",
          "content": "",
          "props": {
            "columns": 4,
            "productsPerPage": 4,
            "showPagination": false,
            "cardStyle": "minimal"
          }
        }
      ]
    },
    {
      "id": "section-2",
      "type": "section",
      "content": "",
      "props": {
        "padding": "large",
        "backgroundColor": "bg-pink-50"
      },
      "children": [
        {
          "id": "heading-2",
          "type": "heading",
          "content": "Why Choose Glow Essentials",
          "props": {
            "level": "h2",
            "className": "text-4xl font-light text-center mb-16"
          }
        },
        {
          "id": "grid-1",
          "type": "grid",
          "content": "",
          "props": {
            "columns": 3,
            "gap": "gap-8"
          },
          "children": [
            {
              "id": "feature-1",
              "type": "feature",
              "content": "",
              "props": {
                "icon": "leaf",
                "title": "Clean Ingredients",
                "description": "All products made with natural, organic ingredients"
              }
            },
            {
              "id": "feature-2",
              "type": "feature",
              "content": "",
              "props": {
                "icon": "heart",
                "title": "Cruelty Free",
                "description": "Never tested on animals, certified ethical"
              }
            },
            {
              "id": "feature-3",
              "type": "feature",
              "content": "",
              "props": {
                "icon": "recycle",
                "title": "Sustainable",
                "description": "Eco-friendly packaging and ethical sourcing"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "footer-1",
      "type": "footer",
      "content": "",
      "props": {
        "siteName": "GLOW ESSENTIALS",
        "links": [
          {"text": "Home", "url": "#"},
          {"text": "Shop", "url": "#"},
          {"text": "About", "url": "#"},
          {"text": "Contact", "url": "#"}
        ],
        "variant": "minimal"
      }
    }
  ],
  "settings": {
    "title": "Glow Essentials - Natural Beauty",
    "description": "Clean beauty products for the conscious consumer"
  },
  "pages": {
    "home": {
      "title": "Home",
      "slug": "/",
      "elements": []
    },
    "shop": {
      "title": "Shop",
      "slug": "/shop", 
      "elements": [
        {
          "id": "shop-hero",
          "type": "hero",
          "content": "",
          "props": {
            "title": "Shop Our Collection",
            "subtitle": "Discover clean beauty products for every need",
            "height": "medium"
          }
        },
        {
          "id": "shop-products",
          "type": "productsList",
          "content": "",
          "props": {
            "columns": 3,
            "productsPerPage": 12,
            "showPagination": true,
            "showFilters": true
          }
        }
      ]
    },
    "about": {
      "title": "About Us",
      "slug": "/about",
      "elements": [
        {
          "id": "about-hero",
          "type": "hero",
          "content": "",
          "props": {
            "title": "Our Story",
            "subtitle": "Founded on the belief that beauty should be clean, ethical, and effective"
          }
        },
        {
          "id": "about-content",
          "type": "text",
          "content": "At Glow Essentials, we believe that true beauty comes from products that are as good for you as they are for the planet. Our journey began with a simple mission: to create effective, luxurious beauty products using only the finest natural ingredients.",
          "props": {
            "className": "text-lg text-center max-w-3xl mx-auto"
          }
        }
      ]
    }
  }
}'
WHERE name = 'Beauty & Cosmetics Template' AND category = 'beauty';

-- Update the fashion template
UPDATE templates 
SET template_data = '{
  "content": [
    {
      "id": "navbar-1",
      "type": "navbar",
      "content": "",
      "props": {
        "siteName": "CHIC BOUTIQUE",
        "links": [
          {"text": "Home", "url": "#"},
          {"text": "New Arrivals", "url": "#new"},
          {"text": "Women", "url": "#women"},
          {"text": "Men", "url": "#men"},
          {"text": "Sale", "url": "#sale"}
        ],
        "variant": "minimal"
      }
    },
    {
      "id": "hero-1",
      "type": "hero",
      "content": "",
      "props": {
        "title": "Summer Collection 2025",
        "subtitle": "Discover sustainable fashion with modern designs",
        "buttonText": "Shop Now",
        "buttonLink": "#products",
        "alignment": "center",
        "imageUrl": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1470&auto=format&fit=crop",
        "overlay": true,
        "height": "large"
      }
    },
    {
      "id": "section-1",
      "type": "section",
      "content": "",
      "props": {
        "padding": "large",
        "backgroundColor": "bg-white"
      },
      "children": [
        {
          "id": "heading-1",
          "type": "heading",
          "content": "New Arrivals",
          "props": {
            "level": "h2",
            "className": "text-4xl font-light text-center mb-8"
          }
        },
        {
          "id": "products-1",
          "type": "productsList",
          "content": "",
          "props": {
            "columns": 4,
            "productsPerPage": 4,
            "showPagination": false,
            "cardStyle": "minimal"
          }
        }
      ]
    },
    {
      "id": "section-2",
      "type": "section",
      "content": "",
      "props": {
        "padding": "large",
        "backgroundColor": "bg-stone-50"
      },
      "children": [
        {
          "id": "grid-1",
          "type": "grid",
          "content": "",
          "props": {
            "columns": 2,
            "gap": "gap-8"
          },
          "children": [
            {
              "id": "image-1",
              "type": "image",
              "content": "",
              "props": {
                "src": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1470&auto=format&fit=crop",
                "alt": "Women Collection",
                "className": "w-full h-96 object-cover"
              }
            },
            {
              "id": "content-1",
              "type": "flex",
              "content": "",
              "props": {
                "direction": "column",
                "justify": "center"
              },
              "children": [
                {
                  "id": "heading-2",
                  "type": "heading",
                  "content": "Sustainable Fashion",
                  "props": {
                    "level": "h2",
                    "className": "text-3xl font-light mb-4"
                  }
                },
                {
                  "id": "text-1",
                  "type": "text",
                  "content": "Our commitment to sustainability means every piece is crafted with care for both style and environmental impact.",
                  "props": {
                    "className": "text-gray-600 mb-6"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "settings": {
    "title": "Chic Boutique - Sustainable Fashion",
    "description": "Modern sustainable fashion for the conscious consumer"
  },
  "pages": {
    "home": {
      "title": "Home",
      "slug": "/",
      "elements": []
    },
    "women": {
      "title": "Women",
      "slug": "/women",
      "elements": [
        {
          "id": "women-hero",
          "type": "hero",
          "content": "",
          "props": {
            "title": "Women''s Collection",
            "subtitle": "Elegant pieces for the modern woman"
          }
        }
      ]
    },
    "men": {
      "title": "Men",
      "slug": "/men", 
      "elements": [
        {
          "id": "men-hero",
          "type": "hero",
          "content": "",
          "props": {
            "title": "Men''s Collection",
            "subtitle": "Sophisticated styles for every occasion"
          }
        }
      ]
    }
  }
}'
WHERE name = 'Fashion & Apparel Template' AND category = 'fashion';

-- Update the furniture template
UPDATE templates 
SET template_data = '{
  "content": [
    {
      "id": "navbar-1",
      "type": "navbar",
      "content": "",
      "props": {
        "siteName": "MODERN LIVING",
        "links": [
          {"text": "Home", "url": "#"},
          {"text": "Living Room", "url": "#living"},
          {"text": "Bedroom", "url": "#bedroom"},
          {"text": "Dining", "url": "#dining"},
          {"text": "Office", "url": "#office"}
        ],
        "variant": "default"
      }
    },
    {
      "id": "hero-1",
      "type": "hero",
      "content": "",
      "props": {
        "title": "Elevate Your Home",
        "subtitle": "Discover furniture that combines style, comfort, and craftsmanship",
        "buttonText": "Shop Collection",
        "buttonLink": "#products",
        "alignment": "center",
        "imageUrl": "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?q=80&w=1406&auto=format&fit=crop",
        "overlay": true,
        "height": "large"
      }
    },
    {
      "id": "section-1",
      "type": "section",
      "content": "",
      "props": {
        "padding": "large",
        "backgroundColor": "bg-white"
      },
      "children": [
        {
          "id": "heading-1",
          "type": "heading",
          "content": "Shop by Room",
          "props": {
            "level": "h2",
            "className": "text-4xl font-light text-center mb-16"
          }
        },
        {
          "id": "grid-1",
          "type": "grid",
          "content": "",
          "props": {
            "columns": 3,
            "gap": "gap-8"
          },
          "children": [
            {
              "id": "card-1",
              "type": "card",
              "content": "",
              "props": {
                "title": "Living Room",
                "description": "Comfortable and stylish seating",
                "image": "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1470&auto=format&fit=crop"
              }
            },
            {
              "id": "card-2",
              "type": "card",
              "content": "",
              "props": {
                "title": "Bedroom",
                "description": "Peaceful and serene furniture",
                "image": "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1457&auto=format&fit=crop"
              }
            },
            {
              "id": "card-3",
              "type": "card",
              "content": "",
              "props": {
                "title": "Dining",
                "description": "Tables that bring people together",
                "image": "https://images.unsplash.com/photo-1615876232449-5b5389e7195f?q=80&w=1480&auto=format&fit=crop"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "section-2",
      "type": "section",
      "content": "",
      "props": {
        "padding": "large",
        "backgroundColor": "bg-stone-100"
      },
      "children": [
        {
          "id": "heading-2",
          "type": "heading",
          "content": "Featured Products",
          "props": {
            "level": "h2",
            "className": "text-4xl font-light text-center mb-16"
          }
        },
        {
          "id": "products-1",
          "type": "productsList",
          "content": "",
          "props": {
            "columns": 3,
            "productsPerPage": 6,
            "showPagination": false,
            "cardStyle": "shadow"
          }
        }
      ]
    }
  ],
  "settings": {
    "title": "Modern Living - Quality Furniture",
    "description": "Premium furniture for modern homes"
  },
  "pages": {
    "home": {
      "title": "Home",
      "slug": "/",
      "elements": []
    },
    "living": {
      "title": "Living Room",
      "slug": "/living-room",
      "elements": [
        {
          "id": "living-hero",
          "type": "hero",
          "content": "",
          "props": {
            "title": "Living Room Furniture",
            "subtitle": "Create a space for relaxation and entertainment"
          }
        }
      ]
    },
    "bedroom": {
      "title": "Bedroom",
      "slug": "/bedroom",
      "elements": [
        {
          "id": "bedroom-hero",
          "type": "hero",
          "content": "",
          "props": {
            "title": "Bedroom Collection",
            "subtitle": "Rest and recharge in style"
          }
        }
      ]
    }
  }
}'
WHERE name = 'Home & Furniture Template' AND category = 'furniture';

-- Update the food template
UPDATE templates 
SET template_data = '{
  "content": [
    {
      "id": "navbar-1",
      "type": "navbar",
      "content": "",
      "props": {
        "siteName": "GOURMET MARKET",
        "links": [
          {"text": "Home", "url": "#"},
          {"text": "Shop", "url": "#shop"},
          {"text": "Recipes", "url": "#recipes"},
          {"text": "About", "url": "#about"},
          {"text": "Contact", "url": "#contact"}
        ],
        "variant": "default"
      }
    },
    {
      "id": "hero-1",
      "type": "hero",
      "content": "",
      "props": {
        "title": "Artisanal Food Products",
        "subtitle": "Discover gourmet ingredients from small producers worldwide",
        "buttonText": "Shop Now",
        "buttonLink": "#products",
        "alignment": "center",
        "imageUrl": "https://images.unsplash.com/photo-1526470498-9ae73c665de8?q=80&w=1298&auto=format&fit=crop",
        "overlay": true,
        "height": "large"
      }
    },
    {
      "id": "section-1",
      "type": "section",
      "content": "",
      "props": {
        "padding": "large",
        "backgroundColor": "bg-white"
      },
      "children": [
        {
          "id": "heading-1",
          "type": "heading",
          "content": "Featured Categories",
          "props": {
            "level": "h2",
            "className": "text-3xl font-bold text-center mb-12"
          }
        },
        {
          "id": "grid-1",
          "type": "grid",
          "content": "",
          "props": {
            "columns": 4,
            "gap": "gap-6"
          },
          "children": [
            {
              "id": "card-1",
              "type": "card",
              "content": "",
              "props": {
                "title": "Olive Oils",
                "description": "Premium cold-pressed varieties",
                "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1470&auto=format&fit=crop"
              }
            },
            {
              "id": "card-2",
              "type": "card",
              "content": "",
              "props": {
                "title": "Spices & Herbs",
                "description": "Authentic flavors from around the world",
                "image": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=1374&auto=format&fit=crop"
              }
            },
            {
              "id": "card-3",
              "type": "card",
              "content": "",
              "props": {
                "title": "Artisanal Pasta",
                "description": "Traditional Italian methods",
                "image": "https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=1374&auto=format&fit=crop"
              }
            },
            {
              "id": "card-4",
              "type": "card",
              "content": "",
              "props": {
                "title": "Specialty Preserves",
                "description": "Small-batch jams and pickles",
                "image": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1374&auto=format&fit=crop"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "section-2",
      "type": "section",
      "content": "",
      "props": {
        "padding": "large",
        "backgroundColor": "bg-amber-50"
      },
      "children": [
        {
          "id": "heading-2",
          "type": "heading",
          "content": "Best Sellers",
          "props": {
            "level": "h2",
            "className": "text-3xl font-bold text-center mb-8"
          }
        },
        {
          "id": "products-1",
          "type": "productsList",
          "content": "",
          "props": {
            "columns": 4,
            "productsPerPage": 8,
            "showPagination": false,
            "cardStyle": "shadow"
          }
        }
      ]
    }
  ],
  "settings": {
    "title": "Gourmet Market - Artisanal Foods",
    "description": "Premium gourmet ingredients and specialty foods"
  },
  "pages": {
    "home": {
      "title": "Home",
      "slug": "/",
      "elements": []
    },
    "recipes": {
      "title": "Recipes",
      "slug": "/recipes",
      "elements": [
        {
          "id": "recipes-hero",
          "type": "hero",
          "content": "",
          "props": {
            "title": "Recipe Collection",
            "subtitle": "Delicious recipes using our premium ingredients"
          }
        }
      ]
    },
    "about": {
      "title": "About",
      "slug": "/about",
      "elements": [
        {
          "id": "about-hero",
          "type": "hero",
          "content": "",
          "props": {
            "title": "Our Story",
            "subtitle": "Connecting you with the finest artisanal producers"
          }
        }
      ]
    }
  }
}'
WHERE name = 'Food & Beverage Template' AND category = 'food';

-- Update the electronics template
UPDATE templates 
SET template_data = '{
  "content": [
    {
      "id": "navbar-1",
      "type": "navbar",
      "content": "",
      "props": {
        "siteName": "TECH HUB",
        "links": [
          {"text": "Home", "url": "#"},
          {"text": "Smartphones", "url": "#phones"},
          {"text": "Laptops", "url": "#laptops"},
          {"text": "Accessories", "url": "#accessories"},
          {"text": "Support", "url": "#support"}
        ],
        "variant": "default"
      }
    },
    {
      "id": "hero-1",
      "type": "hero",
      "content": "",
      "props": {
        "title": "Next Generation Technology",
        "subtitle": "Discover the latest gadgets and tech innovations",
        "buttonText": "Shop Latest Tech",
        "buttonLink": "#products",
        "alignment": "center",
        "imageUrl": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1470&auto=format&fit=crop",
        "overlay": true,
        "height": "large"
      }
    },
    {
      "id": "section-1",
      "type": "section",
      "content": "",
      "props": {
        "padding": "large",
        "backgroundColor": "bg-white"
      },
      "children": [
        {
          "id": "heading-1",
          "type": "heading",
          "content": "Featured Categories",
          "props": {
            "level": "h2",
            "className": "text-3xl font-bold text-center mb-10"
          }
        },
        {
          "id": "grid-1",
          "type": "grid",
          "content": "",
          "props": {
            "columns": 4,
            "gap": "gap-6"
          },
          "children": [
            {
              "id": "card-1",
              "type": "card",
              "content": "",
              "props": {
                "title": "Smartphones",
                "description": "Latest models with cutting-edge features",
                "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02ff9?q=80&w=1480&auto=format&fit=crop"
              }
            },
            {
              "id": "card-2",
              "type": "card",
              "content": "",
              "props": {
                "title": "Laptops",
                "description": "Powerful computers for work and play",
                "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop"
              }
            },
            {
              "id": "card-3",
              "type": "card",
              "content": "",
              "props": {
                "title": "Smart Home",
                "description": "Devices to make your home smarter",
                "image": "https://images.unsplash.com/photo-1558002038-bb47587a3455?q=80&w=1470&auto=format&fit=crop"
              }
            },
            {
              "id": "card-4",
              "type": "card",
              "content": "",
              "props": {
                "title": "Accessories",
                "description": "Essential add-ons for your devices",
                "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1465&auto=format&fit=crop"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "section-2",
      "type": "section",
      "content": "",
      "props": {
        "padding": "large",
        "backgroundColor": "bg-gray-50"
      },
      "children": [
        {
          "id": "heading-2",
          "type": "heading",
          "content": "New Arrivals",
          "props": {
            "level": "h2",
            "className": "text-3xl font-bold text-center mb-8"
          }
        },
        {
          "id": "products-1",
          "type": "productsList",
          "content": "",
          "props": {
            "columns": 4,
            "productsPerPage": 8,
            "showPagination": true,
            "cardStyle": "shadow"
          }
        }
      ]
    }
  ],
  "settings": {
    "title": "Tech Hub - Latest Technology",
    "description": "Your destination for the latest tech gadgets and electronics"
  },
  "pages": {
    "home": {
      "title": "Home",
      "slug": "/",
      "elements": []
    },
    "phones": {
      "title": "Smartphones",
      "slug": "/smartphones",
      "elements": [
        {
          "id": "phones-hero",
          "type": "hero",
          "content": "",
          "props": {
            "title": "Latest Smartphones",
            "subtitle": "Discover the newest mobile technology"
          }
        }
      ]
    },
    "laptops": {
      "title": "Laptops",
      "slug": "/laptops", 
      "elements": [
        {
          "id": "laptops-hero",
          "type": "hero",
          "content": "",
          "props": {
            "title": "Powerful Laptops",
            "subtitle": "Performance meets portability"
          }
        }
      ]
    }
  }
}'
WHERE name = 'Electronics Template' AND category = 'electronics';

-- Add jewelry template if it doesn't exist, or update if it does
INSERT INTO templates (name, description, category, is_premium, is_ai_generated, is_active, template_data, image_url)
VALUES (
  'Jewelry & Accessories Template',
  'Elegant template for jewelry and luxury accessories stores',
  'jewelry',
  false,
  false,
  true,
  '{
    "content": [
      {
        "id": "navbar-1",
        "type": "navbar",
        "content": "",
        "props": {
          "siteName": "LUXE JEWELRY",
          "links": [
            {"text": "Home", "url": "#"},
            {"text": "Rings", "url": "#rings"},
            {"text": "Necklaces", "url": "#necklaces"},
            {"text": "Earrings", "url": "#earrings"},
            {"text": "Collections", "url": "#collections"}
          ],
          "variant": "minimal"
        }
      },
      {
        "id": "hero-1",
        "type": "hero",
        "content": "",
        "props": {
          "title": "Timeless Elegance",
          "subtitle": "Discover our collection of handcrafted jewelry pieces",
          "buttonText": "Shop Collection",
          "buttonLink": "#products",
          "alignment": "center",
          "imageUrl": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1470&auto=format&fit=crop",
          "overlay": true,
          "height": "large"
        }
      },
      {
        "id": "section-1",
        "type": "section",
        "content": "",
        "props": {
          "padding": "large",
          "backgroundColor": "bg-white"
        },
        "children": [
          {
            "id": "heading-1",
            "type": "heading",
            "content": "Featured Collections",
            "props": {
              "level": "h2",
              "className": "text-4xl font-light text-center mb-16"
            }
          },
          {
            "id": "grid-1",
            "type": "grid",
            "content": "",
            "props": {
              "columns": 3,
              "gap": "gap-8"
            },
            "children": [
              {
                "id": "card-1",
                "type": "card",
                "content": "",
                "props": {
                  "title": "Diamond Collection",
                  "description": "Brilliant cuts and timeless designs",
                  "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop"
                }
              },
              {
                "id": "card-2", 
                "type": "card",
                "content": "",
                "props": {
                  "title": "Gold Jewelry",
                  "description": "Classic pieces in 14k and 18k gold",
                  "image": "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1374&auto=format&fit=crop"
                }
              },
              {
                "id": "card-3",
                "type": "card", 
                "content": "",
                "props": {
                  "title": "Custom Pieces",
                  "description": "Bespoke jewelry made just for you",
                  "image": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=1374&auto=format&fit=crop"
                }
              }
            ]
          }
        ]
      },
      {
        "id": "section-2",
        "type": "section",
        "content": "",
        "props": {
          "padding": "large",
          "backgroundColor": "bg-gray-50"
        },
        "children": [
          {
            "id": "heading-2",
            "type": "heading",
            "content": "New Arrivals",
            "props": {
              "level": "h2", 
              "className": "text-4xl font-light text-center mb-8"
            }
          },
          {
            "id": "products-1",
            "type": "productsList",
            "content": "",
            "props": {
              "columns": 4,
              "productsPerPage": 8,
              "showPagination": false,
              "cardStyle": "minimal"
            }
          }
        ]
      }
    ],
    "settings": {
      "title": "Luxe Jewelry - Handcrafted Elegance",
      "description": "Exquisite handcrafted jewelry and luxury accessories"
    },
    "pages": {
      "home": {
        "title": "Home",
        "slug": "/",
        "elements": []
      },
      "rings": {
        "title": "Rings",
        "slug": "/rings",
        "elements": [
          {
            "id": "rings-hero",
            "type": "hero",
            "content": "",
            "props": {
              "title": "Ring Collection",
              "subtitle": "Engagement rings, wedding bands, and statement pieces"
            }
          }
        ]
      },
      "necklaces": {
        "title": "Necklaces",
        "slug": "/necklaces",
        "elements": [
          {
            "id": "necklaces-hero",
            "type": "hero", 
            "content": "",
            "props": {
              "title": "Necklace Collection",
              "subtitle": "Delicate chains to bold statement pieces"
            }
          }
        ]
      }
    }
  }',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop'
)
ON CONFLICT (name) DO UPDATE SET
  template_data = EXCLUDED.template_data,
  description = EXCLUDED.description,
  updated_at = now();
