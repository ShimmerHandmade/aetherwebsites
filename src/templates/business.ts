
import { v4 as uuidv4 } from "@/lib/uuid";

export const businessTemplate = {
  pages: {
    homepage: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "Business Solutions",
          links: [
            { text: "Home", url: "#" },
            { text: "Services", url: "#services" },
            { text: "About", url: "#about" },
            { text: "Testimonials", url: "#testimonials" },
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
          title: "Growing Your Business",
          subtitle: "Professional solutions for your company's success",
          buttonText: "Get Started",
          buttonLink: "#services",
          alignment: "center",
          imageUrl: "/templates/business-hero.jpg",
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
          className: "py-16",
          id: "about"
        },
        children: [
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
                type: "container",
                content: "",
                props: {},
                children: [
                  {
                    id: uuidv4(),
                    type: "heading",
                    content: "About Our Company",
                    props: {
                      level: "h2",
                      className: "text-3xl font-bold mb-6"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Founded in 2010, our company has been providing top-tier business solutions to clients across various industries. We pride ourselves on our commitment to excellence, innovation, and customer satisfaction.",
                    props: {
                      className: "text-gray-600 mb-4"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Our team of experts brings decades of combined experience to every project, ensuring that we deliver results that exceed expectations and drive real business growth.",
                    props: {
                      className: "text-gray-600 mb-6"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "button",
                    content: "Learn More",
                    props: {
                      variant: "default",
                      size: "default"
                    }
                  }
                ]
              },
              {
                id: uuidv4(),
                type: "image",
                content: "",
                props: {
                  src: "/placeholder.svg",
                  alt: "Team Working",
                  className: "rounded-lg shadow-lg"
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
          className: "py-16",
          id: "services"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Our Services",
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
                type: "feature",
                content: "",
                props: {
                  icon: "BarChart",
                  title: "Business Consulting",
                  description: "Strategic guidance to optimize your operations and drive growth."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "PieChart",
                  title: "Financial Analysis",
                  description: "Comprehensive financial reviews and planning for sustainable success."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "Users",
                  title: "HR Solutions",
                  description: "Streamline your talent acquisition and management processes."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "Megaphone",
                  title: "Marketing Strategy",
                  description: "Data-driven marketing approaches to reach your target audience."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "Code",
                  title: "IT Consulting",
                  description: "Technology solutions tailored to your business requirements."
                }
              },
              {
                id: uuidv4(),
                type: "feature",
                content: "",
                props: {
                  icon: "TrendingUp",
                  title: "Growth Strategy",
                  description: "Customized plans to take your business to the next level."
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
          backgroundColor: "bg-blue-700",
          className: "py-16 text-white",
          id: ""
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Ready to Transform Your Business?",
            props: {
              level: "h2",
              className: "text-3xl font-bold text-center mb-6"
            }
          },
          {
            id: uuidv4(),
            type: "text",
            content: "Schedule a free consultation with one of our experts to discuss your specific needs.",
            props: {
              className: "text-center text-blue-100 max-w-2xl mx-auto mb-8"
            }
          },
          {
            id: uuidv4(),
            type: "flex",
            content: "",
            props: {
              justifyContent: "center"
            },
            children: [
              {
                id: uuidv4(),
                type: "button",
                content: "Book a Consultation",
                props: {
                  variant: "outline",
                  size: "lg",
                  className: "border-white text-white hover:bg-white hover:text-blue-700"
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
          className: "py-16",
          id: "testimonials"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "What Our Clients Say",
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
                  quote: "Working with this team transformed our business operations and significantly increased our revenue within just six months.",
                  author: "James Wilson",
                  role: "CEO, TechStart Inc.",
                  avatar: "/placeholder.svg"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "Their strategic insights and practical solutions helped us navigate a challenging market transition with remarkable success.",
                  author: "Sarah Johnson",
                  role: "Marketing Director, Global Brands",
                  avatar: "/placeholder.svg"
                }
              },
              {
                id: uuidv4(),
                type: "testimonial",
                content: "",
                props: {
                  quote: "The financial analysis provided gave us clarity and confidence in our expansion plans. Highly recommended for any growing business.",
                  author: "Michael Chen",
                  role: "CFO, Innovate Corp",
                  avatar: "/placeholder.svg"
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
          className: "py-16",
          id: "contact"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Contact Us",
            props: {
              level: "h2",
              className: "text-3xl font-bold text-center mb-8"
            }
          },
          {
            id: uuidv4(),
            type: "text",
            content: "Have questions or ready to start? Get in touch with our team.",
            props: {
              className: "text-center text-gray-600 max-w-2xl mx-auto mb-12"
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
                type: "container",
                content: "",
                props: {
                  className: "bg-white p-6 rounded-lg shadow-md"
                },
                children: [
                  {
                    id: uuidv4(),
                    type: "heading",
                    content: "Send Us a Message",
                    props: {
                      level: "h3",
                      className: "text-xl font-semibold mb-4"
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
                        { name: "phone", label: "Phone Number", type: "tel" },
                        { name: "message", label: "Message", type: "textarea", required: true }
                      ],
                      submitText: "Send Message"
                    }
                  }
                ]
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
                    content: "Our Office",
                    props: {
                      level: "h3",
                      className: "text-xl font-semibold mb-4"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "123 Business Avenue\nSuite 456\nSan Francisco, CA 94107",
                    props: {
                      className: "text-gray-600 mb-6 whitespace-pre-line"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "heading",
                    content: "Contact Information",
                    props: {
                      level: "h3",
                      className: "text-xl font-semibold mb-4"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Email: info@businesssolutions.com\nPhone: (555) 123-4567\nHours: Monday-Friday, 9AM-5PM PST",
                    props: {
                      className: "text-gray-600 whitespace-pre-line"
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
          siteName: "Business Solutions",
          links: [
            { text: "Home", url: "#" },
            { text: "Services", url: "#services" },
            { text: "About", url: "#about" },
            { text: "Testimonials", url: "#testimonials" },
            { text: "Contact", url: "#contact" }
          ],
          variant: "dark"
        }
      }
    ]
  }
};
