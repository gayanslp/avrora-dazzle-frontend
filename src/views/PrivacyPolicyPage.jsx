'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Database, 
  Server, 
  MapPin, 
  Mail, 
  CheckCircle2, 
  FileText,
  UserCheck,
  CreditCard,
  Truck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PrivacyPolicyPage = () => {
  const { isAvroraTheme } = useTheme();

  const securityPillars = [
    {
      icon: CreditCard,
      title: 'PayHere Secure Gateway',
      desc: 'Central Bank of Sri Lanka approved. We never store card numbers, CVVs, or bank pins.'
    },
    {
      icon: ShieldCheck,
      title: 'PDPA Compliant',
      desc: 'Formulated in accordance with the Sri Lanka Personal Data Protection Act No. 9 of 2022.'
    },
    {
      icon: Lock,
      title: '256-Bit SSL/TLS',
      desc: 'All digital transmissions and transactions are protected by end-to-end data encryption.'
    },
    {
      icon: Truck,
      title: 'Protected Courier Data',
      desc: 'Delivery details shared strictly with accredited courier partners for doorstep delivery.'
    }
  ];

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isAvroraTheme ? 'bg-transparent text-slate-200' : 'bg-slate-50 text-slate-800'
    }`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs mb-8 text-slate-400">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <span>/</span>
          <span className={isAvroraTheme ? 'text-cyan-300 font-medium' : 'text-slate-900 font-medium'}>
            Privacy Policy
          </span>
        </nav>

        {/* Hero Header */}
        <div className={`rounded-3xl p-8 sm:p-12 mb-10 border transition-all relative overflow-hidden ${
          isAvroraTheme
            ? 'bg-gradient-to-br from-[#0c0528]/90 via-[#060119]/80 to-[#120738]/90 border-cyan-500/20 shadow-[0_0_35px_rgba(6,182,212,0.15)]'
            : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <Lock size={14} />
              <span>Data Protection & Confidentiality</span>
            </div>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-cinzel mb-4 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              Privacy Policy
            </h1>
            <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
              isAvroraTheme ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Your privacy is of paramount importance to <strong>Avrora Dazzle Textiles and Fancy Items</strong>. This document explains how we collect, handle, utilize, and protect your personal data in full compliance with the <strong>Personal Data Protection Act (PDPA) No. 9 of 2022 of Sri Lanka</strong>.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                PCI-DSS Level 1 Payment Security
              </span>
              <span>•</span>
              <span>Last updated: October 2026</span>
              <span>•</span>
              <span>Kadawatha, Sri Lanka</span>
            </div>
          </div>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {securityPillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className={`p-5 rounded-2xl border transition-all ${
                  isAvroraTheme
                    ? 'bg-[#090320]/70 border-cyan-500/15 hover:border-cyan-500/35 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Icon size={20} />
                </div>
                <h3 className={`text-sm font-bold mb-1.5 ${isAvroraTheme ? 'text-white' : 'text-slate-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isAvroraTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8">
          
          {/* Section 1: Data Controller */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">01.</span> Data Controller Overview
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                The entity responsible for processing your personal data on this platform is:
              </p>
              <div className={`p-4 rounded-2xl border ${
                isAvroraTheme ? 'bg-[#0d0429]/60 border-cyan-500/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <p className="font-bold">Avrora Dazzle Textiles and Fancy Items</p>
                <p className="text-xs text-slate-400 mt-1">No.62/7, Kandy Road, Kadawatha, 11850, Sri Lanka</p>
                <p className="text-xs text-cyan-400 mt-1">Website: https://avroradazzle.com · Email: privacy@avroradazzle.com</p>
              </div>
            </div>
          </section>

          {/* Section 2: Data We Collect */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">02.</span> Information We Collect
            </h2>
            <p className={`text-sm mb-4 leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              We collect information that is strictly required to process your purchases and ensure smooth doorstep courier deliveries:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Personal Identification', desc: 'Full name, title, and account username.' },
                { title: 'Contact Information', desc: 'Active mobile telephone number (essential for courier alerts) and email address.' },
                { title: 'Shipping & Delivery Address', desc: 'Destination street address, city, postal code, district, and landmarks.' },
                { title: 'Order History & Invoices', desc: 'Items purchased, sizes, transaction timestamps, and invoice records.' },
                { title: 'Technical Device Data', desc: 'IP address, browser version, operating system, and session timestamps.' },
                { title: 'Customer Support Communications', desc: 'Inquiries, size questions, and exchange requests submitted to our desk.' }
              ].map((item, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border text-xs ${
                  isAvroraTheme ? 'bg-[#0c0428]/50 border-cyan-500/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <p className={`font-bold mb-1 ${isAvroraTheme ? 'text-cyan-300' : 'text-slate-900'}`}>{item.title}</p>
                  <p className={isAvroraTheme ? 'text-slate-400' : 'text-slate-600'}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: PayHere & Payment Information */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">03.</span> Payment Details & PayHere Integration
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                All online card transactions, digital wallet payments, and LankaQR purchases are handled directly through <strong>PayHere Payment Gateway</strong>, a certified payment processor approved by the Central Bank of Sri Lanka and audited to PCI-DSS Level 1 compliance.
              </p>
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isAvroraTheme ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold">Zero Card Storage Guarantee:</p>
                  <p className="mt-0.5">
                    Avrora Dazzle <strong>never</strong> collects, stores, or views your 16-digit credit/debit card numbers, CVV security codes, or internet banking credentials on our web servers. All card inputs are tokenized directly within PayHere’s encrypted infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Use of Personal Data */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">04.</span> How We Use Your Information
            </h2>
            <ul className={`list-disc list-inside space-y-2 text-sm leading-relaxed ${
              isAvroraTheme ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <li>To confirm, pack, invoice, and fulfill your orders placed on our website.</li>
              <li>To coordinate doorstep courier transit, SMS delivery notifications, and tracking calls.</li>
              <li>To respond to your inquiries regarding fabric specifications, tailoring, or returns.</li>
              <li>To prevent fraudulent payments, illegal account access, or automated bot activities.</li>
              <li>To share optional, consent-based updates on new textile collections and seasonal promotions (you can unsubscribe anytime).</li>
            </ul>
          </section>

          {/* Section 5: Third-Party Disclosures & Courier Sharing */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">05.</span> Third-Party Data Sharing & Courier Logistics
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                We do not sell, rent, trade, or distribute your private contact details to external third-party advertisers. Data is shared only with strictly authorized operational partners:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong>Courier Logistics Providers:</strong> Your recipient name, delivery address, and contact number are provided to trusted domestic courier services (e.g., Citypak, PromptX, Domex, Pronto) exclusively to fulfill islandwide delivery.</li>
                <li><strong>Payment Processors:</strong> Necessary transaction tokens are transmitted to PayHere to finalize payment authorizations.</li>
                <li><strong>Statutory Authorities:</strong> Disclosed only where compelled by applicable Sri Lankan court orders or criminal investigation laws.</li>
              </ul>
            </div>
          </section>

          {/* Section 6: Data Security Safeguards */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">06.</span> Security Safeguards & Encryption
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                Our store is protected by **256-bit SSL / TLS digital encryption**. This guarantees that all inputs entered during navigation and checkout remain private and encrypted in transit. We maintain role-based server access controls, automated firewall monitoring, and regular security patching.
              </p>
            </div>
          </section>

          {/* Section 7: Customer Rights Under Sri Lanka PDPA */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">07.</span> Your Legal Rights Under the Sri Lanka PDPA
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                Under the Sri Lanka Personal Data Protection Act No. 9 of 2022, you have the right to:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {[
                  { title: 'Right of Access', desc: 'Request a copy of the personal information stored in your customer profile.' },
                  { title: 'Right to Rectification', desc: 'Request immediate correction of outdated or incorrect addresses and phone numbers.' },
                  { title: 'Right to Erasure', desc: 'Request account deletion, subject to mandatory tax and commercial record retention laws.' },
                  { title: 'Right to Withdraw Consent', desc: 'Unsubscribe from promotional emails or SMS broadcasts at any moment.' }
                ].map((item, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border text-xs ${
                    isAvroraTheme ? 'bg-[#0c0428]/50 border-cyan-500/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <p className={`font-bold mb-1 ${isAvroraTheme ? 'text-emerald-300' : 'text-slate-900'}`}>{item.title}</p>
                    <p className={isAvroraTheme ? 'text-slate-400' : 'text-slate-600'}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 8: Cookies */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">08.</span> Cookies & Browser Storage
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                We use functional cookies to remember items in your shopping bag, maintain user login sessions, and monitor website speed. You can disable cookies through your browser settings; however, certain shopping features (such as cart persistence) may not function properly without cookies enabled.
              </p>
            </div>
          </section>

        </div>

        {/* Contact Concierge Box */}
        <div className={`mt-12 p-8 rounded-3xl border text-center transition-all ${
          isAvroraTheme
            ? 'bg-gradient-to-r from-[#0c0528] via-[#100632] to-[#0c0528] border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className={`text-xl font-bold font-cinzel mb-2 ${isAvroraTheme ? 'text-white' : 'text-slate-950'}`}>
            Data Protection & Privacy Officer
          </h3>
          <p className={`text-xs max-w-xl mx-auto mb-6 ${isAvroraTheme ? 'text-slate-400' : 'text-slate-600'}`}>
            If you have questions regarding our data practices or wish to submit an official data rectification request:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a 
              href="mailto:privacy@avroradazzle.com" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md"
            >
              <Mail size={14} />
              <span>privacy@avroradazzle.com</span>
            </a>
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${
              isAvroraTheme ? 'border-cyan-500/30 text-cyan-300' : 'border-slate-300 text-slate-700'
            }`}>
              <MapPin size={14} />
              <span>No.62/7, Kandy Road, Kadawatha, Sri Lanka</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
