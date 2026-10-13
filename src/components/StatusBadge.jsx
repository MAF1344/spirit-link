export default function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    approved: 'bg-green-500/20 text-green-400 border-green-500/50',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/50'
  };

  const labels = {
    pending: 'Pending',
    approved: 'Disetujui',
    rejected: 'Ditolak'
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  );
}
