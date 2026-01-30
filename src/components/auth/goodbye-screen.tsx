"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Heart } from "lucide-react";

interface GoodbyeScreenProps {
  userName?: string | null;
  onComplete: () => void;
}

export function GoodbyeScreen({ userName, onComplete }: GoodbyeScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-muted/20 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex flex-col items-center gap-6 p-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -10, 10, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-muted/30 blur-2xl rounded-full" />
          <LogOut className="w-20 h-20 text-muted-foreground relative z-10" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold flex items-center gap-2 justify-center">
            Tạm biệt{userName ? `, ${userName}` : ""}!
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </h1>
          <p className="text-muted-foreground text-lg">
            Hẹn gặp lại bạn sớm nhé 👋
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
