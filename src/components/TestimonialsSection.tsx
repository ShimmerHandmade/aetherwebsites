
const testimonials = [
  {
    content: "Aether made setting up my online store incredibly easy. I was able to launch within a week and sales have been growing ever since.",
    author: "Sarah Johnson",
    position: "Owner, Handmade Jewelry Shop",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    content: "I've tried many e-commerce platforms, but Aether offers the perfect balance of simplicity and powerful features. Highly recommend!",
    author: "Michael Chen",
    position: "Founder, Organic Food Market",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    content: "The customer support team at Aether is exceptional. They helped me customize my store exactly how I wanted it.",
    author: "Emma Rodriguez",
    position: "CEO, Fashion Boutique",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="gradient-text">Thousands</span> of Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers say about Aether.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg relative"
            >
              {/* Quotation mark */}
              <div className="absolute top-4 right-6 text-6xl text-gray-100 font-serif">"</div>
              
              <p className="text-gray-600 mb-6 relative z-10">{testimonial.content}</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos */}
        <div className="mt-20">
          <p className="text-center text-gray-500 mb-8">TRUSTED BY BUSINESSES WORLDWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {/* These would typically be actual company logos */}
            <div className="text-2xl font-bold text-gray-300">COMPANY 1</div>
            <div className="text-2xl font-bold text-gray-300">COMPANY 2</div>
            <div className="text-2xl font-bold text-gray-300">COMPANY 3</div>
            <div className="text-2xl font-bold text-gray-300">COMPANY 4</div>
            <div className="text-2xl font-bold text-gray-300">COMPANY 5</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
