
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Question {
  id: number;
  question: string;
  answer: string;
  hint: string;
}

interface Teacher {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
  quote?: string;
}

interface Lesson {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  teacherId: string;
}

type Grade = 2 | 3 | 4 | 5;

interface GradeRecord {
  lesson: string;
  score: number;
  grade: Grade;
  date: string;
  teacherName: string;
}

const CapybaraSchool: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [level, setLevel] = useState<number>(1);
  const [currentLesson, setCurrentLesson] = useState<string>("biology");
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  // Учителя школы капибар
  const teachers: Record<string, Teacher> = {
    ibragim: {
      id: "ibragim",
      name: "Ибрагим Каламанси",
      role: "Учитель биологии",
      description: "Специалист по капибарам с 15-летним опытом исследований в естественной среде обитания",
      quote: "Понять капибару — значит понять гармонию природы!"
    },
    maria: {
      id: "maria",
      name: "Мария Водолеева",
      role: "Учитель математики",
      description: "Учитель с творческим подходом к математике, превращает цифры в увлекательные истории",
      quote: "Математика везде, даже в повседневной жизни капибар!"
    },
    petr: {
      id: "petr",
      name: "Пётр Следопытов",
      role: "Учитель географии",
      description: "Путешественник, исследовавший все континенты, где обитают капибары",
      quote: "Каждый водоём — это новый мир для исследования!"
    }
  };

  // Уроки-контрольные для школы капибар
  const lessons: Record<string, Lesson> = {
    biology: {
      id: "biology",
      name: "Биология капибар",
      description: "Знания о жизни капибар в природе",
      teacherId: "ibragim",
      questions: [
        { id: 1, question: "Как называется группа капибар?", answer: "стадо", hint: "Так же называют группу коров или лошадей" },
        { id: 2, question: "Сколько детёнышей обычно рождается у капибары?", answer: "4", hint: "Это число между 3 и 5" },
        { id: 3, question: "В какой части света обитают капибары?", answer: "южная америка", hint: "Континент, где находится Бразилия" },
        { id: 4, question: "Капибары умеют хорошо...", answer: "плавать", hint: "Они проводят много времени в воде" }
      ]
    },
    math: {
      id: "math",
      name: "Математика капибар",
      description: "Решение задач про капибар и их еду",
      teacherId: "maria",
      questions: [
        { id: 1, question: "Если у капибары 8 яблок, и она отдала другим 3, сколько яблок осталось?", answer: "5", hint: "Нужно вычесть 3 из 8" },
        { id: 2, question: "Капибара съедает 2 кг травы за день. Сколько кг травы нужно на 3 дня?", answer: "6", hint: "Умножь 2 на 3" },
        { id: 3, question: "В пруду плавало 10 капибар. 4 вышли на берег. Сколько осталось в воде?", answer: "6", hint: "Вычти из всех капибар тех, кто вышел" },
        { id: 4, question: "У капибары есть 12 орехов, которые она хочет разделить поровну между 4 детьми. Сколько орехов получит каждый?", answer: "3", hint: "Нужно разделить 12 на 4" }
      ]
    },
    geography: {
      id: "geography",
      name: "География капибар",
      description: "Изучение мест обитания капибар",
      teacherId: "petr",
      questions: [
        { id: 1, question: "Как называется самая большая река Южной Америки, где живут капибары?", answer: "амазонка", hint: "Самая полноводная река в мире" },
        { id: 2, question: "В какой стране живёт самая большая популяция капибар?", answer: "бразилия", hint: "Страна знаменита карнавалами и футболом" },
        { id: 3, question: "Капибары обитают в каких климатических зонах? (тропики, арктика, умеренный)", answer: "тропики", hint: "Зона с очень тёплым климатом" },
        { id: 4, question: "Как называется экосистема с высокими травами, где часто живут капибары?", answer: "саванна", hint: "Похожее название есть у американского города в штате Джорджия" }
      ]
    }
  };

  const handleAnswerChange = (id: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [id]: value }));
  };

  const calculateGrade = (percentage: number): Grade => {
    if (percentage >= 90) return 5;
    if (percentage >= 70) return 4;
    if (percentage >= 50) return 3;
    return 2;
  };

  const checkAnswers = () => {
    let correctAnswers = 0;
    const currentQuestions = lessons[currentLesson].questions;
    
    currentQuestions.forEach(q => {
      if (userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase()) {
        correctAnswers++;
      }
    });
    
    const newScore = (correctAnswers / currentQuestions.length) * 100;
    setScore(newScore);
    
    // Добавляем новую оценку
    const currentTeacher = teachers[lessons[currentLesson].teacherId];
    
    const newGrade: GradeRecord = {
      lesson: lessons[currentLesson].name,
      score: newScore,
      grade: calculateGrade(newScore),
      date: new Date().toLocaleDateString('ru-RU'),
      teacherName: currentTeacher.name
    };
    
    setGrades(prev => [newGrade, ...prev]);
    setShowResults(true);
  };

  const resetGame = () => {
    setUserAnswers({});
    setScore(0);
    setShowResults(false);
    setShowHint({});
  };

  const changeLesson = (lessonId: string) => {
    if (showResults || Object.keys(userAnswers).length > 0) {
      if (confirm('Вы действительно хотите сменить урок? Текущие ответы будут сброшены.')) {
        resetGame();
        setCurrentLesson(lessonId);
      }
    } else {
      setCurrentLesson(lessonId);
    }
  };

  const toggleHint = (id: number) => {
    setShowHint(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getResultMessage = () => {
    const currentTeacher = teachers[lessons[currentLesson].teacherId];
    
    if (score >= 90) return `${currentTeacher.name}: "Отлично! Ты настоящий знаток капибар!"`;
    if (score >= 70) return `${currentTeacher.name}: "Очень хорошо! Ты многое знаешь о капибарах!"`;
    if (score >= 50) return `${currentTeacher.name}: "Неплохо! Ты на пути к тому, чтобы стать экспертом!"`;
    if (score >= 30) return `${currentTeacher.name}: "Хорошее начало! Попробуй ещё раз!"`;
    return `${currentTeacher.name}: "Не расстраивайся! В следующий раз получится лучше!"`;
  };

  const getGradeEmoji = (grade: Grade) => {
    switch(grade) {
      case 5: return "🌟";
      case 4: return "✨";
      case 3: return "⭐";
      case 2: return "📚";
      default: return "";
    }
  };

  const currentQuestions = lessons[currentLesson].questions;
  const currentTeacher = teachers[lessons[currentLesson].teacherId];

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
            Проверь свои знания в разных предметах школы капибар!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs 
            defaultValue={currentLesson}
            onValueChange={changeLesson}
            className="mb-6"
          >
            <TabsList className="bg-amber-100 w-full">
              {Object.values(lessons).map(lesson => (
                <TabsTrigger 
                  key={lesson.id} 
                  value={lesson.id}
                  className="data-[state=active]:bg-amber-200"
                >
                  {lesson.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.values(lessons).map(lesson => {
              const teacher = teachers[lesson.teacherId];
              return (
                <TabsContent key={lesson.id} value={lesson.id}>
                  <div className="bg-amber-50 p-4 rounded-lg mb-6 flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-2 border-amber-300">
                      <AvatarFallback className="bg-amber-200 text-amber-800 text-xl">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-amber-900 font-bold text-lg">{teacher.name}</h3>
                      <p className="text-amber-700 text-sm mb-1">{teacher.role}</p>
                      <p className="text-amber-800 mb-2">{teacher.description}</p>
                      {teacher.quote && (
                        <blockquote className="border-l-2 border-amber-300 pl-3 italic text-amber-700">
                          "{teacher.quote}"
                        </blockquote>
                      )}
                    </div>
                  </div>
                  <p className="mb-4 text-amber-800">{lesson.description}</p>
                </TabsContent>
              );
            })}
          </Tabs>
          
          {showResults && (
            <Alert className={`mb-6 ${
              score >= 90 ? 'bg-green-50 border-green-200' : 
              score >= 70 ? 'bg-emerald-50 border-emerald-200' :
              score >= 50 ? 'bg-amber-50 border-amber-200' :
              'bg-red-50 border-red-200'
            }`}>
              <AlertTitle className={
                score >= 90 ? 'text-green-800' : 
                score >= 70 ? 'text-emerald-800' :
                score >= 50 ? 'text-amber-800' :
                'text-red-800'
              }>
                Твой результат: {score}% - Оценка: {calculateGrade(score)} {getGradeEmoji(calculateGrade(score))}
              </AlertTitle>
              <AlertDescription className={
                score >= 90 ? 'text-green-700' : 
                score >= 70 ? 'text-emerald-700' :
                score >= 50 ? 'text-amber-700' :
                'text-red-700'
              }>
                {getResultMessage()}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-6">
            {currentQuestions.map((q) => (
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
                  <p className="text-sm text-amber-600 italic mt-1">Подсказка от {currentTeacher.name}: {q.hint}</p>
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
      
      {grades.length > 0 && (
        <Card className="mb-6 border-2 border-amber-200">
          <CardHeader className="bg-amber-50">
            <CardTitle className="text-xl font-bold text-amber-800">Журнал оценок</CardTitle>
            <CardDescription className="text-amber-700">
              Твои результаты контрольных работ
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              {grades.map((grade, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                  <div>
                    <span className="font-medium text-amber-900">{grade.lesson}</span>
                    <span className="text-sm text-amber-600 ml-2">({grade.date})</span>
                    <div className="text-xs text-amber-600">Учитель: {grade.teacherName}</div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-amber-800 mr-2">{grade.score}%</span>
                    <Badge 
                      className={`
                        ${grade.grade === 5 ? 'bg-green-100 text-green-800 border-green-300' : 
                          grade.grade === 4 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 
                          grade.grade === 3 ? 'bg-amber-100 text-amber-800 border-amber-300' : 
                          'bg-red-100 text-red-800 border-red-300'}
                      `}
                    >
                      {grade.grade} {getGradeEmoji(grade.grade)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="text-center text-amber-700 text-sm">
        Изображение капибары © Школа Капибар, 2025
      </div>
    </div>
  );
};

export default CapybaraSchool;
