import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';

const LuckyWheel = () => {
  // 状态管理
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [names, setNames] = useState([
    '一等奖', '二等奖', '三等奖', '四等奖',
    '五等奖', '六等奖', '七等奖', '八等奖'
  ]);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  // 计算扇形路径的函数
  const calculateSectorPath = (index, total, radius) => {
    const anglePerSector = 360 / total;
    const startAngle = index * anglePerSector;
    const endAngle = (index + 1) * anglePerSector;
    
    // 将角度转换为弧度
    const startRadians = (startAngle - 90) * Math.PI / 180;
    const endRadians = (endAngle - 90) * Math.PI / 180;
    
    // 计算起点和终点坐标
    const startX = radius + radius * Math.cos(startRadians);
    const startY = radius + radius * Math.sin(startRadians);
    const endX = radius + radius * Math.cos(endRadians);
    const endY = radius + radius * Math.sin(endRadians);
    
    // 构建SVG路径
    const largeArcFlag = anglePerSector <= 180 ? 0 : 1;
    
    return `M${radius},${radius}
            L${startX},${startY}
            A${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}
            Z`;
  };

  // 计算文本位置的函数
  const calculateTextPosition = (index, total, radius) => {
    const anglePerSector = 360 / total;
    const angle = ((index + 0.5) * anglePerSector - 90) * Math.PI / 180;
    const x = radius + (radius * 0.65) * Math.cos(angle);
    const y = radius + (radius * 0.65) * Math.sin(angle);
    const rotation = (index * anglePerSector + anglePerSector / 2);
    return { x, y, rotation };
  };

  // 开始抽奖
  const spinWheel = () => {
    if (!spinning) {
      const spins = 5;
      const degrees = 360 * spins + Math.random() * 360;
      setSpinning(true);
      setRotation(rotation + degrees);
      
      setTimeout(() => {
        setSpinning(false);
      }, 5000);
    }
  };

  // 编辑功能
  const startEdit = (index) => {
    setEditMode(true);
    setEditIndex(index);
    setEditValue(names[index]);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      const newNames = [...names];
      newNames[editIndex] = editValue;
      setNames(newNames);
    }
    setEditMode(false);
    setEditIndex(null);
    setEditValue('');
  };

  // 颜色配置
  const colors = [
    '#4299E1', '#3182CE', '#2B6CB0', '#2C5282',
    '#2A4365', '#2C5282', '#2B6CB0', '#3182CE'
  ];

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="relative w-96 h-96">
        {/* SVG转盘 */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 400 400"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          <g>
            {names.map((name, index) => {
              const path = calculateSectorPath(index, names.length, 200);
              const textPos = calculateTextPosition(index, names.length, 200);
              
              return (
                <g key={index} onClick={() => !spinning && startEdit(index)}>
                  <path
                    d={path}
                    fill={colors[index]}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:brightness-110 transition-all"
                  />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                    className="pointer-events-none"
                  >
                    {name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* 指针 */}
        <div className="absolute top-0 left-1/2 w-4 h-8 bg-red-500 transform -translate-x-1/2 z-20" 
             style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} />
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-4">
        <Button 
          onClick={spinWheel} 
          disabled={spinning || editMode}
          className="bg-blue-500 hover:bg-blue-600"
        >
          开始抽奖
        </Button>
        <Button
          onClick={() => setEditMode(!editMode)}
          variant="outline"
          disabled={spinning}
        >
          <Settings className="w-4 h-4 mr-2" />
          编辑名称
        </Button>
      </div>

      {/* 编辑模态框 */}
      {editMode && editIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">编辑名称</h3>
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="mb-4"
              placeholder="输入新名称"
            />
            <div className="flex gap-2">
              <Button onClick={saveEdit}>保存</Button>
              <Button variant="outline" onClick={() => setEditMode(false)}>
                取消
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyWheel;
