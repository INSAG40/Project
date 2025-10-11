// import React, { useState } from 'react';
// import { SidePanel } from './SidePanel';
// import { User as UserType } from '../types/auth';
// import { User, Mail, Shield, Building, Save, Edit3, Eye, EyeOff, ToggleLeft, ToggleRight, Plus, Trash2, AlertTriangle } from 'lucide-react';

// interface SettingsProps {
//   user: UserType;
//   onLogout: () => void;
//   setCurrentPage: (page: 'dashboard' | 'transactions' | 'settings' | 'accounts') => void;
// }

// const Settings: React.FC<SettingsProps> = ({ user, onLogout, setCurrentPage }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showPasswordSection, setShowPasswordSection] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: user.firstName,
//     lastName: user.lastName,
//     email: user.email || '',
//     role: user.role,
//     department: user.department,
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [trafficSettings, setTrafficSettings] = useState({
//     autoBlockEnabled: true,
//     riskScoreThreshold: 8,
//     maxTransactionsPerDay: 100,
//     maxAmountPerTransaction: 50000
//   });
//   const [rules, setRules] = useState([
//     { id: 1, name: 'High Risk Pattern Detection', enabled: true, description: 'Block transactions with unusual patterns' },
//     { id: 2, name: 'Amount Threshold Rule', enabled: true, description: 'Flag transactions above $10,000' },
//     { id: 3, name: 'Frequency Monitoring', enabled: false, description: 'Monitor transaction frequency per account' }
//   ]);

//   const handlePanelSelect = (option: string) => {
//     if (option === 'dashboard') setCurrentPage('dashboard');
//     if (option === 'transactions') setCurrentPage('transactions');
//     if (option === 'settings') setCurrentPage('settings');
//     if (option === 'accounts') setCurrentPage('accounts');
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSave = () => {
//     // TODO: Implement save functionality when backend is ready
//     console.log('Saving profile data:', formData);
//     setIsEditing(false);
//     // Show success message
//     alert('Profile updated successfully!');
//   };

//   const handleCancel = () => {
//     setFormData({
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email || '',
//       role: user.role,
//       department: user.department,
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: ''
//     });
//     setIsEditing(false);
//   };

//   const handleTrafficSettingsChange = (field: string, value: any) => {
//     setTrafficSettings(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const toggleRule = (ruleId: number) => {
//     setRules(prev => prev.map(rule => 
//       rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
//     ));
//   };

//   const addNewRule = () => {
//     const newRule = {
//       id: Math.max(...rules.map(r => r.id)) + 1,
//       name: 'New Rule',
//       enabled: true,
//       description: 'Rule description'
//     };
//     setRules(prev => [...prev, newRule]);
//   };

//   const removeRule = (ruleId: number) => {
//     setRules(prev => prev.filter(rule => rule.id !== ruleId));
//   };

//   return (
//     <div className="min-h-screen bg-green-50">
//       <SidePanel onSelect={handlePanelSelect} user={user} onLogout={onLogout} activePage="settings" />
//       <main className="ml-72 px-10 py-8 flex flex-col items-start min-h-screen">
//         <div className="w-full max-w-4xl">
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
//             <p className="text-gray-600">Manage your account settings and preferences</p>
//           </div>

//           {/* Profile Section */}
//           <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center">
//                 <User className="h-6 w-6 text-blue-500 mr-3" />
//                 <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
//               </div>
//               {!isEditing ? (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                 >
//                   <Edit3 className="h-4 w-4 mr-2" />
//                   Edit Profile
//                 </button>
//               ) : (
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={handleCancel}
//                     className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSave}
//                     className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//                   >
//                     <Save className="h-4 w-4 mr-2" />
//                     Save Changes
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* First Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 />
//               </div>

//               {/* Last Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                 <div className="relative">
//                   <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               {/* Role */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//                 <div className="relative">
//                   <Shield className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
//                   <select
//                     name="role"
//                     value={formData.role}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
//                   >
//                     <option value="analyst">Analyst</option>
//                     <option value="manager">Manager</option>
//                     <option value="admin">Administrator</option>
//                     <option value="compliance">Compliance Officer</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Department */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                 <div className="relative">
//                   <Building className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
//                   <select
//                     name="department"
//                     value={formData.department}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
//                   >
//                     <option value="risk-management">Risk Management</option>
//                     <option value="compliance">Compliance</option>
//                     <option value="operations">Operations</option>
//                     <option value="it">Information Technology</option>
//                     <option value="finance">Finance</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Security Settings */}
//           <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center">
//                 <Shield className="h-6 w-6 text-blue-500 mr-3" />
//                 <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>
//               </div>
//               <button
//                 onClick={() => setShowPasswordSection(!showPasswordSection)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Change Password
//               </button>
//             </div>

//             {showPasswordSection && (
//               <div className="space-y-4 border-t pt-6">
//                 {/* Current Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="currentPassword"
//                       value={formData.currentPassword}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                       placeholder="Enter current password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* New Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
//                   <input
//                     type="password"
//                     name="newPassword"
//                     value={formData.newPassword}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     placeholder="Enter new password"
//                   />
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     placeholder="Confirm new password"
//                   />
//                 </div>

//                 <div className="flex space-x-3 pt-4">
//                   <button
//                     onClick={() => setShowPasswordSection(false)}
//                     className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//                     onClick={() => alert('Password change functionality will be implemented with backend')}
//                   >
//                     Update Password
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Traffic Control Section */}
//           <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//             <div className="flex items-center mb-6">
//               <AlertTriangle className="h-6 w-6 text-blue-500 mr-3" />
//               <h3 className="text-xl font-semibold text-gray-900">Traffic Control Settings</h3>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Auto Block Toggle */}
//               <div className="md:col-span-2">
//                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Auto Block High Risk Transactions</h4>
//                     <p className="text-sm text-gray-600">Automatically block transactions that exceed risk threshold</p>
//                   </div>
//                   <button
//                     onClick={() => handleTrafficSettingsChange('autoBlockEnabled', !trafficSettings.autoBlockEnabled)}
//                     className="flex items-center"
//                   >
//                     {trafficSettings.autoBlockEnabled ? (
//                       <ToggleRight className="h-6 w-6 text-emerald-500" />
//                     ) : (
//                       <ToggleLeft className="h-6 w-6 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Risk Score Threshold */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Risk Score Threshold</label>
//                 <input
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={trafficSettings.riskScoreThreshold}
//                   onChange={(e) => handleTrafficSettingsChange('riskScoreThreshold', parseInt(e.target.value))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">Transactions with risk score above this will be auto-blocked</p>
//               </div>

//               {/* Max Transactions Per Day */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Max Transactions Per Day</label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={trafficSettings.maxTransactionsPerDay}
//                   onChange={(e) => handleTrafficSettingsChange('maxTransactionsPerDay', parseInt(e.target.value))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 />
//               </div>

//               {/* Max Amount Per Transaction */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount Per Transaction ($)</label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={trafficSettings.maxAmountPerTransaction}
//                   onChange={(e) => handleTrafficSettingsChange('maxAmountPerTransaction', parseInt(e.target.value))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 />
//               </div>
//             </div>

//             <div className="mt-6 pt-4 border-t">
//               <button
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 onClick={() => alert('Traffic control settings saved!')}
//               >
//                 Save Traffic Settings
//               </button>
//             </div>
//           </div>

//           {/* Rules Section */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center">
//                 <Shield className="h-6 w-6 text-blue-500 mr-3" />
//                 <h3 className="text-xl font-semibold text-gray-900">Transaction Rules</h3>
//               </div>
//               <button
//                 onClick={addNewRule}
//                 className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Rule
//               </button>
//             </div>

//             <div className="space-y-4">
//               {rules.map((rule) => (
//                 <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div className="flex-1">
//                     <div className="flex items-center">
//                       <h4 className="font-medium text-gray-900 mr-3">{rule.name}</h4>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         rule.enabled 
//                           ? 'bg-emerald-100 text-emerald-800' 
//                           : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {rule.enabled ? 'Enabled' : 'Disabled'}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <button
//                       onClick={() => toggleRule(rule.id)}
//                       className="flex items-center"
//                     >
//                       {rule.enabled ? (
//                         <ToggleRight className="h-6 w-6 text-emerald-500" />
//                       ) : (
//                         <ToggleLeft className="h-6 w-6 text-gray-400" />
//                       )}
//                     </button>
//                     <button
//                       onClick={() => removeRule(rule.id)}
//                       className="p-2 text-red-500 hover:text-red-700 transition-colors"
//                       title="Remove rule"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-6 pt-4 border-t">
//               <button
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 onClick={() => alert('Rules saved successfully!')}
//               >
//                 Save Rules
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Settings;

  






// // import React, { useState, useEffect } from 'react';
// // import { SidePanel } from './SidePanel';
// // import { User as UserType } from '../types/auth';
// // import {
// //   User,
// //   Mail,
// //   Shield,
// //   Building,
// //   Save,
// //   Edit3,
// //   Eye,
// //   EyeOff,
// //   ToggleLeft,
// //   ToggleRight,
// //   Plus,
// //   Trash2,
// //   AlertTriangle,
// // } from 'lucide-react';
// // import { RuleList } from './RuleList';

// // interface SettingsProps {
// //   user?: UserType; // make optional to handle loading
// //   onLogout: () => void;
// //   setCurrentPage: (page: 'dashboard' | 'transactions' | 'settings' | 'accounts') => void;
// // }

// // const Settings: React.FC<SettingsProps> = ({ user, onLogout, setCurrentPage }) => {
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showPasswordSection, setShowPasswordSection] = useState(false);

// //   const [formData, setFormData] = useState({
// //     firstName: user?.firstName || '',
// //     lastName: user?.lastName || '',
// //     email: user?.email || '',
// //     role: user?.role || 'analyst',
// //     department: user?.department || '',
// //     currentPassword: '',
// //     newPassword: '',
// //     confirmPassword: '',
// //   });

// //   const [trafficSettings, setTrafficSettings] = useState({
// //     autoBlockEnabled: true,
// //     riskScoreThreshold: 8,
// //     maxTransactionsPerDay: 100,
// //     maxAmountPerTransaction: 50000,
// //   });

// //   // Sync formData if user changes (like after login)
// //   useEffect(() => {
// //     if (user) {
// //       setFormData(prev => ({
// //         ...prev,
// //         firstName: user.firstName,
// //         lastName: user.lastName,
// //         email: user.email || '',
// //         role: user.role,
// //         department: user.department,
// //       }));
// //     }
// //   }, [user]);

// //   const handlePanelSelect = (option: string) => {
// //     if (option === 'dashboard') setCurrentPage('dashboard');
// //     if (option === 'transactions') setCurrentPage('transactions');
// //     if (option === 'settings') setCurrentPage('settings');
// //     if (option === 'accounts') setCurrentPage('accounts');
// //   };

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSave = () => {
// //     console.log('Saving profile data:', formData);
// //     setIsEditing(false);
// //     alert('Profile updated successfully!');
// //   };

// //   const handleCancel = () => {
// //     if (!user) return;
// //     setFormData({
// //       firstName: user.firstName,
// //       lastName: user.lastName,
// //       email: user.email || '',
// //       role: user.role,
// //       department: user.department,
// //       currentPassword: '',
// //       newPassword: '',
// //       confirmPassword: '',
// //     });
// //     setIsEditing(false);
// //   };

// //   const handleTrafficSettingsChange = (field: string, value: any) => {
// //     setTrafficSettings(prev => ({
// //       ...prev,
// //       [field]: value,
// //     }));
// //   };

// //   // Render loading state if user is not yet defined
// //   if (!user) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <p className="text-gray-700">Loading settings...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-green-50">
// //       <SidePanel onSelect={handlePanelSelect} user={user} onLogout={onLogout} activePage="settings" />

// //       <main className="ml-72 px-10 py-8 flex flex-col items-start min-h-screen">
// //         <div className="w-full max-w-4xl">
// //           {/* Header */}
// //           <div className="mb-8">
// //             <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
// //             <p className="text-gray-600">Manage your account settings and preferences</p>
// //           </div>

// //           {/* Profile Section */}
// //           <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
// //             <div className="flex items-center justify-between mb-6">
// //               <div className="flex items-center">
// //                 <User className="h-6 w-6 text-blue-500 mr-3" />
// //                 <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
// //               </div>

// //               {!isEditing ? (
// //                 <button
// //                   onClick={() => setIsEditing(true)}
// //                   className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
// //                 >
// //                   <Edit3 className="h-4 w-4 mr-2" />
// //                   Edit Profile
// //                 </button>
// //               ) : (
// //                 <div className="flex space-x-3">
// //                   <button
// //                     onClick={handleCancel}
// //                     className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     onClick={handleSave}
// //                     className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
// //                   >
// //                     <Save className="h-4 w-4 mr-2" />
// //                     Save Changes
// //                   </button>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
// //                 <input
// //                   type="text"
// //                   name="firstName"
// //                   value={formData.firstName}
// //                   onChange={handleInputChange}
// //                   disabled={!isEditing}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
// //                 <input
// //                   type="text"
// //                   name="lastName"
// //                   value={formData.lastName}
// //                   onChange={handleInputChange}
// //                   disabled={!isEditing}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
// //                 <div className="relative">
// //                   <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
// //                   <input
// //                     type="email"
// //                     name="email"
// //                     value={formData.email}
// //                     onChange={handleInputChange}
// //                     disabled={!isEditing}
// //                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Role */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
// //                 <div className="relative">
// //                   <Shield className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
// //                   <select
// //                     name="role"
// //                     value={formData.role}
// //                     onChange={handleInputChange}
// //                     disabled={!isEditing}
// //                     className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
// //                   >
// //                     <option value="analyst">Analyst</option>
// //                     <option value="manager">Manager</option>
// //                     <option value="admin">Administrator</option>
// //                     <option value="compliance">Compliance Officer</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               {/* Department */}
// //               <div className="md:col-span-2">
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
// //                 <div className="relative">
// //                   <Building className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
// //                   <select
// //                     name="department"
// //                     value={formData.department}
// //                     onChange={handleInputChange}
// //                     disabled={!isEditing}
// //                     className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
// //                   >
// //                     <option value="risk-management">Risk Management</option>
// //                     <option value="compliance">Compliance</option>
// //                     <option value="operations">Operations</option>
// //                     <option value="it">Information Technology</option>
// //                     <option value="finance">Finance</option>
// //                   </select>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Traffic Control Section */}
// //           {/* ...keep your traffic control UI as-is... */}

// //           {/* Transaction Rules Section */}
// //           <div className="bg-white rounded-lg shadow-lg p-6">
// //             <RuleList user={user} />
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default Settings;













// chaps new edited code
import React, { useState } from 'react';
import { SidePanel } from './SidePanel';
import { User as UserType } from '../types/auth';
import { RuleFormModal } from './RuleFormModal';
import { RuleItem } from './RuleItem';
import { Rule } from '../types/rule';
import {
  User,
  Mail,
  Shield,
  Building,
  Save,
  Edit3,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  Plus,
  AlertTriangle,
} from 'lucide-react';

interface SettingsProps {
  user: UserType;
  onLogout: () => void;
  setCurrentPage: (page: 'dashboard' | 'transactions' | 'settings' | 'accounts') => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onLogout, setCurrentPage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email || '',
    role: user.role,
    department: user.department,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [trafficSettings, setTrafficSettings] = useState({
    autoBlockEnabled: true,
    riskScoreThreshold: 8,
    maxTransactionsPerDay: 100,
    maxAmountPerTransaction: 50000,
  });

  const [rules, setRules] = useState<Rule[]>([
    // {
    //   id: '1',
    //   name: 'High Risk Pattern Detection',
    //   description: 'Block transactions with unusual patterns',
    //   enabled: true,
    //   created_at: new Date().toISOString(),
    // },
    // {
    //   id: '2',
    //   name: 'Amount Threshold Rule',
    //   description: 'Flag transactions above $10,000',
    //   enabled: true,
    //   created_at: new Date().toISOString(),
    // },
    // {
    //   id: '3',
    //   name: 'Frequency Monitoring',
    //   description: 'Monitor transaction frequency per account',
    //   enabled: false,
    //   created_at: new Date().toISOString(),
    // },
  ]);

  const handlePanelSelect = (option: string) => {
    if (option === 'dashboard') setCurrentPage('dashboard');
    if (option === 'transactions') setCurrentPage('transactions');
    if (option === 'settings') setCurrentPage('settings');
    if (option === 'accounts') setCurrentPage('accounts');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log('Saving profile data:', formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || '',
      role: user.role,
      department: user.department,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsEditing(false);
  };

  const handleTrafficSettingsChange = (field: string, value: any) => {
    setTrafficSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-green-50">
      <SidePanel onSelect={handlePanelSelect} user={user} onLogout={onLogout} activePage="settings" />
      <main className="ml-72 px-10 py-8 flex flex-col items-start min-h-screen">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <User className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="relative">
                  <Shield className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
                  >
                    <option value="analyst">Analyst</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                    <option value="compliance">Compliance Officer</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <div className="relative">
                  <Building className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
                  >
                    <option value="risk-management">Risk Management</option>
                    <option value="compliance">Compliance</option>
                    <option value="operations">Operations</option>
                    <option value="it">Information Technology</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>
              </div>
              <button
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Password
              </button>
            </div>

            {showPasswordSection && (
              <div className="space-y-4 border-t pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowPasswordSection(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    onClick={() => alert('Password change functionality will be implemented with backend')}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Traffic Control Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-6 w-6 text-blue-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Traffic Control Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto Block High Risk Transactions</h4>
                    <p className="text-sm text-gray-600">
                      Automatically block transactions that exceed risk threshold
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleTrafficSettingsChange('autoBlockEnabled', !trafficSettings.autoBlockEnabled)
                    }
                    className="flex items-center"
                  >
                    {trafficSettings.autoBlockEnabled ? (
                      <ToggleRight className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Score Threshold</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={trafficSettings.riskScoreThreshold}
                  onChange={e =>
                    handleTrafficSettingsChange('riskScoreThreshold', parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Transactions with risk score above this will be auto-blocked
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Transactions Per Day
                </label>
                <input
                  type="number"
                  min="1"
                  value={trafficSettings.maxTransactionsPerDay}
                  onChange={e =>
                    handleTrafficSettingsChange('maxTransactionsPerDay', parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Amount Per Transaction ($)
                </label>
                <input
                  type="number"
                  min="1"
                  value={trafficSettings.maxAmountPerTransaction}
                  onChange={e =>
                    handleTrafficSettingsChange('maxAmountPerTransaction', parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => alert('Traffic control settings saved!')}
              >
                Save Traffic Settings
              </button>
            </div>
          </div>

          {/* Rules Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Transaction Rules</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </button>
            </div>

            {rules.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Shield className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-lg font-medium">No rules configured yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Click "Add Rule" to create your first transaction rule
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {rules.map(rule => (
                  <RuleItem
                    key={rule.id}
                    rule={rule}
                    onToggle={(id, active) =>
                      setRules(prev =>
                        prev.map(r => (r.id === id ? { ...r, enabled: active } : r))
                      )
                    }
                    onDelete={id => setRules(prev => prev.filter(r => r.id !== id))}
                  />
                ))}
              </div>
            )}

            <RuleFormModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAdd={newRule =>
                setRules(prev => [
                  ...prev,
                  { ...newRule, id: String(Date.now()), created_at: new Date().toISOString() },
                ])
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
