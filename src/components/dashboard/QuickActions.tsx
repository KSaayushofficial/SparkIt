// "use client";

// import { motion } from "framer-motion";
// import { Plus, Zap, Target, Clock } from "lucide-react";

// interface QuickActionsProps {
//   onNotification: (notification: any) => void;
// }

// export default function QuickActions({ onNotification }: QuickActionsProps) {
//   const actions = [
//     { icon: Plus, label: "Quick Add", color: "from-green-500 to-emerald-500" },
//     { icon: Zap, label: "Focus Mode", color: "from-yellow-500 to-orange-500" },
//     { icon: Target, label: "New Goal", color: "from-blue-500 to-purple-500" },
//     { icon: Clock, label: "Time Block", color: "from-red-500 to-pink-500" },
//   ];

//   return (
//     <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
//       <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-2">
//         {actions.map((action, index) => (
//           <motion.button
//             key={action.label}
//             whileHover={{ scale: 1.1, y: -5 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() =>
//               onNotification({
//                 title: "Quick Action",
//                 message: `${action.label} activated!`,
//                 type: "info",
//               })
//             }
//             className={`p-3 rounded-full bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
//           >
//             <action.icon size={18} />
//           </motion.button>
//         ))}
//       </div>
//     </div>
//   );
// }
