import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import ClassCard from './ClassCard';
import { CLASS_INFO } from './ClassCard';

export default function ClassSelectionModal({ onClassSelected, isSubmitting }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelect = (classKey) => {
    setSelectedClass(classKey);
    setShowConfirmation(false);
  };

  const handleConfirm = () => {
    if (!selectedClass) return;
    setShowConfirmation(true);
  };

  const handleFinalConfirm = () => {
    onClassSelected(selectedClass);
  };

  const handleCancelConfirm = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#0A192F] border-2 border-[#00F2FF]/50 rounded-lg max-w-6xl w-full my-8">
        {!showConfirmation ? (
          <>
            {/* Header */}
            <div className="border-b border-[#00F2FF]/30 p-6 text-center">
              <h1 className="text-3xl font-bold text-[#FFD700] mb-2">Choose Your Path</h1>
              <p className="text-gray-300">Select your specialization. This choice is permanent.</p>
              <div className="flex items-center justify-center gap-2 mt-3 text-yellow-400 text-sm">
                <AlertCircle size={16} />
                <span>You cannot change your class after selection</span>
              </div>
            </div>

            {/* Class Cards Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Object.keys(CLASS_INFO).map((classKey) => (
                  <ClassCard
                    key={classKey}
                    classKey={classKey}
                    isSelected={selectedClass === classKey}
                    onSelect={handleSelect}
                  />
                ))}
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleConfirm}
                  disabled={!selectedClass || isSubmitting}
                  className={`
                    px-8 py-3 rounded-lg font-bold text-lg transition-all
                    ${selectedClass && !isSubmitting
                      ? 'bg-gradient-to-r from-[#00F2FF] to-[#00d9ff] hover:from-[#00d9ff] hover:to-[#00c0e0] text-[#0A192F]'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Confirm Selection'}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Confirmation Dialog */
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
              <AlertCircle size={48} className="text-yellow-400" />
            </div>

            <h2 className="text-2xl font-bold text-[#FFD700] mb-3">Confirm Your Choice</h2>
            
            <div className="bg-[#1a1a1a] border border-[#00F2FF]/30 rounded-lg p-6 mb-6 max-w-md mx-auto">
              <p className="text-lg font-semibold text-[#00F2FF] mb-2">
                {CLASS_INFO[selectedClass].name}
              </p>
              <p className="text-sm text-gray-300 mb-3">
                {CLASS_INFO[selectedClass].specialty}
              </p>
              <div className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#FFD700]/20 to-[#FFC700]/20 text-[#FFD700] border border-[#FFD700]">
                {CLASS_INFO[selectedClass].bonus}
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-sm text-yellow-400 font-semibold mb-2">
                ⚠️ This choice is PERMANENT
              </p>
              <p className="text-xs text-gray-300">
                You will not be able to change your class. Only Super Admin can reset it.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleCancelConfirm}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg font-semibold bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handleFinalConfirm}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-[#00F2FF] to-[#00d9ff] hover:from-[#00d9ff] hover:to-[#00c0e0] text-[#0A192F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : 'Yes, I Confirm'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
