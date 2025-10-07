import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import PyodidePlayground from "@/components/playground/PyodidePlayground";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-6">
        <div className="w-full md:max-w-[85%] mx-auto">
          <PyodidePlayground />
        </div>
      </main>
      <Footer />
    </div>
  );
}
