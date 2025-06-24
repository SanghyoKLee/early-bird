"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

function pad(num: number) {
  return num.toString().padStart(2, "0");
}

type TimePickerProps = {
  value: string; // "HH:mm"
  onChange: (val: string) => void;
  onSave?: (val: string) => void;
};

export function TimePicker({ value, onChange, onSave }: TimePickerProps) {
  const [h, m] = value ? value.split(":").map(Number) : [7, 0];
  const [hour, setHour] = React.useState(h);
  const [minute, setMinute] = React.useState(m);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setHour(h);
    setMinute(m);
  }, [value, open, h, m]);

  function handleSelect(newHour: number, newMinute: number) {
    const newVal = `${pad(newHour)}:${pad(newMinute)}`;
    onChange(newVal);
    onSave?.(newVal);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-44 justify-between font-mono text-xl px-6 py-3 hover:cursor-pointer"
          aria-label="Pick time"
        >
          <span>{`${pad(hour)}:${pad(minute)}`}</span>
          <Clock className="ml-2 w-6 h-6 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-2xl w-full p-0 rounded-2xl border-none bg-surface shadow-2xl bg-white"
        )}
        style={{ maxHeight: "90vh" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col items-center w-full gap-8 p-10 "
        >
          <DialogHeader className="w-full flex justify-between items-center mb-4">
            <DialogTitle className="text-2xl text-primary">
              Select Wake Time
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-row justify-center items-start w-full gap-12">
            {/* Hour selector */}
            <div className="flex flex-col items-center flex-1">
              <div className="text-sm mb-2 text-text-light text-center font-semibold tracking-wide">
                Hour
              </div>
              <div className="grid grid-cols-4 gap- w-full">
                {Array.from({ length: 24 }).map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-12 h-12 rounded-xl font-mono text-xl transition-all flex items-center justify-center hover:cursor-pointer",
                      hour === i
                        ? "bg-primary text-primary-foreground font-bold shadow"
                        : "hover:bg-muted"
                    )}
                    onClick={() => setHour(i)}
                    tabIndex={0}
                  >
                    {pad(i)}
                  </button>
                ))}
              </div>
            </div>
            {/* Minute selector */}
            <div className="flex flex-col items-center flex-1">
              <div className="text-sm mb-2 text-text-light text-center font-semibold tracking-wide">
                Minute
              </div>
              <div className="grid grid-cols-3 gap-4 w-full">
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((min) => (
                  <button
                    key={min}
                    className={cn(
                      "w-12 h-12 rounded-xl font-mono text-xl transition-all flex items-center justify-center hover:cursor-pointer",
                      minute === min
                        ? "bg-primary text-primary-foreground font-bold shadow"
                        : "hover:bg-muted"
                    )}
                    onClick={() => setMinute(min)}
                    tabIndex={0}
                  >
                    {pad(min)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Button
            className="w-full mt-4 bg-primary hover:bg-primary-hover text-lg font-bold py-3 hover:cursor-pointer"
            onClick={() => handleSelect(hour, minute)}
          >
            Set Wake Time
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
