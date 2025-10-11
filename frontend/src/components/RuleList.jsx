import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getRules, createRule, updateRule, deleteRule } from '../api/rules';
import { RuleFormModal } from './RuleFormModal';
import { RuleItem } from './RuleItem';

function RuleList() {
  const [rules, setRules] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch rules from backend
  const loadRules = async () => {
    try {
      const data = await getRules();
      setRules(data);
    } catch (error) {
      console.error('Failed to load rules:', error);
    }
  };

  // Load rules on mount
  useEffect(() => {
    loadRules();
  }, []);

  // Add new rule
  const handleAddRule = async (newRule) => {
    try {
      const created = await createRule(newRule);
      
      setRules((prev) => [...prev, created]);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding rule:', error);
      alert('Failed to add rule');
    }
  };

  // Toggle active/inactive
  const handleToggleRule = async (id, active) => {
    try {
      const updated = await updateRule(id, { active });
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, active: updated.active } : r))
      );
    } catch (error) {
      console.error('Error updating rule:', error);
    }
  };

  // Delete rule
  const handleDeleteRule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;
    try {
      await deleteRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Rules</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} />
          Add Rule
        </button>
      </div>

      {/* Rule list */}
      {rules.length === 0 ? (
        <p className="text-gray-500 text-sm">No rules added yet.</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {rules.map((rule) => (
            <RuleItem
              key={rule.id}
              rule={rule}
              onToggle={handleToggleRule}
              onDelete={handleDeleteRule}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <RuleFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddRule}
      />
    </div>
  );
}

export default RuleList;

