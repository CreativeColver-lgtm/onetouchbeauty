import { Cookie } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-text-muted">Last updated: March 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          {[
            {
              title: "What Are Cookies?",
              content: "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and understand how you use it. Cookies are widely used to make websites work more efficiently and provide a better user experience.",
            },
            {
              title: "Strictly Necessary Cookies",
              content: "These cookies are essential for the website to function properly. They enable core features like page navigation, account login, and secure areas of the site. The website cannot function without these cookies, and they cannot be disabled.",
            },
            {
              title: "Analytical Cookies",
              content: "We use analytical cookies to understand how visitors interact with our website. These cookies help us track which pages are most popular, how visitors move around the site, and if they encounter any errors. This data helps us improve the website experience.",
            },
            {
              title: "Functionality Cookies",
              content: "These cookies allow the website to remember choices you make, such as your dark mode preference, location, and language. They provide enhanced, personalised features and help us tailor the site to your needs.",
            },
            {
              title: "Targeting Cookies",
              content: "Targeting cookies may be set through our site by advertising partners. They are used to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information but uniquely identify your browser and device.",
            },
            {
              title: "Managing Cookies",
              content: "You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies. However, if you block all cookies, some features of our website may not function properly. You can also use the cookie settings on our website to manage your preferences.",
            },
            {
              title: "Contact Us",
              content: "If you have any questions about our use of cookies, please contact us at support@onetouchbeauty.co.uk.",
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
