import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Check, 
  X, 
  ChevronRight, 
  Play, 
  RefreshCw, 
  Database, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Cpu, 
  CreditCard, 
  Lock, 
  User, 
  Mail, 
  CheckCircle2, 
  Server, 
  Globe, 
  Copy,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CloudflareWorkerSuite from './components/CloudflareWorkerSuite';

// Campaign Preset Type
interface CampaignPreset {
  name: string;
  source: string;
  medium: string;
  campaign: string;
  gclid: string;
  fbclid: string;
  landingPage: string;
  referrer: string;
  platform: 'Google Ads' | 'Meta Ads' | 'Organic Search' | 'Direct';
}

const PRESETS: CampaignPreset[] = [
  {
    name: 'Meta Paid Campaign (BFCM Lookalike)',
    source: 'facebook',
    medium: 'paid-social',
    campaign: 'bfcm-2026-lookalike-high-intent',
    gclid: '',
    fbclid: 'fb.1.1738492048596.1284958294719',
    landingPage: '/shop/premium-tracker?discount=bfcm',
    referrer: 'https://m.facebook.com/',
    platform: 'Meta Ads',
  },
  {
    name: 'Google Search Ad (Enterprise CPC)',
    source: 'google',
    medium: 'cpc',
    campaign: 'b2b-attribution-exact-intent',
    gclid: 'gcl.8492048596acbd00123ef.9328402',
    fbclid: '',
    landingPage: '/solutions/server-side?cohort=q2',
    referrer: 'https://www.google.com/',
    platform: 'Google Ads',
  },
  {
    name: 'Organic Search Referral',
    source: 'google',
    medium: 'organic',
    campaign: '(organic)',
    gclid: '',
    fbclid: '',
    landingPage: '/blog/why-browser-cookies-are-dying',
    referrer: 'https://news.ycombinator.com/',
    platform: 'Organic Search',
  },
  {
    name: 'Direct Browser Access',
    source: '(direct)',
    medium: '(none)',
    campaign: '(direct)',
    gclid: '',
    fbclid: '',
    landingPage: '/',
    referrer: 'Direct Entry',
    platform: 'Direct',
  },
];

export default function App() {
  // Attribution parameters state
  const [utmSource, setUtmSource] = useState('facebook');
  const [utmMedium, setUtmMedium] = useState('paid-social');
  const [utmCampaign, setUtmCampaign] = useState('bfcm-2026-lookalike-high-intent');
  const [gclid, setGclid] = useState('');
  const [fbclid, setFbclid] = useState('fb.1.1738492048596.1284958294719');
  const [landingPage, setLandingPage] = useState('/shop/premium-tracker?discount=bfcm');
  const [referrer, setReferrer] = useState('https://m.facebook.com/');
  const [transactionId, setTransactionId] = useState('tx_8f9da28c0b5c92f1_demo');
  
  // Interactive / Simulation States
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);
  const [howItWorksStep, setHowItWorksStep] = useState<number>(1);
  const [copiedText, setCopiedText] = useState<string>('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'form' | 'submitting_to_stripe' | 'stripe_active' | 'generating_webhook' | 'processing_gtm' | 'analytics_dispatch' | 'completed'>('form');
  const [purchaserEmail, setPurchaserEmail] = useState('contact.trminsights@gmail.com');
  const [purchaserName, setPurchaserName] = useState('John Marketer');
  const [simulatedScore, setSimulatedScore] = useState(9.4);
  const [stripeMetadataLogs, setStripeMetadataLogs] = useState<any>(null);
  const [gtmWebhookLogs, setGtmWebhookLogs] = useState<any>(null);
  const [metaCapiPayload, setMetaCapiPayload] = useState<any>(null);
  const [ga4Payload, setGa4Payload] = useState<any>(null);
  const [activeJsonTab, setActiveJsonTab] = useState<'meta' | 'ga4' | 'cookies' | 'stripe'>('cookies');

  // Generate new transaction ID on load or refresh
  const regenerateTransactionId = () => {
    const rand = Math.random().toString(16).substring(2, 10);
    setTransactionId(`tx_${rand}_demo`);
  };

  // Redirect simulation parameters state
  const [successRedirectParams, setSuccessRedirectParams] = useState<any>(null);

  // Parse URL search parameters to check if redirect has landed
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true' || params.get('session_id')) {
      const pObj: any = {};
      params.forEach((value, key) => {
        pObj[key] = value;
      });
      setSuccessRedirectParams(pObj);
    }
  }, []);

  // Soft state redirection simulation action
  const handleSimulatedRedirect = (simulatedUrl: string) => {
    const urlObj = new URL(simulatedUrl, 'https://example.com');
    const pObj: any = {};
    urlObj.searchParams.forEach((value, key) => {
      pObj[key] = value;
    });
    setSuccessRedirectParams(pObj);
  };

  const handleClearSuccessScreen = () => {
    setSuccessRedirectParams(null);
    // Suppress search params from current browser URL
    window.history.replaceState({}, '', window.location.pathname);
  };

  useEffect(() => {
    regenerateTransactionId();
  }, []);

  // Preset Selection Helper
  const applyPreset = (preset: CampaignPreset, index: number) => {
    setSelectedPresetIndex(index);
    setUtmSource(preset.source);
    setUtmMedium(preset.medium);
    setUtmCampaign(preset.campaign);
    setGclid(preset.gclid);
    setFbclid(preset.fbclid);
    setLandingPage(preset.landingPage);
    setReferrer(preset.referrer);
  };

  // Keep JSON payload structures dynamically updated
  const browserCookiesValue = {
    _fbc: fbclid ? `fb.1.1700234859.${fbclid}` : undefined,
    _gcl_aw: gclid ? `GCL.1700234859.${gclid}` : undefined,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    first_landing_page: landingPage,
    referrer_url: referrer,
    session_id: 'sid_9e2f8d3c102b48a_demo',
  };

  const stripeCheckoutSessionPayload = {
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Premium Interactive Analytics Tracking API',
          description: 'Attribution recovery system & setup files',
        },
        unit_amount: 100, // $1.00
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://attribution-demo.vercel.app/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://attribution-demo.vercel.app/pricing',
    customer_email: purchaserEmail,
    metadata: {
      fbclid: fbclid || undefined,
      gclid: gclid || undefined,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      first_landing_page: landingPage,
      session_id: 'sid_9e2f8d3c102b48a_demo',
      referrer_url: referrer,
      user_name: purchaserName,
      browser_user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...',
      client_ip_address: '198.51.100.42',
    }
  };

  const getMetaCapiData = () => ({
    data: [{
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_source: 'server',
      event_id: transactionId,
      user_data: {
        client_ip_address: '198.51.100.42',
        client_user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...',
        em: 'fec071acb8577a8eceea748383a8b444fb9d2a23eb1b5055b85a36ba4eeb3521', // sha256 of purchaser email
        fn: '5681600c3c5453f6db03a6a9be7ce47f0ab7be370a049755b9e07f7c17ca427d', // sha256 of purchaser name
        fbc: fbclid ? `fb.1.1700234859.${fbclid}` : undefined,
        external_id: 'cust_842aef3c8d9c22',
      },
      custom_data: {
        currency: 'USD',
        value: 1.00,
        content_name: 'Premium Interactive Analytics Tracking API',
        content_category: 'SaaS Tool',
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        stripe_checkout_id: 'cs_live_a1B2c3D4e5F6...',
      },
      action_source: 'website',
      opt_out: false
    }]
  });

  const getGa4Data = () => ({
    client_id: 'ga_id_18295829.1700234859',
    user_id: 'cust_842aef3c8d9c22',
    non_personalized_ads: false,
    events: [{
      name: 'purchase',
      params: {
        transaction_id: transactionId,
        value: 1.00,
        currency: 'USD',
        engagement_time_msec: 48201,
        session_id: 'sid_9e2f8d3c102b48a_demo',
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        gclid: gclid || undefined,
        page_location: `https://yourdomain.com${landingPage}`,
        item_id: 'prod_attribution_01',
        item_name: 'Premium Interactive Analytics Tracking API',
        price: 1.00,
        quantity: 1,
        source_platform: 'server_gtm_webhook'
      }
    }]
  });

  const handleCopy = (text: any, label: string) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Launch simulated checkout sequence
  const startDemoCheckout = () => {
    setCheckoutStatus('form');
    setCheckoutModalOpen(true);
    setStripeMetadataLogs(null);
    setGtmWebhookLogs(null);
    setMetaCapiPayload(null);
    setGa4Payload(null);
  };

  const runCheckoutSimulation = async () => {
    // Stage 1: Create Stripe Session & lock metadata
    setCheckoutStatus('submitting_to_stripe');
    setStripeMetadataLogs(stripeCheckoutSessionPayload);
    await new Promise(resolve => setTimeout(resolve, 1400));

    // Stage 2: Directing to Simulated Stripe payment UI
    setCheckoutStatus('stripe_active');
    await new Promise(resolve => setTimeout(resolve, 3800)); // Give user time to see the beautiful Stripe checkout Card

    // Stage 3: Payment processed, generating webhook
    setCheckoutStatus('generating_webhook');
    const webhookPayload = {
      id: "evt_1P92q0LkdFs928uK1bC",
      object: "event",
      api_version: "2023-10-16",
      created: Math.floor(Date.now() / 1000),
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_live_a1B2c3D4e5F6g7H8",
          object: "checkout.session",
          amount_subtotal: 100,
          amount_total: 100,
          currency: "usd",
          customer_details: {
            email: purchaserEmail,
            name: purchaserName,
          },
          payment_status: "paid",
          metadata: stripeCheckoutSessionPayload.metadata
        }
      }
    };
    setGtmWebhookLogs(webhookPayload);
    await new Promise(resolve => setTimeout(resolve, 1600));

    // Stage 4: Processing Server GTM logic
    setCheckoutStatus('processing_gtm');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Stage 5: Analytics dispatching
    setCheckoutStatus('analytics_dispatch');
    setMetaCapiPayload(getMetaCapiData());
    setGa4Payload(getGa4Data());
    
    // Higher probability of high match score when fbclid, email and name are aligned
    let score = 5.2;
    if (fbclid) score += 2.1;
    if (purchaserEmail) score += 1.5;
    if (purchaserName) score += 0.8;
    setSimulatedScore(parseFloat(score.toFixed(1)));
    
    await new Promise(resolve => setTimeout(resolve, 1600));

    // Stage 6: Done!
    setCheckoutStatus('completed');
  };

  // Helper to get step-by-step description
  const getStepDetails = (step: number) => {
    switch(step) {
      case 1:
        return {
          title: "User clicks ad",
          desc: `A user triggers an action by clicking your creative on Facebook or Google. The destination URL contains rich parameters: utm_source=${utmSource}, utm_medium=${utmMedium}, and click identifiers or IDs like fbclid or gclid.`,
          tech: "UTM Query Parameters & Auto-tagging",
          badge: "Browser Side"
        };
      case 2:
        return {
          title: "Landing page captures parameters",
          desc: "Our lightweight front-end tracking script active on the landing page instantly runs. It parses the active query string variables directly from the browser's address bar upon entry.",
          tech: "JavaScript URLSearchParams API",
          badge: "Browser Side"
        };
      case 3:
        return {
          title: "Attribution data stored in browser",
          desc: "The parsed URL parameters, referral headers, and active tracking IDs are written safely into the browser's cookies and localStorage, preserving the exact data record for attribution.",
          tech: "Document.cookie & localStorage.setItem()",
          badge: "Client State"
        };
      case 4:
        return {
          title: "Stripe Checkout Session created",
          desc: "When the user clicks purchase, our backend issues a Stripe Checkout API request. Instead of placing variables in public windows, we assemble a secure checkout configuration session payload.",
          tech: "Stripe NodeJS SDK Initialization",
          badge: "Server Side"
        };
      case 5:
        return {
          title: "Attribution attached to Stripe metadata",
          desc: "As we create the Stripe Checkout Session, we embed our browser session database parameters, UTM tags, and click IDs right inside the Stripe metadata dictionary object. It is locked securely on Stripe's infrastructure.",
          tech: "Stripe Checkout Metadata Parameter Object",
          badge: "Server-To-Server"
        };
      case 6:
        return {
          title: "Stripe webhook fires after purchase",
          desc: "The customer completes the payment safely on Stripe. Immediately, Stripe issues an official cryptographic webhook (checkout.session.completed) straight to our secured Server-Side Google Tag Manager (sGTM) webhook endpoint.",
          tech: "Cryptographically Verified POST JSON Request",
          badge: "Server-To-Server"
        };
      case 7:
        return {
          title: "Server GTM processes purchase event",
          desc: "Server-Side GTM intercepts the Stripe webhook. Decrypting the payload, it pulls out the customer email, secure parameters, and UTM cookies directly from the Stripe metadata fields, totally avoiding browser blockages.",
          tech: "sGTM Custom Clients & Webhook Trigger Modules",
          badge: "Cloud Server"
        };
      case 8:
        return {
          title: "Meta CAPI and GA4 receive accurate purchase data",
          desc: "Server GTM formats and dispatches concurrent API requests directly to Meta Conversion API and GA4. It transmits first-party user match parameters alongside accurate attribution tags. Data remains 100% complete and uninterrupted.",
          tech: "Graph API Endpoint & Measurement Protocol",
          badge: "Direct API Integration"
        };
      default:
        return { title: "", desc: "", tech: "", badge: "" };
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FCFDFE] text-[#0A1628] font-sans selection:bg-[#0A1628]/10 selection:text-[#0A1628] overflow-x-hidden" id="app_root">
      
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none z-0 opacity-80" />
      
      {/* Decorative gradient blur in top-right */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] gradient-blur rounded-full pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[-20%] w-[600px] h-[600px] bg-sky-100/10 rounded-full blur-3xl pointer-events-none z-0" />

      {successRedirectParams ? (
        /* GORGEOUS HIGH FIDELITY SUCCESS SHOWCASE VIEW */
        <div className="relative max-w-4xl mx-auto px-6 py-12 md:py-16 z-10 flex flex-col items-stretch text-left animate-in fade-in duration-500" id="success_dashboard">
          
          {/* Header breadcrumb */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200/50 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono">Redirect Verification Completed</span>
            </div>
            <button 
              onClick={handleClearSuccessScreen}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-850 active:scale-95 transition-all shadow-sm"
              id="back_to_playground_header"
            >
              ← Back to Playground
            </button>
          </div>

          <div className="text-center md:text-left mb-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-6 shadow-sm mx-auto md:mx-0">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0A1628]" id="success_title">
              Dynamic Checkout Redirect Resolved Successfully!
            </h1>
            <p className="mt-3 text-slate-600 max-w-2xl leading-relaxed text-sm">
              The browser was successfully redirected from your Stripe Checkout session back to the final landing page. Notice that all key marketing parameters and campaign tracking click IDs were **propagated in the query string**.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
            
            {/* Dynamic Parameter Recovery Card */}
            <div className="lg:col-span-5 p-6 bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col justify-between" id="param_rec_card">
              <div>
                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest block mb-4">RECOVERED DYNAMIC URL VARIABLES</span>
                <div className="space-y-3">
                  {[
                    { label: 'session_id', val: successRedirectParams.session_id || 'cs_live_...', desc: 'Stripe transaction session identifier token' },
                    { label: 'utm_source', val: successRedirectParams.utm_source || '(none)', desc: 'Identifies matching campaign platform' },
                    { label: 'utm_medium', val: successRedirectParams.utm_medium || '(none)', desc: 'Identifies campaign cost format/medium' },
                    { label: 'utm_campaign', val: successRedirectParams.utm_campaign || '(none)', desc: 'Specific marketing container target' },
                    { label: 'fbclid', val: successRedirectParams.fbclid || '(none)', desc: 'Meta pixel conversion algorithm match key' },
                    { label: 'gclid', val: successRedirectParams.gclid || '(none)', desc: 'Google Search autotagged click identifier' },
                    { label: 'referrer', val: successRedirectParams.referrer || '(none)', desc: 'Inbound domain referer path log' },
                  ].map((p) => (
                    <div key={p.label} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between font-mono gap-4">
                        <span className="text-[11px] font-bold text-slate-400">{p.label}</span>
                        <span className={`text-xs font-bold truncate max-w-[200px] ${p.val && p.val !== '(none)' ? 'text-indigo-600' : 'text-slate-400 font-normal italic'}`}>
                          {p.val}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400/80 leading-3 block mt-0.5">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 mt-6 text-center">
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-center gap-1.5 font-mono">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" /> Web parameters verified at Edge
                </span>
              </div>
            </div>

            {/* Outgoing API Streams Verification Log */}
            <div className="lg:col-span-7 bg-[#0A1628] rounded-2xl border border-slate-900 shadow-2xl p-6 md:p-8 text-slate-350 flex flex-col justify-between" id="pipeline_rec_card">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 font-mono text-xs">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
                    LIVE PIPELINE PARSING DISPATCH
                  </span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">200 OK</span>
                </div>

                <div className="space-y-5 text-xs text-left mb-6">
                  {/* Webhook captured event */}
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">1</span>
                    <div>
                      <strong className="text-white block font-sans">Payment Capturing Webhook Received</strong>
                      <span className="text-slate-400 font-mono text-[10px] block mt-0.5">&gt; checkout.session.completed [cs_live_...] verified</span>
                    </div>
                  </div>

                  {/* Campaign reconstruction */}
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">2</span>
                    <div>
                      <strong className="text-white block font-sans">Attribution Reconstitution Complete</strong>
                      <span className="text-slate-400 block leading-relaxed text-[11px] font-sans mt-0.5">
                        Client markers matched back alongside verified values from Stripe metadata. Re-engagement matching score: <strong className="text-emerald-400 font-mono font-bold">10.0 / 10.0</strong>!
                      </span>
                    </div>
                  </div>

                  {/* Meta CAPI target */}
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">3</span>
                    <div>
                      <strong className="text-white block font-sans flex items-center gap-1.5 font-sans">
                        Meta Conversion API stream: <span className="text-emerald-400 font-mono font-bold">[DISPATCHED]</span>
                      </strong>
                      <span className="text-slate-400 font-mono text-[10px] block mt-0.5">POST https://graph.facebook.com/v19.0/purchase (fbc match: true)</span>
                    </div>
                  </div>

                  {/* Google telemetry target */}
                  <div className="flex gap-3 font-sans">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">4</span>
                    <div>
                      <strong className="text-white block">
                        GA4 Measurement Protocol stream: <span className="text-emerald-400 font-mono font-bold">[RESOLVED]</span>
                      </strong>
                      <span className="text-slate-350 font-mono text-[10px] block mt-0.5">POST https://www.google-analytics.com/mp/collect?utm_source={successRedirectParams.utm_source || 'organic'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>SignalGuard Gateway Engine</span>
                <span className="text-sky-500 font-bold">100% complete attribution</span>
              </div>
            </div>

          </div>

          {/* Educational summary bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-amber-50/50 border border-amber-200/50 text-slate-750 leading-normal text-xs text-left mb-8">
            <div>
              <span className="font-bold text-[#0A1628] block mb-1">Dynamic URL Parameters Preservation</span>
              Cloudflare edge script appends dynamic references back to success redirect paths. This makes the landing page instantly aware of which ad generated the payment, saving UTM parameters in downstream CRM, sGTM, or browser cookies database.
            </div>
            <div>
              <span className="font-bold text-[#0A1628] block mb-1">Uninterrupted Stripe Pipeline</span>
              Since identifiers (like `fbclid` or `gclid`) bypass the browser by remaining safely inside Stripe's centralized secure checkout metadata wrapper, they can never be stripped by browser ad blocks, cookie expirations, or third-party blocks.
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleClearSuccessScreen}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 flex items-center gap-2 mx-auto"
              id="back_to_playground_footer"
            >
              <span>← Return to Attribution Playground</span>
            </button>
          </div>

        </div>
      ) : (
        <>
          {/* Header / Navbar */}
          <header className="relative border-b border-slate-100 z-10 bg-white/70 backdrop-blur-md" id="app_header">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A1628] flex items-center justify-center text-white" id="app_logo_container">
              <Server className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-[#0A1628]" id="brand_title">SignalGuard</span>
              <span className="ml-[6px] px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-[#0A1628]/70 font-mono" id="app_badge">DEMO PLAYGROUND</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-[#0A1628] transition-colors" id="nav_how_it_works">How It Works</a>
            <a href="#sandbox" className="hover:text-[#0A1628] transition-colors" id="nav_sandbox">Attribution Sandbox</a>
            <a href="#cloudflare-workers" className="hover:text-orange-600 text-orange-600 font-bold transition-colors" id="nav_cloudflare">Cloudflare Edge Deploy</a>
            <a href="#benefits" className="hover:text-[#0A1628] transition-colors" id="nav_benefits">Benefits</a>
            <a href="#comparison" className="hover:text-[#0A1628] transition-colors" id="nav_comparison">Comparison</a>
            <a href="#stack" className="hover:text-[#0A1628] transition-colors" id="nav_stack">Stack Specs</a>
          </nav>

          <button 
            onClick={startDemoCheckout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1628] text-white text-sm font-medium hover:bg-slate-800 active:scale-95 transition-all shadow-md shadow-slate-900/10"
            id="nav_cta"
          >
            <span>Start Tracking Demo</span>
            <Play className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-6 overflow-hidden z-10" id="hero_section">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-6 flex flex-col items-start text-left" id="hero_text_column">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A1628]/5 border border-slate-200/50 mb-6" id="hero_badge">
              <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
              <span className="text-xs font-semibold text-[#0A1628] tracking-wide uppercase">Interactive Multi-Channel Simulation</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A1628] leading-[1.1]" id="hero_title">
              Good Ads Deserve <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0A1628] to-sky-600">Better Data.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed" id="hero_paragraph">
              Recover lost attribution, improve conversion accuracy, and preserve marketing data from click to revenue with server-side tracking. Ensure 100% data fidelity by passing click identifiers securely through Stripe and custom cloud servers directly to platforms.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 w-full sm:w-auto" id="hero_ctas">
              <button 
                onClick={startDemoCheckout}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#0A1628] hover:bg-slate-800 text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                id="hero_primary_cta"
              >
                <span>Start Tracking Demo</span>
                <ArrowRight className="w-5 h-5 text-sky-400" />
              </button>
              <a 
                href="#how-it-works"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border-slate-300"
                id="hero_secondary_cta"
              >
                <span>View Data Flow</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-8 text-xs text-slate-500 font-mono" id="hero_metrics">
              <div>
                <span className="block text-lg font-bold text-[#0A1628]">99.8%</span>
                <span>DATA INTEGRITY</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-200" />
              <div>
                <span className="block text-lg font-bold text-[#0A1628]">+28%</span>
                <span>ROAS IMPROVEMENT</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-200" />
              <div>
                <span className="block text-lg font-bold text-[#0A1628]">&lt;0.1%</span>
                <span>ATTRIBUTION MISSES</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Dashboard Illustration */}
          <div className="lg:col-span-6 w-full" id="hero_dashboard_illustration">
            <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/5 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 font-mono text-xs text-slate-400">attribution_observer_stream.ms</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>LISTENING LIVE</span>
                </div>
              </div>

              {/* Data Flow Diagram Area */}
              <div className="grid grid-cols-3 gap-y-10 gap-x-4 relative">
                
                {/* SVG Active Connector Paths that "Pulse" */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0EA5E9" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                    </defs>
                    {/* Column 1 to Column 2 */}
                    <path d="M 85 45 Q 120 45 150 90" fill="none" stroke="rgba(10, 22, 40, 0.08)" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 85 135 Q 120 135 150 110" fill="none" stroke="rgba(10, 22, 40, 0.08)" strokeWidth="2" strokeDasharray="4 4" />
                    
                    {/* Column 2 to Column 2 Row 3 */}
                    <path d="M 180 145 L 180 195" fill="none" stroke="rgba(10, 22, 40, 0.08)" strokeWidth="2" strokeDasharray="4 4" />
                    
                    {/* Column 2 Row 3 (Stripe) to Column 3 (Server GTM) */}
                    <path d="M 215 225 H 280" fill="none" stroke="rgba(10, 22, 40, 0.08)" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Column 3 Row 2 (Server GTM) to targets (CAPI / GA4) */}
                    <path d="M 330 180 Q 355 135 385 75" fill="none" stroke="rgba(10, 22, 40, 0.08)" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 330 220 Q 355 220 385 245" fill="none" stroke="rgba(10, 22, 40, 0.08)" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Dynamic Active Pulses */}
                    <circle r="4" fill="#0EA5E9" className="animate-[pulse_2s_infinite]">
                      <animateMotion dur="3s" repeatCount="indefinite" path="M 85 45 Q 120 45 150 90" />
                    </circle>
                    <circle r="4" fill="#6366F1" className="animate-[pulse_1.5s_infinite]">
                      <animateMotion dur="4s" repeatCount="indefinite" path="M 180 145 L 180 195" />
                    </circle>
                    <circle r="4" fill="#10B981" className="animate-[pulse_2.5s_infinite]">
                      <animateMotion dur="2.5s" repeatCount="indefinite" path="M 215 225 H 280" />
                    </circle>
                    <circle r="3.5" fill="#0284C7" className="animate-[pulse_3s_infinite]">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M 330 180 Q 355 135 385 75" />
                    </circle>
                  </svg>
                </div>

                {/* --- Left Column: Ad Traffic Sources --- */}
                <div className="flex flex-col gap-3 justify-center z-10">
                  <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">f</div>
                    <span className="text-[11px] font-semibold mt-2 text-blue-900">Meta Ads</span>
                    <span className="text-[9px] font-mono text-blue-500">{fbclid ? 'fbclid=✓' : 'no_id'}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm">G</div>
                    <span className="text-[11px] font-semibold mt-2 text-amber-900">Google Ads</span>
                    <span className="text-[9px] font-mono text-amber-500">{gclid ? 'gclid=✓' : 'no_id'}</span>
                  </div>
                </div>

                {/* --- Middle Column: User Interface & Checkout --- */}
                <div className="flex flex-col gap-6 justify-between z-10">
                  {/* Landing Page */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold mt-2 text-[#0A1628]">Webflow Page</span>
                    <span className="text-[9px] px-1 py-0.5 rounded bg-slate-100 text-slate-500 mt-1 font-mono">cookie_captured</span>
                  </div>

                  {/* Checkout Stage */}
                  <div className="p-3 px-2 rounded-xl border-2 border-dashed border-[#0EA5E9]/50 bg-sky-50/50 flex flex-col items-center mt-auto animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold mt-2 text-indigo-950">Stripe System</span>
                    <span className="text-[9px] text-[#0A1628]/80 text-center font-mono mt-0.5">metadata_locked</span>
                  </div>
                </div>

                {/* --- Right Column: Tracking Hub & Analytics --- */}
                <div className="flex flex-col justify-between items-end z-10">
                  {/* Meta Conversions API Target */}
                  <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 flex flex-col items-center w-[110px]">
                    <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold mt-2 text-indigo-950">Meta CAPI</span>
                    <span className="text-[9px] text-emerald-600 font-bold font-mono mt-0.5">9.8 MATCH</span>
                  </div>

                  {/* Cloud Container Server GTM */}
                  <div className="p-3.5 rounded-xl border-2 border-[#0A1628] bg-[#0A1628] text-white flex flex-col items-center w-[110px] shadow-lg">
                    <div className="w-7 h-7 rounded-lg bg-sky-404 bg-white/10 flex items-center justify-center">
                      <Server className="w-4 h-4 text-sky-400" />
                    </div>
                    <span className="text-[10px] font-bold mt-1.5 text-center leading-3">Server GTM</span>
                    <span className="text-[8px] text-slate-300 font-mono mt-1">100% Reliable</span>
                  </div>

                  {/* Google Analytics 4 Target */}
                  <div className="p-3.5 rounded-xl border border-yellow-100 bg-yellow-50/40 flex flex-col items-center w-[110px]">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">4</div>
                    <span className="text-[11px] font-bold mt-2 text-amber-950">GA4 Server</span>
                    <span className="text-[9px] text-emerald-600 font-bold font-mono mt-0.5">MATCH: ✓</span>
                  </div>
                </div>

              </div>

              {/* Console logs box detailing parameter bindings */}
              <div className="mt-6 p-4 rounded-xl bg-slate-900 text-[#00E5FF] font-mono text-[11px] border border-slate-800" id="hero_logs_console">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800 text-slate-400">
                  <span>ACTIVATION MAP CONSOLE</span>
                  <span className="text-[10px] text-sky-500">REALTIME</span>
                </div>
                <div className="space-y-1">
                  <div><span className="text-slate-500">&gt;</span> <span className="text-slate-300">Listening to incoming query...</span></div>
                  <div><span className="text-slate-500">&gt;</span> <span className="text-yellow-400">gclid: </span>"{gclid || '(not active, pixel would lose)'}"</div>
                  <div><span className="text-slate-500">&gt;</span> <span className="text-pink-400">fbclid: </span>"{fbclid || '(not active, pixel would lose)'}"</div>
                  <div><span className="text-slate-500">&gt;</span> <span className="text-sky-300">Attached attribution elements directly inside Stripe metadata wrapper payload.</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow Interactive Step Section */}
      <section className="py-24 bg-slate-50/50 border-y border-slate-100 relative z-10" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1628]" id="how_it_works_title">
              How Server-Side Tracking Safeguards Data
            </h2>
            <p className="mt-4 text-slate-600">
              Unlike unstable client-side browsers and cookies, attribution parameters remain locked behind Stripe Checkout API integrations and Server-Side GTM rules. Click the tabs below to step through our secure sequence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Step Navigation Sidebar */}
            <div className="lg:col-span-5 space-y-2" id="how_it_works_navigation">
              {[
                { step: 1, label: "user_clicks_ad", title: "User clicks external ad link" },
                { step: 2, label: "capture_landing", title: "Landing page parses URL" },
                { step: 3, label: "browser_storage", title: "Attribution cached inside cookies" },
                { step: 4, label: "stripe_checkout_call", title: "Stripe API payload assembled" },
                { step: 5, label: "stripe_metadata_bound", title: "UTMs attached securely to checkout" },
                { step: 6, label: "cryptographic_webhook", title: "Safe Stripe webhook fires back" },
                { step: 7, label: "server_gtm_trigger", title: "Server GTM intercept logic" },
                { step: 8, label: "capi_ga4_dispatch", title: "Fidelity payload dispatch" },
              ].map((item) => (
                <button
                  key={item.step}
                  onClick={() => setHowItWorksStep(item.step)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between ${
                    howItWorksStep === item.step 
                      ? 'border-[#0A1628] bg-white text-[#0A1628] shadow-md shadow-slate-900/5' 
                      : 'border-transparent text-slate-500 hover:text-[#0A1628] hover:bg-white/50'
                  }`}
                  id={`step_trigger_${item.step}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-md font-mono text-xs flex items-center justify-center font-bold transition-all ${
                      howItWorksStep === item.step 
                        ? 'bg-[#0A1628] text-white' 
                        : 'bg-slate-200/60 text-slate-600'
                    }`}>
                      {item.step}
                    </span>
                    <span className="font-semibold text-sm">{item.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${howItWorksStep === item.step ? 'text-[#0A1628] translate-x-0.5' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            {/* Step Explanation Frame */}
            <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-900/5" id="how_it_works_console_panel">
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 bg-sky-50 text-sky-800 rounded-full font-mono text-xs font-semibold uppercase tracking-wider">
                  {getStepDetails(howItWorksStep).badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">SPECIFICATION - STEP 0{howItWorksStep}/08</span>
              </div>

              <h3 className="text-2xl font-bold text-[#0A1628] tracking-tight">
                {getStepDetails(howItWorksStep).title}
              </h3>

              <p className="mt-4 text-slate-644 text-slate-600 leading-relaxed min-h-[80px]">
                {getStepDetails(howItWorksStep).desc}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-y-4 items-center justify-between">
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">Core Protocol</span>
                  <span className="text-sm font-semibold text-slate-800 font-mono mt-0.5 block">{getStepDetails(howItWorksStep).tech}</span>
                </div>
                
                {/* Visualizing dynamic flow of values according to currently simulated values */}
                <div className="px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200/50 flex items-center gap-2 text-xs">
                  <Database className="w-4 h-4 text-sky-600" />
                  <span className="font-mono text-[#0A1628]/80">Matched source: <strong className="text-sky-600 font-bold">{utmSource}</strong></span>
                </div>
              </div>

              {/* Dynamic educational schematic illustrating tracking preservation */}
              <div className="mt-6 p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[12px] overflow-x-auto border border-slate-900 max-h-[220px]">
                {howItWorksStep === 1 && (
                  <pre className="text-slate-400">
                    <span className="text-emerald-400">// Outgoing Ad Link Payload</span>
                    {"\n"}https://yourdomain.com/landing
                    {"\n"}  ?utm_source=<span className="text-sky-300">{utmSource}</span>
                    {"\n"}  &utm_medium=<span className="text-sky-300">{utmMedium}</span>
                    {"\n"}  &utm_campaign=<span className="text-sky-300">{utmCampaign}</span>
                    {fbclid && `\n  &fbclid=${fbclid}`}
                    {gclid && `\n  &gclid=${gclid}`}
                  </pre>
                )}
                {howItWorksStep === 2 && (
                  <pre className="text-slate-400">
                    <span className="text-emerald-400">// Parsing Landing script execution</span>
                    {"\n"}const params = new URLSearchParams(window.location.search);
                    {"\n"}const source = params.get('utm_source') || 'organic';
                    {"\n"}console.log('Intercepted:', source); <span className="text-emerald-500">// logs "{utmSource}"</span>
                  </pre>
                )}
                {howItWorksStep === 3 && (
                  <pre className="text-slate-400">
                    <span className="text-emerald-400">// Caching attribution indicators inside browser context</span>
                    {"\n"}document.cookie = `utm_source=${utmSource}; path=/; max-age=2592000; secure`;
                    {"\n"}document.cookie = `fbclid=${fbclid}; path=/; max-age=2592000; secure`;
                    {"\n"}localStorage.setItem('landing_referrer', '{referrer}');
                  </pre>
                )}
                {howItWorksStep === 4 && (
                  <pre className="text-slate-400">
                    <span className="text-emerald-400">// Stripe Server Checkout Creation API Call</span>
                    {"\n"}const session = await stripe.checkout.sessions.create({"{"}
                    {"\n"}  line_items: [...],
                    {"\n"}  mode: 'payment',
                    {"\n"}  customer_email: '{purchaserEmail}',
                  </pre>
                )}
                {howItWorksStep === 5 && (
                  <pre className="text-slate-400">
                    <span className="text-emerald-400">// Attachment inside stripe metadata parameters dictionary</span>
                    {"\n"}  metadata: {"{"}
                    {"\n"}    utm_source: "{utmSource}",
                    {"\n"}    utm_medium: "{utmMedium}",
                    {"\n"}    fbclid: "{fbclid || '(none)'}",
                    {"\n"}    gclid: "{gclid || '(none)'}",
                    {"\n"}    referrer_url: "{referrer}"
                    {"\n"}  {"}"}
                    {"\n"}{"}"});
                  </pre>
                )}
                {howItWorksStep === 6 && (
                  <pre className="text-slate-400">
                    <span className="text-emerald-400">// Automated postback from Stripe Webhook Router</span>
                    {"\n"}POST https://sgtm.analytics.yourdomain.com/stripe/webhook
                    {"\n"}Header: "Stripe-Signature" cryptographic challenge
                    {"\n"}Payload: checkout.session.completed [containing metadata metadata_dict]
                  </pre>
                )}
                {howItWorksStep === 7 && (
                  <pre className="text-slate-400">
                    <span className="text-emerald-400">// Server GTM Client parsing incoming webhook parameters</span>
                    {"\n"}const body = JSON.parse(incomingBody);
                    {"\n"}const campaignData = body.data.object.metadata;
                    {"\n"}console.log('Restored Attribution:', campaignData.utm_source); <span className="text-emerald-500">// returns "{utmSource}"</span>
                  </pre>
                )}
                {howItWorksStep === 8 && (
                  <pre className="text-slate-400">
                    <span className="text-emerald-400">// Outgoing Server side Conversion API call structured data</span>
                    {"\n"}dispatchToMetaCapi(campaignData);
                    {"\n"}dispatchToGA4MeasurementProtocol(campaignData);
                    {"\n"}STATUS: 200 OK (Attribute secured across cookies blocks)
                  </pre>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Sandbox Session */}
      <section className="py-24 px-6 relative z-10" id="sandbox">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1628]" id="sandbox_title">
              Interactive Attribution Sandbox
            </h2>
            <p className="mt-4 text-slate-600">
              Customize the attribution parameters or choose a campaign preset. View how variables propagate instantly so that when a purchase takes place, the tracking matches securely!
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl p-6 lg:p-10" id="sandbox_container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Sandbox Control Section */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6" id="sandbox_controls">
                
                {/* presets selector option */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-3">
                    Campaign Presets
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={p.name}
                        onClick={() => applyPreset(p, idx)}
                        className={`text-left px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                          selectedPresetIndex === idx 
                            ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 shadow-sm' 
                            : 'border-slate-100 hover:border-slate-300 bg-slate-50/50 text-slate-600'
                        }`}
                        id={`preset_btn_${idx}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            p.platform === 'Meta Ads' ? 'bg-sky-500' :
                            p.platform === 'Google Ads' ? 'bg-amber-500' :
                            p.platform === 'Organic Search' ? 'bg-indigo-500' : 'bg-slate-400'
                          }`} />
                          <span>{p.name}</span>
                        </div>
                        {selectedPresetIndex === idx && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* customized value controls */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Manual Parameters
                    </label>
                    <button 
                      onClick={() => setSelectedPresetIndex(null)}
                      className="text-[11px] text-[#0A1628] hover:underline font-mono font-bold"
                      id="unlock_custom_button"
                    >
                      CUSTOMIZE
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 mb-1">utm_source</span>
                      <input 
                        type="text" 
                        value={utmSource} 
                        onChange={(e) => { setUtmSource(e.target.value); setSelectedPresetIndex(null); }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#0A1628]"
                        placeholder="e.g. google"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 mb-1">utm_medium</span>
                      <input 
                        type="text" 
                        value={utmMedium} 
                        onChange={(e) => { setUtmMedium(e.target.value); setSelectedPresetIndex(null); }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#0A1628]"
                        placeholder="e.g. cpc"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 mb-1">utm_campaign</span>
                      <input 
                        type="text" 
                        value={utmCampaign} 
                        onChange={(e) => { setUtmCampaign(e.target.value); setSelectedPresetIndex(null); }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#0A1628]"
                        placeholder="e.g. summer-sale"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[10px] font-semibold text-pink-500 mb-1">fbclid (Meta Click ID)</span>
                      <input 
                        type="text" 
                        value={fbclid} 
                        onChange={(e) => { setFbclid(e.target.value); setGclid(''); setSelectedPresetIndex(null); }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#0A1628] font-mono"
                        placeholder="e.g. fb.1.17..."
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-amber-500 mb-1">gclid (Google click ID)</span>
                      <input 
                        type="text" 
                        value={gclid} 
                        onChange={(e) => { setGclid(e.target.value); setFbclid(''); setSelectedPresetIndex(null); }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#0A1628] font-mono"
                        placeholder="e.g. gcl_849..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 mb-1">Landing page context</span>
                      <input 
                        type="text" 
                        value={landingPage} 
                        onChange={(e) => { setLandingPage(e.target.value); setSelectedPresetIndex(null); }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#0A1628]"
                      />
                    </div>
                  </div>

                </div>

                {/* Interactive Simulation Trigger Button */}
                <div className="pt-4 mt-auto">
                  <button
                    onClick={startDemoCheckout}
                    className="w-full py-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold tracking-wide transition-all shadow-md shadow-sky-600/10 flex items-center justify-center gap-2"
                    id="submit_sandbox_to_checkout"
                  >
                    <span>Test attribution flow</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2 text-center">
                    Proceed with current parameters directly to checkout simulation.
                  </p>
                </div>

              </div>

              {/* Right JSON Logs Viewer & Captured Cards Column */}
              <div className="lg:col-span-7 flex flex-col justify-between" id="sandbox_logs_column">
                
                {/* 8 Live data cards showing tracking fields */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Active Parameter State Card
                    </label>
                    <span className="text-[10px] text-emerald-600 font-mono flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      AUTO UPDATE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'fbclid', val: fbclid || '(not captured)', active: !!fbclid, color: 'text-pink-600' },
                      { label: 'gclid', val: gclid || '(not captured)', active: !!gclid, color: 'text-amber-600' },
                      { label: 'utm_source', val: utmSource, active: !!utmSource, color: 'text-sky-600' },
                      { label: 'utm_medium', val: utmMedium, active: !!utmMedium, color: 'text-sky-600' },
                      { label: 'utm_campaign', val: utmCampaign, active: !!utmCampaign, color: 'text-sky-600' },
                      { label: 'landing_page', val: landingPage, active: !!landingPage, color: 'text-slate-700' },
                      { label: 'referrer', val: referrer, active: !referrer.includes('Direct'), color: 'text-slate-700' },
                      { label: 'transaction_id', val: transactionId, active: true, color: 'text-indigo-600' },
                    ].map((card) => (
                      <div 
                        key={card.label} 
                        className={`p-3 rounded-xl border transition-all ${
                          card.active 
                            ? 'border-indigo-100 bg-gradient-to-br from-indigo-50/10 to-indigo-50/40 shadow-sm' 
                            : 'border-slate-100 bg-slate-50/50 opacity-60'
                        }`}
                        id={`data_card_${card.label}`}
                      >
                        <span className="block text-[9px] font-mono font-bold text-slate-400 mb-1">{card.label}</span>
                        <span className={`block text-xs font-mono font-bold truncate ${card.active ? card.color : 'text-slate-400 font-normal italic'}`}>
                          {card.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code-style JSON viewer with Tab layout */}
                <div className="flex-1 flex flex-col justify-end">
                  <div className="flex items-center justify-between bg-slate-900 rounded-t-xl px-4 py-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <button
                        onClick={() => setActiveJsonTab('cookies')}
                        className={`text-xs font-mono px-3 py-1.5 rounded transition-all ${
                          activeJsonTab === 'cookies' ? 'bg-[#0A1628] text-sky-400 font-bold border border-slate-800' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        id="tab_trigger_cookies"
                      >
                        Browser.Cookies
                      </button>
                      <button
                        onClick={() => setActiveJsonTab('stripe')}
                        className={`text-xs font-mono px-3 py-1.5 rounded transition-all ${
                          activeJsonTab === 'stripe' ? 'bg-[#0A1628] text-sky-400 font-bold border border-slate-800' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        id="tab_trigger_stripe"
                      >
                        Stripe.Metadata
                      </button>
                      <button
                        onClick={() => setActiveJsonTab('meta')}
                        className={`text-xs font-mono px-3 py-1.5 rounded transition-all ${
                          activeJsonTab === 'meta' ? 'bg-[#0A1628] text-sky-400 font-bold border border-slate-800' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        id="tab_trigger_meta"
                      >
                        Meta.CAPI_Payload
                      </button>
                      <button
                        onClick={() => setActiveJsonTab('ga4')}
                        className={`text-xs font-mono px-3 py-1.5 rounded transition-all ${
                          activeJsonTab === 'ga4' ? 'bg-[#0A1628] text-sky-400 font-bold border border-slate-800' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        id="tab_trigger_ga4"
                      >
                        GA4.Analytics4
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const targetVal = 
                          activeJsonTab === 'cookies' ? browserCookiesValue :
                          activeJsonTab === 'stripe' ? stripeCheckoutSessionPayload :
                          activeJsonTab === 'meta' ? getMetaCapiData() : getGa4Data();
                        handleCopy(targetVal, activeJsonTab);
                      }}
                      className="text-[11px] text-sky-400 hover:text-sky-200 font-mono py-1 px-2 rounded hover:bg-slate-800 flex items-center gap-1.5"
                      id="copy_json_button"
                    >
                      {copiedText === activeJsonTab ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy API JSON</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-b-xl border border-slate-900 border-t-0 font-mono text-[11px] text-slate-350 min-h-[250px] max-h-[300px] overflow-y-auto">
                    {activeJsonTab === 'cookies' && (
                      <pre className="text-emerald-300">{JSON.stringify(browserCookiesValue, null, 2)}</pre>
                    )}
                    {activeJsonTab === 'stripe' && (
                      <pre className="text-blue-300">{JSON.stringify(stripeCheckoutSessionPayload, null, 2)}</pre>
                    )}
                    {activeJsonTab === 'meta' && (
                      <pre className="text-purple-300">{JSON.stringify(getMetaCapiData(), null, 2)}</pre>
                    )}
                    {activeJsonTab === 'ga4' && (
                      <pre className="text-amber-300">{JSON.stringify(getGa4Data(), null, 2)}</pre>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloudflare Worker & Deploy Suite */}
      <CloudflareWorkerSuite 
        utmSource={utmSource}
        utmMedium={utmMedium}
        utmCampaign={utmCampaign}
        fbclid={fbclid}
        gclid={gclid}
        landingPage={landingPage}
        referrer={referrer}
        onSimulateRedirect={handleSimulatedRedirect}
      />

      {/* Benefits Grid Section */}
      <section className="py-24 bg-slate-50/50 border-y border-slate-100 relative z-10" id="benefits">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1628]" id="benefits_title">
              Engineered for Complete Campaign Reporting
            </h2>
            <p className="mt-4 text-slate-600">
              Stop losing up to 35% of ad conversions due to Safari ITP blockers, Chrome Third-Party Cookie deprecation, ad blockers, and cookie loss upon checkout redirect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="benefits_grid">
            
            {/* Benefit Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-sky-500/40 hover:shadow-xl transition-all" id="benefit_card_1">
              <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 mb-5">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1628] tracking-tight">Accurate Attribution</h3>
              <p className="mt-2.5 text-slate-600 text-sm leading-relaxed">
                Preserve marketing attribution across checkout. Blockers can't strip query signatures when click identifiers pass inside secure server-side metadata envelopes.
              </p>
            </div>

            {/* Benefit Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-indigo-500/40 hover:shadow-xl transition-all" id="benefit_card_2">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1628] tracking-tight">Meta Optimization</h3>
              <p className="mt-2.5 text-slate-600 text-sm leading-relaxed">
                Send high-quality conversion signals to Meta. Supply full customer indices secure in CAPI (EM, FN) for enhanced matching accuracy, direct targeting, and low CPC.
              </p>
            </div>

            {/* Benefit Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-indigo-500/40 hover:shadow-xl transition-all" id="benefit_card_3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1628] tracking-tight">Improved Reporting</h3>
              <p className="mt-2.5 text-slate-600 text-sm leading-relaxed">
                Reduce discrepancies between ad platforms and analytics. Align your actual Stripe sales perfectly with conversion rows reported in GA4 and Meta Ads Manager dashboards.
              </p>
            </div>

            {/* Benefit Card 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-xl transition-all" id="benefit_card_4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1628] tracking-tight">Server-Side Measurement</h3>
              <p className="mt-2.5 text-slate-600 text-sm leading-relaxed">
                Improve tracking reliability despite browser restrictions. Bypass localized tracking timeouts by streaming transaction logs directly from Stripe API webhooks.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Comparison Section (Traditional vs Server-Side) */}
      <section className="py-24 px-6 relative z-10 bg-white" id="comparison">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1628]" id="comparison_title">
              Why Server-Side Tracking?
            </h2>
            <p className="mt-4 text-slate-600">
              Modern browsers block marketing scripts on average over 35% of the time. Here is how relying strictly on native pixel tracking compares to our unified Server-Side system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto" id="comparison_columns">
            
            {/* Traditional Column */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-[#FCFDFE] relative overflow-hidden" id="traditional_tracking_col">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-400" />
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 rounded-lg bg-red-50 text-red-500">
                  <X className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-[#0A1628]">Traditional Pixel Tracking</h3>
              </div>

              <ul className="space-y-4" id="traditional_points_list">
                {[
                  { text: 'Blocked by browsers', detail: 'Safari Intelligent Tracking Prevention (ITP) caps cookies at 1-7 days, meaning returning conversions lose their ad campaign association entirely.' },
                  { text: 'Ad blockers reduce visibility', detail: 'Over 30% of tech-savvy audiences actively use browser extensions that terminate scripts from Google or Meta upon page load.' },
                  { text: 'Lower match quality', detail: 'Sending conversions directly from client devices frequently matches fake variables, resulting in high advertising CPMs.' },
                  { text: 'Missing conversions', detail: "Redirects across Stripe and checkout platforms cause browsers to drop tracking queries, causing incomplete logs." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mt-1 shrink-0 font-bold">!</span>
                    <div>
                      <strong className="block text-sm text-slate-900 font-semibold">{item.text}</strong>
                      <span className="text-xs text-slate-500 mt-1 block leading-relaxed">{item.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Server-Side Column */}
            <div className="p-8 rounded-2xl border-2 border-[#0A1628] bg-white shadow-xl relative overflow-hidden" id="serverside_tracking_col">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-500" />
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 rounded-lg bg-sky-50 text-sky-600">
                  <Check className="w-5 h-5 text-sky-600 font-bold" />
                </span>
                <h3 className="text-xl font-bold text-[#0A1628]">Server-Side Tracking</h3>
              </div>

              <ul className="space-y-4" id="serverside_points_list">
                {[
                  { text: 'Better attribution accuracy', detail: 'Click identifiers and UTM records are cached in server files and attached to customers, protecting marketing data integrity for up to 365 days.' },
                  { text: 'Higher match quality', detail: 'Hashed first-party indices (EM, FN, IP Address) are transmitted securely server-to-server, matching precisely with Facebook/Google users.' },
                  { text: 'Reliable conversion reporting', detail: 'Conversions trigger instantly upon Stripe payment webhooks. Ad blockers are entirely blind to server-to-server HTTP API calls.' },
                  { text: 'Improved campaign optimization', detail: 'Attributing 100% of sales allows platform bidding algorithms to locate premium customers, driving down customer acquisition cost.' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs mt-1 shrink-0 font-bold">✓</span>
                    <div>
                      <strong className="block text-sm text-[#0A1628] font-bold">{item.text}</strong>
                      <span className="text-xs text-slate-600 mt-1 block leading-relaxed">{item.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Demo Checkout Hero Action Banner Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0A1628] to-indigo-950 text-white relative z-10" id="checkout-demo">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden p-8 sm:p-12 md:p-16 relative bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center gap-10">
          
          <div className="md:w-3/5 text-left" id="checkout_inner_text">
            <span className="text-sky-400 font-semibold font-mono text-xs uppercase tracking-wider">Interactive Playground</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white" id="checkout_headline">
              Test the Complete Attribution Flow
            </h2>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Simulate a real checkout transaction. See how current sandbox attributes (<strong className="text-sky-300 font-mono font-bold">{utmSource} / {utmMedium}</strong>) transfer safely inside Stripe payload variables directly into GTM, CAPI, and GA4!
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-sky-400" /> SECURE WEBHOOKS</span>
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-sky-400" /> SERVER INTERCEPT</span>
            </div>
          </div>

          <div className="md:w-2/5 flex flex-col items-center flex-shrink-0" id="checkout_action_card">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 w-full text-center">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Interactive Sandbox Purchase</span>
              <div className="text-3xl font-extrabold text-white mt-1">$1.00 USD <span className="text-xs font-normal text-slate-300 font-sans">demo value</span></div>
              
              <button 
                onClick={startDemoCheckout}
                className="w-full mt-6 py-4 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-2"
                id="cta_test_interactive_payment"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay $1 Demo</span>
              </button>
              
              <span className="mt-3 block text-[10px] text-slate-400 font-mono">No real credit card required</span>
            </div>
          </div>

        </div>
      </section>

      {/* Technology Stack Grid Spec Section */}
      <section className="py-24 px-6 relative bg-slate-50/50 z-10 border-t border-slate-100" id="stack">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1628]" id="stack_title">
              Fully Integrated Tech Stack Specs
            </h2>
            <p className="mt-4 text-slate-600">
              Our setup utilizes industry-leading analytics and server technologies to secure safe pipelines and high Event Match Quality scoring.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" id="stack_grid">
            
            {/* Stripe Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center font-extrabold text-sm mb-3">S</div>
              <span className="text-xs font-bold text-[#0A1628] block">Stripe Checkout</span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">Metadata Storage</span>
            </div>

            {/* Server GTM Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center font-extrabold text-sm mb-3">s</div>
              <span className="text-xs font-bold text-[#0A1628] block">Server GTM</span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">Routing Container</span>
            </div>

            {/* Meta CAPI Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9] flex items-center justify-center font-extrabold text-sm mb-3">M</div>
              <span className="text-xs font-bold text-[#0A1628] block">Meta CAPI</span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">Conversions Protocol</span>
            </div>

            {/* GA4 Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-extrabold text-sm mb-3">4</div>
              <span className="text-xs font-bold text-[#0A1628] block">GA4 Analytics</span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">Measurement API</span>
            </div>

            {/* Cloudflare Workers Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center font-extrabold text-sm mb-3">CF</div>
              <span className="text-xs font-bold text-[#0A1628] block">Cloudflare</span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">Secure Edge Routing</span>
            </div>

            {/* Vercel Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-[#000000]/10 text-[#000000] flex items-center justify-center font-extrabold text-sm mb-3">▲</div>
              <span className="text-xs font-bold text-[#0A1628] block">Vercel Edge</span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">Host & Middleware</span>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1628] text-slate-400 py-16 px-6 relative z-10 border-t border-slate-800" id="footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 text-left">
            <div className="flex items-center gap-3 text-white mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Server className="w-4 h-4 text-sky-400" />
              </div>
              <span className="font-bold text-lg tracking-tight">SignalGuard</span>
            </div>
            <p className="text-slate-450 text-[#FCFDFE]/70 text-sm max-w-sm leading-relaxed">
              Demonstrate how attribution data is preserved from ad click to purchase using Webflow/Vercel, Stripe Checkout, Server GTM, Meta Conversion API, and GA4.
            </p>
          </div>
          
          <div className="md:col-span-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t md:border-t-0 border-slate-800 pt-6 md:pt-0">
            <p className="text-xs text-slate-500 max-w-md leading-relaxed font-mono">
              Built for marketers, agencies, and businesses that need accurate attribution and measurement. Fully isolated server testing.
            </p>
            <div className="text-xs font-mono text-slate-500">
              © 2026 SignalGuard Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      </>)}


      {/* --- High Fidelity Stripe Simulation & Webhook Logs Modal Window --- */}
      <AnimatePresence>
        {checkoutModalOpen && (
          <div className="fixed inset-0 bg-[#0A1628]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" id="checkout_modal">
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FCFDFE] text-[#0A1628] w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[580px] my-8"
              id="checkout_modal_content"
            >
              
              {/* Modal Left Side - Active Interactive Interface */}
              <div className="lg:w-[45%] bg-[#F8FAFC] p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between" id="modal_left_pane">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Simulated Checkout</span>
                  </div>
                  <button 
                    onClick={() => setCheckoutModalOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                    id="close_checkout_modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* State-dependent screen */}
                <div className="my-6 flex-1 flex flex-col justify-center">
                  
                  {checkoutStatus === 'form' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#0A1628] mb-1">Enter Customer Billing Details</h3>
                        <p className="text-xs text-slate-500 mb-4">Attribution parameters are already locked in parameters. Proceed to check matching scoring.</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input 
                              type="text" 
                              value={purchaserName} 
                              onChange={(e) => setPurchaserName(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0A1628] outline-none text-sm font-semibold"
                              placeholder="e.g. John Doe"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Email address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input 
                              type="email" 
                              value={purchaserEmail} 
                              onChange={(e) => setPurchaserEmail(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0A1628] outline-none text-sm font-semibold"
                              placeholder="e.g. john@yourdomain.com"
                            />
                          </div>
                        </div>

                        <div className="pt-3">
                          <button
                            onClick={runCheckoutSimulation}
                            className="w-full py-3.5 rounded-xl bg-[#0A1628] hover:bg-slate-800 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
                            id="submit_payment_details_btn"
                          >
                            <CreditCard className="w-4 h-4 text-sky-400" />
                            <span>Submit Stripe Order ($1.00)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutStatus === 'submitting_to_stripe' && (
                    <div className="text-center space-y-4 py-6">
                      <RefreshCw className="w-10 h-10 text-[#0A1628] animate-spin mx-auto" />
                      <h4 className="font-bold text-base text-[#0A1628]">Assembling Session Payload...</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">Writing active values (fbclid, gclid, utm_source) into Stripe API Metadata configuration object...</p>
                    </div>
                  )}

                  {checkoutStatus === 'stripe_active' && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-lg relative">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                        <span className="text-indigo-600 font-bold block text-sm">stripe <span className="font-normal text-slate-400">checkout</span></span>
                        <span className="text-[10px] text-slate-400 font-mono">SECURE DIALOGUE</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Active Account:</span>
                          <span className="font-semibold text-slate-800">{purchaserEmail}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Product:</span>
                          <span className="font-semibold text-slate-800">Track Sandbox Service</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                          <span className="text-slate-500">Total Charged:</span>
                          <span className="font-bold text-[#0A1628]">$1.00 USD</span>
                        </div>

                        {/* Simulated Visa field */}
                        <div className="space-y-2">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono text-[9px] font-bold">VISA</span>
                              <span className="font-mono text-xs font-semibold text-slate-700">•••• •••• •••• 4242</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">12 / 28</span>
                          </div>
                          <div className="flex items-center gap-1.5 justify-center text-[10px] text-emerald-600 font-semibold font-mono">
                            <Lock className="w-3 h-3" />
                            <span>SECURE PRESET DETAILS LOADED</span>
                          </div>
                        </div>

                        <div className="bg-blue-50 text-blue-950 p-3 rounded-lg text-[10px] flex gap-2 border border-blue-100 leading-normal">
                          <Info className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Simulated Stripe Environment. Click trigger to submit instant authorized payment!</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutStatus === 'generating_webhook' && (
                    <div className="text-center space-y-4 py-6">
                      <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto" strokeWidth={3} />
                      <h4 className="font-bold text-base text-emerald-900">Payment Captured Successfully!</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">Emitting cryptographic checkout webhook event containing backlogged metadata parameters to Server GTM...</p>
                    </div>
                  )}

                  {checkoutStatus === 'processing_gtm' && (
                    <div className="text-center space-y-4 py-6">
                      <Cpu className="w-10 h-10 text-[#0A1628] animate-bounce mx-auto" />
                      <h4 className="font-bold text-base text-[#0A1628]">Server GTM Parsing Webhook...</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">Decrypting campaign metadata directly from Stripe payload. Ad blockers bypassed entirely.</p>
                    </div>
                  )}

                  {checkoutStatus === 'analytics_dispatch' && (
                    <div className="text-center space-y-4 py-6">
                      <Activity className="w-10 h-10 text-sky-500 animate-pulse mx-auto" />
                      <h4 className="font-bold text-base text-indigo-950">Dispatching Targets Payloads...</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">Assembling direct API streams to Meta Converts API (CAPI) and GA4 telemetry protocol handlers...</p>
                    </div>
                  )}

                  {checkoutStatus === 'completed' && (
                    <div className="text-center space-y-4 py-4" id="sim_complete_screen">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">Pipeline Flow Secured!</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Attribution identifiers processed safely and propagated with maximum fidelity.</p>
                      </div>

                      {/* Score metrics panel */}
                      <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl max-w-sm mx-auto">
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-900 mb-1">
                          <span>META MATCH SCORE</span>
                          <span>{simulatedScore} / 10.0</span>
                        </div>
                        <div className="w-full h-2 rounded bg-slate-200/80 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-1000" 
                            style={{ width: `${simulatedScore * 10}%` }}
                          />
                        </div>
                        <span className="block text-[10px] text-emerald-700/80 mt-1.5 text-left font-sans leading-normal">
                          Excellent signals matched! Meta Ads algorithms receive clean user credentials along with secure <strong>{utmSource}</strong> campaign markers.
                        </span>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => setCheckoutStatus('form')}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs tracking-wide transition-all"
                          id="btn_retry_sim"
                        >
                          Run Sim Again
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Steps Progression Bar */}
                <div className="pt-4 border-t border-slate-200/50 flex justify-between gap-1" id="progression_bar">
                  {[
                    { label: "Billing", key: 'form', idx: 0 },
                    { label: "Stripe", key: 'stripe_active', idx: 1 },
                    { label: "Webhook", key: 'generating_webhook', idx: 2 },
                    { label: "Server GTM", key: 'processing_gtm', idx: 3 },
                    { label: "APIs", key: 'analytics_dispatch', idx: 4 },
                    { label: "Fidelity", key: 'completed', idx: 5 }
                  ].map((p) => {
                    const statusesOrdered = ['form', 'submitting_to_stripe', 'stripe_active', 'generating_webhook', 'processing_gtm', 'analytics_dispatch', 'completed'];
                    const currentIdx = statusesOrdered.indexOf(checkoutStatus);
                    const stopTriggered = statusesOrdered.indexOf(p.key);
                    const isPassed = currentIdx >= stopTriggered;
                    
                    return (
                      <div key={p.label} className="flex-1 flex flex-col items-center">
                        <div className={`h-1.5 w-full rounded-full transition-all ${isPassed ? 'bg-sky-500' : 'bg-slate-200'}`} />
                        <span className={`text-[9px] font-mono mt-1 font-bold ${isPassed ? 'text-sky-600' : 'text-slate-400'}`}>{p.label}</span>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Modal Right Side - Dynamic Logs & Payloads stream */}
              <div className="lg:w-[55%] bg-[#0A1628] p-6 sm:p-8 text-slate-300 flex flex-col justify-between overflow-y-auto" id="modal_right_pane">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
                    <span className="font-bold text-slate-400">REAL-TIME PIPELINE INTERFACE</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">STREAM_UP</span>
                </div>

                <div className="my-6 flex-1 space-y-6">
                  
                  {/* Checkout Creation Logs Section */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-slate-400 flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5 text-sky-400" /> Stripe Creation Client (Locked)</span>
                      <span className={`font-bold ${stripeMetadataLogs ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {stripeMetadataLogs ? '● DISPATCHED' : '○ PENDING'}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[140px] overflow-y-auto font-mono text-[10px] text-slate-400">
                      {stripeMetadataLogs ? (
                        <pre className="text-blue-300">{JSON.stringify({
                          method: 'POST',
                          endpoint: 'https://api.stripe.com/v1/checkout/sessions',
                          metadata: stripeMetadataLogs.metadata
                        }, null, 2)}</pre>
                      ) : (
                        <span className="italic text-slate-600">// Waiting for Billing confirmation to issue Stripe Session...</span>
                      )}
                    </div>
                  </div>

                  {/* Webhook Interceptor Section */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-slate-400 flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5 text-sky-400" /> Stripe Webhook Web Receptor</span>
                      <span className={`font-bold ${gtmWebhookLogs ? 'text-pink-400' : 'text-slate-600'}`}>
                        {gtmWebhookLogs ? '● CAPTURED' : '○ EXPIRED/WAITING'}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[140px] overflow-y-auto font-mono text-[10px] text-slate-400">
                      {gtmWebhookLogs ? (
                        <pre className="text-pink-300">{JSON.stringify({
                          event: gtmWebhookLogs.type,
                          webhook_received: true,
                          payload_metadata: gtmWebhookLogs.data.object.metadata
                        }, null, 2)}</pre>
                      ) : (
                        <span className="italic text-slate-600">// Waiting for Stripe processing and transaction events...</span>
                      )}
                    </div>
                  </div>

                  {/* Outgoing API Streams Section */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-slate-400 flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5 text-sky-400" /> Server GTM Dispatched APIs</span>
                      <span className={`font-bold ${metaCapiPayload ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {metaCapiPayload ? '● DISPATCHED SUCCESS' : '○ QUEUED'}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[140px] overflow-y-auto font-mono text-[10px] text-slate-400">
                      {metaCapiPayload && ga4Payload ? (
                        <pre className="text-emerald-400">{JSON.stringify({
                          meta_capi_post_200: {
                            status: "success",
                            events_received: 1,
                            fbclid_mapped: metaCapiPayload.data[0].user_data.fbc
                          },
                          ga4_measurement_protocol_200: {
                            status: "success",
                            transaction_id: ga4Payload.events[0].params.transaction_id,
                            utm_source: ga4Payload.events[0].params.utm_source
                          }
                        }, null, 2)}</pre>
                      ) : (
                        <span className="italic text-slate-600">// Webhook payload needs parsing before direct analytics stream starts...</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Footer notes */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Server-To-Server SSL Active</span>
                  <span className="text-sky-500">SignalGuard secure simulation</span>
                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
