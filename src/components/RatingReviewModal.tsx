'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, X, Sparkles, UserCheck } from 'lucide-react';
import { useVoltStore } from '@/lib/store';

export const RatingReviewModal: React.FC = () => {
  const { ratingModalTicket, closeRatingModal, submitTicketRating } = useVoltStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!ratingModalTicket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTicketRating(ratingModalTicket.id, rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeRatingModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 relative">
        <button
          onClick={closeRatingModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-slate-400">
              Your rating helps other residents find trusted and prompt certified electricians.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Rate Service Quality</h3>
                <p className="text-xs text-slate-400">Service: {ratingModalTicket.title}</p>
              </div>
            </div>

            {ratingModalTicket.assignedElectricianName && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-sm">
                  {ratingModalTicket.assignedElectricianName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs text-slate-400">Electrician</div>
                  <div className="text-sm font-semibold text-white">{ratingModalTicket.assignedElectricianName}</div>
                </div>
              </div>
            )}

            {/* Star Picker */}
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1.5 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-amber-300">
                {rating === 5 && '⭐⭐⭐⭐⭐ Outstanding & Fast Service'}
                {rating === 4 && '⭐⭐⭐⭐ Very Good Service'}
                {rating === 3 && '⭐⭐⭐ Average Service'}
                {rating === 2 && '⭐⭐ Below Expectations'}
                {rating === 1 && '⭐ Poor Service'}
              </span>
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Write a brief review (Optional):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Arrived on time, fixed the short circuit cleanly, respectful and courteous..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition"
            >
              Submit Rating & Update Electrician Ranking
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
