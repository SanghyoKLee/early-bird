"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

function pad(num: number) {
  return num.toString().padStart(2, "0");
}

type TimePickerProps = {
  value: string; // "HH:mm"
  onChange: (val: string) => void;
  onSave?: (val: string) => void;
};

export default function TimePicker({
  value,
  onChange,
  onSave,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const [hour, setHour] = React.useState<number>(7);
  const [minute, setMinute] = React.useState<number>(0);

  // Parse value and sync local state when dialog opens
  React.useEffect(() => {
    if (!open) return;
    if (value) {
      const [h, m] = value.split(":").map(Number);
      setHour(h);
      setMinute(m);
    }
  }, [open, value]);

  function handleSave() {
    const val = `${pad(hour)}:${pad(minute)}`;
    onChange(val);
    onSave?.(val);
    setOpen(false);
  }

  return (
    <React.Fragment>
      <Button
        variant="outline"
        className="w-44 justify-between font-mono text-xl px-6 py-3"
        aria-label="Pick time"
        onClick={() => setOpen(true)}
      >
        <span>
          {pad(hour)}:{pad(minute)}
        </span>
        <Clock className="ml-2 w-6 h-6 text-primary" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 backdrop-blur-[10px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.18 }}
            className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-8 border border-muted"
          >
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-primary text-center mb-2">
                Select Wake Time
              </h2>
              <div className="flex gap-12">
                {/* Hour Select */}
                <div className="flex flex-col flex-1 ">
                  <span className="text-text-light mb-1 font-medium text-sm text-center">
                    Hour
                  </span>
                  <Select
                    value={hour.toString()}
                    onValueChange={(val) => setHour(Number(val))}
                  >
                    <SelectTrigger className="w-full font-mono text-xl px-2 py-3 bg-white rounded-lg border border-muted hover:cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="flex max-h-60 overflow-y-auto bg-surface bg-white ">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString()}
                          className="font-mono text-lg"
                        >
                          {pad(i)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Minute Select */}
                <div className="flex flex-col flex-1">
                  <span className="text-text-light mb-1 font-medium text-sm text-center">
                    Minute
                  </span>
                  <Select
                    value={minute.toString()}
                    onValueChange={(val) => setMinute(Number(val))}
                  >
                    <SelectTrigger className="w-full font-mono text-xl px-2 py-3 bg-white rounded-lg border border-muted hover:cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto  bg-white">
                      {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(
                        (min) => (
                          <SelectItem
                            key={min}
                            value={min.toString()}
                            className="font-mono text-lg"
                          >
                            {pad(min)}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                className="w-full mt-4 bg-primary hover:bg-primary-hover font-bold py-5 hover:cursor-pointer"
                onClick={handleSave}
              >
                Set Wake Time
              </Button>
              <Button
                variant="destructive"
                className="w-full text-white hover:cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </React.Fragment>
  );
}
