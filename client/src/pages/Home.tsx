import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DrawingCanvas from "@/components/DrawingCanvas";
import ResultsPanel from "@/components/ResultsPanel";

export default function Home() {
  // Set document title
  useEffect(() => {
    document.title = "SketchMix - Drawing to Media Generator";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="text-center mb-6">
          <h2 className="text-xl text-gray-600 italic">Where imagination becomes art & music</h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2 flex flex-col">
            <DrawingCanvas />
          </div>
          
          <div className="lg:w-1/2 flex flex-col">
            <ResultsPanel />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
