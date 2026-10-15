import React, { useState } from 'react';
import { ChecklistItem, ChecklistCategory, IndividualContact } from '../types/expedition';
import { CheckSquare, Square, Plus, Trash2, BatteryCharging, Utensils, Mountain, ShieldAlert, Radio } from 'lucide-react';

interface ChecklistManagerProps {
  checklists: ChecklistItem[];
  members: IndividualContact[];
  onUpdateChecklists: (items: ChecklistItem[]) => void;
  theme?: 'dark' | 'light';
}

export const ChecklistManager: React.FC<ChecklistManagerProps> = ({
  checklists,
  members,
  onUpdateChecklists,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<ChecklistCategory | 'all'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ChecklistCategory>('gear');
  const [newQuantity, setNewQuantity] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const totalItems = checklists.length;
  const packedItems = checklists.filter((i) => i.packed).length;
  const percentPacked = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const filteredItems = activeCategory === 'all'
    ? checklists
    : checklists.filter((i) => i.category === activeCategory);

  const handleToggle = (id: string) => {
    const updated = checklists.map((item) =>
      item.id === id ? { ...item, packed: !item.packed } : item
    );
    onUpdateChecklists(updated);
  };

  const handleDelete = (id: string) => {
    const updated = checklists.filter((item) => item.id !== id);
    onUpdateChecklists(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ChecklistItem = {
      id: `c-item-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      quantity: newQuantity.trim() || undefined,
      packed: false,
    };

    onUpdateChecklists([...checklists, newItem]);
    setNewTitle('');
    setNewQuantity('');
    setIsAdding(false);
  };

  return (
    <div className={`rounded-2xl p-6 shadow-lg border transition-colors flex flex-col gap-5 ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'
    }`}>
      {/* Header & Progress */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <CheckSquare className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
              Expedition Manifest & Packing Checklist
            </h3>
          </div>
          <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <span>{packedItems} of {totalItems} items verified packed ({percentPacked}%)</span>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-colors self-start sm:self-auto cursor-pointer ${
            isDark
              ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/50'
              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-emerald-300'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'Add Gear Item'}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className={`w-full rounded-full h-2.5 overflow-hidden border ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-200 border-slate-300'
      }`}>
        <div
          className={`h-full transition-all duration-300 ${
            percentPacked === 100 ? 'bg-emerald-400' : 'bg-emerald-500'
          }`}
          style={{ width: `${percentPacked}%` }}
        />
      </div>

      {/* Category Tabs (Segmented Button Controls) */}
      <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border overflow-x-auto text-xs sm:text-sm font-bold ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
      }`}>
        {[
          { key: 'all', label: 'All Items' },
          { key: 'provisions', label: 'Provisions & Food' },
          { key: 'gear', label: 'Shelter & Gear' },
          { key: 'chargers', label: 'Power & Chargers' },
          { key: 'safety', label: 'Medical & Survival' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key as any)}
            className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === tab.key
                ? isDark ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inline Add Form */}
      {isAdding && (
        <form onSubmit={handleAddItem} className={`p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-12 gap-3 text-sm ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
        }`}>
          <div className="sm:col-span-5">
            <label className={`block mb-1 font-bold text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Item Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Anker 20,000mAh Power Bank"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400'
              }`}
            />
          </div>

          <div className="sm:col-span-3">
            <label className={`block mb-1 font-bold text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as ChecklistCategory)}
              className={`w-full px-3.5 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-950'
              }`}
            >
              <option value="gear">Shelter & Gear</option>
              <option value="provisions">Provisions & Food</option>
              <option value="chargers">Power & Chargers</option>
              <option value="safety">Medical & Safety</option>
              <option value="comms">Comms & Navigation</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={`block mb-1 font-bold text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Quantity</label>
            <input
              type="text"
              placeholder="e.g. 2 units"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400'
              }`}
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer shadow-sm"
            >
              Add Item
            </button>
          </div>
        </form>
      )}

      {/* Item List */}
      <div className="space-y-2.5 max-h-100 overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className={`text-center py-10 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No items in this category yet. Click "Add Gear Item" to add gear.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3.5 transition-colors ${
                item.packed
                  ? isDark
                    ? 'bg-slate-950/40 border-slate-800 text-slate-500'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                  : isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-100'
                    : 'bg-white border-slate-300 text-slate-950 shadow-sm'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                className="flex items-center gap-3.5 min-w-0 text-left flex-1 cursor-pointer"
              >
                <div className="shrink-0">
                  {item.packed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Square className={`w-5 h-5 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`} />
                  )}
                </div>

                <div className="truncate">
                  <div className={`text-sm sm:text-base font-bold truncate ${
                    item.packed ? 'line-through opacity-60' : ''
                  }`}>
                    {item.title}
                  </div>
                  <div className={`text-xs font-semibold mt-1 flex items-center gap-2 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <span className="capitalize">{item.category}</span>
                    {item.quantity && (
                      <>
                        <span>·</span>
                        <span className="font-mono">{item.quantity}</span>
                      </>
                    )}
                    {item.assignedTo && (
                      <>
                        <span>·</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-800'}>Assigned: {item.assignedTo}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                  isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100'
                }`}
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
