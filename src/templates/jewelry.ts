
import { v4 as uuidv4 } from "@/lib/uuid";

export const jewelryTemplate = {
  pages: {
    homepage: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "LUXE GEMS",
          links: [
            { text: "Home", url: "#" },
            { text: "Collections", url: "#" },
            { text: "Bespoke", url: "#" },
            { text: "Our Story", url: "#" },
            { text: "Contact", url: "#" }
          ],
          variant: "minimal"
        }
      },
      {
        id: uuidv4(),
        type: "hero",
        content: "",
        props: {
          title: "Timeless Elegance",
          subtitle: "Handcrafted jewelry for life's most precious moments",
          buttonText: "Explore Collections",
          buttonLink: "#collections",
          alignment: "center",
          imageUrl: "https://images.unsplash.com/photo-1581252517866-6c03232384a4?q=80&w=1471&auto=format&fit=crop",
          overlay: true,
          height: "large",
          backgroundColor: "bg-gray-900"
        }
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
            type: "flex",
            content: "",
            props: {
              direction: "column",
              justify: "center",
              align: "center",
              className: "max-w-xl mx-auto text-center mb-16"
            },
            children: [
              {
                id: uuidv4(),
                type: "text",
                content: "CRAFTSMANSHIP",
                props: {
                  className: "text-gold-600 font-semibold tracking-widest mb-4"
                }
              },
              {
                id: uuidv4(),
                type: "heading",
                content: "The Art of Fine Jewelry",
                props: {
                  level: "h2",
                  className: "text-4xl font-light mb-6 tracking-wide"
                }
              },
              {
                id: uuidv4(),
                type: "text",
                content: "Each piece is meticulously handcrafted by our master artisans using ethically sourced materials and time-honored techniques passed down through generations. We combine traditional craftsmanship with innovative design to create jewelry that becomes part of your life story.",
                props: {
                  className: "text-gray-600"
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
              gap: "gap-6"
            },
            children: [
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "star",
                  title: "Ethically Sourced",
                  description: "We ensure all our gemstones and precious metals are responsibly and ethically sourced from trusted mines and suppliers that meet our rigorous standards."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "tag",
                  title: "Artisan Crafted",
                  description: "Each piece is handcrafted by skilled artisans with decades of experience. No machine mass production, only careful hands creating wearable art."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "shopping-bag",
                  title: "Lifetime Warranty",
                  description: "We stand behind our craftsmanship with a lifetime warranty on all pieces. Our jewelry is made to last generations, not seasons."
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
          backgroundColor: "bg-gray-50",
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
                  src: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?q=80&w=1470&auto=format&fit=crop",
                  alt: "Signature collection",
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
                    content: "SIGNATURE COLLECTION",
                    props: {
                      className: "text-gray-500 font-semibold tracking-widest mb-4"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "heading",
                    content: "Celestial Dreams",
                    props: {
                      level: "h2",
                      className: "text-4xl font-light mb-6 tracking-wide"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Inspired by the night sky, our Celestial Dreams collection features stars, moons, and cosmic elements transformed into wearable art. Each piece incorporates ethically sourced diamonds and sapphires set in 18k gold. The collection balances bold statement pieces with delicate everyday jewelry that catches the light with every movement.",
                    props: {
                      className: "text-gray-600 mb-8"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "button",
                    content: "View Collection",
                    props: {
                      variant: "default",
                      size: "lg",
                      url: "#",
                      className: "bg-gray-900 hover:bg-gray-800"
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
            content: "Featured Pieces",
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
                content: "Shop All Jewelry",
                props: {
                  variant: "outline",
                  size: "lg",
                  url: "/shop",
                  className: "border-gray-900 text-gray-900 hover:bg-gray-50"
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
          backgroundColor: "bg-gray-900",
          className: "py-24 text-white"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Bespoke Creations",
            props: {
              level: "h2",
              className: "text-4xl font-light text-center mb-8 tracking-wide"
            }
          },
          {
            id: uuidv4(),
            type: "text",
            content: "Create a truly one-of-a-kind piece that tells your unique story",
            props: {
              className: "text-gray-300 text-center text-lg max-w-2xl mx-auto mb-16"
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
                  title: "Consultation",
                  description: "Meet with our designers to discuss your vision",
                  image: "https://images.unsplash.com/photo-1544376798-76d0bf5a6f9a?q=80&w=1374&auto=format&fit=crop",
                  className: "bg-gray-800 border-gray-700 text-white"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Design",
                  description: "Collaborate on sketches and 3D renderings",
                  image: "https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?q=80&w=1365&auto=format&fit=crop",
                  className: "bg-gray-800 border-gray-700 text-white"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Creation",
                  description: "Watch as your piece is crafted by our artisans",
                  image: "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?q=80&w=1374&auto=format&fit=crop",
                  className: "bg-gray-800 border-gray-700 text-white"
                }
              }
            ]
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
                content: "Book a Consultation",
                props: {
                  variant: "outline",
                  size: "lg",
                  url: "#",
                  className: "border-white text-white hover:bg-gray-800"
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
            content: "Client Stories",
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
                  quote: "My engagement ring from Luxe Gems is breathtaking. The attention to detail and quality of craftsmanship exceeds every expectation. Five years later, it still sparkles like the day we picked it out.",
                  author: "Rebecca Anderson",
                  role: "New York, NY",
                  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1376&auto=format&fit=crop"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "Working with the design team on a custom anniversary piece was a wonderful experience. The result is a masterpiece we'll cherish forever. They captured our vision perfectly while adding their artistic expertise.",
                  author: "Thomas & Claire Harris",
                  role: "London, UK",
                  avatar: "https://images.unsplash.com/photo-1623082574085-157d955f1d35?q=80&w=1364&auto=format&fit=crop"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "The heirloom quality of Luxe Gems jewelry is unmatched. These aren't just accessories, they're future family treasures. The compliments I receive on my necklace are endless - it truly makes every outfit special.",
                  author: "Elena Miyazaki",
                  role: "Tokyo, Japan",
                  avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=1374&auto=format&fit=crop"
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
          siteName: "LUXE GEMS",
          links: [
            { text: "Home", url: "#" },
            { text: "Collections", url: "#" },
            { text: "Bespoke", url: "#" },
            { text: "Our Story", url: "#" },
            { text: "Contact", url: "#" },
            { text: "Care Guide", url: "#" }
          ],
          variant: "minimal"
        }
      }
    ]
  }
};
