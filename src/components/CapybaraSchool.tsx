
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Question {
  id: number;
  question: string;
  answer: string;
  hint: string;
}

const CapybaraSchool: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [level, setLevel] = useState<number>(1);

  // Вопросы для первого уровня игры
  const questions: Question[] = [
    { id: 1, question: "Как называется группа капибар?", answer: "стадо", hint: "Так же называют группу коров или лошадей" },
    { id: 2, question: "Сколько детёнышей обычно рождается у капибары?", answer: "4", hint: "Это число между 3 и 5" },
    { id: 3, question: "В какой части света обитают капибары?", answer: "южная америка", hint: "Континент, где находится Бразилия" },
    { id: 4, question: "Капибары умеют хорошо...", answer: "плавать", hint: "Они проводят много времени в воде" }
  ];

  const handleAnswerChange = (id: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [id]: value }));
  };

  const checkAnswers = () => {
    let newScore = 0;
    questions.forEach(q => {
      if (userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase()) {
        newScore += 25;
      }
    });
    setScore(newScore);
    setShowResults(true);
  };

  const resetGame = () => {
    setUserAnswers({});
    setScore(0);
    setShowResults(false);
    setShowHint({});
  };

  const toggleHint = (id: number) => {
    setShowHint(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getResultMessage = () => {
    if (score === 100) return "Отлично! Ты настоящий знаток капибар!";
    if (score >= 75) return "Очень хорошо! Ты многое знаешь о капибарах!";
    if (score >= 50) return "Неплохо! Ты на пути к тому, чтобы стать экспертом!";
    if (score >= 25) return "Хорошее начало! Попробуй ещё раз!";
    return "Не расстраивайся! В следующий раз получится лучше!";
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6 border-2 border-amber-200">
        <CardHeader className="bg-amber-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-amber-800">Школа Капибар</CardTitle>
            <Badge variant="outline" className="bg-amber-100 text-amber-800">
              Уровень {level}
            </Badge>
          </div>
          <CardDescription className="text-amber-700">
            Проверь свои знания о самых дружелюбных грызунах на планете!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {showResults && (
            <Alert className={`mb-6 ${score === 100 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
              <AlertTitle className={score === 100 ? 'text-green-800' : 'text-amber-800'}>
                Твой результат: {score}%
              </AlertTitle>
              <AlertDescription className={score === 100 ? 'text-green-700' : 'text-amber-700'}>
                {getResultMessage()}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="border rounded-lg p-4 bg-amber-50/30">
                <h3 className="font-medium text-lg text-amber-900 mb-2">{q.question}</h3>
                
                <Input
                  type="text"
                  placeholder="Введи свой ответ"
                  value={userAnswers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  disabled={showResults}
                  className="mb-2 border-amber-200 focus:border-amber-400"
                />
                
                {showHint[q.id] && (
                  <p className="text-sm text-amber-600 italic mt-1">Подсказка: {q.hint}</p>
                )}
                
                {!showResults && (
                  <Button 
                    variant="link" 
                    onClick={() => toggleHint(q.id)}
                    className="text-amber-600 p-0 h-auto text-sm"
                  >
                    {showHint[q.id] ? 'Скрыть подсказку' : 'Показать подсказку'}
                  </Button>
                )}
                
                {showResults && (
                  <div className="mt-2">
                    {userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase() ? (
                      <p className="text-green-600">✓ Правильно!</p>
                    ) : (
                      <p className="text-red-500">✗ Правильный ответ: {q.answer}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        
        <Separator className="bg-amber-100" />
        
        <CardFooter className="pt-4 flex justify-between">
          {!showResults ? (
            <Button 
              onClick={checkAnswers}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Проверить ответы
            </Button>
          ) : (
            <Button 
              onClick={resetGame}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Попробовать снова
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="text-center text-amber-700 text-sm">
        Изображение капибары © Школа Капибар, 2025
      </div>
    </div>
  );
};

export default CapybaraSchool;
