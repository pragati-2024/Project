import React, { useMemo, useState } from 'react';
import {
  FaClock,
  FaEnvelope,
  FaMapMarkedAlt,
  FaPaperPlane,
  FaUserGraduate
} from 'react-icons/fa';
import { FaBuildingColumns } from 'react-icons/fa6';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const canSubmit = useMemo(() => {
    return Boolean(form.name.trim() && form.email.trim() && form.message.trim());
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!canSubmit) {
      setStatus({ type: 'error', message: 'Please fill name, email, and message.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Unable to send message.');

      setStatus({ type: 'success', message: data?.message || 'Message sent successfully!' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err?.message || 'Something went wrong.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2c1b4e] via-[#110b23] to-[#0a061b] text-white px-4 py-10 font-[Inter]">
      <div className="max-w-6xl mx-auto mb-12">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 animate-slideUp">
            Contact Our Team
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            We're computer science students working on Project Aurora. Reach out with questions or collaboration ideas!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="w-full bg-[#1e293b] p-8 rounded-xl border border-[#334155] shadow-xl relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all">
            <h3 className="text-2xl font-semibold mb-6 relative text-white after:absolute after:bottom-[-8px] after:left-0 after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 after:rounded animate-gradientPulse">
              Contact Info
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4 group">
                <FaUserGraduate className="text-purple-400 mt-1" aria-hidden="true" />
                <p><strong>Team:</strong> Mocknet Developers</p>
              </div>
              <div className="flex items-start gap-4 group">
                <FaEnvelope className="text-purple-400 mt-1" aria-hidden="true" />
                <p><strong>Email:</strong> <a href="mailto:mocknet@university.edu" className="text-blue-400 hover:underline">mocknet@university.edu</a></p>
              </div>
              <div className="flex items-start gap-4 group">
                <FaBuildingColumns className="text-purple-400 mt-1" aria-hidden="true" />
                <p><strong>Department:</strong> Computer Science</p>
              </div>
              <div className="flex items-start gap-4 group">
                <FaMapMarkedAlt className="text-purple-400 mt-1" aria-hidden="true" />
                <p><strong>Campus Location:</strong> LPU , GLA</p>
              </div>
              <div className="flex items-start gap-4 group">
                <FaClock className="text-purple-400 mt-1" aria-hidden="true" />
                <p><strong>Hours:</strong> Mon-Fri, 10AM-6PM</p>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#1e293b] p-8 rounded-xl border border-[#334155] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
            <h3 className="text-2xl font-semibold mb-6 relative text-white after:absolute after:bottom-[-8px] after:left-0 after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 after:rounded animate-gradientPulse">
              Send a Message
            </h3>
            <form className="space-y-5" onSubmit={onSubmit}>
              {status.message && (
                <div
                  className={`rounded border px-4 py-3 text-sm ${
                    status.type === 'success'
                      ? 'border-green-500/40 bg-green-500/10 text-green-200'
                      : 'border-red-500/40 bg-red-500/10 text-red-200'
                  }`}
                  role="status"
                >
                  {status.message}
                </div>
              )}
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your name"
                  className="w-full p-3 rounded bg-[#1e293b] border border-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="your.email@university.edu"
                  className="w-full p-3 rounded bg-[#1e293b] border border-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block mb-1 font-medium">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={onChange}
                  placeholder="Project inquiry"
                  className="w-full p-3 rounded bg-[#1e293b] border border-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 font-medium">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows="4"
                  placeholder="Your message..."
                  className="w-full p-3 rounded bg-[#1e293b] border border-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full py-3 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-60 disabled:hover:scale-100"
              >
                <FaPaperPlane className="inline-block mr-2" aria-hidden="true" />
                {isSubmitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
