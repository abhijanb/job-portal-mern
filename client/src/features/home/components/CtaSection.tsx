import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="bg-surface-container-high py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-primary rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to hire world-class talent?</h2>
            <p className="text-base text-primary-fixed max-w-lg">
              Join companies hiring on Hire. Post your first job today and reach millions of professionals.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10 shrink-0">
<Link to="/register" className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-bold text-sm hover:brightness-110 transition-all inline-block">
  Start Hiring Now
</Link>
<Link to="/jobs" className="border border-white/20 text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-white/10 transition-all inline-block">
  Learn More
</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
