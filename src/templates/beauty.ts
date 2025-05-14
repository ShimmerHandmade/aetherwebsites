
import { v4 as uuidv4 } from "@/lib/uuid";

export const beautyTemplate = {
  pages: {
    homepage: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "GLOW ESSENTIALS",
          links: [
            { text: "Home", url: "#" },
            { text: "Shop", url: "#" },
            { text: "Collections", url: "#" },
            { text: "Skincare Guide", url: "#" },
            { text: "About Us", url: "#" }
          ],
          variant: "minimal"
        }
      },
      {
        id: uuidv4(),
        type: "section",
        content: "",
        props: {
          padding: "none",
          backgroundColor: "bg-pink-50",
          className: ""
        },
        children: [
          {
            id: uuidv4(),
            type: "grid",
            content: "",
            props: {
              columns: 2,
              gap: "gap-0"
            },
            children: [
              {
                id: uuidv4(),
                type: "image",
                content: "",
                props: {
                  src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1480&auto=format&fit=crop",
                  alt: "Beauty Products",
                  className: "w-full h-screen object-cover"
                }
              },
              {
                id: uuidv4(),
                type: "flex",
                content: "",
                props: {
                  direction: "column",
                  justify: "center",
                  align: "center",
                  className: "p-12 h-screen"
                },
                children: [
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "NEW COLLECTION",
                    props: {
                      className: "text-pink-600 font-semibold tracking-widest mb-4"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "heading",
                    content: "Natural Beauty Essentials",
                    props: {
                      level: "h1",
                      className: "text-5xl font-light text-center mb-6 tracking-wide"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Discover our clean beauty products made with natural ingredients to enhance your natural radiance. Our formulations are free from harmful chemicals and packed with nourishing botanicals that work in harmony with your skin.",
                    props: {
                      className: "text-gray-600 text-center max-w-md mb-10"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "button",
                    content: "Shop the Collection",
                    props: {
                      variant: "default",
                      size: "lg",
                      url: "#products",
                      className: "bg-pink-600 hover:bg-pink-700"
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
          className: "py-20"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Bestsellers",
            props: {
              level: "h2",
              className: "text-4xl font-light text-center mb-2 tracking-wide"
            }
          },
          {
            id: uuidv4(),
            type: "text",
            content: "Our most loved products",
            props: {
              className: "text-gray-500 text-center mb-12"
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
              cardStyle: "minimal",
              sortBy: "created_at",
              sortOrder: "desc",
              categoryFilter: "featured"
            }
          },
          {
            id: uuidv4(),
            type: "flex",
            content: "",
            props: {
              justifyContent: "center",
              className: "mt-12"
            },
            children: [
              {
                id: uuidv4(),
                type: "button",
                content: "View All Products",
                props: {
                  variant: "outline",
                  size: "default",
                  url: "/shop",
                  className: "border-pink-600 text-pink-600 hover:bg-pink-50"
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
          backgroundColor: "bg-pink-50",
          className: "py-20"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Our Promise",
            props: {
              level: "h2",
              className: "text-4xl font-light text-center mb-16 tracking-wide"
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
                type: "feature",
                content: "",
                props: {
                  icon: "star",
                  title: "Clean Ingredients",
                  description: "All our products are made with natural, organic ingredients with no harmful chemicals. We source the finest botanicals from sustainable farms around the world."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "tag",
                  title: "Cruelty Free",
                  description: "We never test on animals and only partner with ethical suppliers who share our commitment to cruelty-free beauty. Our products are certified by Leaping Bunny and PETA."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "shopping-bag",
                  title: "Sustainable Packaging",
                  description: "Our packaging is eco-friendly, recyclable, and minimizes environmental impact. We use recycled materials and biodegradable options whenever possible."
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
            type: "heading",
            content: "Shop By Category",
            props: {
              level: "h2",
              className: "text-4xl font-light text-center mb-16 tracking-wide"
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
                type: "card",
                content: "",
                props: {
                  title: "Skincare",
                  description: "Nourish and protect",
                  image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?q=80&w=1374&auto=format&fit=crop",
                  className: "overflow-hidden hover:shadow-lg transition-all duration-300"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Makeup",
                  description: "Enhance your natural beauty",
                  image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1487&auto=format&fit=crop",
                  className: "overflow-hidden hover:shadow-lg transition-all duration-300"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Bath & Body",
                  description: "Relaxing self-care essentials",
                  image: "https://images.unsplash.com/photo-1570213489059-0aac6626cade?q=80&w=1372&auto=format&fit=crop",
                  className: "overflow-hidden hover:shadow-lg transition-all duration-300"
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
          backgroundColor: "bg-pink-100",
          className: "py-16"
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
                type: "image",
                content: "",
                props: {
                  src: "https://images.unsplash.com/photo-1621607149049-3a1cf44dc43a?q=80&w=1374&auto=format&fit=crop",
                  alt: "Subscribe to newsletter",
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
                    content: "Join Our Community",
                    props: {
                      level: "h2",
                      className: "text-3xl font-light mb-4 tracking-wide"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Subscribe to our newsletter for exclusive offers, beauty tips, and first access to new product launches. Join thousands of beauty enthusiasts who trust our products and expertise.",
                    props: {
                      className: "mb-8 text-gray-600"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "form",
                    content: "",
                    props: {
                      fields: ["Email"],
                      submitText: "Subscribe",
                      className: "w-full"
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
        type: "footer",
        content: "",
        props: {
          siteName: "GLOW ESSENTIALS",
          links: [
            { text: "Home", url: "#" },
            { text: "Shop", url: "#" },
            { text: "About", url: "#" },
            { text: "Contact", url: "#" },
            { text: "Shipping", url: "#" },
            { text: "Returns", url: "#" }
          ],
          variant: "minimal"
        }
      }
    ]
  }
};
