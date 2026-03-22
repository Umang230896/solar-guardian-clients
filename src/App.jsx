import React, { useState, useEffect, useMemo } from 'react';
import './App.css'; // <-- Added to ensure Tailwind CSS is loaded
import { 
  Home, Clock, FileText, CreditCard, User, LogOut, 
  ChevronRight, CalendarCheck, Shield, AlertCircle, 
  CheckCircle, Sun, MapPin, Receipt, Wallet, ArrowLeft,
  X, Download, ExternalLink, Phone, Mail, Lock, Edit
} from 'lucide-react';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://lydodkjktnryvdamdado.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ZG9ka2prdG5yeXZkYW1kYWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjg2NzEsImV4cCI6MjA4ODkwNDY3MX0.cxMa86cX_WQLDBjOQHGWBy2ecpEZ-GA4vw9XFYg6Aac';

const COMPANY_PHONE = '+91 89802 47098';
const COMPANY_DETAILS = {
  name: 'Solar Guardian',
  bankName: 'KOTAK MAHINDRA - SARTHANA',
  accNo: '4145839716',
  ifsc: 'KKBK0002862',
  hod: 'UGAM SODVADIYA',
  hodTitle: 'Head Of Department',
  phone: '+91 89802 47098',
  email: 'Ugamsodvadiya03@gmail.com',
  insta: '@solarguardian.in',
  terms: '1. Full payment is due within 7 days of receiving the invoice. Late payments will incur a penalty of 2% of the total amount per week of delay.'
};

// --- HELPER FORMATTERS ---
const formatCurrency = (amount) => {
  return Math.round(Number(amount) || 0).toLocaleString('en-IN');
};

const sanitizePhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const getUpiLink = (amount) => {
  const formattedAmount = Number(amount).toFixed(2);
  return `upi://pay?pa=umangchodavadiya1234@okicici&pn=Ugam%20Sodvadiya&am=${formattedAmount}&cu=INR&aid=uGICAgID-teuhfA`;
};

// --- ASSETS ---
const SolarGuardianLogo = ({ className = "w-12 h-12" }) => (
  <img 
    src="https://i.ibb.co/DS33CMQ/Gemini-Generated-Image-xpt698xpt698xpt6-removebg-preview.png" 
    alt="Solar Guardian Logo" 
    className={className} 
  />
);

const DynamicUPIQRCode = ({ amount }) => {
  const upiString = getUpiLink(amount);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}&margin=0`;
  
  return (
    <img 
      src={qrUrl} 
      alt={`UPI Payment QR`} 
      className="w-24 h-24 object-contain mix-blend-multiply" 
      crossOrigin="anonymous" 
    />
  );
};

// --- PDF-STYLE INVOICE TEMPLATE ---
const InvoiceDocument = ({ inv, client }) => {
  if (!inv) return null;
  return (
    <div className="bg-white mx-auto w-[210mm] h-[290mm] box-border relative font-sans text-gray-900 flex flex-col shrink-0 overflow-hidden shadow-none">
      <div className="absolute top-[-150px] right-[-150px] w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[80px] opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[400px] bg-teal-50 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
      <div className="h-3 w-full bg-gradient-to-r from-emerald-800 to-teal-500 shrink-0"></div>

      <div className="p-8 flex-1 flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-6 shrink-0">
           <div className="flex flex-col items-start gap-2">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <SolarGuardianLogo className="h-14 w-auto object-contain" />
              </div>
              <p className="text-emerald-700 font-bold text-[11px] uppercase tracking-widest pl-1">Professional Solar Maintenance</p>
           </div>
           <div className="text-right">
              <h2 className="text-[42px] font-black text-gray-200 uppercase tracking-tighter leading-none">Invoice</h2>
              <p className="text-lg font-bold text-emerald-800 mt-1">#{inv.invoiceNo}</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6 shrink-0">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
               <User size={14}/> Billed To
             </h3>
             <p className="text-xl font-black text-emerald-950 mb-1">{client.name || 'Unknown Client'}</p>
             {client.address && <p className="text-sm text-gray-600 leading-relaxed max-w-[250px] mb-3">{client.address}</p>}
             <div className="space-y-1">
               <p className="text-xs font-medium text-gray-700 flex items-center gap-2"><Phone size={14} className="text-emerald-600"/> {client.phone}</p>
               {client.email && <p className="text-xs font-medium text-gray-700 flex items-center gap-2"><Mail size={14} className="text-emerald-600"/> {client.email}</p>}
             </div>
          </div>

          <div className="flex flex-col justify-center items-end text-right">
             <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 rounded-2xl p-6 border border-emerald-100 shadow-sm w-full max-w-[280px]">
               <div className="flex justify-between items-center mb-3">
                 <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">Date Issued</span>
                 <span className="font-bold text-emerald-950">{formatDate(inv.date)}</span>
               </div>
               <div className="flex justify-between items-center mb-4">
                 <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">Status</span>
                 <span className={`font-bold px-2.5 py-1 rounded text-[10px] uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'}`}>{inv.status}</span>
               </div>
               <div className="pt-4 border-t border-emerald-200/60 flex justify-between items-end">
                 <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest pb-1">Total Due</span>
                 <span className="text-2xl font-black text-emerald-700 leading-none">₹{formatCurrency(inv.subTotal)}</span>
               </div>
             </div>
          </div>
        </div>

        <div className="mb-6 flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-900 text-white shadow-md">
                <th className="py-2.5 px-4 font-bold text-[10px] uppercase tracking-widest rounded-l-xl w-1/2">Service Description</th>
                <th className="py-2.5 px-4 font-bold text-[10px] uppercase tracking-widest text-center">Qty / Panels</th>
                <th className="py-2.5 px-4 font-bold text-[10px] uppercase tracking-widest text-center">Rate</th>
                <th className="py-2.5 px-4 font-bold text-[10px] uppercase tracking-widest text-right rounded-r-xl">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inv.items && inv.items.map((item) => (
                <tr key={item.id || Math.random()} className="text-sm group">
                  <td className="py-2.5 px-4">
                    <p className="font-bold text-gray-900">{item.description}</p>
                  </td>
                  <td className="py-2.5 px-4 text-center font-bold text-gray-600">{item.qty}</td>
                  <td className="py-2.5 px-4 text-center font-medium text-gray-500">₹{formatCurrency(item.rate)}</td>
                  <td className="py-2.5 px-4 text-right font-black text-emerald-950">₹{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-6 shrink-0">
          <div className="w-[320px] bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center text-sm mb-2 text-gray-600">
               <span className="font-medium">Subtotal</span>
               <span className="font-bold text-gray-900">₹{formatCurrency(inv.subTotal)}</span>
             </div>
             <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-100">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-1">Total Amount</span>
               <span className="text-[28px] font-black text-emerald-600 leading-none">₹{formatCurrency(inv.subTotal)}</span>
             </div>
          </div>
        </div>

        <div className="mt-auto shrink-0">
          <div className="grid grid-cols-12 gap-8 items-end">
            <div className="col-span-7 bg-gradient-to-br from-emerald-50 to-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex gap-4 items-center">
              <div className="flex-shrink-0 bg-white p-2 rounded-xl border border-emerald-100 shadow-sm">
                <DynamicUPIQRCode amount={inv.subTotal} />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5">Payment Details</h3>
                <p className="text-xs text-gray-900 font-bold mb-1">{COMPANY_DETAILS.bankName}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mb-1.5">
                  <p className="text-[11px] text-gray-600"><span className="font-medium text-gray-800">A/C:</span> {COMPANY_DETAILS.accNo}</p>
                  <p className="text-[11px] text-gray-600"><span className="font-medium text-gray-800">IFSC:</span> {COMPANY_DETAILS.ifsc}</p>
                </div>
                <div>
                   <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/80 px-2 py-1 rounded">Scan QR to pay instantly</span>
                </div>
              </div>
            </div>
            <div className="col-span-5 text-right flex flex-col items-end justify-end pb-1">
               <img src="https://i.ibb.co/Kx2KXgVp/sign-1.png" alt="Signature" className="h-14 w-auto mb-1 mix-blend-multiply opacity-80" />
               <p className="text-sm font-black text-emerald-950 uppercase tracking-widest border-t-2 border-emerald-900/20 pt-1 w-48">{COMPANY_DETAILS.hod}</p>
               <p className="text-[10px] font-bold text-emerald-600 mt-0.5">{COMPANY_DETAILS.hodTitle}</p>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Authorized Signatory</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
             <div className="flex gap-6">
               <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                 <div className="bg-emerald-100 p-1.5 rounded-full"><Phone size={12} className="text-emerald-700" /></div> {COMPANY_DETAILS.phone}
               </span>
             </div>
             <div className="max-w-[50%] text-right text-[9px] font-medium text-gray-400 leading-relaxed uppercase tracking-wide">
                {COMPANY_DETAILS.terms}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP UI COMPONENTS ---

const Header = ({ title, showBack, onBack, user, onProfileClick }) => {
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_8px_30px_-15px_rgba(16,185,129,0.2)]">
      {/* Top Brand Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400"></div>
      
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-3.5">
          {showBack ? (
            <button 
              onClick={onBack} 
              className="p-2.5 -ml-1 bg-white hover:bg-emerald-50 border border-gray-200 rounded-full shadow-sm transition-all active:scale-95 text-emerald-700 flex items-center justify-center"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 blur-lg opacity-30 rounded-full"></div>
              <div className="relative bg-white p-1.5 rounded-[1rem] border border-emerald-50 shadow-sm">
                <SolarGuardianLogo className="h-8 w-8 object-contain" />
              </div>
            </div>
          )}
          <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-950 to-teal-900 tracking-tight">
            {title}
          </h1>
        </div>
        
        {!showBack && user && (
          <button 
            onClick={onProfileClick} 
            className="group flex items-center gap-2 p-1 pl-3 bg-white rounded-full border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 active:scale-95 transition-all"
          >
            <span className="text-sm font-extrabold text-emerald-950 tracking-tight">
              {user.name.split(' ')[0]}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-inner border-2 border-white ring-1 ring-emerald-100 group-hover:scale-105 transition-transform">
              {userInitial}
            </div>
          </button>
        )}
      </div>
    </header>
  );
};

const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'history', icon: Clock, label: 'Services' },
    { id: 'bills', icon: FileText, label: 'Bills' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-100 flex justify-around pb-safe pt-2 px-2 z-40 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.08)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 min-w-[72px] transition-all duration-300 relative rounded-2xl ${
              isActive ? 'text-emerald-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {isActive && <div className="absolute inset-0 bg-emerald-50 rounded-xl -z-10 scale-100 transition-transform"></div>}
            <Icon size={24} className={isActive ? 'mb-1 drop-shadow-md' : 'mb-1'} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] ${isActive ? 'font-black tracking-wide' : 'font-medium'}`}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center mt-6">
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-[2rem] mb-5 shadow-inner border border-emerald-100/50">
      <Icon size={48} className="text-emerald-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-extrabold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-xs font-medium leading-relaxed">{message}</p>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [supabase, setSupabase] = useState(null);
  const [dbSetupMissing, setDbSetupMissing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // App State
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('home');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Client Data State
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [events, setEvents] = useState([]);
  const [quotations, setQuotations] = useState([]);

  // Login Form State
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ loginId: '', password: '' });
  const [profileSaveMsg, setProfileSaveMsg] = useState({ type: '', text: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // 1. Initialize Supabase Script
  useEffect(() => {
    const initSupabase = async () => {
      try {
        if (!window.supabase) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = () => reject();
            document.head.appendChild(script);
          });
        }
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        setSupabase(client);
      } catch (error) {
        console.error("Supabase init error", error);
        setErrorMsg("Failed to connect to servers. Please check your internet connection.");
      }
    };
    initSupabase();
  }, []);

// Auto-login session check
  useEffect(() => {
    const checkSession = async () => {
      const savedUserId = localStorage.getItem('solar_guardian_client_id');
      if (savedUserId && supabase) {
        setLoading(true);
        try {
          const { data, error } = await supabase.from('clients').select('*').eq('id', savedUserId).single();
          if (data && !error) {
            setUser(data);
            fetchClientData(data.id);
          } else {
            localStorage.removeItem('solar_guardian_client_id');
          }
        } catch (err) {
          console.error('Session check failed', err);
        }
        setLoading(false);
      }
    };
    checkSession();
  }, [supabase]);
  
  // 2. Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: clients, error } = await supabase.from('clients').select('*');
      
      if (error) {
        if (error.code === 'PGRST205') {
            setErrorMsg("Database tables are not set up yet.");
            setDbSetupMissing(true);
        } else {
            setErrorMsg(error.message);
        }
        setLoading(false);
        return;
      }

      const inputNameSanitized = loginName.trim().toLowerCase();
      const rawPasswordInput = loginPassword.trim();

      const matchedClient = clients.find(client => {
        // Default fallbacks
        const defaultLoginId = (client.name || '').split(' ')[0].toLowerCase();
        const defaultPassword = sanitizePhone(client.phone);

        // Database overrides (if client set custom credentials)
        const dbLoginId = (client.loginId || '').trim().toLowerCase();
        const dbPassword = (client.password || '').trim();

        const targetLoginId = dbLoginId || defaultLoginId;
        const isIdMatch = targetLoginId === inputNameSanitized;
        
        let isPasswordMatch = false;
        if (dbPassword) {
           // Exact match for custom passwords
           isPasswordMatch = dbPassword === rawPasswordInput;
        } else {
           // Fuzzy match for default phone number password
           const inputPhoneSanitized = sanitizePhone(rawPasswordInput);
           isPasswordMatch = defaultPassword.includes(inputPhoneSanitized) && inputPhoneSanitized.length >= 8;
        }

        return isIdMatch && isPasswordMatch;
      });

      if (matchedClient) {
        setUser(matchedClient);
        fetchClientData(matchedClient.id);
      } else {
        setErrorMsg("Invalid credentials. Please check your Username and Password.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
    }
    setLoading(false);
  };

  // 3. Fetch specific client data
  const fetchClientData = async (clientId) => {
    if (!supabase) return;
    try {
      const [iRes, pRes, eRes, qRes] = await Promise.all([
        supabase.from('invoices').select('*').eq('clientId', clientId).order('date', { ascending: false }),
        supabase.from('payments').select('*').eq('clientId', clientId).order('date', { ascending: false }),
        supabase.from('calendar_events').select('*').eq('clientId', clientId).order('date', { ascending: false }),
        supabase.from('quotations').select('*').eq('clientId', clientId).order('date', { ascending: false })
      ]);

      if (iRes.data) setInvoices(iRes.data);
      if (pRes.data) setPayments(pRes.data);
      if (eRes.data) setEvents(eRes.data);
      if (qRes.data) setQuotations(qRes.data);
    } catch (err) {
      console.error("Data fetch error", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setInvoices([]);
    setPayments([]);
    setEvents([]);
    setQuotations([]);
    setActiveTab('home');
    setLoginName('');
    setLoginPassword('');
    setSelectedInvoice(null);
  };

  const handleUpiPayment = (amount) => {
    const upiUrl = getUpiLink(amount);
    // Dynamic anchor tag is the most reliable way to trigger Android Intents for UPI
    const a = document.createElement('a');
    a.href = upiUrl;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    // Give the hidden DOM element a fraction of a second to fully paint
    await new Promise(r => setTimeout(r, 300));
    
    const element = document.getElementById('hidden-client-invoice-pdf');
    if (!element) {
      setIsDownloading(false);
      return;
    }

    if (!window.html2pdf) {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.body.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      } catch (err) {
        alert('Failed to load PDF generator. Please check connection.');
        setIsDownloading(false);
        return;
      }
    }

    window.html2pdf().set({
      margin: 0,
      filename: `SolarGuardian_Invoice_${selectedInvoice.invoiceNo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save().then(() => {
      setIsDownloading(false);
    });
  };

  const openEditProfile = () => {
    setEditProfileData({
      loginId: user.loginId || (user.name || '').split(' ')[0],
      password: user.password || sanitizePhone(user.phone)
    });
    setProfileSaveMsg({ type: '', text: '' });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setIsSavingProfile(true);
    setProfileSaveMsg({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          loginId: editProfileData.loginId,
          password: editProfileData.password
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUser({ ...user, ...editProfileData });
      setProfileSaveMsg({ type: 'success', text: 'Login credentials updated successfully!' });
      
      // Close modal after success
      setTimeout(() => {
        setIsEditingProfile(false);
      }, 1500);
      
    } catch (err) {
      setProfileSaveMsg({ type: 'error', text: err.message || 'Failed to update credentials.' });
    }
    setIsSavingProfile(false);
  };

  // --- CALCULATIONS FOR HOME DASHBOARD ---
  const dashboardStats = useMemo(() => {
    if (!user) return {};

    const totalInvoiced = invoices.reduce((sum, inv) => sum + (Number(inv.subTotal) || 0), 0);
    const totalPayments = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const totalDeposits = quotations.filter(q => q.status === 'Onboarded').reduce((sum, q) => sum + (Number(q.depositAmount) || 0), 0);
    
    const amountPaid = totalPayments + totalDeposits;
    const balance = totalInvoiced - amountPaid;

    const todayStr = new Date().toISOString().split('T')[0];
    
    const upcomingEvents = events
      .filter(e => e.date >= todayStr && e.status !== 'Completed' && e.status !== 'Cancelled')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const pastEvents = events
      .filter(e => e.date < todayStr || e.status === 'Completed')
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const activeYearlyQuotes = quotations.filter(q => q.status === 'Onboarded' && q.contractType === 'Yearly');

    return {
      balance,
      amountPaid,
      nextService: upcomingEvents[0] || null,
      upcomingCount: upcomingEvents.length,
      pastCount: pastEvents.length,
      hasYearlyContract: activeYearlyQuotes.length > 0
    };
  }, [invoices, payments, quotations, events, user]);


  // --- VIEWS ---

  if (dbSetupMissing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">System Maintenance</h2>
        <p className="text-gray-600 font-medium">The application database is currently not accessible. Please contact the Solar Guardian administration team.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center px-6 font-sans relative overflow-hidden">
        {/* Modern Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[60%] bg-emerald-600 rounded-[100%] blur-[120px] opacity-15 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[50%] bg-teal-500 rounded-full blur-[100px] opacity-15 pointer-events-none"></div>

        <div className="max-w-md w-full mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-white rounded-[2rem] shadow-xl shadow-emerald-900/10 border border-emerald-50 mb-6">
              <SolarGuardianLogo className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Solar Guardian</h1>
            <p className="mt-2 text-sm text-emerald-700 font-bold uppercase tracking-widest">Client Portal</p>
          </div>

          <div className="bg-white/90 backdrop-blur-2xl py-8 px-6 shadow-2xl shadow-emerald-900/10 rounded-[2.5rem] border border-white/60">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex gap-3 text-red-800 text-sm font-medium">
                <AlertCircle size={20} className="shrink-0 text-red-600" />
                <p>{errorMsg}</p>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-2 ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    value={loginName} 
                    onChange={e => setLoginName(e.target.value)} 
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-emerald-500 outline-none transition-all bg-gray-50/50 focus:bg-white text-base font-medium" 
                    placeholder="e.g. Rahul"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-2 ml-1">Password <span className="text-gray-400 font-medium">(Default is Mobile No)</span></label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CreditCard size={20} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input 
                    required 
                    type="password" 
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)} 
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-emerald-500 outline-none transition-all bg-gray-50/50 focus:bg-white text-base font-medium" 
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-emerald-600/30 text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-70 mt-6"
              >
                {loading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </form>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-8 font-bold flex items-center justify-center gap-1.5">
            <Shield size={14} className="text-emerald-500"/> Protected by Solar Guardian
          </p>
        </div>
      </div>
    );
  }

  // Define dynamic header titles
  const getHeaderTitle = () => {
    switch(activeTab) {
      case 'home': return 'Dashboard';
      case 'history': return 'Service History';
      case 'bills': return 'My Bills';
      case 'payments': return 'Payments';
      case 'profile': return 'My Profile';
      default: return 'Solar Guardian';
    }
  };

  const renderHome = () => (
    <div className="p-5 space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-[2.5rem] p-7 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 p-4 opacity-10 mix-blend-overlay">
          <Sun size={180} />
        </div>
        <div className="relative z-10">
          <p className="text-emerald-100/80 font-bold text-xs mb-1 uppercase tracking-widest">Welcome Back</p>
          <h2 className="text-3xl font-black mb-6">{user.name}</h2>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 flex justify-between items-center shadow-inner">
            <div>
              <p className="text-xs text-emerald-100 mb-1.5 font-bold uppercase tracking-widest">Ledger Balance</p>
              <h3 className="text-3xl font-black tracking-tight">
                ₹{formatCurrency(Math.abs(dashboardStats.balance))}
              </h3>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-sm ${dashboardStats.balance > 0 ? 'bg-red-500/20 text-red-100 border border-red-500/30' : 'bg-emerald-400/20 text-emerald-50 border border-emerald-400/30'}`}>
                {dashboardStats.balance > 0 ? 'Amount Due' : 'Advance / Settled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Status Banner */}
      {dashboardStats.hasYearlyContract && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/60 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-amber-100 shrink-0">
            <Shield size={26} className="text-amber-500" />
          </div>
          <div>
            <h4 className="font-extrabold text-amber-950 text-base">Active Yearly Member</h4>
            <p className="text-xs text-amber-800/80 font-medium mt-0.5 leading-relaxed">Your panels are protected with premium annual maintenance.</p>
          </div>
        </div>
      )}

      {/* Next Service Widget */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
            <CalendarCheck size={22} className="text-emerald-600" /> Next Service
          </h3>
          <button onClick={() => setActiveTab('history')} className="text-xs font-bold text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors">View All</button>
        </div>
        
        {dashboardStats.nextService ? (
          <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100 flex items-center justify-between shadow-inner">
            <div>
              <p className="text-sm font-black text-emerald-700 mb-1 uppercase tracking-wider">{formatDate(dashboardStats.nextService.date)}</p>
              <p className="text-gray-900 font-extrabold text-base">{dashboardStats.nextService.serviceName || 'Solar Panel Cleaning'}</p>
              <p className="text-xs font-bold text-gray-500 mt-1.5 flex items-center gap-1"><Sun size={12}/> {dashboardStats.nextService.qty} Panels Scheduled</p>
            </div>
            <div className="bg-white p-4 rounded-[1.2rem] shadow-sm border border-gray-100 shrink-0">
               <CalendarCheck size={28} className="text-emerald-500" />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-[1.5rem] p-8 text-center border border-gray-100 shadow-inner">
            <p className="text-gray-500 text-sm font-bold">No upcoming services scheduled.</p>
            <button onClick={() => window.open(`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}`)} className="mt-4 text-sm font-extrabold text-emerald-700 bg-emerald-100/50 px-5 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors">Request Service</button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setActiveTab('bills')} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform hover:border-emerald-100 hover:shadow-md group">
           <div className="bg-blue-50 group-hover:bg-blue-100 transition-colors p-5 rounded-[1.5rem]"><Receipt size={32} className="text-blue-500" /></div>
           <span className="font-extrabold text-gray-800 text-sm">View Bills</span>
        </button>
        <button onClick={() => setActiveTab('payments')} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform hover:border-emerald-100 hover:shadow-md group">
           <div className="bg-purple-50 group-hover:bg-purple-100 transition-colors p-5 rounded-[1.5rem]"><Wallet size={32} className="text-purple-500" /></div>
           <span className="font-extrabold text-gray-800 text-sm">Payments</span>
        </button>
      </div>
    </div>
  );

  const renderHistory = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = events.filter(e => e.date >= todayStr && e.status !== 'Completed' && e.status !== 'Cancelled').sort((a, b) => new Date(a.date) - new Date(b.date));
    const past = events.filter(e => e.date < todayStr || e.status === 'Completed').sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
      <div className="p-5 space-y-8 animate-in fade-in duration-300">
        
        {/* Upcoming Section */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
            <Clock size={24} className="text-amber-500" /> Upcoming
          </h2>
          <div className="space-y-4">
            {upcoming.length > 0 ? (
              upcoming.map((ev, i) => (
                <div key={ev.id} className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-300 to-amber-500"></div>
                  <div className="pl-3">
                    <p className="text-[11px] text-amber-600 font-black uppercase tracking-widest mb-1.5">{formatDate(ev.date)}</p>
                    <p className="font-extrabold text-gray-900 text-base">{ev.serviceName || 'Solar Panel Cleaning'}</p>
                    <p className="text-xs font-bold text-gray-500 mt-1 flex items-center gap-1"><Sun size={12}/> {ev.qty} Panels</p>
                  </div>
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-amber-100/50 shadow-inner uppercase tracking-wider">Scheduled</span>
                </div>
              ))
            ) : (
              <EmptyState icon={CalendarCheck} title="No Upcoming Services" message="You don't have any scheduled cleaning services at the moment." />
            )}
          </div>
        </div>

        {/* Past Section */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
            <CheckCircle size={24} className="text-emerald-500" /> Past Services
          </h2>
          <div className="space-y-4">
            {past.length > 0 ? (
              past.map(ev => (
                <div key={ev.id} className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-sm flex items-center justify-between opacity-90 hover:opacity-100 transition-opacity">
                  <div>
                    <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-1.5">{formatDate(ev.date)}</p>
                    <p className="font-bold text-gray-800 text-sm">{ev.serviceName || 'Solar Panel Cleaning'}</p>
                  </div>
                  {ev.status === 'Cancelled' ? (
                     <span className="bg-red-50 text-red-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-red-100/50 uppercase tracking-wider">Cancelled</span>
                  ) : (
                     <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-emerald-100/50 flex items-center gap-1 uppercase tracking-wider shadow-inner"><CheckCircle size={14}/> Completed</span>
                  )}
                </div>
              ))
            ) : (
              <EmptyState icon={History} title="No History Yet" message="Completed services will appear here." />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBills = () => (
    <div className="p-5 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/80 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900">Your Invoices</h2>
          <span className="text-[11px] font-black text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-sm uppercase tracking-wider">{invoices.length} Total</span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {invoices.length > 0 ? (
            invoices.map(inv => (
              <div 
                key={inv.id} 
                onClick={() => setSelectedInvoice(inv)}
                className="p-6 flex flex-col gap-4 active:bg-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="font-extrabold text-gray-900 text-lg">{inv.invoiceNo}</p>
                      {inv.status === 'Paid' ? (
                        <span className="bg-emerald-100/50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-emerald-200/50">Paid</span>
                      ) : (
                        <span className="bg-red-100/50 text-red-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-red-200/50">Pending</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{formatDate(inv.date)}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-full border border-gray-100 group-hover:bg-white transition-colors">
                     <ChevronRight size={20} className="text-gray-400 group-hover:text-emerald-500" />
                  </div>
                </div>
                
                <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                   <p className="text-xs font-bold text-gray-500">Total Amount</p>
                   <p className="text-xl font-black text-emerald-700">₹{formatCurrency(inv.subTotal)}</p>
                </div>
              </div>
            ))
          ) : (
             <EmptyState icon={Receipt} title="No Invoices" message="You don't have any generated bills yet." />
          )}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => {
    const combinedLedger = [
      ...payments.map(p => ({ ...p, type: 'Payment', displayRef: p.method })),
      ...quotations.filter(q => q.status === 'Onboarded' && q.depositAmount > 0).map(q => ({
        id: `dep-${q.id}`, date: q.date, amount: q.depositAmount, type: 'Advance Deposit', displayRef: `Quote #${q.quoteNo}`
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
      <div className="p-5 animate-in fade-in duration-300">
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-[2.5rem] p-7 text-white shadow-xl shadow-emerald-900/20 mb-8 flex items-center justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[40px] pointer-events-none"></div>
           <div className="relative z-10">
             <p className="text-emerald-100/80 text-[11px] font-bold uppercase tracking-widest mb-1.5">Total Paid</p>
             <h2 className="text-4xl font-black">₹{formatCurrency(dashboardStats.amountPaid)}</h2>
           </div>
           <div className="bg-white/10 p-5 rounded-[1.5rem] border border-white/20 shadow-inner relative z-10">
              <Wallet size={36} className="text-emerald-100" />
           </div>
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-5 pl-1">Payment Ledger</h2>
        
        <div className="space-y-4">
          {combinedLedger.length > 0 ? (
            combinedLedger.map(item => (
              <div key={item.id} className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                   <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 shadow-inner">
                     <CheckCircle size={22} className="text-emerald-600" />
                   </div>
                   <div>
                     <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1">{formatDate(item.date)}</p>
                     <p className="font-extrabold text-gray-800 text-base leading-none">{item.type}</p>
                     <p className="text-xs font-bold text-gray-500 mt-1">{item.displayRef}</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-700 text-xl">₹{formatCurrency(item.amount)}</p>
                  <p className="text-[10px] text-emerald-600/70 font-black uppercase tracking-widest mt-1">Success</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon={Wallet} title="No Payments Yet" message="Your payment history will appear here once transactions are recorded." />
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="p-5 space-y-5 animate-in fade-in h-full pb-24">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-center p-8 relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-emerald-50 to-white"></div>
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-5 border border-emerald-100 shadow-lg relative z-10">
          <SolarGuardianLogo className="w-16 h-16 object-contain" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
        <p className="text-sm font-bold text-gray-500 mt-1">{user.phone}</p>
        {user.email && <p className="text-sm font-medium text-gray-500">{user.email}</p>}
        {user.address && <p className="text-xs font-bold text-gray-600 mt-4 bg-gray-50 p-3 rounded-2xl inline-block border border-gray-100">{user.address}</p>}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button onClick={openEditProfile} className="w-full bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:bg-emerald-50/50 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100 group-hover:bg-white transition-colors"><Lock size={22} className="text-purple-600" /></div>
            <div className="text-left">
               <span className="font-extrabold text-gray-800 block text-base">Edit Login Credentials</span>
               <span className="text-xs font-bold text-gray-400">Change Username & Password</span>
            </div>
          </div>
          <ChevronRight size={22} className="text-gray-300 group-hover:text-purple-500 transition-colors" />
        </button>

        <button onClick={() => window.open(`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}`)} className="w-full bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:bg-emerald-50/50 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 group-hover:bg-white transition-colors"><Phone size={22} className="text-emerald-600" /></div>
            <div className="text-left">
               <span className="font-extrabold text-gray-800 block text-base">Contact Support</span>
               <span className="text-xs font-bold text-gray-400">Reach via WhatsApp</span>
            </div>
          </div>
          <ChevronRight size={22} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
        </button>
      </div>

      <button onClick={handleLogout} className="w-full bg-red-50/50 rounded-[1.5rem] border border-red-100 shadow-sm p-5 flex items-center justify-center gap-2 hover:bg-red-100/50 transition-colors mt-8">
        <LogOut size={22} className="text-red-600" />
        <span className="font-extrabold text-red-600 text-base">Secure Log Out</span>
      </button>
      
      <p className="text-center text-xs font-bold text-gray-300 mt-8">Solar Guardian Client App v1.0</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 pb-20 selection:bg-emerald-200">
      <Header 
        title={getHeaderTitle()} 
        user={user} 
        showBack={activeTab === 'profile'} 
        onBack={() => setActiveTab('home')}
        onProfileClick={() => setActiveTab('profile')}
      />

      <main className="max-w-md mx-auto relative h-full">
        {/* Hidden unscaled container specifically for perfect A4 PDF generation */}
        <div className="absolute left-[-9999px] top-[-9999px]">
          <div id="hidden-client-invoice-pdf" className="w-[210mm] h-[290mm] overflow-hidden">
             {selectedInvoice && <InvoiceDocument inv={selectedInvoice} client={user} />}
          </div>
        </div>

        {activeTab === 'home' && renderHome()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'bills' && renderBills()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'profile' && renderProfile()}

        {/* INVOICE MODAL OVERLAY */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="bg-white/10 backdrop-blur-md p-4 flex justify-between items-center text-white shrink-0 border-b border-white/10">
              <div>
                <h3 className="font-black text-lg">Invoice #{selectedInvoice.invoiceNo}</h3>
                <p className="text-xs font-medium text-gray-300">₹{formatCurrency(selectedInvoice.subTotal)} • {selectedInvoice.status}</p>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable PDF View Container */}
            <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
               {/* Scaled transform to fit typical mobile width (approx 0.45 scale for 210mm) */}
               <div className="origin-top flex justify-center w-[210mm] sm:scale-[0.6] scale-[0.45] bg-white shadow-2xl">
                 <InvoiceDocument inv={selectedInvoice} client={user} />
               </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="bg-white p-5 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] shrink-0 flex flex-col gap-3">
               {selectedInvoice.status !== 'Paid' && (
                  <button 
                    onClick={() => handleUpiPayment(selectedInvoice.subTotal)}
                    className="w-full flex justify-center items-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                  >
                    PAY VIA UPI APP <ExternalLink size={20} />
                  </button>
               )}
               <button 
                 onClick={handleDownloadPdf}
                 disabled={isDownloading}
                 className="w-full flex justify-center items-center gap-2 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-extrabold text-sm active:bg-gray-200 transition-colors disabled:opacity-50"
               >
                 <Download size={18} /> {isDownloading ? 'Generating PDF...' : 'Download Copy'}
               </button>
            </div>
          </div>
        )}

        {/* EDIT PROFILE MODAL */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] p-6 shadow-2xl w-full max-w-md relative">
              <button 
                onClick={() => setIsEditingProfile(false)} 
                className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-black text-gray-900 mb-1 flex items-center gap-2">
                <Lock className="text-purple-600" size={24} /> Edit Credentials
              </h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">Update your secure login details below.</p>

              {profileSaveMsg.text && (
                <div className={`mb-5 p-3.5 rounded-2xl text-sm font-bold flex gap-2.5 items-center ${profileSaveMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {profileSaveMsg.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                  {profileSaveMsg.text}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-sm font-extrabold text-gray-700 mb-1.5 ml-1">Custom Username</label>
                  <input required type="text" value={editProfileData.loginId} onChange={e => setEditProfileData({...editProfileData, loginId: e.target.value})} className="block w-full px-4 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-purple-500 outline-none transition-all bg-gray-50/50 focus:bg-white text-base font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-gray-700 mb-1.5 ml-1">New Password</label>
                  <input required type="text" value={editProfileData.password} onChange={e => setEditProfileData({...editProfileData, password: e.target.value})} className="block w-full px-4 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-purple-500 outline-none transition-all bg-gray-50/50 focus:bg-white text-base font-medium" />
                </div>
                
                <button type="submit" disabled={isSavingProfile} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-purple-600/20 text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-70 mt-6">
                  {isSavingProfile ? 'Saving Changes...' : 'Save Credentials'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
