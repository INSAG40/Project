import { Trash2 } from 'lucide-react';
import { Rule } from '../types/rule';

interface RuleItemProps {
  rule: Rule;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

export function RuleItem({ rule, onToggle, onDelete }: RuleItemProps) {
  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900">{rule.name}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                rule.active
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {rule.active ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="text-sm text-gray-600">{rule.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rule.active}
              onChange={(e) => rule.id && onToggle(rule.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
          <button
            onClick={() => rule.id && onDelete(rule.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
