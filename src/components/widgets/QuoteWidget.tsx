// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { RefreshCw, Quote } from "lucide-react";
// import GlassPanel from "@/components/ui/GlassPanel";

// interface QuoteData {
//   text: string;
//   author: string;
// }

// export default function QuoteWidget() {
//   const [quote, setQuote] = useState<QuoteData>({
//     text: "The way to get started is to quit talking and begin doing.",
//     author: "Walt Disney",
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const quotes = [
//     {
//       text: "The way to get started is to quit talking and begin doing.",
//       author: "Walt Disney",
//     },
//     {
//       text: "Innovation distinguishes between a leader and a follower.",
//       author: "Steve Jobs",
//     },
//     {
//       text: "Life is what happens to you while you're busy making other plans.",
//       author: "John Lennon",
//     },
//     {
//       text: "The future belongs to those who believe in the beauty of their dreams.",
//       author: "Eleanor Roosevelt",
//     },
//     {
//       text: "It is during our darkest moments that we must focus to see the light.",
//       author: "Aristotle",
//     },
//   ];

//   const getNewQuote = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
//       setQuote(randomQuote);
//       setIsLoading(false);
//     }, 500);
//   };

//   return (
//     <GlassPanel className="p-6" glow>
//       <div className="flex items-start justify-between mb-4">
//         <Quote className="w-6 h-6 text-purple-400 flex-shrink-0" />
//         <motion.button
//           whileHover={{ scale: 1.1, rotate: 180 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={getNewQuote}
//           disabled={isLoading}
//           className="text-white/70 hover:text-white transition-colors"
//         >
//           <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
//         </motion.button>
//       </div>

//       <motion.div
//         key={quote.text}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <p className="text-white/90 text-sm leading-relaxed mb-3">
//           "{quote.text}"
//         </p>
//         <p className="text-white/60 text-xs text-right">— {quote.author}</p>
//       </motion.div>
//     </GlassPanel>
//   );
// }
