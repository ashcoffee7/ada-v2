export default function InputField({ label, type, value, onChange }: { label: string, type: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">{label}</label>
      <input
        type={type}
        required
        className="w-full p-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-[#3d9194] outline-none transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}