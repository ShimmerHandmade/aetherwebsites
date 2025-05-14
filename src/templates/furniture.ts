
import { v4 as uuidv4 } from "@/lib/uuid";

export const furnitureTemplate = {
  pages: {
    homepage: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "MODERN LIVING",
          links: [
            { text: "Home", url: "#" },
            { text: "Shop", url: "#" },
            { text: "Collections", url: "#" },
            { text: "Design Ideas", url: "#" },
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
          title: "Elevate Your Home",
          subtitle: "Discover furniture that combines style, comfort, and exceptional craftsmanship",
          buttonText: "Shop Collection",
          buttonLink: "#products",
          alignment: "center",
          imageUrl: "/templates/furniture-hero.jpg",
          overlay: true,
          height: "large",
          backgroundColor: "bg-stone-900"
        }
      },
      {
        id: uuidv4(),
        type: "section",
        content: "",
        props: {
          padding: "large",
          backgroundColor: "bg-white",
          className: "py-24"
        },
        children: [
          {
            id: uuidv4(),
            type: "flex",
            content: "",
            props: {
              direction: "column",
              justify: "center",
              align: "center",
              className: "max-w-3xl mx-auto text-center mb-16"
            },
            children: [
              {
                id: uuidv4(),
                type: "heading",
                content: "Crafted with Passion",
                props: {
                  level: "h2",
                  className: "text-4xl font-light mb-6 tracking-wide"
                }
              },
              {
                id: uuidv4(),
                type: "text",
                content: "Our furniture combines traditional craftsmanship with contemporary design to create pieces that last a lifetime. Each item is carefully constructed using sustainable materials and ethical practices.",
                props: {
                  className: "text-gray-600 text-lg"
                }
              }
            ]
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
                  title: "Living Room",
                  description: "Elegant sofas and accent pieces",
                  image: "/templates/furniture-living.jpg",
                  className: "overflow-hidden"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Bedroom",
                  description: "Serene and comfortable designs",
                  image: "/templates/furniture-bedroom.jpg",
                  className: "overflow-hidden"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Dining",
                  description: "Tables that bring people together",
                  image: "/templates/furniture-dining.jpg",
                  className: "overflow-hidden"
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
          padding: "none",
          backgroundColor: "bg-stone-100",
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
                  src: "/templates/furniture-feature.jpg",
                  alt: "Featured collection",
                  className: "w-full h-[600px] object-cover"
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
                  className: "p-16"
                },
                children: [
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "NEW COLLECTION",
                    props: {
                      className: "text-stone-600 font-semibold tracking-widest mb-4"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "heading",
                    content: "The Scandinavian Series",
                    props: {
                      level: "h2",
                      className: "text-4xl font-light mb-6 tracking-wide"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Inspired by Nordic design principles, this collection combines functionality with minimalist aesthetics. Each piece is crafted from sustainable oak with clean lines and organic forms.",
                    props: {
                      className: "text-gray-600 mb-8"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "button",
                    content: "Explore the Collection",
                    props: {
                      variant: "default",
                      size: "lg",
                      url: "#",
                      className: "bg-stone-800 hover:bg-stone-900"
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
              className: "text-4xl font-light text-center mb-16 tracking-wide"
            }
          },
          {
            id: uuidv4(),
            type: "productsList",
            content: "",
            props: {
              columns: 3,
              productsPerPage: 3,
              showPagination: false,
              cardStyle: "shadow",
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
                  size: "lg",
                  url: "/shop",
                  className: "border-stone-800 text-stone-800 hover:bg-stone-50"
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
          backgroundColor: "bg-stone-800",
          className: "py-20 text-white"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Our Services",
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
                  icon: "package",
                  title: "Free Delivery",
                  description: "Free shipping on all orders over $500 within the mainland."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "star",
                  title: "Interior Design Consultation",
                  description: "Book a consultation with our professional interior designers."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "package",
                  title: "10-Year Warranty",
                  description: "All our furniture comes with a 10-year warranty for peace of mind."
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
          backgroundColor: "bg-stone-100",
          className: "py-20"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Customer Stories",
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
                type: "testimonial",
                content: "",
                props: {
                  quote: "The quality of our new dining table is exceptional. It's become the center of our family gatherings.",
                  author: "Emily Thompson",
                  role: "New York, NY",
                  avatar: "/placeholder.svg"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "The interior design service helped me transform my living room into a space I truly love.",
                  author: "Marcus Johnson",
                  role: "Chicago, IL",
                  avatar: "/placeholder.svg"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "Five years in, and our Modern Living sofa still looks as good as the day we bought it.",
                  author: "Sophia Rodriguez",
                  role: "Austin, TX",
                  avatar: "/placeholder.svg"
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
          siteName: "MODERN LIVING",
          links: [
            { text: "Home", url: "#" },
            { text: "Shop", url: "#" },
            { text: "About Us", url: "#" },
            { text: "Contact", url: "#" },
            { text: "Delivery", url: "#" },
            { text: "Warranty", url: "#" }
          ],
          variant: "dark"
        }
      }
    ]
  }
};
