// "use client";

// import { motion } from "framer-motion";
// import { Focus } from "lucide-react";

// interface FocusModeProps {
//   isActive: boolean;
//   onToggle: (active: boolean) => void;
// }

// export default function FocusMode({ isActive, onToggle }: FocusModeProps) {
//   return (
//     <motion.button
//       whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)" }}
//       whileTap={{ scale: 0.95 }}
//       onClick={() => onToggle(!isActive)}
//       className={`p-3 rounded-xl border transition-all duration-300 ${
//         isActive
//           ? "bg-red-500/20 border-red-500/50 text-red-400"
//           : "bg-white/10 border-white/20 text-white hover:bg-white/20"
//       } backdrop-blur-sm`}
//     >
//       <Focus size={20} />
//     </motion.button>
//   );
// }
