import { useState } from 'react';
import { X, Award, AlertCircle } from 'lucide-react';

export default function SubmissionModal({ quest, onClose, onSubmit, isSubmitting }) {
  const [submissionType, setSubmissionType] = useState('text');
  const [proofUrl, setProofUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (notes.trim().length === 0) {
      newErrors.notes = 'Notes tidak boleh kosong';
    }

    if (notes.length > 500) {
      newErrors.notes = 'Notes maksimal 500 karakter';
    }

    if ((submissionType === 'photo' || submissionType === 'video') && proofUrl.trim().length === 0) {
      newErrors.proofUrl = 'URL bukti wajib diisi untuk foto/video';
    }

    if (proofUrl && !isValidUrl(proofUrl)) {
      newErrors.proofUrl = 'Format URL tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        submission_type: submissionType,
        proof_url: proofUrl || null,
        notes: notes.trim()
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] border border-[#00F2FF]/50 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#00F2FF]/30 p-4 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#FFD700] mb-1">Submit Mission</h2>
            <p className="text-sm text-gray-400">{quest.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white ml-2">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Reward Info */}
          <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3 flex items-center gap-2">
            <Award size={20} className="text-[#FFD700]" />
            <div>
              <p className="text-sm text-gray-300">Reward</p>
              <p className="font-bold text-[#FFD700]">{quest.exp_reward} EXP</p>
            </div>
          </div>

          {/* Submission Type */}
          <div>
            <label className="block text-sm font-semibold text-[#00F2FF] mb-2">
              Tipe Submission
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSubmissionType('text')}
                className={`py-2 px-3 rounded text-sm font-semibold transition-all ${
                  submissionType === 'text'
                    ? 'bg-[#00F2FF] text-[#0A192F]'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => setSubmissionType('photo')}
                className={`py-2 px-3 rounded text-sm font-semibold transition-all ${
                  submissionType === 'photo'
                    ? 'bg-[#00F2FF] text-[#0A192F]'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Photo
              </button>
              <button
                type="button"
                onClick={() => setSubmissionType('video')}
                className={`py-2 px-3 rounded text-sm font-semibold transition-all ${
                  submissionType === 'video'
                    ? 'bg-[#00F2FF] text-[#0A192F]'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Video
              </button>
            </div>
          </div>

          {/* Proof URL (if photo/video) */}
          {(submissionType === 'photo' || submissionType === 'video') && (
            <div>
              <label className="block text-sm font-semibold text-[#00F2FF] mb-2">
                URL Bukti {submissionType === 'photo' ? 'Foto' : 'Video'} *
              </label>
              <input
                type="text"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-white/10 border border-[#00F2FF]/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#00F2FF]"
              />
              {errors.proofUrl && (
                <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                  <AlertCircle size={14} />
                  <span>{errors.proofUrl}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload foto/video ke image hosting (mis: imgur, imgbb) dan paste URL-nya di sini
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#00F2FF] mb-2">
              Catatan *
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jelaskan aktivitas yang kamu lakukan..."
              rows={4}
              maxLength={500}
              className="w-full bg-white/10 border border-[#00F2FF]/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#00F2FF] resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.notes ? (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <AlertCircle size={14} />
                  <span>{errors.notes}</span>
                </div>
              ) : (
                <span className="text-xs text-gray-500">
                  Jelaskan apa yang kamu lakukan untuk mission ini
                </span>
              )}
              <span className="text-xs text-gray-500">{notes.length}/500</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#00F2FF] to-[#00d9ff] hover:from-[#00d9ff] hover:to-[#00c0e0] text-[#0A192F] font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Mengirim...' : 'Submit Mission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
