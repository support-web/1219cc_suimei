'use client';

import { useState } from 'react';
import { BirthData, FullMeishiki } from '@/types';
import BirthDataForm from '@/components/BirthDataForm';
import MeishikiDisplay from '@/components/MeishikiDisplay';
import DaiunDisplay from '@/components/DaiunDisplay';
import FortuneDisplay from '@/components/FortuneDisplay';

export default function Home() {
  const [meishiki, setMeishiki] = useState<FullMeishiki | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'meishiki' | 'daiun' | 'fortune'>('meishiki');

  const handleSubmit = async (birthData: BirthData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(birthData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '計算に失敗しました');
      }

      const result = await response.json();
      setMeishiki(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMeishiki(null);
    setError(null);
    setActiveTab('meishiki');
  };

  return (
    <div className="space-y-8">
      {/* 入力フォーム or 結果表示 */}
      {!meishiki ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              四柱推命で運命を読み解く
            </h2>
            <p className="text-gray-600">
              生年月日と時刻から、あなたの命式と運勢を鑑定します
            </p>
          </div>

          <BirthDataForm onSubmit={handleSubmit} isLoading={isLoading} />

          {error && (
            <div className="max-w-md mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* 説明セクション */}
          <div className="max-w-2xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold mb-1">四柱推命とは</h3>
              <p className="text-sm text-gray-600">
                生まれた年・月・日・時の4つの柱から運命を読み解く東洋占術
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-semibold mb-1">通変星</h3>
              <p className="text-sm text-gray-600">
                あなたの性格や才能、人生の傾向を表す10種類の星
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🔮</div>
              <h3 className="font-semibold mb-1">大運・流年</h3>
              <p className="text-sm text-gray-600">
                10年ごとの大きな運気の流れと年ごとの運勢
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 結果ヘッダー */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">鑑定結果</h2>
              <p className="text-sm text-gray-500">
                {meishiki.birthData.year}年{meishiki.birthData.month}月{meishiki.birthData.day}日
                {meishiki.birthData.hour !== null && ` ${meishiki.birthData.hour}時`}
                生まれ（{meishiki.birthData.gender === 'male' ? '男性' : '女性'}）
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              別の日時で鑑定
            </button>
          </div>

          {/* タブナビゲーション */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('meishiki')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'meishiki'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              命式
            </button>
            <button
              onClick={() => setActiveTab('daiun')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'daiun'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              大運
            </button>
            <button
              onClick={() => setActiveTab('fortune')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'fortune'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              運勢年表
            </button>
          </div>

          {/* タブコンテンツ */}
          <div className="mt-6">
            {activeTab === 'meishiki' && <MeishikiDisplay meishiki={meishiki} />}
            {activeTab === 'daiun' && <DaiunDisplay meishiki={meishiki} />}
            {activeTab === 'fortune' && <FortuneDisplay meishiki={meishiki} />}
          </div>
        </>
      )}
    </div>
  );
}
