import React, { useState } from 'react';

const InterviewTips = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All Superpowers');

  const categories = [
    "All Superpowers", "Communication", "Leadership", "Problem Solving",
    "Storytelling", "Technical", "Body Language", "Negotiation",
    "Creativity", "Stress Management"
  ];

  const blogPosts = [
    {
      id: 'communication',
      category: "Communication",
      title: "The 3-Second Rule That Makes You Unforgettable",
      excerpt: "Discover the neuroscience-backed technique that makes interviewers hang on your every word (most candidates never do this).",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1350&q=80",
      content: {
        description: "Most candidates rush their answers, creating a forgettable impression. The 3-second rule is a neuroscience-backed technique that makes interviewers remember you as thoughtful and composed.",
        sections: [
          {
            title: "How to Apply the 3-Second Rule:",
            points: [
              "Pause for 3 seconds before answering any question - this shows deliberation and prevents rushed responses",
              "Maintain eye contact during the pause - establishes confidence and connection",
              "Breathe deeply - oxygenates your brain for clearer thinking",
              "Structure your answer mentally - creates a more coherent response",
              "Smile slightly - releases endorphins to calm your nerves"
            ]
          },
          {
            title: "Why This Works:",
            points: [
              "Creates anticipation - makes the interviewer lean in",
              "Demonstrates emotional intelligence - shows you think before speaking",
              "Differentiates you - 92% of candidates answer immediately",
              "Gives you time - to formulate a stronger response",
              "Reduces filler words - like 'um' and 'ah' by 60%"
            ]
          }
        ]
      }
    },
    {
      id: 'leadership',
      category: "Leadership",
      title: "Fake It Till You Make It? Better Strategy Inside",
      excerpt: "How to demonstrate leadership when you've never managed a team (this works even for entry-level candidates).",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80",
      content: {
        description: "You don't need a formal leadership title to demonstrate leadership potential. Interviewers look for specific behaviors that predict leadership success, regardless of your experience level.",
        sections: [
          {
            title: "Prove Leadership Without Experience:",
            points: [
              "Highlight informal leadership - mentoring, training new team members, organizing events",
              "Use the STAR-L method - Situation, Task, Action, Result + Leadership lesson",
              "Show initiative - projects you started without being asked",
              "Demonstrate influence - times you changed minds or improved processes",
              "Share learning moments - leadership isn't about perfection"
            ]
          }
        ]
      }
    },
    // Add other blog posts with similar structure
  ];

  const openModal = (modalId) => {
    setActiveModal(modalId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-gradient-to-b from-[#2c1b4e] via-[#110b23] to-[#0a061b] text-[#e6f1ff] min-h-screen">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 w-full flex justify-between items-center py-3 px-8 bg-[rgba(255,255,255,0.05)] backdrop-blur-md border-b border-[rgba(255,255,255,0.1)] shadow-lg z-50">
        <div className="logo">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#64ffda] to-[#9d7aff] text-transparent bg-clip-text">Mockneto</h1>
        </div>
        <div className="flex items-center gap-5">
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-white hover:text-[#b78be6] transition">Home</a>
            <a href="#" className="text-white hover:text-[#b78be6] transition">Practice Interview</a>
            <a href="/interviewtips" className="text-white hover:text-[#b78be6] transition">Interview Tips</a>
            <a href="/contactus" className="text-white hover:text-[#b78be6] transition">Contact Us</a>
            <a href="/aboutus" className="text-white hover:text-[#b78be6] transition">About Us</a>
          </nav>
          <a href="/login" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6648de] to-[#6a7ae7] text-white font-semibold hover:shadow-lg transition">Login</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden border-b border-[#1e2a47]">
        <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-radial-gradient(circle, rgba(123, 97, 255, 0.3), transparent 70%) blur-[100px] pointer-events-none"></div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#9d7aff] to-[#64ffda] text-transparent bg-clip-text mb-4 animate-fadeInDown">
          Interview Mastery Unleashed
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-[#ccd6f6] animate-fadeInUp">
          Transform from nervous candidate to confident professional with these battle-tested strategies that make interviewers say "Wow!"
        </p>
        <div className="relative max-w-xl mx-auto mt-10 animate-fadeIn">
          <input
            type="text"
            placeholder="Search for killer interview tactics..."
            className="w-full py-4 px-6 rounded-full bg-[#112240] text-white border border-[#1e2a47] focus:outline-none focus:ring-2 focus:ring-[#64ffda]"
          />
          <button className="absolute right-2 top-2 bg-gradient-to-r from-[#9d7aff] to-[#7f5af0] text-white px-6 py-2 rounded-full font-semibold hover:translate-y-[-2px] transition">
            Find Secrets
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-[#ccd6f6] mb-10 relative inline-block">
          Dominate Every Interview Dimension
          <span className="block w-20 h-1 bg-gradient-to-r from-[#9d7aff] to-[#64ffda] mx-auto mt-2"></span>
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full border border-[#1e2a47] font-medium transition hover:scale-105 hover:shadow-lg ${
                activeCategory === category 
                  ? 'bg-gradient-to-r from-[#9d7aff] to-[#7f5af0] text-white' 
                  : 'bg-[#112240] text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="px-6 pb-20">
        <h2 className="text-3xl text-center font-bold text-[#ccd6f6] mb-10">
          Interview Ninja Tactics
          <span className="block w-20 h-1 bg-gradient-to-r from-[#9d7aff] to-[#64ffda] mx-auto mt-2"></span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogPosts.map((post) => (
            <div 
              key={post.id}
              className="bg-[#112240] rounded-lg overflow-hidden border border-[#1e2a47] shadow-lg transform hover:-translate-y-2 transition cursor-pointer"
              onClick={() => openModal(post.id)}
            >
              <img 
                src={post.img} 
                alt={post.category} 
                className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105" 
              />
              <div className="p-5">
                <span className="inline-block mb-2 text-sm font-semibold bg-[#9d7aff1a] text-[#9d7aff] px-3 py-1 rounded border border-[#9d7aff4d]">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-[#ccd6f6] hover:text-[#64ffda] transition mb-2">
                  {post.title}
                </h3>
                <p className="text-[#8892b0] text-sm">{post.excerpt}</p>
                <div className="inline-flex items-center mt-4 text-[#64ffda] hover:text-[#9d7aff] font-semibold text-sm transition">
                  Read More →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-[#112240] to-[#0a192f] py-16 border-t border-b border-[#1e2a47]">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-around text-center gap-8 px-4">
          {[
            { stat: "97%", label: "More Confidence" },
            { stat: "3.5x", label: "More Callbacks" },
            { stat: "42%", label: "Higher Offers" },
          ].map((s, i) => (
            <div key={i} className="min-w-[150px]">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#9d7aff] to-[#64ffda] text-transparent bg-clip-text mb-2">
                {s.stat}
              </div>
              <div className="uppercase tracking-widest text-[#8892b0] text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0e061a] text-[#ccc] pt-12 pb-6 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="footer-section">
            <h3 className="text-xl font-bold text-[#c499ff] mb-4 pb-2 border-b-2 border-[#7f5af0]">Mockneto</h3>
            <p className="mb-4">Your personal AI coach to master real-world interviews with confidence. Transform your interview skills with our cutting-edge AI technology.</p>
            <div className="flex gap-4 text-xl">
              <a href="#" className="text-[#c499ff] hover:text-white transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-[#c499ff] hover:text-white transition"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="text-[#c499ff] hover:text-white transition"><i className="fab fa-github"></i></a>
              <a href="#" className="text-[#c499ff] hover:text-white transition"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="text-lg font-bold text-[#c499ff] mb-4 pb-2 border-b-2 border-[#7f5af0]">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#bbb] hover:text-white transition">Home</a></li>
              <li><a href="#" className="text-[#bbb] hover:text-white transition">Practice Interview</a></li>
              <li><a href="#" className="text-[#bbb] hover:text-white transition">Interview Tips</a></li>
              <li><a href="#" className="text-[#bbb] hover:text-white transition">Mock Assignment</a></li>
              <li><a href="#" className="text-[#bbb] hover:text-white transition">About Us</a></li>
              <li><a href="#" className="text-[#bbb] hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="text-lg font-bold text-[#c499ff] mb-4 pb-2 border-b-2 border-[#7f5af0]">Interview Tips</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#bbb] hover:text-white transition">Communication Skills</a></li>
              <li><a href="#" className="text-[#bbb] hover:text-white transition">Leadership Skills</a></li>
              <li><a href="#" className="text-[#bbb] hover:text-white transition">Problem Solving</a></li>
              <li><a href="#" className="text-[#bbb] hover:text-white transition">Body Language</a></li>
              <li><a href="#" className="text-[#bbb] hover:text-white transition">Creativity</a></li>
              <li><a href="#" className="text-[#bbb] hover:text-white transition">Practice Questions</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="text-lg font-bold text-[#c499ff] mb-4 pb-2 border-b-2 border-[#7f5af0]">Stay Updated</h4>
            <p className="mb-4">Subscribe to our newsletter for the latest interview tips and AI updates.</p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-3 py-2 rounded bg-[#20132d] text-[#eee] border-none focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
              />
              <button 
                type="submit" 
                className="w-full bg-[#a974ff] text-white px-3 py-2 rounded hover:bg-[#7f5af0] transition"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-4 space-y-2">
              <p className="flex items-center gap-2"><i className="fas fa-envelope"></i> support@mockneto.com</p>
              <p className="flex items-center gap-2"><i className="fas fa-phone-alt"></i> +91 8282828282</p>
              <p className="flex items-center gap-2"><i className="fas fa-map-marker-alt"></i> Bharat</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#2e1a4f] text-center text-[#aaa] text-sm">
          <p>&copy; 2025 Mockneto. All rights reserved.</p>
          <div className="flex justify-center gap-2 mt-2">
            <a href="#" className="text-[#888] hover:text-white transition">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="text-[#888] hover:text-white transition">Terms of Service</a>
            <span>|</span>
            <a href="#" className="text-[#888] hover:text-white transition">Cookie Policy</a>
            <span>|</span>
            <a href="#" className="text-[#888] hover:text-white transition">GDPR</a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {activeModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-gradient-to-b from-[#112240] to-[#0a192f] rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#1e2a47] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {blogPosts.filter(post => post.id === activeModal).map(post => (
              <div key={post.id}>
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-[#1e2a47]">
                  <div>
                    <span className="inline-block mb-3 bg-[rgba(157,122,255,0.1)] text-[#9d7aff] px-4 py-1 rounded border border-[rgba(157,122,255,0.3)] font-semibold">
                      {post.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#ccd6f6]">{post.title}</h2>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="text-3xl text-[#8892b0] hover:text-[#64ffda] transition"
                  >
                    &times;
                  </button>
                </div>

                <img 
                  src={post.img} 
                  alt={post.category} 
                  className="w-full h-64 object-cover rounded-lg mb-6 shadow-lg"
                />

                <div className="text-[#a8b2d1] space-y-6">
                  <p>{post.content.description}</p>

                  {post.content.sections.map((section, index) => (
                    <div key={index}>
                      <h3 className="text-xl text-[#64ffda] my-4">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.points.map((point, i) => (
                          <li key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-[#9d7aff] before:rounded-full">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewTips;