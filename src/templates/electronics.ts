
import { v4 as uuidv4 } from "@/lib/uuid";

export const electronicsTemplate = {
  pages: {
    homepage: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "TECH HUB",
          links: [
            { text: "Home", url: "#" },
            { text: "Products", url: "#" },
            { text: "Deals", url: "#" },
            { text: "Support", url: "#" },
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
          title: "Next Generation Technology",
          subtitle: "Discover the latest gadgets and tech innovations at unbeatable prices",
          buttonText: "Shop Latest Tech",
          buttonLink: "#products",
          alignment: "center",
          imageUrl: "/templates/electronics-hero.jpg",
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
            content: "Featured Categories",
            props: {
              level: "h2",
              className: "text-3xl font-bold text-center mb-10"
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
                  title: "Smartphones",
                  description: "Latest models with cutting-edge features",
                  image: "/templates/electronics-phones.jpg"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Laptops",
                  description: "Powerful computers for work and play",
                  image: "/templates/electronics-laptops.jpg"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Smart Home",
                  description: "Devices to make your home smarter",
                  image: "/templates/electronics-smarthome.jpg"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Accessories",
                  description: "Essential add-ons for your devices",
                  image: "/templates/electronics-accessories.jpg"
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
            content: "New Arrivals",
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
              productsPerPage: 8,
              showPagination: true,
              cardStyle: "shadow",
              sortBy: "created_at",
              sortOrder: "desc"
            }
          }
        ]
      },
      {
        id: uuidv4(),
        type: "section",
        content: "",
        props: {
          padding: "large",
          backgroundColor: "bg-blue-900",
          className: "py-16 text-white"
        },
        children: [
          {
            id: uuidv4(),
            type: "grid",
            content: "",
            props: {
              columns: 2,
              gap: "gap-8"
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
                    content: "Tech Support That Works",
                    props: {
                      level: "h2",
                      className: "text-3xl font-bold mb-4"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Our experts are available 24/7 to help you with any technical issues. We offer free support for all our products for the first year of purchase.",
                    props: {
                      className: "mb-6 text-blue-100"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "button",
                    content: "Contact Support",
                    props: {
                      variant: "outline",
                      size: "lg",
                      url: "#",
                      className: "border-white text-white hover:bg-white hover:text-blue-900"
                    }
                  }
                ]
              },
              {
                id: uuidv4(),
                type: "image",
                content: "",
                props: {
                  src: "/templates/electronics-support.jpg",
                  alt: "Tech Support",
                  className: "w-full h-80 object-cover rounded-lg"
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
            content: "What Our Customers Say",
            props: {
              level: "h2",
              className: "text-3xl font-bold text-center mb-10"
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
                  quote: "The customer service is outstanding. They helped me choose the perfect laptop for my needs and budget.",
                  author: "Michael Johnson",
                  role: "Software Developer",
                  avatar: "/placeholder.svg"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "Fast delivery and the products are exactly as described. Will definitely shop here again!",
                  author: "Sarah Williams",
                  role: "Graphic Designer",
                  avatar: "/placeholder.svg"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "I appreciate the 30-day trial period. It gave me time to properly test my new smartphone before committing.",
                  author: "David Lee",
                  role: "Business Analyst",
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
          siteName: "TECH HUB",
          links: [
            { text: "Home", url: "#" },
            { text: "Products", url: "#" },
            { text: "Support", url: "#" },
            { text: "Contact", url: "#" },
            { text: "Warranty", url: "#" },
            { text: "Returns", url: "#" }
          ],
          variant: "dark"
        }
      }
    ]
  }
};
