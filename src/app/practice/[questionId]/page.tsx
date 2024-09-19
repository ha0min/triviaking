import InterviewQuestionCard from "@/components/interview-question-card";
import Link from 'next/link';

export default function PracticePage({
  params,
}: {
  params: { questionId: string };
}) {
  const mockData = {
    ch_question: "HTTP1.0和HTTP1.1的区别",
    question: "Differences between HTTP1.0 and HTTP1.1",
    tag: "Computer Networks",
    frequency: "High",
    finished: false,
    marked: false,
    id: 8,
  };
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/practice" className="text-blue-500 hover:text-blue-700">
            ← Go Back
          </Link>
          <h1 className="text-2xl font-bold">Practice Question</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl px-4 flex justify-center">
          <InterviewQuestionCard data={mockData} />
        </div>
      </main>
    </div>
  );
}
