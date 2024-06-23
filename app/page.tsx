import Approach from "@/components/shared/Approach";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import Testimonials from "@/components/shared/Testimonials";

export default function Home() {
  return (
    <main className="w-full py-5 lg:px-24 px-5">
      <Hero />
      <Testimonials />
      <Approach />
      <Footer />
    </main>
  );
}
