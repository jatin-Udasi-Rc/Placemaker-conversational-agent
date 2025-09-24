import Navbar from './components/Navbar';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <ChatInterface />
      </main>
    </div>
  );
}
