
import { v4 as uuidv4 } from "@/lib/uuid";

export const portfolioTemplate = {
  pages: {
    homepage: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "My Portfolio",
          links: [
            { text: "Home", url: "#" },
            { text: "Projects", url: "#projects" },
            { text: "About", url: "#about" },
            { text: "Contact", url: "#contact" }
          ],
          variant: "default"
        }
      },
      {
        id: uuidv4(),
        type: "hero",
        content: "",
        props: {
          title: "Jane Doe",
          subtitle: "UI/UX Designer & Developer",
          buttonText: "View My Work",
          buttonLink: "#projects",
          alignment: "center",
          imageUrl: "/templates/portfolio-hero.jpg",
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
          className: "py-12",
          id: "about"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "About Me",
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
              gap: "gap-12",
              className: "items-center"
            },
            children: [
              {
                id: uuidv4(),
                type: "image",
                content: "",
                props: {
                  src: "/placeholder.svg",
                  alt: "Profile Photo",
                  className: "rounded-lg shadow-lg"
                }
              },
              {
                id: uuidv4(),
                type: "container",
                content: "",
                props: {},
                children: [
                  {
                    id: uuidv4(),
                    type: "heading",
                    content: "Hi there, I'm Jane",
                    props: {
                      level: "h3",
                      className: "text-2xl font-bold mb-4"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "I'm a passionate designer and developer with over 5 years of experience creating beautiful, functional websites and applications. My approach combines aesthetic sensibility with technical know-how to deliver projects that not only look great but perform excellently.",
                    props: {
                      className: "text-gray-600 mb-6"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "I specialize in UI/UX design, frontend development, and creating cohesive brand experiences across digital platforms.",
                    props: {
                      className: "text-gray-600 mb-6"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "button",
                    content: "Download Resume",
                    props: {
                      variant: "outline",
                      size: "default"
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
          backgroundColor: "bg-gray-50",
          className: "py-12",
          id: "projects"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "My Projects",
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
                  title: "E-Commerce Redesign",
                  description: "A complete redesign of an e-commerce platform focusing on user experience and conversion optimization.",
                  image: "/placeholder.svg",
                  link: "#"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Mobile Banking App",
                  description: "A modern, intuitive banking application designed with security and ease of use in mind.",
                  image: "/placeholder.svg",
                  link: "#"
                }
              },
              {
                id: uuidv4(),
                type: "card",
                content: "",
                props: {
                  title: "Healthcare Portal",
                  description: "A comprehensive patient management system for healthcare providers.",
                  image: "/placeholder.svg",
                  link: "#"
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
          className: "py-12",
          id: "contact"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Get In Touch",
            props: {
              level: "h2",
              className: "text-3xl font-bold text-center mb-8"
            }
          },
          {
            id: uuidv4(),
            type: "form",
            content: "",
            props: {
              fields: [
                { name: "name", label: "Your Name", type: "text", required: true },
                { name: "email", label: "Your Email", type: "email", required: true },
                { name: "subject", label: "Subject", type: "text" },
                { name: "message", label: "Message", type: "textarea", required: true }
              ],
              submitText: "Send Message",
              className: "max-w-2xl mx-auto"
            }
          }
        ]
      },
      {
        id: uuidv4(),
        type: "footer",
        content: "",
        props: {
          siteName: "Jane Doe Portfolio",
          links: [
            { text: "Home", url: "#" },
            { text: "Projects", url: "#projects" },
            { text: "About", url: "#about" },
            { text: "Contact", url: "#contact" }
          ],
          variant: "dark"
        }
      }
    ]
  }
};
