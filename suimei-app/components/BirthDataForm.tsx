'use client';

import { useState } from 'react';
import { BirthData } from '@/types';

interface BirthDataFormProps {
  onSubmit: (data: BirthData) => void;
  isLoading?: boolean;
}

export default function BirthDataForm({ onSubmit, isLoading = false }: BirthDataFormProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    year: 1990,
    month: 1,
    day: 1,
    hour: '',
    minute: '',
    gender: 'male' as 'male' | 'female',
    includeTime: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const birthData: BirthData = {
      year: formData.year,
      month: formData.month,
      day: formData.day,
      hour: formData.includeTime && formData.hour !== '' ? parseInt(formData.hour) : null,
      minute: formData.includeTime && formData.minute !== '' ? parseInt(formData.minute) : null,
      gender: formData.gender,
      timezone: 'Asia/Tokyo',
    };

    onSubmit(birthData);
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center">生年月日を入力</h2>

      {/* 生年月日 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          生年月日
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {Array.from({ length: 100 }, (_, i) => currentYear - i).map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
          </div>
          <div className="w-20">
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{month}月</option>
              ))}
            </select>
          </div>
          <div className="w-20">
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>{day}日</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 出生時刻 */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="includeTime"
            checked={formData.includeTime}
            onChange={(e) => setFormData({ ...formData, includeTime: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="includeTime" className="text-sm font-medium text-gray-700">
            出生時刻を入力する
          </label>
        </div>
        {formData.includeTime && (
          <div className="flex gap-2">
            <div className="w-24">
              <select
                value={formData.hour}
                onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">時</option>
                {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                  <option key={hour} value={hour}>{hour}時</option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <select
                value={formData.minute}
                onChange={(e) => setFormData({ ...formData, minute: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">分</option>
                {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                  <option key={minute} value={minute}>{minute}分</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          時刻がわからない場合はチェックを外してください
        </p>
      </div>

      {/* 性別 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          性別
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={() => setFormData({ ...formData, gender: 'male' })}
              className="mr-2"
            />
            <span>男性</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={() => setFormData({ ...formData, gender: 'female' })}
              className="mr-2"
            />
            <span>女性</span>
          </label>
        </div>
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '計算中...' : '命式を鑑定する'}
      </button>
    </form>
  );
}
