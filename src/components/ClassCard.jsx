import { BookOpen, Users, GraduationCap, Heart } from 'lucide-react';

const CLASS_INFO = {
  quran_protector: {
    name: 'The Quran Protector',
    specialty: 'Quranic Literacy',
    bonus: '1.2x EXP on Quran missions',
    description: 'Specialist in Quranic Literacy. Gains bonus power for memorization and recitation.',
    icon: BookOpen,
    color: 'green',
    bgGradient: 'from-green-500/20 to-green-600/20',
    borderColor: 'border-green-500',
    textColor: 'text-green-400'
  },
  dai: {
    name: "The Da'i",
    specialty: 'Dawah Outreach',
    bonus: '1.2x EXP on Community missions',
    description: 'Vanguard of Dawah Outreach. Excels in mosque committee and community service.',
    icon: Users,
    color: 'blue',
    bgGradient: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400'
  },
  scholar: {
    name: 'The Scholar',
    specialty: "Seeker's Insight",
    bonus: '1.2x EXP on Learning missions',
    description: 'Seeker of knowledge. Gains intellect-based buffs for attending study circles.',
    icon: GraduationCap,
    color: 'purple',
    bgGradient: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400'
  },
  mumin: {
    name: "The Mu'min",
    specialty: 'Balanced',
    bonus: '1.05x EXP on ALL missions',
    description: 'Balanced class. No single specialization but steady growth in all spiritual areas.',
    icon: Heart,
    color: 'gold',
    bgGradient: 'from-[#FFD700]/20 to-[#FFC700]/20',
    borderColor: 'border-[#FFD700]',
    textColor: 'text-[#FFD700]'
  }
};

export default function ClassCard({ classKey, isSelected, onSelect }) {
  const classInfo = CLASS_INFO[classKey];
  const Icon = classInfo.icon;

  return (
    <button
      onClick={() => onSelect(classKey)}
      className={`
        w-full p-6 rounded-lg border-2 transition-all duration-300
        ${isSelected 
          ? `${classInfo.borderColor} bg-gradient-to-br ${classInfo.bgGradient} scale-105 shadow-lg shadow-${classInfo.color}-500/50`
          : 'border-white/20 bg-[#1a1a1a] hover:border-white/40 hover:scale-102'
        }
      `}
    >
      {/* Icon */}
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${classInfo.bgGradient} flex items-center justify-center`}>
        <Icon size={32} className={classInfo.textColor} />
      </div>

      {/* Class Name */}
      <h3 className={`text-xl font-bold mb-2 ${isSelected ? classInfo.textColor : 'text-white'}`}>
        {classInfo.name}
      </h3>

      {/* Specialty */}
      <p className={`text-sm font-semibold mb-3 ${classInfo.textColor}`}>
        {classInfo.specialty}
      </p>

      {/* Divider */}
      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-3" />

      {/* Description */}
      <p className="text-sm text-gray-300 mb-4 leading-relaxed">
        {classInfo.description}
      </p>

      {/* Bonus */}
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${classInfo.bgGradient} ${classInfo.textColor} border ${classInfo.borderColor}`}>
        {classInfo.bonus}
      </div>
    </button>
  );
}

export { CLASS_INFO };
