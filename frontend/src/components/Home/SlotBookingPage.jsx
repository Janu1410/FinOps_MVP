import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SlotBookingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const inquiry = state?.inquiry;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const slideUpVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const formItemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  // Redirect if inquiry data missing
  useEffect(() => {
    if (!inquiry) navigate("/");
  }, [inquiry, navigate]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate) return;

    async function fetchSlots() {
      setLoadingSlots(true);
      setSelectedSlot(null);

      try {
        const formattedDate = `${selectedDate.getFullYear()}-${String(
          selectedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

        const res = await axios.get(
          `http://localhost:5000/api/inquiry/slots/by-date?date=${formattedDate}`
        );
        setSlots(res.data.slots || []);
      } catch (err) {
        console.error("Failed to fetch slots", err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [selectedDate]);

  function buildPreferredDateTime(date, slotStart) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}T${slotStart}:00`;
  }

  async function handleSubmit() {
    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }

    setSubmitting(true);

    const preferred_datetime = buildPreferredDateTime(
      selectedDate,
      selectedSlot.start
    );

    const payload = {
      ...inquiry,
      preferred_datetime,
      timezone,
    };

    try {
      await axios.post("http://localhost:5000/api/inquiry/submit", payload);
      alert("Inquiry submitted successfully");
      navigate("/");
    } catch (err) {
      console.error("Failed to submit inquiry", err);
      alert("Failed to submit inquiry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white px-6 py-16 relative overflow-hidden">
      {/* Background Glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B2FC9]/10 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div variants={slideUpVariants} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6">
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#8B2FC9]"
            />
            Book Your Audit
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Select a Date & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8B2FC9]">
              Time
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Choose your preferred slot for the FinOps Audit
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          variants={slideUpVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative"
        >
          {/* Summary Card */}
          {inquiry && (
            <motion.div
              variants={formItemVariants}
              className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="text-[#8B2FC9]" size={20} />
                <h3 className="text-lg font-semibold text-white">
                  Inquiry Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Name
                  </p>
                  <p className="text-white">{inquiry.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-white">{inquiry.email}</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div variants={containerVariants} className="space-y-6">
            {/* Timezone */}
            <motion.div variants={formItemVariants} className="space-y-2">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <MapPin size={14} />
                Timezone
              </label>
              <input
                disabled
                value={timezone}
                className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-xl p-3 text-white text-sm"
              />
            </motion.div>

            {/* Date Picker */}
            <motion.div variants={formItemVariants} className="space-y-2">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Calendar size={14} />
                Select Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none"
                placeholderText="Choose a date"
                wrapperClassName="w-full"
              />
            </motion.div>

            {/* Available Slots */}
            <motion.div variants={formItemVariants} className="space-y-3">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Clock size={14} />
                Available Slots
                {selectedDate && (
                  <span className="text-xs font-normal text-gray-400 ml-auto">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                )}
              </label>

              {loadingSlots && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B2FC9]"></div>
                </div>
              )}

              {!loadingSlots && slots.length === 0 && selectedDate && (
                <div className="text-center py-8 border border-white/10 rounded-xl">
                  <Clock className="mx-auto mb-3 text-gray-500" size={32} />
                  <p className="text-gray-400">No slots available for this date</p>
                  <p className="text-gray-500 text-sm mt-1">Please select another date</p>
                </div>
              )}

              {!loadingSlots && slots.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slots.map((slot, idx) => (
                    <button
                      key={idx}
                      variants={formItemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        selectedSlot?.start === slot.start
                          ? "bg-[#8B2FC9]/20 border-[#8B2FC9] shadow-[0_0_20px_rgba(139,47,201,0.3)]"
                          : "bg-white/5 border-white/10 hover:border-[#8B2FC9]/50 hover:bg-white/[0.07]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium text-sm">
                            {slot.start} – {slot.end}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {selectedDate && selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        {selectedSlot?.start === slot.start && (
                          <CheckCircle2 className="text-[#8B2FC9]" size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={formItemVariants}>
              <motion.button
                whileHover={{ scale: selectedSlot && !submitting ? 1.02 : 1 }}
                whileTap={{ scale: selectedSlot && !submitting ? 0.98 : 1 }}
                onClick={handleSubmit}
                disabled={!selectedSlot || submitting}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 group ${
                  submitting
                    ? "bg-gray-700 cursor-not-allowed"
                    : selectedSlot
                    ? "bg-[#8B2FC9] hover:bg-[#7e22ce] shadow-[0_0_20px_rgba(139,47,201,0.3)] hover:shadow-[0_0_30px_rgba(139,47,201,0.5)]"
                    : "bg-gray-700 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </motion.button>
            </motion.div>

           
          </motion.div>
        </motion.div>

      
      </motion.div>
    </div>
  );
}