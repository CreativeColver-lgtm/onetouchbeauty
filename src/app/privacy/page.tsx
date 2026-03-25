import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield size={40} className="text-primary mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-text-muted">Last updated: March 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 prose-custom">
          {[
            {
              title: "1. Information We Collect",
              content: "We collect personal information including your name, email address, phone number, and location when you create an account. For business accounts, we also collect business details and identity verification documents. We automatically collect technical data such as your IP address, browser type, and how you use our platform.",
            },
            {
              title: "2. How We Use Your Information",
              content: "We use your information to provide and improve our services, process bookings, send appointment reminders and notifications, communicate with you about your account, and for internal record-keeping. We may also use your information for marketing communications, which you can opt out of at any time.",
            },
            {
              title: "3. Cookies",
              content: "We use four types of cookies: strictly necessary cookies (for the site to function), analytical cookies (to track visitor behaviour), functionality cookies (for personalisation), and targeting cookies (for relevant advertising). You can manage your cookie preferences through your browser settings.",
            },
            {
              title: "4. Data Sharing",
              content: "We may share your data with our group companies, employees, professional advisors, payment processors, and relevant authorities when required by law. We do not sell your personal information to third parties. When you book with a business, we share the necessary booking details with that business.",
            },
            {
              title: "5. Your Rights",
              content: "You have the right to request access to your personal data, correct any inaccuracies, request deletion of your data, restrict processing, obtain a portable copy of your data, or object to certain uses. To exercise any of these rights, contact us at support@onetouchbeauty.co.uk.",
            },
            {
              title: "6. Data Security",
              content: "We take data security seriously. We use password protection, encrypted servers, and SSL technology for all data transfers. We maintain high security standards to protect your personal information from unauthorised access, disclosure, or loss.",
            },
            {
              title: "7. Data Retention",
              content: "We keep your personal data for as long as your account is active or as needed to provide services. If you close your account, we will delete or anonymise your data within a reasonable timeframe, unless we need to retain it for legal purposes.",
            },
            {
              title: "8. Contact Us",
              content: "If you have any questions about this Privacy Policy or how we handle your data, please contact us at support@onetouchbeauty.co.uk.",
            },
          ].map((section) => (
            <div key={section.title} className="mb-8">
              <h2 className="text-lg font-bold text-foreground mb-3">{section.title}</h2>
              <p className="text-text-muted text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
