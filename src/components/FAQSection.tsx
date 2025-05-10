
import { useState } from "react";
import { PlusIcon, MinusIcon } from "lucide-react";

const faqs = [
  {
    question: "How does the 14-day free trial work?",
    answer: "You can sign up for ModernBuilder and use all the features for 14 days without entering any payment information. At the end of the trial, you can choose a plan that fits your needs. If you decide not to continue, your account will automatically be downgraded to a limited free version."
  },
  {
    question: "Do I need technical knowledge to use ModernBuilder?",
    answer: "Not at all! ModernBuilder is designed to be user-friendly even if you have no technical experience. Our drag-and-drop builder and intuitive interface make it easy to create a professional e-commerce store without any coding knowledge."
  },
  {
    question: "Can I use my own domain name?",
    answer: "Absolutely! You can connect your existing domain or purchase a new one directly through ModernBuilder. We make the process simple with step-by-step instructions to get your custom domain set up quickly."
  },
  {
    question: "Which payment methods can I accept in my store?",
    answer: "ModernBuilder supports a wide range of payment gateways including Stripe, PayPal, Apple Pay, Google Pay, and many more. This allows you to offer your customers their preferred payment methods for a smooth checkout experience."
  },
  {
    question: "Is there a limit to how many products I can sell?",
    answer: "The product limits depend on your plan. The Basic plan allows up to 20 products, Professional up to 500 products, and Enterprise offers unlimited products. You can upgrade your plan at any time as your business grows."
  },
  {
    question: "What kind of support do you offer?",
    answer: "All plans include email support and access to our comprehensive knowledge base. The Professional plan adds live chat support, while Enterprise customers receive priority support with dedicated account managers to help you succeed."
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about ModernBuilder.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="mb-4 border-b border-gray-200 pb-4 last:border-b-0"
            >
              <button
                className="flex justify-between items-center w-full text-left py-4 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-medium">{faq.question}</h3>
                {openIndex === index ? (
                  <MinusIcon className="w-5 h-5 text-brand-600" />
                ) : (
                  <PlusIcon className="w-5 h-5 text-brand-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="pb-4 pt-2 text-gray-600 animate-fade-in">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions? Contact our support team.
          </p>
          <button className="mt-4 inline-flex items-center text-brand-600 font-medium hover:text-brand-700">
            Contact Support
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
