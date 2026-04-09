import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const MILESTONES = [10, 20, 30, 33];

export default function ProgressBar({ visited, total, darkMode }) {
  const prevCountRef = useRef(visited);

  useEffect(() => {
    const prev = prevCountRef.current;
    const curr = visited;
    prevCountRef.current = curr;

    // Fire confetti when hitting milestones
    const hitMilestone = MILESTONES.find(m => prev < m && curr >= m);
    if (hitMilestone) {
      const isFinal = hitMilestone === 33;
      confetti({
        particleCount: isFinal ? 200 : 100,
        spread: isFinal ? 120 : 80,
        origin: { y: 0.4 },
        colors: ['#2D5016', '#8B2035', '#FDF8F0', '#FFD700', '#3D6B1F'],
        gravity: isFinal ? 0.8 : 1,
        scalar: isFinal ? 1.4 : 1,
      });
      if (isFinal) {
        setTimeout(() => {
          confetti({
            particleCount: 150,
            angle: 60,
            spread: 80,
            origin: { x: 0, y: 0.5 },
            colors: ['#2D5016', '#8B2035', '#FFD700'],
          });
          confetti({
            particleCount: 150,
            angle: 120,
            spread: 80,
            origin: { x: 1, y: 0.5 },
            colors: ['#2D5016', '#8B2035', '#FFD700'],
          });
        }, 400);
      }
    }
  }, [visited]);

  const pct = Math.round((visited / total) * 100);

  const getMessage = () => {
    if (visited === 0) return "Ready to start your bookstore adventure!";
    if (visited === total) return "YOU DID IT! All 33 bookstores visited! Amazing!";
    if (visited >= 30) return "Almost there! Just a few more to go!";
    if (visited >= 20) return "Great progress — over halfway done!";
    if (visited >= 10) return "Double digits! You're on a roll!";
    return `${visited} down, ${total - visited} to go!`;
  };

  return (
    <div className={`rounded-xl p-4 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-forest'}`}>
          Progress: {visited}/{total} stores
        </span>
        <span className={`text-lg font-bold ${visited === total ? 'text-yellow-500' : darkMode ? 'text-green-400' : 'text-forest'}`}>
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className={`w-full h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-cream-200'}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${visited === total ? 'bg-yellow-500' : 'bg-gradient-to-r from-forest to-forest-light'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Milestone markers */}
      <div className="relative mt-1">
        <div className="flex justify-between">
          {MILESTONES.map(m => {
            const milePct = (m / total) * 100;
            const hit = visited >= m;
            return (
              <div
                key={m}
                className="flex flex-col items-center"
                style={{ position: 'absolute', left: `${milePct}%`, transform: 'translateX(-50%)' }}
              >
                <div className={`w-2 h-2 rounded-full mt-0.5 ${hit ? 'bg-yellow-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                <span className={`text-xs mt-0.5 ${hit ? (darkMode ? 'text-yellow-400' : 'text-yellow-600') : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {m}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-6" /> {/* spacer for absolute markers */}
      </div>

      <p className={`text-xs mt-1 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
        {getMessage()}
      </p>
    </div>
  );
}
