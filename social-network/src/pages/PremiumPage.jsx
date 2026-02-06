import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sun, Moon, Coffee } from 'lucide-react';

const PremiumPage = () => {
  const navigate = useNavigate();
  const [activeDuration, setActiveDuration] = useState('1');
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to Light Mode
  const [showServices, setShowServices] = useState(false);

  // Pricing Data
  const monthlyBase = { basic: 5, plus: 15, pro: 25, elite: 50, diamond: 75, titanium: 100 };
  const totals = {
    1: { basic: 5, plus: 15, pro: 25, elite: 50, diamond: 75, titanium: 100 },
    3: { basic: 15, plus: 45, pro: 75, elite: 150, diamond: 225, titanium: 300 },
    6: { basic: 30, plus: 90, pro: 150, elite: 300, diamond: 450, titanium: 600 },
    12: { basic: 60, plus: 180, pro: 300, elite: 600, diamond: 900, titanium: 1200 }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      desc: 'Basic access to start',
      buttonClass: 'btn-free',
      buttonText: 'Continue Free',
      features: [
        'Up to 2h/day Focus Rooms',
        'Limited translations & corrections',
        'Pin up to 4 partners',
        'Ads included'
      ]
    },
    {
      name: 'Basic',
      id: 'basic',
      desc: 'Better for regular practice',
      buttonClass: 'btn-basic',
      buttonText: 'Select Basic',
      features: [
        'Up to 4h/day Focus Rooms',
        'Ad-free experience',
        'Unlimited message translations',
        'Unlimited grammar corrections',
        'Pin up to 15 partners',
        'Unlimited saved words & phrases',
        '60 encouragements / day'
      ]
    },
    {
      name: 'Plus',
      id: 'plus',
      desc: 'Enhanced learning tools',
      buttonClass: 'btn-plus',
      buttonText: 'Select Plus',
      features: [
        'Up to 8h/day Focus Rooms',
        'Advanced partner search filters',
        'Smart partner recommendations',
        'Voice-to-text conversion',
        'Save & organize learning notes',
        '120 encouragements / day',
        'Priority profile visibility'
      ]
    },
    {
      name: 'Pro',
      id: 'pro',
      popular: true,
      desc: 'Full language mastery',
      buttonClass: 'btn-pro',
      buttonText: 'Select Pro',
      features: [
        'Unlimited Focus Room time',
        'Pin up to 50 partners',
        'Pronunciation feedback tools',
        'Unlimited audio transcriptions',
        'See who pinned / viewed you',
        'Private Focus Rooms',
        '200 encouragements / day'
      ]
    },
    {
      name: 'Elite',
      id: 'elite',
      desc: 'Premium global access',
      buttonClass: 'btn-elite',
      buttonText: 'Select Elite',
      features: [
        'All Pro features',
        'Premium badge + custom ID',
        'Early access to new features',
        'Priority customer support',
        '300 encouragements / day',
        'Location-based discovery boost'
      ]
    },
    {
      name: 'Diamond',
      id: 'diamond',
      desc: 'Ultimate Power User',
      buttonClass: 'btn-diamond',
      buttonText: 'Select Diamond',
      features: [
        'Dedicated account manager',
        'Unlimited everything',
        '500 encouragements / day',
        'Exclusive "Diamond" Profile Ring',
        'Direct access to dev team feedback',
        'Monthly 1:1 Coaching Session'
      ]
    },
    {
      name: 'Titanium',
      id: 'titanium',
      desc: 'Legendary Status',
      buttonClass: 'btn-titanium',
      buttonText: 'Select Titanium',
      features: [
        'Founder\'s Circle Access',
        'Lifetime "Legend" Badge',
        '1000 encouragements / day',
        'Beta test new groundbreaking features',
        'Personalized App Theme',
        'VIP Event Invitations'
      ]
    },
    {
      name: 'Donation',
      price: 'Support Us',
      desc: 'Help the community grow',
      buttonClass: 'btn-donate',
      buttonText: 'Make Donation',
      isDonation: true,
      features: [
        'Thank-you badge on profile',
        'Community shoutout in newsletter',
        'Help keep servers running',
        'Contribute to student scholarships',
        'Support future development',
        'Developer love 💙'
      ]
    }
  ];

  const getPriceDisplay = (plan) => {
    if (plan.name === 'Free') return plan.price;
    if (plan.name === 'Donation') return plan.price;

    // In this new logic, we display the Total Price for the selected duration
    const duration = parseInt(activeDuration);
    const total = totals[duration][plan.id];

    // Calculate simple savings label if needed (optional, keeping logic simple)
    // We compare monthly breakdown vs base monthly
    const monthlyBreakdown = total / duration;
    const basePrice = monthlyBase[plan.id];
    const savings = Math.round((1 - (monthlyBreakdown / basePrice)) * 100);

    let durationLabel = '/ month';
    if (duration === 3) durationLabel = '/ 3 months';
    if (duration === 6) durationLabel = '/ 6 months';
    if (duration === 12) durationLabel = '/ year';

    return (
      <>
        ${total} <small style={{ fontSize: '1rem', fontWeight: 400 }}>{durationLabel}</small>
        {duration > 1 && savings > 0 && (
          <span style={{ fontSize: '0.9rem', color: '#22c55e', marginLeft: '8px' }}>Save {savings}%</span>
        )}
      </>
    );
  };

  // Removed getBilledText as requested

  return (
    <div className={`premium-page-container ${isDarkMode ? 'dark' : 'light'}`}>
      <style>{`
        .premium-page-container {
          --bg: #0a0a0f;
          --text: #ffffff;
          --muted: #ffffff; /* User requested all text white in dark mode */
          --card: rgba(30,30,45,0.8);
          --border: rgba(255,255,255,0.15);
          --accent: #00d4ff;
          --green: #22c55e;
          --purple: #a855f7;
          --orange: #f97316;
          --ig-gradient: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          
          background: var(--bg);
          color: var(--text);
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          padding: 24px;
          line-height: 1.6;
          transition: background 0.4s, color 0.4s;
          overflow-x: hidden;
        }

        .premium-page-container.light {
          --bg: #f9fafb;
          --text: #111827;
          --muted: #6b7280;
          --card: #ffffff;
          --border: rgba(0,0,0,0.1);
          --accent: #0ea5e9;
          --green: #16a34a;
          --purple: #7c3aed;
          --orange: #ea580c;
        }

        .premium-page-container.dark .plan-card .price,
        .premium-page-container.dark .plan-card .per-month,
        .premium-page-container.dark .plan-card p,
        .premium-page-container.dark .service-desc,
        .premium-page-container.dark .plan-name,
        .premium-page-container.dark .feature-item span {
          color: #ffffff !important; /* Force white text in dark mode */
        }
        
        /* Muted text in light mode should stay dark/gray */
        .premium-page-container.light .per-month,
        .premium-page-container.light p,
        .premium-page-container.light .service-desc {
           color: var(--muted) !important;
        }

        .inner-container { max-width: 1400px; margin: 0 auto; position: relative; z-index: 1; }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .back-btn {
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 8px 16px;
          border-radius: 999px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        h1 {
          font-size: clamp(2rem, 8vw, 3rem);
          font-weight: 800;
          background: linear-gradient(90deg, var(--text), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .theme-toggle {
          padding: 10px 20px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 999px;
          color: var(--text);
          cursor: pointer;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s;
        }

        .subtitle {
          text-align: center;
          color: var(--muted);
          font-size: clamp(1rem, 4vw, 1.25rem);
          margin-bottom: 32px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .duration-selector {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin: 32px 0 48px;
        }

        .duration-btn {
          padding: 12px 24px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--card);
          color: var(--text);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.95rem;
        }

        .duration-btn.active {
          background: var(--accent);
          color: #ffffff; /* White text for active button */
          border-color: var(--accent);
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
          transform: scale(1.05);
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 64px;
        }

        .plan-card {
          padding: 32px;
          background: var(--card);
          border-radius: 24px;
          border: 1px solid var(--border);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s; /* Removed border transition */
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .plan-card:hover { 
          transform: translateY(-10px); 
          /* border-color change removed as requested */
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .plan-card.popular {
          border-color: var(--accent);
          border-width: 2px;
        }
        
        /* Force white text for donation card in light mode */
        .premium-page-container.light .plan-card.donation-card {
            background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
            color: #ffffff;
            border: none;
        }
        
        .premium-page-container.light .plan-card.donation-card .plan-name,
        .premium-page-container.light .plan-card.donation-card .price,
        .premium-page-container.light .plan-card.donation-card p,
        .premium-page-container.light .plan-card.donation-card .feature-item span {
            color: #ffffff !important;
        }
        
        .premium-page-container.light .plan-card.donation-card .tick-icon {
            color: #ffffff;
        }

        .popular-badge {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background: var(--accent);
          color: #000;
          padding: 6px 20px;
          border-radius: 0 0 12px 12px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .plan-name { font-size: 1.75rem; font-weight: 700; margin-bottom: 16px; }

        .price {
          font-size: 2.75rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 8px;
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
        }

        .per-month { font-size: 0.9rem; color: var(--muted); display: block; margin-bottom: 20px; }

        .btn {
          width: 100%;
          padding: 16px;
          margin: 24px 0;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .btn:hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

        /* All buttons to have white text as requested */
        .btn-free    { background: rgba(255,255,255,0.1); color: var(--text); border: 1px solid var(--border); }
        .btn-basic   { background: var(--green); color: #ffffff; }
        .btn-plus    { background: #059669; color: #ffffff; }
        .btn-pro     { background: var(--accent); color: #ffffff; }
        .btn-elite   { background: var(--purple); color: #ffffff; }
        .btn-diamond { background: linear-gradient(135deg, #00d4ff, #005bea); color: #ffffff; }
        .btn-titanium { background: linear-gradient(135deg, #2b5876, #4e4376); color: #ffffff; }
        .btn-donate  { background: var(--orange); color: #ffffff; }
        
        .premium-page-container.light .btn-donate {
            background: #ffffff;
            color: #ea580c;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 1rem;
          flex-grow: 1;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .tick-icon {
          color: var(--green);
          flex-shrink: 0;
          margin-top: 4px;
        }

        .section-divider {
          font-size: 2rem;
          text-align: center;
          color: var(--accent);
          margin: 80px 0 24px;
          font-weight: 700;
        }

        .services-toggle-btn {
          display: block;
          margin: 0 auto 32px;
          padding: 16px 40px;
          background: var(--accent);
          color: #000;
          border: none;
          border-radius: 999px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.2);
        }

        .services-toggle-btn:hover { transform: translateY(-3px); box-shadow: 0 0 40px rgba(0, 212, 255, 0.4); }

        .services-container { 
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.8s ease-in-out, opacity 0.5s;
          opacity: 0;
        }

        .services-container.active { 
          max-height: 4000px;
          opacity: 1;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .service-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s;
        }

        .service-card:hover { border-color: var(--accent); }

        .service-name {
          font-size: 1.5rem;
          color: var(--accent);
          margin-bottom: 16px;
          font-weight: 700;
        }

        .service-desc { color: var(--muted); font-size: 0.95rem; }

        .contact-info {
          text-align: center;
          margin-top: 48px;
          padding: 40px;
          background: var(--card);
          border-radius: 24px;
          border: 1px solid var(--border);
        }

        .contact-info a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .footer-note {
          text-align: center;
          color: var(--muted);
          margin-top: 80px;
          padding-bottom: 40px;
          font-size: 1rem;
        }

        .bmc-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          margin: 60px 0;
        }

        .bmc-btn {
          height: 60px;
          transition: transform 0.2s;
        }

        .bmc-btn:hover { transform: scale(1.05); }

        @media (max-width: 768px) {
          .premium-page-container { padding: 16px; }
          .duration-selector { gap: 8px; }
          .duration-btn { padding: 10px 16px; font-size: 0.85rem; }
          .plans-grid { grid-template-columns: 1fr; }
          .plan-card { padding: 24px; }
          .price { font-size: 2.25rem; }
          h1 { margin-top: 20px; text-align: center; }
          header { flex-direction: column-reverse; }
        }
      `}</style>

      <div className="inner-container">
        <header>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1>HAPPYY TALK Premium</h1>
          <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <><Sun size={20} /> Light Mode</> : <><Moon size={20} /> Dark Mode</>}
          </button>
        </header>

        <p className="subtitle">Choose your plan — unlock powerful language learning & study abroad features designed to help you connect naturally.</p>

        <div className="duration-selector">
          {['1', '3', '6', '12'].map((d) => (
            <button
              key={d}
              className={`duration-btn ${activeDuration === d ? 'active' : ''}`}
              onClick={() => setActiveDuration(d)}
            >
              {d === '1' ? 'Monthly' : `${d} Months`}
            </button>
          ))}
        </div>

        <div className="plans-grid">
          {plans.map((plan, idx) => (
            <div key={idx} className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.isDonation ? 'donation-card' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="price">{getPriceDisplay(plan)}</div>
              {/* getBilledText removed */}
              <p style={{ color: 'var(--muted)', marginBottom: '20px', fontSize: '0.95rem' }}>{plan.desc}</p>
              <button className={`btn ${plan.buttonClass}`} onClick={() => {
                if (plan.name === 'Free') {
                  console.log('Continuing with Free plan');
                } else if (plan.name === 'Donation') {
                  const section = document.querySelector('.bmc-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // All other paid plans (Basic, Plus, Pro, Elite, Diamond, Titanium)
                  window.open('https://ko-fi.com/D1D41TKUCQ', '_blank');
                }
              }}>
                {plan.buttonText}
              </button>
              <div className="features-list">
                {plan.features.map((feature, i) => (
                  <div key={i} className="feature-item">
                    <Check className="tick-icon" size={18} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 className="section-divider">Our Premium Services</h2>
        <button className="services-toggle-btn" onClick={() => setShowServices(!showServices)}>
          {showServices ? 'Hide Premium Services' : 'Show Premium Services'}
        </button>

        <div className={`services-container ${showServices ? 'active' : ''}`}>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-name">Language Learning</div>
              <div className="service-desc">
                AI courses • Spoken English / IELTS / TOEFL / PTE • Vocabulary packs • Grammar crash courses • Pronunciation training • AI conversation bots • Daily challenges • Offline lessons • 1:1 tutoring • Group classes • Native sessions • Mock interviews • Kids & corporate programs
              </div>
            </div>
            <div className="service-card">
              <div className="service-name">Study Abroad Support</div>
              <div className="service-desc">
                Country & university selection • SOP / LOR writing • Application tracking • Exam coaching • Visa consultation • Document verification • Loan & scholarship help • Accommodation • Pre-departure orientation • Flight & insurance
              </div>
            </div>
            <div className="service-card">
              <div className="service-name">Visa & Legal Services</div>
              <div className="service-desc">
                Student visa consultation • Visa application assistance • Document verification • Interview preparation • Visual refusal handling • Embassy appointment booking • Translation & Apostille services
              </div>
            </div>
            <div className="service-card">
              <div className="service-name">Financial Products</div>
              <div className="service-desc">
                Education loan assistance • Loan comparison • Scholarship search & application • Financial planning • Forex services • International bank account setup • Blocked account services (Germany, etc.)
              </div>
            </div>
            <div className="service-card">
              <div className="service-name">Pre-Departure Services</div>
              <div className="service-desc">
                Cultural training • Language survival kits • Country-specific guides • Packing checklists • Accommodation guidance • Flight booking help • Travel insurance
              </div>
            </div>
            <div className="service-card">
              <div className="service-name">Accommodation & Living</div>
              <div className="service-desc">
                Student housing partnerships • Hostel / shared apartment booking • Temporary stay bookings • Roommate matching • City guides • Cost-of-living calculators
              </div>
            </div>
            <div className="service-card">
              <div className="service-name">Career & Job Support</div>
              <div className="service-desc">
                International CV / LinkedIn • Cover letter writing • Part-time job guidance • Interview preparation • Internship placement • Freelancing guidance • Post-study work visa guidance
              </div>
            </div>
            <div className="service-card">
              <div className="service-name">Community & Networking</div>
              <div className="service-desc">
                Paid student communities • Country-specific student groups • Alumni networks • Mentorship programs • Language practice communities • Mental health support groups • Weekly live Q&A
              </div>
            </div>
            <div className="service-card">
              <div className="service-name">Physical Products</div>
              <div className="service-desc">
                Language learning books • Flashcards • Study planners • Notebooks • Pronunciation guides • Branded merchandise (bags, bottles, hoodies) • Exam prep kits
              </div>
            </div>
            <div className="service-card">
              <div className="service-name">Digital Tools & SaaS</div>
              <div className="service-desc">
                Study planner app • Language progress tracker • AI SOP reviewer • University comparison tool • Visa checklist tool • Country eligibility checker • Scholarship finder
              </div>
            </div>
            <div className="service-card">
              <div className="service-name">Content & Media</div>
              <div className="service-desc">
                YouTube courses • Paid webinars • Workshops • E-books • Email courses • Premium newsletters • Sponsored podcasts
              </div>
            </div>
            <div className="service-card">
              <div className="service-name">Add-Ons & Upsells</div>
              <div className="service-desc">
                Priority support • Fast-track applications • 24/7 chat support • Personal mentor access • Country relocation concierge • Emergency support abroad
              </div>
            </div>
          </div>

          <div className="contact-info">
            <p style={{ marginBottom: '10px', color: 'var(--muted)' }}>Have unique requirements or need customized support?</p>
            Questions? Contact: <a href="mailto:happyytalk@gmail.com">happyytalk@gmail.com</a>
          </div>
        </div>

        <div className="bmc-section">
          <h2 className="section-divider" style={{ marginTop: 0 }}>Support Our Development</h2>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px', alignItems: 'center' }}>
            {/* Ko-fi Image Button */}
            <a href='https://ko-fi.com/D1D41TKUCQ' target='_blank' rel="noreferrer">
              <img height='36' style={{ border: '0px', height: '36px' }} src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' />
            </a>

            {/* Existing BMC Button */}
            <a href="https://www.buymeacoffee.com/happyytalk" target="_blank" rel="noreferrer">
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                className="bmc-btn"
                style={{ height: '36px', width: 'auto' }}
              />
            </a>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ marginBottom: '10px', color: 'var(--muted)' }}>Scan to Support</p>
            <img src="/kofi_qr.png" alt="Ko-fi QR Code" style={{ width: '200px', borderRadius: '12px' }} />
          </div>

          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <iframe
              id='kofiframe'
              src='https://ko-fi.com/happyytalk/?hidefeed=true&widget=true&embed=true&preview=true'
              style={{ border: 'none', width: '100%', padding: '4px', background: '#f9f9f9', borderRadius: '12px' }}
              height='712'
              title='happyytalk'
            ></iframe>
          </div>

          <p style={{ color: 'var(--muted)', marginTop: '20px' }}>Your support helps us keep HappyTalk free and evolving for everyone!</p>
        </div>

        <p className="footer-note">
          Cancel anytime • Longer plans = bigger savings<br />
          <strong>Learn naturally. Connect globally. — HAPPYY TALK 💙</strong>
        </p>
      </div>
    </div>
  );
};

export default PremiumPage;
