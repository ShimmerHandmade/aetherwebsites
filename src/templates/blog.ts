
import { v4 as uuidv4 } from "@/lib/uuid";

export const blogTemplate = {
  pages: {
    homepage: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "My Blog",
          links: [
            { text: "Home", url: "#" },
            { text: "Articles", url: "#" },
            { text: "Categories", url: "#" },
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
          title: "Welcome to My Blog",
          subtitle: "Thoughts, stories and ideas",
          buttonText: "Start Reading",
          buttonLink: "#featured",
          alignment: "center",
          imageUrl: "/templates/blog-hero.jpg",
          overlay: true,
          height: "medium",
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
          className: "py-12",
          id: "featured"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Featured Posts",
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
              gap: "gap-8"
            },
            children: [
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Getting Started with Web Development",
                  description: "Learn the basics of HTML, CSS, and JavaScript to begin your journey into web development.",
                  image: "/placeholder.svg",
                  link: "#",
                  metadata: "May 15, 2024 • 5 min read"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "The Future of Artificial Intelligence",
                  description: "Exploring the potential impact of AI on various industries and our daily lives.",
                  image: "/placeholder.svg",
                  link: "#",
                  metadata: "May 10, 2024 • 8 min read"
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
            content: "Latest Articles",
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
                type: "card",
                content: "",
                props: {
                  title: "Mastering CSS Grid Layout",
                  description: "A comprehensive guide to using CSS Grid for modern web layouts.",
                  image: "/placeholder.svg",
                  link: "#",
                  metadata: "May 5, 2024 • 6 min read"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Introduction to React Hooks",
                  description: "Learn how to use React Hooks to simplify your components and manage state.",
                  image: "/placeholder.svg",
                  link: "#",
                  metadata: "April 28, 2024 • 7 min read"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Building a JAMstack Website",
                  description: "Step-by-step tutorial on creating a high-performance website using the JAMstack architecture.",
                  image: "/placeholder.svg",
                  link: "#",
                  metadata: "April 20, 2024 • 10 min read"
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
              className: "mt-8"
            },
            children: [
              {
                id: uuidv4(),
                type: "button",
                content: "View All Articles",
                props: {
                  variant: "default",
                  size: "lg"
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
            content: "Subscribe to My Newsletter",
            props: {
              level: "h2",
              className: "text-3xl font-bold text-center mb-4"
            }
          },
          {
            id: uuidv4(),
            type: "text",
            content: "Get the latest articles delivered right to your inbox.",
            props: {
              className: "text-center text-gray-600 mb-8 max-w-2xl mx-auto"
            }
          },
          {
            id: uuidv4(),
            type: "form",
            content: "",
            props: {
              fields: [
                { name: "email", label: "Your Email", type: "email", required: true }
              ],
              submitText: "Subscribe",
              layout: "inline",
              className: "max-w-md mx-auto"
            }
          }
        ]
      },
      {
        id: uuidv4(),
        type: "footer",
        content: "",
        props: {
          siteName: "My Blog",
          links: [
            { text: "Home", url: "#" },
            { text: "Articles", url: "#" },
            { text: "Categories", url: "#" },
            { text: "About", url: "#" },
            { text: "Contact", url: "#" }
          ],
          variant: "dark"
        }
      }
    ]
  }
};
