import { ScamPreset } from '../types';

export const CONSUMER_SCAM_PRESETS: ScamPreset[] = [
  {
    id: 'bank-kyc-scam',
    title: 'Urgent Bank Account Suspension SMS',
    category: 'Banking Scam',
    sender: '+91 98765 43210 (SMS)',
    riskScore: 95,
    verdict: 'Critical Scam',
    message: 'Dear Customer, your HDFC Account will be blocked today due to pending KYC update. Click link immediately to verify PAN card details: http://hdfc-kyc-update-login.net/verify',
  },
  {
    id: 'fedex-customs-fraud',
    title: 'Customs Duty Parcel Scam',
    category: 'Package Delivery',
    sender: 'delivery-alert@fedex-tracking-portal.com',
    riskScore: 88,
    verdict: 'High Risk',
    message: 'Your international parcel #FX-99214 is held at Mumbai Customs due to unpaid duty of ₹1,450. Pay within 2 hours via UPI to avoid parcel destruction.',
  },
  {
    id: 'part-time-job-fraud',
    title: 'WhatsApp YouTube Like Job Offer',
    category: 'WhatsApp Fraud',
    sender: 'WhatsApp (+62 812 3456 7890)',
    riskScore: 92,
    verdict: 'Critical Scam',
    message: 'Earn ₹5,000 daily from home! Just like YouTube videos & subscribe. No experience required. Daily payout via UPI. Contact HR Manager on Telegram: @WorkFromHomeDaily',
  },
  {
    id: 'crypto-phishing',
    title: 'Fake Crypto Airdrop Email',
    category: 'Crypto Phishing',
    sender: 'claim@binance-airdrop-bonus2026.org',
    riskScore: 90,
    verdict: 'Critical Scam',
    message: 'Congratulations! You have received 0.55 BTC ($35,000 USD) in your Binance Airdrop allocation. Connect your MetaMask wallet immediately to claim your funds.',
  },
];
