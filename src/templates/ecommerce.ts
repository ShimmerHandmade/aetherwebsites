
import { v4 as uuidv4 } from "@/lib/uuid";

export const ecommerceTemplate = {
  pages: {
    // The home page content will be assigned dynamically by updateWebsiteTemplate based on the pages structure
    homepage: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "E-Commerce Store",
          links: [
            { text: "Home", url: "#" },
            { text: "Shop", url: "#" },
            { text: "About", url: "#" },
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
          title: "Welcome to Our Store",
          subtitle: "Find the best products at the best prices",
          buttonText: "Shop Now",
          buttonLink: "#products",
          alignment: "center",
          imageUrl: "/templates/ecommerce-hero.jpg",
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
            content: "Why Shop With Us",
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
                type: "feature",
                content: "",
                props: {
                  icon: "ShoppingBag",
                  title: "Quality Products",
                  description: "All our products are carefully selected to ensure the highest quality."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "Truck",
                  title: "Fast Shipping",
                  description: "Get your products delivered to your doorstep within days."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "HeadsetHelp",
                  title: "24/7 Support",
                  description: "Our customer service team is always ready to help you."
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
              className: "text-3xl font-bold text-center mb-8"
            }
          },
          {
            id: uuidv4(),
            type: "grid",
            content: "",
            props: {
              columns: 2,
              gap: "gap-6"
            },
            children: [
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "I love their products! Fast shipping and great customer service.",
                  author: "Jane Doe",
                  role: "Regular Customer",
                  avatar: "/placeholder.svg"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "Best online shopping experience I've ever had. Will definitely order again!",
                  author: "John Smith",
                  role: "First-time Customer",
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
          siteName: "E-Commerce Store",
          links: [
            { text: "Home", url: "#" },
            { text: "Shop", url: "#" },
            { text: "About", url: "#" },
            { text: "Contact", url: "#" }
          ],
          variant: "dark"
        }
      }
    ]
  }
};
