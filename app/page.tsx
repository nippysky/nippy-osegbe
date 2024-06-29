import Approach from "@/components/shared/Approach";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import Hero from "@/components/shared/Hero";
import RecentProjects from "@/components/shared/RecentProjects";
import Testimonials from "@/components/shared/Testimonials";

export default function Home() {
  return (
    <main className="w-full py-5 lg:px-32 px-5">
      <Header />
      <Hero />
      <Approach />
      <RecentProjects />
      <Testimonials />
      <Footer />
    </main>
  );
}
