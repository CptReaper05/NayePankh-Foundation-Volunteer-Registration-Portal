import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  const stats = [
    { value: "200,000+", label: "Lives Uplifted", desc: "Provided free food, hygiene kits, education, and clothes" },
    { value: "500+", label: "Youth Volunteers", desc: "Leading student-driven community development across cities" },
    { value: "80G & 12A", label: "Govt. Registered", desc: "Tax-exempt status verified by the Income Tax Department" },
    { value: "100%", label: "Transparency", desc: "Every donation directly funds grassroots community drives" }
  ];

  const focusAreas = [
    {
      title: "Pathshala Education",
      desc: "Uplifting future generations by teaching basic literacy, providing books, bags, stationery, and sponsoring educational supplies for slum children.",
      icon: "📚",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Nutritious Food Program",
      desc: "Fighting hunger at the grass-root level. Our volunteers distribute freshly prepared, healthy hot meals weekly to families in impoverished slum clusters.",
      icon: "🍲",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Pad Kranti (Sanitation)",
      desc: "Promoting menstrual hygiene and health. We distribute free eco-friendly sanitary napkins to rural women and break the social taboos through awareness camps.",
      icon: "🌸",
      color: "from-rose-500 to-pink-600"
    },
    {
      title: "Clothing Drives",
      desc: "Providing warmth and dignity. We organize mass clothing drives, distributing sweaters, socks, and blankets to street and pavement dwellers during harsh winters.",
      icon: "🧥",
      color: "from-blue-500 to-indigo-600"
    }
  ];

  const newspapers = [
    { name: "Dainik Jagran", quote: "Student-led NayePankh Foundation feeds hundreds in local slum clusters." },
    { name: "Hindustan", quote: "NGO distributes thousands of sanitary pads to rural women, educating on menstrual health." },
    { name: "The Pioneer", quote: "Pathshala initiative by NayePankh brings basic reading and writing to street children." }
  ];

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-300">
      
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 md:py-24">
        {/* Background Decorative Gradient Blur */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500 rounded-full blur-[100px]"></div>
          <div className="absolute top-60 right-10 w-80 h-80 bg-orange-500 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                UP Govt. Registered NGO
              </span>
              <span className="bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                80G & 12A Certified
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-100">
              Uplifting Underprivileged Lives, <span className="text-emerald-400">One Step</span> At A Time
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              NayePankh Foundation is a registered NGO and one of the largest student-driven volunteer organizations in India. We have touched the lives of over 200,000+ individuals by offering free meals, quality education resources, sanitary kits, and warm clothing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link 
                href="/drives" 
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg shadow-lg hover:shadow-emerald-500/20 text-center transition-all duration-200"
              >
                Join Volunteer Drives 🤝
              </Link>
              <a 
                href="#programs" 
                className="px-8 py-3 bg-transparent border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white font-bold rounded-lg text-center transition-all duration-200"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Decorative Visual - Right (5 cols) */}
          <div className="lg:col-span-5 hidden lg:flex justify-center">
            <div className="relative p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-sm w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-3xl blur opacity-25"></div>
              <div className="relative bg-slate-950 p-6 rounded-2xl text-left space-y-4 border border-slate-900">
                <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                  <img src="/logo.png" alt="NayePankh Logo" className="w-12 h-12 rounded-full bg-white p-0.5 object-contain border border-slate-800" />
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">NayePankh Foundation</h4>
                    <span className="text-xs text-slate-500">Founded in 2021</span>
                  </div>
                </div>
                <blockquote className="text-slate-400 text-xs italic leading-relaxed">
                  "High school students started this initiative during the COVID-19 pandemic to assist families in need. Today, we are hundreds of youth volunteers strong, working in multiple cities."
                </blockquote>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
                  <span>✔</span> UP Government Registration No. 248/2021
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section className="bg-slate-900/40 border-y border-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 hover:border-slate-700 transition-all hover:shadow-md duration-300">
                <span className="text-3xl font-extrabold text-emerald-400 block">{stat.value}</span>
                <span className="text-slate-200 font-bold text-sm block mt-2 uppercase tracking-wide">{stat.label}</span>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Programs Focus Section */}
      <section id="programs" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">Our Core Mission</span>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-3">What We Do</h2>
          <p className="text-slate-400 mt-3 text-sm">
            NayePankh foundation implements targeted, grass-roots programs to ensure that every individual in our focus areas has access to fundamental basic needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {focusAreas.map((area, i) => (
            <div 
              key={i} 
              className="flex flex-col sm:flex-row gap-5 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-emerald-500/[0.02] transition-all duration-300 hover:border-slate-700"
            >
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-slate-950 flex items-center justify-center text-3xl border border-slate-800">
                {area.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-100">{area.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{area.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust, Legal and 12A/80G Certifications */}
      <section className="bg-slate-900/60 border-y border-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Trust Text */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-400/10 border border-emerald-500/20 px-3 py-1 rounded-full">Transparency & Authenticity</span>
            <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Your Trust is Our Greatest Asset</h2>
            <p className="text-slate-450 text-sm leading-relaxed text-slate-400">
              We are a registered society and hold essential government tax-exempt certifications. Every rupee contributed to NayePankh Foundation is audited and used for community upliftment drives. Contributors are entitled to tax exemptions under Section 80G.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-slate-300 text-xs">
                <span className="text-emerald-400">✔</span> Registered under Society Registration Act (Reg No. 248/2021)
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-xs">
                <span className="text-emerald-400">✔</span> 12A Certified Unique Registration Number
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-xs">
                <span className="text-emerald-400">✔</span> 80G Tax Exemption Eligible donations
              </div>
            </div>
          </div>

          {/* Trust Details Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="text-emerald-400 font-bold text-xs">12A Certification</span>
              <h4 className="font-extrabold text-white text-base mt-2">Section 12A Registered</h4>
              <p className="text-slate-500 text-xs mt-1">Legally recognized as a non-profit organization focused entirely on public charity and service.</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="text-sky-400 font-bold text-xs">80G Tax Exemption</span>
              <h4 className="font-extrabold text-white text-base mt-2">Section 80G Approved</h4>
              <p className="text-slate-500 text-xs mt-1">Donations made to NayePankh Foundation qualify for tax deductions for domestic donors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Press Coverage */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">In the News</span>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-3">Media Recognition</h2>
          <p className="text-slate-400 mt-3 text-sm">
            Our student-led model and community welfare campaigns have been covered by prominent news agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newspapers.map((news, i) => (
            <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 hover:shadow-md transition-all duration-300">
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">{news.name}</div>
              <p className="text-slate-300 text-xs italic mt-3 leading-relaxed">
                "{news.quote}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-slate-950 text-white py-16 text-center border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-100">Ready to Fly with NayePankh?</h2>
          <p className="text-slate-450 text-sm max-w-xl mx-auto text-slate-400">
            Become a part of one of India's biggest student organizations. Use your skills, dedicate your time, and help us uplift rural communities.
          </p>
          <div className="pt-2">
            <Link 
              href="/drives" 
              className="inline-block px-10 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all text-sm"
            >
              Sign Up For Volunteer Drives 🤝
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Footer Banner */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
          <div>
            <strong className="text-emerald-500 font-extrabold text-sm block">NayePankh Foundation</strong>
            <p className="mt-1">UP Govt. Registered Society (Reg No. 248/2021) | 80G & 12A Tax Exempted</p>
          </div>
          <div className="text-right md:text-left space-y-1">
            <div>✉ Email: <a href="mailto:contact@nayepankh.com" className="hover:text-white transition-colors underline">contact@nayepankh.com</a></div>
            <div>📞 Contact: <a href="tel:+918318500748" className="hover:text-white transition-colors underline">+91 83185 00748</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}