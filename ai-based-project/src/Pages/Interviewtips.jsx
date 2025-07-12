// import React from 'react';
// import './Interviewtips.css';

// const Interviewtips = () => {
//   return (
//     <>
//       <header>
//         <div className="container">
//           <h1>Interview Mastery Unleashed</h1>
//           <p>Transform from nervous candidate to confident professional with these battle-tested strategies that make interviewers say "Wow!"</p>
//           <div className="search-bar">
//             <input type="text" placeholder="Search for killer interview tactics..." />
//             <button>Find Secrets</button>
//           </div>
//         </div>
//       </header>

//       <section className="categories">
//         <div className="container">
//           <h2>Dominate Every Interview Dimension</h2>
//           <div className="category-tags">
//             <div className="category-tag active">All Superpowers</div>
//             <div className="category-tag">Communication</div>
//             <div className="category-tag">Leadership</div>
//             <div className="category-tag">Problem Solving</div>
//             <div className="category-tag">Storytelling</div>
//             <div className="category-tag">Technical</div>
//             <div className="category-tag">Body Language</div>
//             <div className="category-tag">Negotiation</div>
//             <div className="category-tag">Creativity</div>
//             <div className="category-tag">Stress Management</div>
//           </div>
//         </div>
//       </section>

//       <section className="blog-section">
//         <div className="container">
//           <h2>Interview Ninja Tactics</h2>
//           <div className="blog-grid">
//             {/* Blog Card 1 */}
//             <div className="blog-card">
//               <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Communication Skills" />
//               <div className="blog-content">
//                 <span className="blog-category">Communication</span>
//                 <h3 className="blog-title">The 3-Second Rule That Makes You Unforgettable</h3>
//                 <p className="blog-excerpt">Discover the neuroscience-backed technique that makes interviewers hang on your every word (most candidates never do this).</p>
//                 <a href="error 404.html" className="read-more">Steal This Technique</a>
//               </div>
//             </div>

//             {/* Blog Card 2 */}
//             <div className="blog-card">
//               <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Leadership Skills" />
//               <div className="blog-content">
//                 <span className="blog-category">Leadership</span>
//                 <h3 className="blog-title">Fake It Till You Make It? Better Strategy Inside</h3>
//                 <p className="blog-excerpt">How to demonstrate leadership when you've never managed a team (this works even for entry-level candidates).</p>
//                 <a href="error 404.html" className="read-more">Leadership Hacks</a>
//               </div>
//             </div>

//             {/* Blog Card 3 */}
//             <div className="blog-card">
//               <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Problem Solving" />
//               <div className="blog-content">
//                 <span className="blog-category">Problem Solving</span>
//                 <h3 className="blog-title">The Consultant's Secret Framework</h3>
//                 <p className="blog-excerpt">McKinsey consultants use this exact method to crush case interviews - adapted for any problem-solving question.</p>
//                 <a href="error 404.html" className="read-more">Learn the Framework</a>
//               </div>
//             </div>

//             {/* Blog Card 4 */}
//             <div className="blog-card">
//               <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Storytelling" />
//               <div className="blog-content">
//                 <span className="blog-category">Storytelling</span>
//                 <h3 className="blog-title">Hollywood's Formula for Answering "Tell Me About Yourself"</h3>
//                 <p className="blog-excerpt">Screenwriters use this story structure to captivate audiences - perfect it for your interview opener.</p>
//                 <a href="error 404.html" className="read-more">Storytelling Magic</a>
//               </div>
//             </div>

//             {/* Blog Card 5 */}
//             <div className="blog-card">
//               <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Technical Interviews" />
//               <div className="blog-content">
//                 <span className="blog-category">Technical</span>
//                 <h3 className="blog-title">Whiteboard Interviews: How to Fail Gracefully</h3>
//                 <p className="blog-excerpt">What to do when you're completely stuck (this saved my Google interview when I blanked on binary trees).</p>
//                 <a href="error 404.html" className="read-more">Damage Control</a>
//               </div>
//             </div>

//             {/* Blog Card 6 */}
//             <div className="blog-card">
//               <img src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Body Language" />
//               <div className="blog-content">
//                 <span className="blog-category">Body Language</span>
//                 <h3 className="blog-title">The Power Pose Myth: What Actually Works</h3>
//                 <p className="blog-excerpt">Forget what you've heard - these 3 subtle movements make you appear 10x more confident instantly.</p>
//                 <a href="error 404.html" className="read-more">Body Language Hacks</a>
//               </div>
//             </div>

//             {/* Blog Card 7 */}
//             <div className="blog-card">
//               <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Negotiation" />
//               <div className="blog-content">
//                 <span className="blog-category">Negotiation</span>
//                 <h3 className="blog-title">Salary Negotiation: The Magic Number Trick</h3>
//                 <p className="blog-excerpt">How to name your price without pricing yourself out (this one phrase increased my offer by 22%).</p>
//                 <a href="error 404.html" className="read-more">Get Paid</a>
//               </div>
//             </div>

//             {/* Blog Card 8 */}
//             <div className="blog-card">
//               <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Creativity" />
//               <div className="blog-content">
//                 <span className="blog-category">Creativity</span>
//                 <h3 className="blog-title">"Show Me Your Creativity" Questions Decoded</h3>
//                 <p className="blog-excerpt">What they're really asking and how to respond with examples that dazzle (even if you're not "creative").</p>
//                 <a href="error 404.html" className="read-more">Creative Solutions</a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="stats">
//         <div className="container">
//           <div className="stats-container">
//             <div className="stat-item">
//               <div className="stat-number">97%</div>
//               <div className="stat-label">More Confidence</div>
//             </div>
//             <div className="stat-item">
//               <div className="stat-number">3.5x</div>
//               <div className="stat-label">More Callbacks</div>
//             </div>
//             <div className="stat-item">
//               <div className="stat-number">42%</div>
//               <div className="stat-label">Higher Offers</div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Interviewtips;
