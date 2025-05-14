
import { v4 as uuidv4 } from "@/lib/uuid";

export const fashionTemplate = {
  pages: {
    homepage: [
      {
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: "CHIC BOUTIQUE",
          links: [
            { text: "Home", url: "#" },
            { text: "New Arrivals", url: "#" },
            { text: "Collections", url: "#" },
            { text: "About", url: "#" },
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
          title: "Summer Collection 2025",
          subtitle: "Discover our latest styles with sustainable materials and modern designs",
          buttonText: "Shop Now",
          buttonLink: "#products",
          alignment: "center",
          imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1470&auto=format&fit=crop",
          overlay: true,
          height: "large",
          backgroundColor: "bg-stone-50"
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
            content: "New Arrivals",
            props: {
              level: "h2",
              className: "text-4xl font-light text-center mb-8 tracking-wider"
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
                content: "View All Collection",
                props: {
                  variant: "outline",
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
          backgroundColor: "bg-stone-50",
          className: "py-16"
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
                type: "image",
                content: "",
                props: {
                  src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1470&auto=format&fit=crop",
                  alt: "Women's Collection",
                  className: "w-full h-96 object-cover"
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
                  className: "p-8"
                },
                children: [
                  {
                    id: uuidv4(),
                    type: "heading",
                    content: "Women's Collection",
                    props: {
                      level: "h2",
                      className: "text-3xl font-light mb-4 tracking-wide"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "text",
                    content: "Discover our curated collection of contemporary women's fashion designed for the modern, confident woman. Featuring sustainably sourced materials and timeless designs that transition effortlessly from day to night. Our premium fabrics ensure comfort without compromising on style.",
                    props: {
                      className: "text-gray-600 mb-6"
                    }
                  },
                  {
                    id: uuidv4(),
                    type: "button",
                    content: "Explore Women's",
                    props: {
                      variant: "outline",
                      size: "default",
                      url: "#"
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
            content: "Our Instagram",
            props: {
              level: "h2",
              className: "text-3xl font-light text-center mb-8 tracking-wide"
            }
          },
          {
            id: uuidv4(),
            type: "grid",
            content: "",
            props: {
              columns: 5,
              gap: "gap-2"
            },
            children: [
              {
                id: uuidv4(),
                type: "image",
                content: "",
                props: {
                  src: "https://images.unsplash.com/photo-1548549557-dbe9946621da?q=80&w=1374&auto=format&fit=crop",
                  alt: "Instagram post 1",
                  className: "w-full aspect-square object-cover"
                }
              },
              {
                id: uuidv4(),
                type: "image",
                content: "",
                props: {
                  src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1440&auto=format&fit=crop",
                  alt: "Instagram post 2",
                  className: "w-full aspect-square object-cover"
                }
              },
              {
                id: uuidv4(),
                type: "image",
                content: "",
                props: {
                  src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1374&auto=format&fit=crop",
                  alt: "Instagram post 3",
                  className: "w-full aspect-square object-cover"
                }
              },
              {
                id: uuidv4(),
                type: "image",
                content: "",
                props: {
                  src: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1472&auto=format&fit=crop",
                  alt: "Instagram post 4",
                  className: "w-full aspect-square object-cover"
                }
              },
              {
                id: uuidv4(),
                type: "image",
                content: "",
                props: {
                  src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1473&auto=format&fit=crop",
                  alt: "Instagram post 5",
                  className: "w-full aspect-square object-cover"
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
                type: "text",
                content: "Follow us @chicboutique",
                props: {
                  className: "text-gray-600 text-lg"
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
          siteName: "CHIC BOUTIQUE",
          links: [
            { text: "Home", url: "#" },
            { text: "Shop", url: "#" },
            { text: "About", url: "#" },
            { text: "Contact", url: "#" },
            { text: "Terms", url: "#" },
            { text: "Privacy", url: "#" }
          ],
          variant: "minimal"
        }
      }
    ]
  }
};
