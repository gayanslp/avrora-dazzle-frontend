'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileCheck2, 
  Scale, 
  ShieldCheck, 
  HelpCircle, 
  CreditCard, 
  Truck, 
  MapPin, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TermsAndConditionsPage = () => {
  const { isAvroraTheme } = useTheme();

  const legalPillars = [
    {
      icon: Scale,
      title: 'Laws of Sri Lanka',
      desc: 'All agreements and orders are subject to the exclusive jurisdiction of the courts of Sri Lanka.'
    },
    {
      icon: CreditCard,
      title: 'PayHere & Secure Payments',
      desc: 'Card payments and digital wallets processed with Central Bank approved PayHere gateway.'
    },
    {
      icon: Truck,
      title: 'Islandwide Delivery',
      desc: 'Reliable doorstep courier transit with full tracking across all Sri Lankan districts.'
    },
    {
      icon: BadgeCheck,
      title: 'Genuine Fabrics & Quality',
      desc: 'Curated textiles, designer fashion, and accessories inspected to high standards.'
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
            Terms & Conditions
          </span>
        </nav>

        {/* Hero Header */}
        <div className={`rounded-3xl p-8 sm:p-12 mb-10 border transition-all relative overflow-hidden ${
          isAvroraTheme
            ? 'bg-gradient-to-br from-[#0c0528]/90 via-[#060119]/80 to-[#120738]/90 border-cyan-500/20 shadow-[0_0_35px_rgba(6,182,212,0.15)]'
            : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
              <FileCheck2 size={14} />
              <span>Official Commercial Terms</span>
            </div>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-cinzel mb-4 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              Terms & Conditions
            </h1>
            <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
              isAvroraTheme ? 'text-slate-300' : 'text-slate-600'
            }`}>
              These terms govern your access to and purchases on <strong>avroradazzle.com</strong>, operated by <strong>Avrora Dazzle Textiles and Fancy Items</strong>. By browsing, purchasing, or creating an account, you agree to comply with and be bound by the terms outlined below.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Scale size={14} className="text-cyan-400" />
                Governed by the Democratic Socialist Republic of Sri Lanka
              </span>
              <span>•</span>
              <span>Last updated: October 2026</span>
              <span>•</span>
              <span>Kadawatha Showroom & Store</span>
            </div>
          </div>
        </div>

        {/* Legal Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {legalPillars.map((item, index) => {
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
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

        {/* Terms Content Sections */}
        <div className="space-y-8">
          
          {/* Section 1: Business Identification */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">01.</span> Business Entity & Head Office
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                This website is operated by <strong>Avrora Dazzle Textiles and Fancy Items</strong>, a registered retail and commercial enterprise in Sri Lanka.
              </p>
              <div className={`p-4 rounded-2xl border ${
                isAvroraTheme ? 'bg-[#0d0429]/60 border-cyan-500/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <p className="font-bold">Avrora Dazzle Textiles and Fancy Items</p>
                <p className="text-xs text-slate-400 mt-1">Official Address: No.62/7, Kandy Road, Kadawatha, 11850, Sri Lanka</p>
                <p className="text-xs text-cyan-400 mt-1">Website: https://avroradazzle.com · Email: support@avroradazzle.com</p>
              </div>
            </div>
          </section>

          {/* Section 2: Website Eligibility & Account Rules */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">02.</span> Eligibility & Account Security
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                By using this site, you certify that you are at least 18 years of age or accessing under the supervision of a parent or legal guardian.
              </p>
              <p>
                You are responsible for keeping your login credentials confidential. Any activity executed under your registered account is your responsibility. You agree to provide true and accurate shipping and contact information at all times.
              </p>
            </div>
          </section>

          {/* Section 3: Product Descriptions & Fabric Cutting Tolerances */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">03.</span> Product Specifications & Textile Disclaimers
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                <strong>Color Representation:</strong> We take rigorous photographic care to accurately present garment shades and fabric textures. However, variations in individual computer/mobile displays and ambient studio lighting mean slight shade nuances may occur and do not constitute a product defect.
              </p>
              <p>
                <strong>Textile Yardage Cutting Tolerances:</strong> In the purchase of custom-cut fabrics or unstitched materials, manual measurement and artisanal hand-cutting may produce standard commercial cutting tolerances of approximately <strong>±1 to 2 cm</strong>.
              </p>
            </div>
          </section>

          {/* Section 4: Pricing & Sri Lankan Rupee Currency */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">04.</span> Pricing, Currency & Typographical Errors
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                All prices on this website are stated in <strong>Sri Lankan Rupees (LKR / Rs.)</strong>. Delivery fees are calculated transparently during the checkout phase based on parcel weight and destination district.
              </p>
              <p>
                In the rare instance that a product is mistakenly listed at an incorrect price due to an IT system or clerical error, Avrora Dazzle reserves the right to cancel or refuse any orders placed at the erroneous figure prior to dispatch, promptly issuing a 100% refund.
              </p>
            </div>
          </section>

          {/* Section 5: Order Placement & Contract Formation */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">05.</span> Order Confirmation & Acceptance
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                Receiving an automated order confirmation email acknowledges receipt of your purchase intent, but does not represent formal acceptance. The binding contract of sale is formed when your order has been packaged and handed over to our courier partner with an assigned tracking consignment number.
              </p>
              <p>
                We reserve the right to limit or reject orders in circumstances involving suspected payment fraud, unserviceable courier destinations, or damaged stock inventory.
              </p>
            </div>
          </section>

          {/* Section 6: Payment Methods & PayHere Gateway */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">06.</span> Payment Terms & Options
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                Customers may complete purchases through the following verified payment options:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong>PayHere Gateway:</strong> Visa, MasterCard, American Express, LankaQR, and supported digital wallets. Regulated by the Central Bank of Sri Lanka with PCI-DSS Level 1 compliance.</li>
                <li><strong>Cash on Delivery (COD):</strong> Payable in cash upon delivery to the authorized courier agent before parcel handover. Repeated refusal of legitimate COD orders may result in suspension of COD privileges.</li>
                <li><strong>Direct Bank Deposit:</strong> Requires remittance to our designated corporate bank account with deposit receipt proof sent within 24 hours.</li>
              </ul>
            </div>
          </section>

          {/* Section 7: Shipping & Risk of Loss */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">07.</span> Shipping, Islandwide Delivery & Transit Risk
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                We deliver islandwide across Sri Lanka. Typical transit times:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong>Western Province (Colombo & Gampaha):</strong> 2 to 4 working days.</li>
                <li><strong>Outstation Districts:</strong> 3 to 7 working days.</li>
              </ul>
              <p>
                Title and risk of loss pass to the customer once the courier delivers the package to the physical shipping address provided at checkout.
              </p>
            </div>
          </section>

          {/* Section 8: Returns & Refunds Reference */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">08.</span> Returns & Refunds Policy
            </h2>
            <p className={`text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              All exchanges and returns are strictly governed by our <Link href="/refund-policy" className="text-cyan-400 underline font-semibold">Refund Policy</Link>, which provides a 14-day window for eligible unused items and details non-returnable categories (such as cut fabrics and intimates).
            </p>
          </section>

          {/* Section 9: Intellectual Property */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">09.</span> Intellectual Property Rights
            </h2>
            <p className={`text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              All materials on this site—including the brand name Avrora Dazzle, typography, editorial images, textile designs, product descriptions, UI elements, and code—are protected under the <strong>Intellectual Property Act No. 36 of 2003 of Sri Lanka</strong>. Unauthorized copying, scraping, or commercial republishing is prohibited.
            </p>
          </section>

          {/* Section 10: Limitation of Liability */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">10.</span> Limitation of Liability
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                To the fullest extent permitted under Sri Lankan law, Avrora Dazzle shall not be liable for any indirect, incidental, or consequential damages resulting from website downtime, minor delivery delays by third-party couriers, or computer viruses.
              </p>
              <p>
                Our aggregate legal liability for any valid claim shall in no event exceed the purchase price paid for the specific product giving rise to the claim.
              </p>
            </div>
          </section>

          {/* Section 11: Governing Law & Courts */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">11.</span> Governing Law & Judicial Jurisdiction
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                These Terms and Conditions and any transaction executed through this website shall be governed by and construed in accordance with the <strong>laws of the Democratic Socialist Republic of Sri Lanka</strong>.
              </p>
              <p>
                Any legal action or dispute arising from these terms shall be subject to the exclusive jurisdiction of the competent courts of Sri Lanka (specifically within the Colombo or Gampaha judicial districts).
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
            Questions Regarding Our Commercial Terms?
          </h3>
          <p className={`text-xs max-w-xl mx-auto mb-6 ${isAvroraTheme ? 'text-slate-400' : 'text-slate-600'}`}>
            For inquiries or legal notices, our corporate management desk in Kadawatha is pleased to assist you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a 
              href="mailto:support@avroradazzle.com" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-md"
            >
              <Mail size={14} />
              <span>support@avroradazzle.com</span>
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

export default TermsAndConditionsPage;
