import React, { useState, useMemo } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import {
  MessageSquare,
  MessagesSquare,
  Sparkles,
  HelpCircle,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Lock,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface ArticleTopic {
  id: string;
  title: string;
  description: string;
  category: string;
}

class DisqusErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorMessage: error?.message || 'Disqus loading error' };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn('Disqus caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <span>Disqus Forum Notice</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Third-party cross-origin scripts or tracking protection might be active in your browser. If you have an ad-blocker or strict tracking protection enabled, whitelist <code>homestyler-1.disqus.com</code> to view and submit live comments.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800"
          >
            Retry Loading Discussion
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TOPICS: ArticleTopic[] = [
  {
    id: 'homestyler-general-inquiries',
    title: 'General Renovation, Styling & Interior Design Advice',
    description: 'Discuss interior design concepts, Scandinavian & Japandi layouts, space planning, and budget management with fellow homeowners.',
    category: 'Design & Living',
  },
  {
    id: 'homestyler-trades-contractors',
    title: 'Tradesmen Matchmaking & Rate Card Inquiries',
    description: 'Ask questions about carpentry rates per foot run, PUB licensed plumbers, EMA electricians, and compare contractor quotes.',
    category: 'Trade Pros',
  },
  {
    id: 'homestyler-permits-aa',
    title: 'A&A Permits, BCA Regulations & Structural Load Advice',
    description: 'Guidelines for non-structural wall hacking, 72-hour waterproofing ponding tests, and PE structural engineer endorsements.',
    category: 'Regulations & Permits',
  },
  {
    id: 'homestyler-escrow-loans',
    title: 'SafePay Escrow Protection & Bank Renovation Financing',
    description: 'Inquiries regarding progressive milestone payouts, 30-day warranty retention sums, and DBS / Maybank 0% installment plans.',
    category: 'Fintech & Escrow',
  },
];

export const TalkToUs: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<ArticleTopic>(TOPICS[0]);
  const [useSsoMode, setUseSsoMode] = useState<boolean>(false);
  const [quickContactSent, setQuickContactSent] = useState<boolean>(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Base URL calculation (safe for both browser and server-side contexts)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://homestyler.sg';

  const currentArticle = useMemo(() => {
    return {
      id: selectedTopic.id,
      title: selectedTopic.title,
      url: `${baseUrl}/talk-to-us/${selectedTopic.id}`,
    };
  }, [selectedTopic, baseUrl]);

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;
    setQuickContactSent(true);
    setTimeout(() => {
      setQuickContactSent(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
              <MessagesSquare className="w-4 h-4 text-amber-700" />
              <span>Community Forum &amp; Direct Support</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 font-display tracking-tight">
              Talk to Us &amp; Homeowner Forum
            </h1>
            <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
              Have questions regarding renovation scope, contractor quotations, or A&amp;A guidelines? Join the live Disqus conversation or reach out directly to our Singapore advisors.
            </p>
          </div>

          {/* SSO Mode Selector Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center p-1 bg-stone-200/80 rounded-xl">
              <button
                onClick={() => setUseSsoMode(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  !useSsoMode
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Standard Disqus Embed
              </button>
              <button
                onClick={() => setUseSsoMode(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  useSsoMode
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                SSO Embed Mode
              </button>
            </div>
          </div>
        </div>

        {/* Quick Contact & Live Hotline Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <PhoneCall className="w-4 h-4 text-amber-700" />
              <span>Singapore Advisor Hotline</span>
            </div>
            <div className="text-xl font-extrabold text-stone-900 font-mono">
              +65 6789 2200
            </div>
            <p className="text-xs text-stone-500">
              Mon – Sat: 9:00 AM – 7:00 PM (SGT) · WhatsApp chat available
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Mail className="w-4 h-4 text-emerald-700" />
              <span>Direct Support Desk</span>
            </div>
            <div className="text-xl font-extrabold text-stone-900 font-mono text-base sm:text-lg truncate">
              support@homestyler.sg
            </div>
            <p className="text-xs text-stone-500">
              Average response time: &lt; 2 hours for active SafePay projects
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
              <MapPin className="w-4 h-4 text-stone-600" />
              <span>Homestyler Center</span>
            </div>
            <div className="text-sm font-bold text-stone-900">
              90 Stamford Road, Singapore 178903
            </div>
            <p className="text-xs text-stone-500">
              Walk-in consultation for floor plan review &amp; A&amp;A filings
            </p>
          </div>
        </div>

        {/* Forum Section */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Topics Navigation */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Discussion Channels
              </span>
              <span className="text-xs text-stone-500 font-mono">Disqus Forum</span>
            </div>

            <div className="space-y-2.5">
              {TOPICS.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                const topicArticle = {
                  id: topic.id,
                  title: topic.title,
                  url: `${baseUrl}/talk-to-us/${topic.id}`,
                };

                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-white border-amber-600 shadow-md ring-1 ring-amber-600'
                        : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-1">
                      <span className="font-semibold text-amber-800">{topic.category}</span>
                      
                      {/* Disqus Comment Count integration */}
                      <span className="font-mono text-stone-600 flex items-center gap-1 text-[11px] bg-stone-100 px-2 py-0.5 rounded">
                        <MessageSquare className="w-3 h-3 text-stone-500" />
                        <CommentCount
                          shortname="homestyler-1"
                          config={{
                            url: topicArticle.url,
                            identifier: topicArticle.id,
                            title: topicArticle.title,
                          }}
                        >
                          Comments
                        </CommentCount>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 line-clamp-1">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Quick Ticket Form */}
            <div className="mt-6 p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>Send Quick Private Message</span>
              </div>
              <p className="text-xs text-stone-500">
                Prefer a confidential response? Our team replies via email within 2 hours.
              </p>

              {quickContactSent ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Message sent! We will contact you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSendQuickMessage} className="space-y-3 text-xs">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      required
                      placeholder="How can we help with your renovation?"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Embedded Disqus Discussion */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Active Discussion Title & Comment Count */}
            <div className="pb-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <span className="font-semibold text-amber-800">{selectedTopic.category}</span>
                  <span>·</span>
                  <span className="font-mono text-[11px] text-stone-400">ID: {selectedTopic.id}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                  {selectedTopic.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-lg bg-stone-100 text-xs font-mono font-bold text-stone-800 border border-stone-200 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                  <CommentCount
                    shortname="homestyler-1"
                    config={{
                      url: currentArticle.url,
                      identifier: currentArticle.id,
                      title: currentArticle.title,
                    }}
                  >
                    Comments
                  </CommentCount>
                </span>
              </div>
            </div>

            {/* Disqus Embed Container */}
            <div className="min-h-[420px] pt-2">
              <DisqusErrorBoundary>
                {!useSsoMode ? (
                  /* (1) Standard DiscussionEmbed */
                  <DiscussionEmbed
                    shortname="homestyler-1"
                    config={{
                      url: currentArticle.url,
                      identifier: currentArticle.id,
                      title: currentArticle.title,
                      language: 'en',
                    }}
                  />
                ) : (
                  /* (3) SSO DiscussionEmbed */
                  <DiscussionEmbed
                    shortname="homestyler-1"
                    config={{
                      url: currentArticle.url,
                      identifier: currentArticle.id,
                      title: currentArticle.title,
                      language: 'en',
                      remoteAuthS3: '', // Generated by your server (see https://help.disqus.com/customer/en/articles/1717160-integrating-single-sign-on for more details)
                      apiKey: '', // Your API key that can be generated or referenced at https://disqus.com/api/applications/
                      sso: {
                        name: 'SampleNews',
                        button: 'http://example.com/images/samplenews.gif',
                        icon: 'http://example.com/favicon.png',
                        url: 'http://example.com/login/',
                        logout: 'http://example.com/logout/',
                        profile_url: 'http://example.com/profileUrlTemplate/{username}',
                        width: '800',
                        height: '400',
                      },
                    }}
                  />
                )}
              </DisqusErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
