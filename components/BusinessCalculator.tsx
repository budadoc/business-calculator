
// components/BusinessCalculator.tsx
'use client';
import { useState, useEffect } from 'react';

export default function BusinessCalculator() {
  const [expression, setExpression] = useState('');
  const [inputBuffer, setInputBuffer] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [mode, setMode] = useState<'margin' | 'discount' | null>(null);
  const [percentBuffer, setPercentBuffer] = useState('');

  const addMargin = (value: number, percent: number) => value * (1 + percent / 100);
  const applyDiscount = (value: number, percent: number) => value * (1 - percent / 100);
  const addVAT = (value: number) => value * 1.1;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (mode) {
        if (/\d/.test(key)) setPercentBuffer(prev => prev + key);
        if (key === 'Enter' || key === '=') {
          const percent = parseFloat(percentBuffer);
          if (!isNaN(percent) && result !== null) {
            const newResult =
              mode === 'margin' ? addMargin(result, percent) : applyDiscount(result, percent);
            setResult(newResult);
            setHistory(prev => [...prev, {
              expression: `${result} ${mode === 'margin' ? '+ 마진' : '- 할인'} ${percent}%`,
              result: newResult
            }]);
          }
          setMode(null);
          setPercentBuffer('');
        }
        if (key === 'Escape') {
          setMode(null);
          setPercentBuffer('');
        }
        return;
      }

      if (/\d/.test(key)) setInputBuffer(prev => prev + key);
      else if (['+', '-', '*', '/'].includes(key)) {
        if (inputBuffer) {
          setExpression(prev => prev + inputBuffer + key);
          setInputBuffer('');
        } else if (result !== null) {
          setExpression(result + key);
          setResult(null);
        }
      } else if (key === '.') {
        if (!inputBuffer.includes('.')) setInputBuffer(prev => prev + '.');
      } else if (key === 'Backspace') {
        setInputBuffer(prev => prev.slice(0, -1));
      } else if (key === 'Enter' || key === '=') {
        try {
          const full = expression + inputBuffer;
          const evalResult = eval(full);
          setResult(evalResult);
          setHistory(prev => [...prev, { expression: full, result: evalResult }]);
          setExpression('');
          setInputBuffer('');
        } catch {
          alert('계산 오류');
        }
      } else if (key === 'a') {
        if (result !== null) {
          setMode('margin');
          setPercentBuffer('');
        }
      } else if (key === 's') {
        if (result !== null) {
          setMode('discount');
          setPercentBuffer('');
        }
      } else if (key === 'd') {
        if (result !== null) {
          const vat = addVAT(result);
          setResult(vat);
          setHistory(prev => [...prev, { expression: `${result} + 부가세`, result: vat }]);
        }
      } else if (key === 'q') {
        const total = history.reduce((sum, h) => sum + h.result, 0);
        setResult(total);
        setHistory(prev => [...prev, { expression: '총합계', result: total }]);
      } else if (key === 'w') {
        const total = history.reduce((sum, h) => sum + h.result, 0);
        const totalVAT = addVAT(total);
        setResult(totalVAT);
        setHistory(prev => [...prev, { expression: `총합 + 부가세`, result: totalVAT }]);
      } else if (key === 'e') {
        setHistory([]);
        setResult(null);
      } else if (key === 'c') {
        setInputBuffer('');
        setExpression('');
        setResult(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [inputBuffer, expression, result, mode, percentBuffer, history]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-bold text-center mb-4">사장님 계산기</h2>
      <div className="bg-gray-100 p-3 rounded mb-2">
        <div className="text-sm text-gray-500">입력: {expression + inputBuffer}</div>
        <div className="text-xl font-bold">결과: {result ?? 0}</div>
        {mode && <div className="text-red-500">[{mode === 'margin' ? '마진' : '할인'} 모드] % 입력 후 Enter</div>}
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[7,8,9,'/','4','5','6','*','1','2','3','-','0','.','=','+'].map((b, i) => (
          <button key={i} onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: b.toString() }))} className="bg-gray-200 p-3 rounded hover:bg-gray-300">
            {b}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button className="bg-blue-500 text-white py-2 rounded" onClick={() => setMode('margin')}>+ 마진추가 (A)</button>
        <button className="bg-pink-500 text-white py-2 rounded" onClick={() => setMode('discount')}>- 할인적용 (S)</button>
        <button className="bg-purple-500 text-white py-2 rounded" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }))}>+ 부가세 (D)</button>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button className="bg-gray-700 text-white py-2 rounded" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }))}>총합계 (Q)</button>
        <button className="bg-gray-800 text-white py-2 rounded" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }))}>총합+부가세 (W)</button>
        <button className="bg-red-400 text-white py-2 rounded" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' }))}>이력 지우기 (E)</button>
      </div>
      <div>
        <h3 className="font-semibold mb-2">계산 이력</h3>
        {history.length === 0 && <div className="text-sm text-gray-400">이력이 없습니다</div>}
        <ul className="space-y-1 max-h-60 overflow-y-auto text-sm">
          {history.slice().reverse().map((item, idx) => (
            <li key={idx} className="border p-2 rounded flex justify-between">
              <div>
                <div className="text-gray-600">{item.expression}</div>
                <div className="font-bold">= {item.result.toLocaleString()}</div>
              </div>
              <button className="text-red-500 font-bold" onClick={() => setHistory(prev => prev.filter((_, i) => i !== history.length - 1 - idx))}>×</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
