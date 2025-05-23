
import { v4 as uuidv4 } from "@/lib/uuid";

export const ecommerceTemplate = {
  pages: {
    homepage: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "E-Commerce Store",
          links: [
            { text: "Home", url: "#" },
            { text: "Shop", url: "#shop" },
            { text: "Products", url: "#products" },
            { text: "Cart", url: "#cart" }
          ],
          variant: "default"
        }
      },
      {
        id: uuidv4(),
        type: "hero",
        content: "",
        props: {
          title: "Welcome to Our Store",
          subtitle: "Discover premium products at competitive prices",
          buttonText: "Shop Now",
          buttonLink: "#products",
          alignment: "center",
          imageUrl: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1470&auto=format&fit=crop",
          overlay: true,
          height: "large",
          backgroundColor: "bg-slate-900"
        }
      },
      {
        id: uuidv4(),
        type: "section",
        content: "",
        props: {
          padding: "large",
          backgroundColor: "bg-white",
          className: "py-12"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Featured Products",
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
              cardStyle: "default",
              onlyFeatured: true
            }
          },
          {
            id: uuidv4(),
            type: "flex",
            content: "",
            props: {
              justifyContent: "center",
              className: "mt-8"
            },
            children: [
              {
                id: uuidv4(),
                type: "button",
                content: "View All Products",
                props: {
                  variant: "default",
                  size: "lg",
                  url: "/shop"
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
          backgroundColor: "bg-gray-50",
          className: "py-12"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Shop by Category",
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
              gap: "gap-8"
            },
            children: [
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "New Arrivals",
                  description: "Check out our latest products",
                  image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2215&auto=format&fit=crop",
                  buttonText: "Browse",
                  buttonUrl: "#new-arrivals"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Best Sellers",
                  description: "Our most popular items",
                  image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2215&auto=format&fit=crop",
                  buttonText: "Shop Now",
                  buttonUrl: "#best-sellers"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Sale Items",
                  description: "Special discounts and promotions",
                  image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=2070&auto=format&fit=crop",
                  buttonText: "View Deals",
                  buttonUrl: "#sale"
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
          className: "py-12"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Customer Benefits",
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
                type: "feature",
                content: "",
                props: {
                  icon: "truck",
                  title: "Fast Shipping",
                  description: "Get your products delivered quickly to your doorstep"
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "refresh-ccw",
                  title: "Easy Returns",
                  description: "30-day hassle-free return policy on all purchases"
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "shield",
                  title: "Secure Payments",
                  description: "Your transactions are protected with advanced encryption"
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "headphones",
                  title: "24/7 Support",
                  description: "Our customer service team is always here to help"
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
          backgroundColor: "bg-primary/5",
          className: "py-12"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Customer Reviews",
            props: {
              level: "h2",
              className: "text-3xl font-bold text-center mb-8"
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
                  quote: "I love shopping here! The products are high quality and shipping is always fast. Will definitely be a returning customer.",
                  author: "Sarah Johnson",
                  role: "Verified Buyer",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "Great customer service and competitive prices. When I had an issue with my order, they resolved it immediately.",
                  author: "Michael Chen",
                  role: "Loyal Customer",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1287&auto=format&fit=crop"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "The website is so easy to navigate and checkout is a breeze. I appreciate how they showcase their products with great images.",
                  author: "Emily Rodriguez",
                  role: "New Customer",
                  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop"
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
          className: "py-12"
        },
        children: [
          {
            id: uuidv4(),
            type: "cta",
            content: "",
            props: {
              title: "Subscribe to Our Newsletter",
              description: "Get updates on new products, special offers, and more",
              buttonText: "Subscribe",
              buttonLink: "#subscribe",
              alignment: "center"
            }
          }
        ]
      },
      {
        id: uuidv4(),
        type: "footer",
        content: "",
        props: {
          siteName: "E-Commerce Store",
          links: [
            { text: "Home", url: "#" },
            { text: "Shop", url: "#shop" },
            { text: "About Us", url: "#about" },
            { text: "Contact", url: "#contact" },
            { text: "Return Policy", url: "#return" },
            { text: "Shipping Info", url: "#shipping" },
          ],
          variant: "dark"
        }
      }
    ],
    shop: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "E-Commerce Store",
          links: [
            { text: "Home", url: "/" },
            { text: "Shop", url: "#" },
            { text: "Products", url: "#products" },
            { text: "Cart", url: "/cart" }
          ],
          variant: "default"
        }
      },
      {
        id: uuidv4(),
        type: "section",
        content: "",
        props: {
          padding: "medium",
          backgroundColor: "bg-white",
          className: "py-8"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Shop Our Products",
            props: {
              level: "h1",
              className: "text-3xl font-bold text-center mb-8"
            }
          },
          {
            id: uuidv4(),
            type: "productsList",
            content: "",
            props: {
              columns: 4,
              productsPerPage: 12,
              showPagination: true,
              cardStyle: "default",
              showFilters: true
            }
          }
        ]
      },
      {
        id: uuidv4(),
        type: "footer",
        content: "",
        props: {
          siteName: "E-Commerce Store",
          links: [
            { text: "Home", url: "/" },
            { text: "Shop", url: "#" },
            { text: "About Us", url: "#about" },
            { text: "Contact", url: "#contact" }
          ],
          variant: "dark"
        }
      }
    ]
  }
};
