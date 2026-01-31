import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InterviewTipsPage = () => {
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
    {
      id: 'problem',
      category: "Problem Solving",
      title: "The Consultant's Secret Framework",
      excerpt: "McKinsey consultants use this exact method to crush case interviews - adapted for any problem-solving question.",
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1350&q=80",
      content: {
        description: "Top consultants use structured frameworks to break down complex problems. This adapted version works for any problem-solving interview question, from 'How many golf balls fit in a 747?' to real business challenges.",
        sections: [
          {
            title: "The SCQH Framework:",
            points: [
              "Situation - Clarify the context and constraints",
              "Complication - Identify the root problem",
              "Question - Define the key question to answer",
              "Hypothesis - Propose a solution path"
            ]
          }
        ]
      }
    },
    {
      id: 'storytelling',
      category: "Storytelling",
      title: "Hollywood's Formula for Answering 'Tell Me About Yourself'",
      excerpt: "Screenwriters use this story structure to captivate audiences - perfect it for your interview opener.",
      img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1350&q=80",
      content: {
        description: "The 'Hero's Journey' story structure used in blockbuster movies is perfect for crafting your 'Tell me about yourself' answer. It creates emotional connection while highlighting your qualifications.",
        sections: [
          {
            title: "The 3-Act Structure:",
            points: [
              "Act 1: The Setup (Past) - Briefly establish your background and motivations",
              "Act 2: The Conflict (Present) - Show the challenges you're solving now",
              "Act 3: The Resolution (Future) - Position yourself as the solution to their needs"
            ]
          }
        ]
      }
    },
    {
      id: 'technical',
      category: "Technical",
      title: "Whiteboard Interviews: How to Fail Gracefully",
      excerpt: "What to do when you're completely stuck (this saved my Google interview when I blanked on binary trees).",
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1350&q=80",
      content: {
        description: "Technical interviews test your problem-solving process more than perfect solutions. When stuck, how you recover often matters more than getting the 'right' answer.",
        sections: [
          {
            title: "Damage Control Strategies:",
            points: [
              "Buy time intelligently: 'That's an interesting challenge - let me think through this step by step'",
              "Break it down: Solve a simpler version of the problem first",
              "Think aloud: Narrate your thought process - interviewers can't help if they don't know where you're stuck",
              "Ask strategic questions: 'Would focusing on the data structure first be appropriate here?'",
              "Admit knowledge gaps: 'I'm not familiar with X algorithm, but here's how I'd approach it conceptually...'"
            ]
          }
        ]
      }
    },
    {
      id: 'body',
      category: "Body Language",
      title: "The Power Pose Myth: What Actually Works",
      excerpt: "Forget what you've heard - these 3 subtle movements make you appear 10x more confident instantly.",
      img: "https://images.unsplash.com/photo-1541178735493-479c1a27ed24?auto=format&fit=crop&w=1350&q=80",
      content: {
        description: "Forget striking a superhero pose in the bathroom. These subtle, research-backed techniques actually influence how interviewers perceive your confidence and competence.",
        sections: [
          {
            title: "3 Scientifically-Validated Techniques:",
            points: [
              "The 50/50 Weight Stance: Balanced weight distribution (not leaning) conveys stability and presence",
              "Triangular Gazing: Alternate between left eye, right eye, and mouth to create connection without staring",
              "Micro-Mirroring: Subtly match the interviewer's posture and speech pace (with 2-3 second delay)"
            ]
          }
        ]
      }
    },
    {
      id: 'negotiation',
      category: "Negotiation",
      title: "Salary Negotiation: The Magic Number Trick",
      excerpt: "How to name your price without pricing yourself out (this one phrase increased my offer by 22%).",
      img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1350&q=80",
      content: {
        description: "The wrong number can cost you thousands. This research-backed method positions your request as reasonable while leaving room for negotiation.",
        sections: [
          {
            title: "The Precision Pricing Strategy:",
            points: [
              "Research shows precise numbers (e.g., $87,500) are perceived as more reasoned than round numbers ($85,000)",
              "Anchor high but realistic - use market data to justify",
              "Express flexibility - 'Based on my research, I was expecting something in the range of $87,500 to $92,000'",
              "Focus on total compensation - benefits, bonuses, equity matter"
            ]
          }
        ]
      }
    },
    {
      id: 'creativity',
      category: "Creativity",
      title: "'Show Me Your Creativity' Questions Decoded",
      excerpt: "What they're really asking and how to respond with examples that dazzle (even if you're not 'creative').",
      img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1350&q=80",
      content: {
        description: "Creativity questions aren't about artistic talent - they assess your problem-solving approach, adaptability, and ability to think beyond conventional solutions.",
        sections: [
          {
            title: "What Interviewers Really Want:",
            points: [
              "How you define and frame problems",
              "Ability to generate multiple solutions",
              "Comfort with ambiguity",
              "Willingness to take calculated risks",
              "Capacity to learn from failure"
            ]
          }
        ]
      }
    }
  ];

  const filteredPosts = activeCategory === 'All Superpowers' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const openBlogModal = (id) => {
    setActiveModal(id);
    document.body.style.overflow = 'hidden';
  };

  const closeBlogModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2c1b4e] via-[#110b23] to-[#0a061b] text-[#e6f1ff]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full flex justify-between items-center py-3 px-8 bg-[rgba(255,255,255,0.05)] backdrop-blur-md border-b border-[rgba(255,255,255,0.1)] shadow-lg z-50">
        <div className="text-2xl font-bold text-white">Mockneto</div>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-[#b78be6] transition">Home</Link>
          <Link to="/dashboard" className="text-white hover:text-[#b78be6] transition">Practice Interview</Link>
          <Link to="/interviewtips" className="text-white hover:text-[#b78be6] transition">Interview Tips</Link>
          <Link to="/contactus" className="text-white hover:text-[#b78be6] transition">Contact Us</Link>
          <Link to="/aboutus" className="text-white hover:text-[#b78be6] transition">About Us</Link>
          <Link to="/login" className="bg-gradient-to-r from-[#6648de] to-[#6a7ae7] text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden border-b border-[#1e2a47]">
        <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(123,97,255,0.3),transparent_70%)] blur-[100px] pointer-events-none"></div>
        
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
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-2 rounded-full border border-[#1e2a47] font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                activeCategory === category 
                  ? 'bg-gradient-to-r from-[#9d7aff] to-[#7f5af0] text-white'
                  : 'bg-[#112240] text-white hover:bg-[#1e2a47]'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="px-6 pb-20">
        <h2 className="text-3xl text-center font-bold text-[#ccd6f6] mb-10 relative">
          Interview Ninja Tactics
          <span className="block w-20 h-1 bg-gradient-to-r from-[#9d7aff] to-[#64ffda] mx-auto mt-2"></span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredPosts.map((post, index) => (
            <div 
              key={index} 
              className="bg-[#112240] rounded-lg overflow-hidden border border-[#1e2a47] shadow-lg transform hover:-translate-y-2 transition duration-300"
            >
              <div className="overflow-hidden h-48">
                <img 
                  src={post.img} 
                  alt={post.category} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <div className="p-5">
                <span className="inline-block mb-2 text-sm font-semibold bg-[#9d7aff1a] text-[#9d7aff] px-3 py-1 rounded border border-[#9d7aff4d]">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-[#ccd6f6] hover:text-[#64ffda] transition mb-2">
                  {post.title}
                </h3>
                <p className="text-[#8892b0] text-sm mb-4">{post.excerpt}</p>
                <button 
                  onClick={() => openBlogModal(post.id)}
                  className="inline-flex items-center text-[#64ffda] hover:text-[#9d7aff] font-semibold text-sm transition"
                >
                  Read More →
                </button>
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
          ].map((item, index) => (
            <div key={index} className="min-w-[150px]">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#9d7aff] to-[#64ffda] text-transparent bg-clip-text mb-2">
                {item.stat}
              </div>
              <div className="uppercase tracking-widest text-[#8892b0] text-sm">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Post Modals */}
      {activeModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeBlogModal}
        >
          <div 
            className="bg-gradient-to-b from-[#112240] to-[#0a192f] rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {blogPosts.filter(post => post.id === activeModal).map(post => (
              <div key={post.id}>
                <div className="flex justify-between items-start mb-6">
                  <span className="inline-block bg-[rgba(157,122,255,0.1)] text-[#9d7aff] px-3 py-1 rounded border border-[rgba(157,122,255,0.3)] text-sm font-semibold">
                    {post.category}
                  </span>
                  <button 
                    onClick={closeBlogModal}
                    className="text-[#8892b0] text-2xl hover:text-[#64ffda] transition"
                  >
                    &times;
                  </button>
                </div>
                
                <h2 className="text-3xl font-bold text-[#ccd6f6] mb-6">{post.title}</h2>
                
                <img 
                  src={post.img} 
                  alt={post.category} 
                  className="w-full h-64 object-cover rounded-lg mb-6 shadow-lg"
                />
                
                <div className="text-[#a8b2d1] space-y-6">
                  <p>{post.content.description}</p>
                  
                  {post.content.sections.map((section, index) => (
                    <div key={index}>
                      <h3 className="text-xl text-[#64ffda] font-semibold mb-3">{section.title}</h3>
                      <ul className="space-y-2 pl-5">
                        {section.points.map((point, i) => (
                          <li key={i} className="relative pl-5">
                            <span className="absolute left-0 top-2 w-2 h-2 bg-[#9d7aff] rounded-full"></span>
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

export default InterviewTipsPage;