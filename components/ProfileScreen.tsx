"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export function ProfileScreen() {
  const { user, setUser, setRoute } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-black text-white font-medium">
              Profile Details
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium">
              Order History
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium">
              Saved Addresses
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium">
              Settings
            </button>
            <hr className="my-4" />
            <button 
              onClick={() => setRoute("home")}
              className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium"
            >
              Log Out
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-medium text-pink-600 hover:text-pink-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              <div className="p-6 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Address</label>
                        <textarea
                          rows={3}
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSave}
                        className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-2xl font-bold text-pink-600">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-gray-500 text-sm">Customer since 2026</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm text-gray-400 mb-1">Address</p>
                        <p className="font-medium">{user.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-500">Orders Placed</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold">₹0</p>
                  <p className="text-sm text-gray-500">Total Spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
