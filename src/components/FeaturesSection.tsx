
import { ShoppingCart, Calendar, CreditCard, User, Tag, Layout, Layers, Shield } from "lucide-react";

const features = [
  {
    title: "Drag & Drop Builder",
    description: "Build your store with our intuitive drag-and-drop interface. No coding required.",
    icon: <Layout className="w-6 h-6 text-brand-600" />
  },
  {
    title: "Beautiful Templates",
    description: "Choose from professionally designed templates for any industry.",
    icon: <Layers className="w-6 h-6 text-brand-600" />
  },
  {
    title: "Product Management",
    description: "Easily add, edit, and organize your products with our simple tools.",
    icon: <ShoppingCart className="w-6 h-6 text-brand-600" />
  },
  {
    title: "Secure Payments",
    description: "Accept payments safely with built-in security and multiple payment gateways.",
    icon: <CreditCard className="w-6 h-6 text-brand-600" />
  },
  {
    title: "Order Management",
    description: "Track orders, manage inventory, and handle shipping all in one place.",
    icon: <Calendar className="w-6 h-6 text-brand-600" />
  },
  {
    title: "Custom Discounts",
    description: "Create coupons and promotions to drive sales and reward your customers.",
    icon: <Tag className="w-6 h-6 text-brand-600" />
  },
  {
    title: "Multiple Websites",
    description: "Create one website on Basic, three on Professional, or five on Enterprise plans.",
    icon: <Layers className="w-6 h-6 text-brand-600" />
  },
  {
    title: "Enhanced Security",
    description: "Keep your customer data and business information safe with enterprise security.",
    icon: <Shield className="w-6 h-6 text-brand-600" />
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="gradient-text">Succeed Online</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ModernBuilder gives you the tools to build and grow your e-commerce business, all in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to build your online store?</h3>
              <p className="text-indigo-100 text-lg">
                Join thousands of businesses that use ModernBuilder to sell online.
              </p>
            </div>
            <button className="whitespace-nowrap px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
