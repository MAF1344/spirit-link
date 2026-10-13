import { Award, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function SubmissionCard({ submission }) {
  const {
    quest_title,
    submission_type,
    proof_url,
    notes,
    status,
    validated_at,
    rejection_reason,
    exp_awarded,
    submitted_at,
    exp_reward
  } = submission;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#00F2FF]/30 rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#FFD700] mb-1">{quest_title}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar size={14} />
            <span>{formatDate(submitted_at)}</span>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Photo Proof */}
      {proof_url && submission_type === 'photo' && (
        <div className="mb-3">
          <img 
            src={proof_url} 
            alt="Bukti submission" 
            className="w-full max-h-48 object-cover rounded-lg border border-white/10"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none' }} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
            <AlertCircle size={24} className="text-red-400 mx-auto mb-1" />
            <p className="text-xs text-red-400">Gagal memuat gambar</p>
          </div>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div className="mb-3">
          <p className="text-sm text-gray-300 italic">"{notes}"</p>
        </div>
      )}

      {/* Status Details */}
      <div className="space-y-2">
        {status === 'pending' && (
          <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <Clock size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-400">Menunggu Validasi</p>
              <p className="text-xs text-gray-400 mt-0.5">GM sedang mereview submission kamu</p>
            </div>
          </div>
        )}

        {status === 'approved' && (
          <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <CheckCircle size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-400">Mission Disetujui!</p>
              <div className="flex items-center gap-2 mt-1">
                <Award size={16} className="text-[#FFD700]" />
                <span className="text-sm font-bold text-[#FFD700]">+{exp_awarded || exp_reward} EXP</span>
              </div>
              {validated_at && (
                <p className="text-xs text-gray-500 mt-1">
                  Divalidasi: {formatDate(validated_at)}
                </p>
              )}
            </div>
          </div>
        )}

        {status === 'rejected' && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400">Mission Ditolak</p>
              {rejection_reason && (
                <p className="text-xs text-gray-300 mt-1">
                  Alasan: {rejection_reason}
                </p>
              )}
              {validated_at && (
                <p className="text-xs text-gray-500 mt-1">
                  Divalidasi: {formatDate(validated_at)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submission Type Badge */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-gray-500">Tipe:</span>
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-400">
          {submission_type}
        </span>
      </div>
    </div>
  );
}
