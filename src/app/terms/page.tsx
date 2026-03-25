import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FileText size={40} className="text-primary mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">Terms of Service</h1>
          <p className="text-text-muted">Last updated: March 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          {[
            {
              title: "1. About One Touch Beauty",
              content: "One Touch Beauty is a beauty directory and booking platform operated in the United Kingdom. By using our website and services, you agree to these terms. If you do not agree, please do not use our platform.",
            },
            {
              title: "2. Account Registration",
              content: "To use certain features, you must create an account with accurate and complete information. You are responsible for maintaining the security of your account and password. Business accounts require identity verification. You must be at least 18 years old to create an account.",
            },
            {
              title: "3. Customer Accounts",
              content: "Customer accounts are free and provide access to search, book appointments, save favourites, and leave reviews. You agree to use the platform responsibly, provide honest reviews, and not misuse any features or content.",
            },
            {
              title: "4. Business Accounts",
              content: "Business accounts require a monthly subscription. You agree to provide accurate business information, maintain up-to-date availability, respond to bookings in a timely manner, and comply with all relevant laws and regulations for your trade.",
            },
            {
              title: "5. Bookings & Payments",
              content: "Bookings made through our platform are agreements between the customer and the business. One Touch Beauty facilitates the booking but is not a party to the service agreement. Cancellation policies are set by individual businesses.",
            },
            {
              title: "6. Reviews & Content",
              content: "Users may submit reviews, ratings, and other content. You grant us a licence to display this content on our platform. Reviews must be honest, relevant, and not contain offensive, defamatory, or misleading content. We reserve the right to remove content that violates these guidelines.",
            },
            {
              title: "7. Intellectual Property",
              content: "All content on One Touch Beauty, including the website design, logos, text, and graphics, is owned by or licensed to us. You may not copy, reproduce, or redistribute any content without our written permission.",
            },
            {
              title: "8. Limitation of Liability",
              content: "One Touch Beauty acts as a directory and booking platform. We are not responsible for the quality of services provided by businesses listed on our platform. We do not guarantee the availability, accuracy, or reliability of any business listing.",
            },
            {
              title: "9. Termination",
              content: "We may suspend or terminate your account if you breach these terms. You may close your account at any time by contacting us. Upon termination, your right to use the platform ceases immediately.",
            },
            {
              title: "10. Contact",
              content: "For questions about these Terms of Service, contact us at support@onetouchbeauty.co.uk.",
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
