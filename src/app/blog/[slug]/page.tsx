import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ArrowLeft, Share2, ExternalLink, ChevronRight } from "lucide-react";

const articleData: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorBio: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
  toc: string[];
}> = {
  "top-10-hair-trends-2026": {
    title: "Top 10 Hair Trends for 2026",
    excerpt: "From copper tones to micro-bobs, discover the hottest hair trends dominating salons this year.",
    category: "Hair",
    author: "Sophie Laurent",
    authorBio: "Award-winning hair stylist with 15 years of experience. Sophie runs Glow Studio in Shoreditch, London and is passionate about colour innovation.",
    date: "20 March 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=600&fit=crop",
    toc: [
      "1. Copper Renaissance",
      "2. The Micro-Bob",
      "3. Lived-In Balayage",
      "4. Platinum Pixie",
      "5. 90s Curtain Bangs Revival",
      "6. Cherry Cola Red",
      "7. Soft Shag Layers",
      "8. Money Pieces",
      "9. Blunt One-Length",
      "10. Natural Texture Movement",
    ],
    content: [
      "The beauty industry never stands still, and 2026 is proving to be one of the most exciting years for hair trends in recent memory. Whether you're a salon professional looking to stay ahead of the curve or a client seeking your next look, these ten trends are defining the year.",
      "## 1. Copper Renaissance",
      "Copper is having its biggest moment yet. From soft penny tones to rich burnished copper, this warm shade flatters a wide range of skin tones and adds instant warmth. The key difference in 2026? It's all about dimension — colourists are layering multiple copper shades for a lived-in, multi-tonal effect.",
      "**Pro tip:** Pair copper with a gloss treatment every 4-6 weeks to maintain vibrancy without full colour appointments.",
      "## 2. The Micro-Bob",
      "The bob is back, but shorter than ever. Sitting just below the ear, the micro-bob is clean, architectural, and incredibly chic. It works beautifully on straight and wavy textures alike, and it's become the go-to for clients wanting a dramatic change.",
      "## 3. Lived-In Balayage",
      "Balayage isn't going anywhere, but the technique has evolved. In 2026, it's all about a softer, more natural approach — think grown-out roots that look intentional, with subtle face-framing brightness. The goal is hair that looks effortlessly sun-kissed, never freshly done.",
      "## 4. Platinum Pixie",
      "Bold, brave, and brilliant. The platinum pixie combines two statement choices into one head-turning look. Ideal for clients with strong features who want to make an impact. Maintenance is key — expect salon visits every 3-4 weeks.",
      "## 5. 90s Curtain Bangs Revival",
      "Everything 90s continues to resonate, and curtain bangs remain the most requested fringe style. They're versatile, grow out gracefully, and frame the face beautifully. In 2026, we're seeing them paired with longer, layered styles for a relaxed bohemian feel.",
      "## 6. Cherry Cola Red",
      "A deeper, richer alternative to copper, cherry cola red is the shade for clients who want drama without going full scarlet. This dark red-brown hybrid looks stunning under salon lighting and catches the light in the most beautiful way.",
      "## 7. Soft Shag Layers",
      "The shag cut has been reimagined for 2026 with softer, more blended layers. Gone are the choppy, disconnected layers of previous years — this version is refined, textured, and incredibly wearable for everyday styling.",
      "## 8. Money Pieces",
      "Face-framing highlights, known as 'money pieces', continue to dominate. They're the perfect low-commitment colour option — brightening the face without a full head of foils. They work with every base colour and can be customised to suit any skin tone.",
      "## 9. Blunt One-Length",
      "Clean, sharp, and powerful. The blunt one-length cut — whether at the shoulder or mid-back — is a statement of sleek minimalism. It looks exceptional on straight hair and can be elevated with a glossy finish treatment.",
      "## 10. Natural Texture Movement",
      "Perhaps the most important trend of 2026 isn't a specific style — it's the continued celebration of natural texture. More clients than ever are embracing their curls, coils, and waves, and salons are investing in training and products that nurture and enhance natural hair.",
      "## The Bottom Line",
      "2026 is all about personal expression. Whether you're drawn to bold colour changes or subtle refinements, the best trend is the one that makes you feel confident. Book a consultation with your stylist to discuss which of these looks would work best for your hair type, lifestyle, and personal style.",
    ],
  },
};

const relatedArticles = [
  { slug: "balayage-vs-highlights", title: "Balayage vs Highlights: Which One Is Right for You?", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=260&fit=crop", readTime: "5 min" },
  { slug: "bridal-makeup-guide", title: "Bridal Makeup: Planning Your Perfect Wedding Day Look", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=260&fit=crop", readTime: "8 min" },
  { slug: "gen-z-beauty-trends", title: "Gen Z Beauty: The Trends Shaping the Industry", image: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400&h=260&fit=crop", readTime: "6 min" },
];

function renderContent(blocks: string[]) {
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return <h2 key={i} id={block.replace("## ", "").toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="text-xl font-extrabold text-foreground mt-8 mb-3">{block.replace("## ", "")}</h2>;
    }
    if (block.startsWith("**") && block.endsWith("**")) {
      return <p key={i} className="text-foreground font-semibold my-3">{block.replace(/\*\*/g, "")}</p>;
    }
    if (block.startsWith("**")) {
      const parts = block.split("**");
      return (
        <p key={i} className="text-text-muted leading-relaxed mb-4">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part)}
        </p>
      );
    }
    return <p key={i} className="text-text-muted leading-relaxed mb-4">{block}</p>;
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleData[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Article not found</h1>
          <p className="text-text-muted mb-4">This blog post doesn&apos;t exist yet.</p>
          <Link href="/blog" className="text-primary font-semibold hover:underline flex items-center gap-1 justify-center">
            <ArrowLeft size={14} /> Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 lg:h-[28rem]">
        <Image src={article.image} alt={article.title} fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-white mb-3 inline-block">{article.category}</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1"><User size={13} /> {article.author}</span>
            <span className="flex items-center gap-1"><Calendar size={13} /> {article.date}</span>
            <span className="flex items-center gap-1"><Clock size={13} /> {article.readTime}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex gap-10">
          {/* TOC Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Table of Contents</h4>
              <nav className="space-y-2 border-l-2 border-border pl-4">
                {article.toc.map((item, i) => (
                  <a key={i} href={`#${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="block text-sm text-text-muted hover:text-primary transition leading-snug">
                    {item}
                  </a>
                ))}
              </nav>

              {/* Share */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Share</h4>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center hover:border-primary/30 transition">
                    <ExternalLink size={16} className="text-text-muted" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center hover:border-primary/30 transition">
                    <ExternalLink size={16} className="text-text-muted" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center hover:border-primary/30 transition">
                    <Share2 size={16} className="text-text-muted" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Article Content */}
          <article className="flex-1 max-w-3xl">
            <div className="prose-custom">
              {renderContent(article.content)}
            </div>

            {/* Mobile Share */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border lg:hidden">
              <span className="text-sm font-semibold text-foreground">Share:</span>
              <button className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <ExternalLink size={16} className="text-text-muted" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <ExternalLink size={16} className="text-text-muted" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <Share2 size={16} className="text-text-muted" />
              </button>
            </div>

            {/* Author Bio */}
            <div className="mt-10 bg-surface-elevated border border-border rounded-2xl p-6 flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg shrink-0">
                {article.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-bold text-foreground">{article.author}</p>
                <p className="text-sm text-text-muted mt-1 leading-relaxed">{article.authorBio}</p>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-12">
              <h3 className="text-lg font-bold text-foreground mb-5">Related Articles</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedArticles.map((a) => (
                  <Link key={a.slug} href={`/blog/${a.slug}`}
                    className="bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                    <div className="h-32 relative">
                      <Image src={a.image} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition line-clamp-2">{a.title}</h4>
                      <p className="text-xs text-text-muted mt-2 flex items-center gap-1"><Clock size={10} /> {a.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Back to Blog */}
            <div className="mt-10 pt-6 border-t border-border">
              <Link href="/blog" className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                <ArrowLeft size={14} /> Back to all articles
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
