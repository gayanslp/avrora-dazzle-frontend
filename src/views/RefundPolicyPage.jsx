'use client';

import React from 'react';
import Link from 'next/link';
import { 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  CreditCard,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const RefundPolicyPage = () => {
  const { isAvroraTheme } = useTheme();

  const keyHighlights = [
    {
      icon: Clock,
      title: '14-Day Return Window',
      desc: 'Request returns or exchanges within 14 calendar days from delivery.'
    },
    {
      icon: Package,
      title: 'Original Condition',
      desc: 'Unworn, unwashed, unaltered with all brand tags and packaging intact.'
    },
    {
      icon: CreditCard,
      title: 'PayHere & Bank Reversal',
      desc: 'Direct reversals to original payment cards or verified bank transfers.'
    },
    {
      icon: Building2,
      title: 'Showroom or Courier',
      desc: 'Return via islandwide courier pickup or in person at Kadawatha.'
    }
  ];

  const nonReturnableItems = [
    { title: 'Innerwear & Intimates', desc: 'Undergarments, lingerie, shapewear, and swimwear due to strict health and hygiene standards.' },
    { title: 'Pierced Jewelry', desc: 'Earrings, nose studs, and body jewelry once unsealed from their protective packaging.' },
    { title: 'Custom-Cut Fabrics', desc: 'Fabrics, unstitched suitings, silks, or laces cut from bolts to individual custom meterage.' },
    { title: 'Customized & Tailored Wear', desc: 'Garments hemmed, altered, or tailor-made to specific customer measurements.' },
    { title: 'Unsealed Fancy Novelties', desc: 'Opened hair extensions, cosmetic fancy novelties, and delicate decorative accessories.' },
    { title: 'Clearance & Flash Sale Items', desc: 'Merchandise explicitly sold under "Final Sale" or clearance promotional campaigns.' }
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
            Refund & Returns Policy
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
              <RotateCcw size={14} />
              <span>Customer Satisfaction & Assurance</span>
            </div>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-cinzel mb-4 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              Refund & Returns Policy
            </h1>
            <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
              isAvroraTheme ? 'text-slate-300' : 'text-slate-600'
            }`}>
              At <strong>Avrora Dazzle Textiles and Fancy Items</strong>, we pride ourselves on exceptional craftsmanship, premium textiles, and verified customer trust. If you need to make an exchange or return, our policy guarantees transparency, convenience, and prompt resolution.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-cyan-400" />
                Valid for all islandwide purchases
              </span>
              <span>•</span>
              <span>Last updated: October 2026</span>
              <span>•</span>
              <span>Kadawatha Showroom & Online Store</span>
            </div>
          </div>
        </div>

        {/* Key Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {keyHighlights.map((item, index) => {
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

        {/* Policy Content Sections */}
        <div className="space-y-8">
          
          {/* Section 1 */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">01.</span> The 14-Day Return Window
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                You may request an exchange or return within <strong>fourteen (14) calendar days</strong> from the date your order was delivered by our domestic courier partner.
              </p>
              <p>
                Returns initiated after the 14-day window cannot be accommodated under our standard policy. We kindly request that you inspect your fabrics, garments, or accessories immediately upon arrival.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">02.</span> Return Eligibility Conditions
            </h2>
            <p className={`text-sm mb-4 leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              To qualify for an exchange or refund, returned merchandise must satisfy all of the following requirements:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Unworn, unwashed, unaltered, and without fragrance or makeup marks.',
                'All original designer tags, seals, and barcodes attached in original form.',
                'Complete original protective packaging (boxes, dust covers, pouches).',
                'Accompanied by original purchase invoice or valid digital Order ID.'
              ].map((text, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                  isAvroraTheme ? 'bg-[#0c0428]/50 border-cyan-500/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Non-Returnable Items */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">03.</span> Non-Returnable & Final Sale Items
            </h2>
            <p className={`text-sm mb-4 leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              Due to hygiene standards, custom cutting, and individual fabrication, the following products are strictly non-returnable unless a verified manufacturing defect is confirmed:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nonReturnableItems.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  isAvroraTheme ? 'bg-[#0d042a]/60 border-rose-500/20' : 'bg-rose-50/50 border-rose-100'
                }`}>
                  <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className={`text-xs font-bold ${isAvroraTheme ? 'text-rose-200' : 'text-rose-900'}`}>
                      {item.title}
                    </h4>
                    <p className={`text-xs mt-1 ${isAvroraTheme ? 'text-slate-400' : 'text-rose-700'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Damaged or Defective Items */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">04.</span> Damaged, Defective, or Incorrect Deliveries
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                Every parcel dispatched from our Kadawatha center undergoes strict multi-stage quality checks. However, if your order is damaged in courier transit or an incorrect size/model is received:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Notify our team within <strong>48 hours</strong> of delivery with clear unboxing photos/video.</li>
                <li>Avrora Dazzle will arrange an immediate replacement or full refund without charging you any return courier fees.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Step-by-Step Return Process */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-6 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">05.</span> How to Initiate a Return
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className={`p-5 rounded-2xl border ${
                isAvroraTheme ? 'bg-[#0c0429]/70 border-cyan-500/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-2xl font-black text-cyan-400 mb-2">Step 1</div>
                <h4 className={`text-sm font-bold mb-2 ${isAvroraTheme ? 'text-white' : 'text-slate-900'}`}>Contact Support</h4>
                <p className={`text-xs leading-relaxed ${isAvroraTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  Email <span className="font-semibold text-cyan-400">support@avroradazzle.com</span> with your Order ID, reason, and photo evidence to obtain a Return Authorization.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${
                isAvroraTheme ? 'bg-[#0c0429]/70 border-cyan-500/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-2xl font-black text-cyan-400 mb-2">Step 2</div>
                <h4 className={`text-sm font-bold mb-2 ${isAvroraTheme ? 'text-white' : 'text-slate-900'}`}>Pack Securely</h4>
                <p className={`text-xs leading-relaxed ${isAvroraTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  Place the merchandise inside its original packaging with all tags attached and your Order ID clearly written on the outer parcel.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${
                isAvroraTheme ? 'bg-[#0c0429]/70 border-cyan-500/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-2xl font-black text-cyan-400 mb-2">Step 3</div>
                <h4 className={`text-sm font-bold mb-2 ${isAvroraTheme ? 'text-white' : 'text-slate-900'}`}>Courier or Showroom</h4>
                <p className={`text-xs leading-relaxed ${isAvroraTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  Hand over to our assigned courier or drop off the parcel directly at our Kadawatha retail showroom (No.62/7, Kandy Road, Kadawatha).
                </p>
              </div>
            </div>

            <div className={`mt-5 p-4 rounded-xl border flex items-center gap-3 text-xs ${
              isAvroraTheme ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-200' : 'bg-cyan-50 border-cyan-200 text-cyan-900'
            }`}>
              <AlertCircle size={16} className="shrink-0 text-cyan-400" />
              <span>For change-of-mind exchanges, standard domestic courier return fees (typically Rs 350 - 500) apply.</span>
            </div>
          </section>

          {/* Section 6: Refund Processing Details */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">06.</span> Refund Timelines & Payment Methods
            </h2>
            <p className={`text-sm mb-4 leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              Following quality inspection at our Kadawatha facility (typically 2-3 business days), approved refunds are disbursed through your original payment method:
            </p>

            <div className="overflow-x-auto">
              <table className={`w-full text-left text-xs border-collapse rounded-xl overflow-hidden ${
                isAvroraTheme ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <thead>
                  <tr className={isAvroraTheme ? 'bg-cyan-500/15 text-cyan-300 border-b border-cyan-500/20' : 'bg-slate-100 text-slate-900 border-b border-slate-200'}>
                    <th className="p-3.5 font-bold uppercase tracking-wider">Payment Method</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">Refund Channel</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">Processing Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/10">
                  <tr className={isAvroraTheme ? 'hover:bg-cyan-500/5' : 'hover:bg-slate-50'}>
                    <td className="p-3.5 font-semibold">PayHere (Online Cards / Wallets)</td>
                    <td className="p-3.5">Reversal to original Visa / MasterCard / Account</td>
                    <td className="p-3.5 font-bold text-cyan-400">5 – 10 Business Days</td>
                  </tr>
                  <tr className={isAvroraTheme ? 'hover:bg-cyan-500/5' : 'hover:bg-slate-50'}>
                    <td className="p-3.5 font-semibold">Cash on Delivery / Direct Bank</td>
                    <td className="p-3.5">Electronic Bank Transfer (CEFT / SLIPS)</td>
                    <td className="p-3.5 font-bold text-cyan-400">3 – 5 Business Days</td>
                  </tr>
                  <tr className={isAvroraTheme ? 'hover:bg-cyan-500/5' : 'hover:bg-slate-50'}>
                    <td className="p-3.5 font-semibold">Store Credit / Gift Voucher</td>
                    <td className="p-3.5">Digital Gift Code for Online Catalog</td>
                    <td className="p-3.5 font-bold text-emerald-400">Instant (Within 24 Hours)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: Order Cancellations */}
          <section className={`p-6 sm:p-8 rounded-3xl border ${
            isAvroraTheme ? 'bg-[#060217]/60 border-cyan-500/15' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold font-cinzel mb-4 flex items-center gap-3 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              <span className="text-cyan-400">07.</span> Order Cancellations
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isAvroraTheme ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                <strong>Before Dispatch:</strong> You may cancel an order free of charge by contacting support within 2 hours of placement, or prior to parcel handover to our courier.
              </p>
              <p>
                <strong>After Courier Handover:</strong> Dispatched orders cannot be cancelled mid-transit. The package must be accepted upon delivery and then returned in accordance with our return guidelines.
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
            Need Assistance with an Order or Return?
          </h3>
          <p className={`text-xs max-w-xl mx-auto mb-6 ${isAvroraTheme ? 'text-slate-400' : 'text-slate-600'}`}>
            Our Customer Concierge team at Kadawatha is ready to assist you Monday through Saturday, 9:30 AM to 7:30 PM.
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

export default RefundPolicyPage;
