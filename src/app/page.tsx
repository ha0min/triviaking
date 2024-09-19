import { InterviewPracticeComponent } from "@/components/interview-practice";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Interview Practice</h1>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        <InterviewPracticeComponent />
    </main>
      
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Interview Practice App. All rights reserved.</p>
      </footer>
    </div>
  );
}
