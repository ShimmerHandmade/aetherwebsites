
import { v4 as uuidv4 } from "@/lib/uuid";

export const foodTemplate = {
  pages: {
    homepage: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "GOURMET MARKET",
          links: [
            { text: "Home", url: "#" },
            { text: "Shop", url: "#" },
            { text: "Recipes", url: "#" },
            { text: "About Us", url: "#" },
            { text: "Contact", url: "#" }
          ],
          variant: "default"
        }
      },
      {
        id: uuidv4(),
        type: "hero",
        content: "",
        props: {
          title: "Artisanal Food Products",
          subtitle: "Discover gourmet ingredients sourced from small producers around the world",
          buttonText: "Shop Now",
          buttonLink: "#products",
          alignment: "center",
          imageUrl: "https://images.unsplash.com/photo-1526470498-9ae73c665de8?q=80&w=1298&auto=format&fit=crop",
          overlay: true,
          height: "large",
          backgroundColor: "bg-amber-900"
        }
      },
      {
        id: uuidv4(),
        type: "section",
        content: "",
        props: {
          padding: "large",
          backgroundColor: "bg-white",
          className: "py-16"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Featured Categories",
            props: {
              level: "h2",
              className: "text-3xl font-bold text-center mb-12"
            }
          },
          {
            id: uuidv4(),
            type: "grid",
            content: "",
            props: {
              columns: 4,
              gap: "gap-6"
            },
            children: [
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Olive Oils",
                  description: "Premium cold-pressed varieties",
                  image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1470&auto=format&fit=crop"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Spices & Herbs",
                  description: "From around the world",
                  image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=1374&auto=format&fit=crop"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Artisanal Pastas",
                  description: "Traditional Italian methods",
                  image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=1374&auto=format&fit=crop"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Specialty Preserves",
                  description: "Small-batch jams and pickles",
                  image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1374&auto=format&fit=crop"
                }
              }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        type: "section",
        content: "",
        props: {
          padding: "large",
          backgroundColor: "bg-amber-50",
          className: "py-16"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Our Best Sellers",
            props: {
              level: "h2",
              className: "text-3xl font-bold text-center mb-8"
            }
          },
          {
            id: uuidv4(),
            type: "productsList",
            content: "",
            props: {
              columns: 4,
              productsPerPage: 4,
              showPagination: false,
              cardStyle: "shadow",
              sortBy: "created_at",
              sortOrder: "desc"
            }
          },
          {
            id: uuidv4(),
            type: "flex",
            content: "",
            props: {
              justifyContent: "center",
              className: "mt-10"
            },
            children: [
              {
                id: uuidv4(),
                type: "button",
                content: "View All Products",
                props: {
                  variant: "default",
                  size: "lg",
                  url: "/shop",
                  className: "bg-amber-800 hover:bg-amber-900"
                }
              }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        type: "section",
        content: "",
        props: {
          padding: "large",
          backgroundColor: "bg-white",
          className: "py-20"
        },
        children: [
          {
            id: uuidv4(),
            type: "grid",
            content: "",
            props: {
              columns: 2,
              gap: "gap-12"
            },
            children: [
              {
                id: uuidv4(),
                type: "flex",
                content: "",
                props: {
                  direction: "column",
                  justify: "center",
                  align: "start",
                  className: "p-6"
                },
                children: [
                  {
                    id: uuidv4(),
                    type: "heading",
                    content: "Our Story",
                    props: {
                      level: "h2",
                      className: "text-3xl font-bold mb-6"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Gourmet Market was founded in 2010 by food enthusiasts who wanted to bring unique, high-quality ingredients to home cooks everywhere. We travel the world to source authentic products from small producers who use traditional methods and prioritize quality over quantity. Our team includes chefs and culinary experts who personally test and select each item in our collection.",
                    props: {
                      className: "mb-4 text-gray-600"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Our mission is to support sustainable agriculture while connecting you with exceptional products that elevate your cooking and eating experience. We believe that great ingredients are the foundation of great meals.",
                    props: {
                      className: "mb-8 text-gray-600"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "button",
                    content: "Learn More",
                    props: {
                      variant: "outline",
                      size: "default",
                      url: "#",
                      className: "border-amber-800 text-amber-800 hover:bg-amber-50"
                    }
                  }
                ]
              },
              {
                id: uuidv4(),
                type: "image",
                content: "",
                props: {
                  src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1368&auto=format&fit=crop",
                  alt: "Our story",
                  className: "w-full h-96 object-cover rounded-lg"
                }
              }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        type: "section",
        content: "",
        props: {
          padding: "large",
          backgroundColor: "bg-amber-900",
          className: "py-16 text-white"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Recipe of the Month",
            props: {
              level: "h2",
              className: "text-3xl font-bold text-center mb-12"
            }
          },
          {
            id: uuidv4(),
            type: "grid",
            content: "",
            props: {
              columns: 2,
              gap: "gap-12"
            },
            children: [
              {
                id: uuidv4(),
                type: "image",
                content: "",
                props: {
                  src: "https://images.unsplash.com/photo-1607330289024-1535acc6014a?q=80&w=1374&auto=format&fit=crop",
                  alt: "Recipe of the month",
                  className: "w-full h-96 object-cover rounded-lg"
                }
              },
              {
                id: uuidv4(),
                type: "flex",
                content: "",
                props: {
                  direction: "column",
                  justify: "center",
                  align: "start",
                  className: "p-6"
                },
                children: [
                  {
                    id: uuidv4(),
                    type: "heading",
                    content: "Truffle Risotto with Wild Mushrooms",
                    props: {
                      level: "h3",
                      className: "text-2xl font-bold mb-4"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "A rich, creamy risotto infused with the earthy flavors of truffles and wild mushrooms. This luxurious dish is perfect for special occasions or whenever you want to impress dinner guests. The secret is in the slow cooking process and using the highest quality ingredients for maximum flavor.",
                    props: {
                      className: "mb-6 text-amber-100"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Made with our premium Carnaroli rice, black truffle oil, and dried porcini mushrooms - all available in our store. Pair with a full-bodied white wine for a truly memorable dining experience.",
                    props: {
                      className: "mb-8 text-amber-100"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "button",
                    content: "View Full Recipe",
                    props: {
                      variant: "outline",
                      size: "default",
                      url: "#",
                      className: "border-white text-white hover:bg-amber-800"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        type: "section",
        content: "",
        props: {
          padding: "large",
          backgroundColor: "bg-white",
          className: "py-16"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "What Our Customers Say",
            props: {
              level: "h2",
              className: "text-3xl font-bold text-center mb-12"
            }
          },
          {
            id: uuidv4(),
            type: "grid",
            content: "",
            props: {
              columns: 3,
              gap: "gap-6"
            },
            children: [
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "The olive oil is exceptional - better than anything I've tasted outside of Italy. It's become a kitchen staple, and I use it for everything from salads to finishing dishes. It elevates even the simplest recipes.",
                  author: "Anna Martinez",
                  role: "Home Chef",
                  avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1471&auto=format&fit=crop"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "The spice blends are incredible and have transformed my cooking. Fast shipping and beautiful packaging too! I especially love the Moroccan blend - it's perfectly balanced and authentic.",
                  author: "James Wilson",
                  role: "Food Blogger",
                  avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1448&auto=format&fit=crop"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "I'm impressed with the quality and authenticity of every product I've ordered. The customer service is also outstanding. They helped me select the perfect gifts for clients who still rave about them.",
                  author: "Michelle Chen",
                  role: "Professional Chef",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1528&auto=format&fit=crop"
                }
              }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        type: "footer",
        content: "",
        props: {
          siteName: "GOURMET MARKET",
          links: [
            { text: "Home", url: "#" },
            { text: "Shop", url: "#" },
            { text: "Recipes", url: "#" },
            { text: "About", url: "#" },
            { text: "Contact", url: "#" },
            { text: "Shipping", url: "#" }
          ],
          variant: "default"
        }
      }
    ]
  }
};
