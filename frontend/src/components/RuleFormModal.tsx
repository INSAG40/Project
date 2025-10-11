// import { useState } from 'react';
// import { X } from 'lucide-react';
// import { Rule } from '../types/rule';

// interface RuleFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (rule: Omit<Rule, 'id' | 'created_at'>) => void;
// }

// export function RuleFormModal({ isOpen, onClose, onSubmit }: RuleFormModalProps) {
//   const [formData, setFormData] = useState<Omit<Rule, 'id' | 'created_at'>>({
//     name: '',
//     description: '',
//     category: 'behavioral',
//     field: '',
//     operator: '>=',
//     value: '',
//     risk_points: 0,
//     active: true,
//   });

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//     setFormData({
//       name: '',
//       description: '',
//       category: 'behavioral',
//       field: '',
//       operator: '>=',
//       value: '',
//       risk_points: 0,
//       active: true,
//     });
//     onClose();
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'number' ? parseFloat(value) : value,
//     }));
//   };

//   const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       active: e.target.checked,
//     }));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
//           <h2 className="text-xl font-semibold text-gray-900">Add New Rule</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-5">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//               Rule Name *
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               required
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="e.g., High Value Transaction"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//             />
//           </div>

//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//               Description *
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               required
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="e.g., Flag transactions >= 10000"
//               rows={3}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-none"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
//                 Category *
//               </label>
//               <select
//                 id="category"
//                 name="category"
//                 required
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//               >
//                 <option value="behavioral">Behavioral</option>
//                 <option value="pattern">Pattern</option>
//                 <option value="frequency">Frequency</option>
//                 <option value="threshold">Threshold</option>
//               </select>
//             </div>

//             <div>
//               <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">
//                 Field *
//               </label>
//               <input
//                 type="text"
//                 id="field"
//                 name="field"
//                 required
//                 value={formData.field}
//                 onChange={handleChange}
//                 placeholder="e.g., amount"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="operator" className="block text-sm font-medium text-gray-700 mb-1">
//                 Operator *
//               </label>
//               <select
//                 id="operator"
//                 name="operator"
//                 required
//                 value={formData.operator}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//               >
//                 <option value=">=">{'>='} Greater than or equal</option>
//                 <option value="<=">{'<='} Less than or equal</option>
//                 <option value=">">{'>'} Greater than</option>
//                 <option value="<">{'<'} Less than</option>
//                 <option value="==">== Equal</option>
//                 <option value="!=">!= Not equal</option>
//                 <option value="contains">Contains</option>
//                 <option value="not_contains">Not Contains</option>
//               </select>
//             </div>

//             <div>
//               <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
//                 Value *
//               </label>
//               <input
//                 type="text"
//                 id="value"
//                 name="value"
//                 required
//                 value={formData.value}
//                 onChange={handleChange}
//                 placeholder="e.g., 10000"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//               />
//             </div>
//           </div>

//           <div>
//             <label htmlFor="risk_points" className="block text-sm font-medium text-gray-700 mb-1">
//               Risk Points *
//             </label>
//             <input
//               type="number"
//               id="risk_points"
//               name="risk_points"
//               required
//               min="0"
//               step="0.1"
//               value={formData.risk_points}
//               onChange={handleChange}
//               placeholder="e.g., 50"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//             />
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="active"
//               name="active"
//               checked={formData.active}
//               onChange={handleCheckbox}
//               className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
//             />
//             <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
//               Active (Enable this rule immediately)
//             </label>
//           </div>

//           <div className="flex gap-3 pt-4 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
//             >
//               Add Rule
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }





import React, { useState } from "react";
import { X } from "lucide-react";
import { Rule } from "../types/rule";

interface RuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newRule: Rule) => void;
}

export const RuleFormModal: React.FC<RuleFormModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<Omit<Rule, 'id' | 'created_at'>>({
    name: "",
    description: "",
    category: "behavioral",
    field: "",
    operator: ">=",
    value: "",
    risk_points: 0,
    active: true,
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const name = target.name as keyof Omit<Rule, 'id' | 'created_at'>;
    const value = (target as HTMLInputElement).value;
    const type = (target as HTMLInputElement).type;
    const checked = (target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (checked as any)
          : type === "number"
          ? (parseFloat(value) as any)
          : (value as any),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    const newRule: Rule = {
      id: String(Date.now()),
      created_at: new Date().toISOString(),
      ...formData,
    };

    onAdd(newRule);
    onClose();
    setFormData({
      name: "",
      description: "",
      category: "behavioral",
      field: "",
      operator: ">=",
      value: "",
      risk_points: 0,
      active: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Add New Rule</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rule Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., High Value Transaction"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Flag transactions >= 10000"
              rows={3}
              required
            />
          </div>

          {/* Category and Field */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="behavioral">Behavioral</option>
                <option value="pattern">Pattern</option>
                <option value="frequency">Frequency</option>
                <option value="threshold">Threshold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field *</label>
              <input
                type="text"
                name="field"
                value={formData.field}
                onChange={handleChange}
                placeholder="e.g., amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Operator and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operator *</label>
              <select
                name="operator"
                value={formData.operator}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value=">=">&gt;= Greater than or equal</option>
                <option value="<=">&lt;= Less than or equal</option>
                <option value=">">&gt; Greater than</option>
                <option value="<">&lt; Less than</option>
                <option value="==">== Equal</option>
                <option value="!=">!= Not equal</option>
                <option value="contains">Contains</option>
                <option value="not_contains">Not Contains</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
              <input
                type="text"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Risk Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Points *</label>
            <input
              type="number"
              name="risk_points"
              value={formData.risk_points}
              onChange={handleChange}
              min="0"
              step="0.1"
              placeholder="e.g., 50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label className="text-sm text-gray-700">Active (Enable this rule immediately)</label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Add Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};








