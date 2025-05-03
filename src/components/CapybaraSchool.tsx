
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  questions: Record<string, Question[]>; // ключ - id класса
  teacherId: string;
  minGrade: number;
  availableForClasses: string[]; // в каких классах доступен предмет
}

interface SchoolClass {
  id: string;
  name: string;
  description: string;
  level: number; // 1-4 младшие, 5-9 средние, 10-11 старшие
}

type Grade = 1 | 2 | 3 | 4 | 5;

interface GradeRecord {
  lesson: string;
  score: number;
  grade: Grade;
  date: string;
  teacherName: string;
  className: string;
}

const CapybaraSchool: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [currentLesson, setCurrentLesson] = useState<string>("biology");
  const [currentClass, setCurrentClass] = useState<string>("1");
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [availableLessons, setAvailableLessons] = useState<string[]>([]);

  // Классы в школе капибар
  const schoolClasses: SchoolClass[] = [
    // Младшие классы
    { id: "1", name: "1 класс", description: "Первый год обучения", level: 1 },
    { id: "2", name: "2 класс", description: "Второй год обучения", level: 2 },
    { id: "3", name: "3 класс", description: "Третий год обучения", level: 3 },
    { id: "4", name: "4 класс", description: "Четвертый год обучения", level: 4 },
    // Средние классы
    { id: "5", name: "5 класс", description: "Пятый год обучения", level: 5 },
    { id: "6", name: "6 класс", description: "Шестой год обучения", level: 6 },
    { id: "7", name: "7 класс", description: "Седьмой год обучения", level: 7 },
    { id: "8", name: "8 класс", description: "Восьмой год обучения", level: 8 },
    { id: "9", name: "9 класс", description: "Девятый год обучения", level: 9 },
    // Старшие классы
    { id: "10", name: "10 класс", description: "Десятый год обучения", level: 10 },
    { id: "11", name: "11 класс", description: "Выпускной класс", level: 11 },
  ];

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
    },
    stella: {
      id: "stella",
      name: "Стелла Звёздная",
      role: "Учитель астрономии",
      description: "Известный астроном, изучающий космос и поведение капибар под звёздным небом",
      quote: "Капибары, как и звёзды, часть великой вселенной. Познай её тайны!"
    },
    boris: {
      id: "boris",
      name: "Борис Литераторов",
      role: "Учитель литературы",
      description: "Знаток капибарьих сказаний и легенд, собиратель фольклора",
      quote: "В каждой истории о капибарах скрыта глубокая мудрость!"
    },
    anna: {
      id: "anna",
      name: "Анна Кисточкина",
      role: "Учитель рисования",
      description: "Художница, специализирующаяся на портретах капибар в различных стилях",
      quote: "Капибара — идеальная модель для изображения гармонии форм!"
    },
    vladimir: {
      id: "vladimir",
      name: "Владимир Физкультурник",
      role: "Учитель физкультуры",
      description: "Бывший тренер капибарьих гонок по воде, эксперт по активному образу жизни",
      quote: "Движение — это жизнь! Бери пример с капибар!"
    }
  };

  // Уроки-контрольные для школы капибар
  const lessons: Record<string, Lesson> = {
    biology: {
      id: "biology",
      name: "Биология капибар",
      description: "Знания о жизни капибар в природе",
      teacherId: "ibragim",
      minGrade: 2,
      availableForClasses: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
      questions: {
        "1": [
          { id: 1, question: "Как называется группа капибар?", answer: "стадо", hint: "Так же называют группу коров или лошадей" },
          { id: 2, question: "Сколько детёнышей обычно рождается у капибары?", answer: "4", hint: "Это число между 3 и 5" },
          { id: 3, question: "В какой части света обитают капибары?", answer: "южная америка", hint: "Континент, где находится Бразилия" },
          { id: 4, question: "Капибары умеют хорошо...", answer: "плавать", hint: "Они проводят много времени в воде" }
        ],
        "5": [
          { id: 1, question: "Какое место капибара занимает среди грызунов по размеру?", answer: "первое", hint: "Капибара - самый крупный представитель своего отряда" },
          { id: 2, question: "Какой орган чувств у капибар очень хорошо развит?", answer: "обоняние", hint: "Этот орган позволяет различать запахи" },
          { id: 3, question: "Какую особенность имеет глазное строение капибар?", answer: "выпуклые глаза", hint: "Это помогает им видеть, когда они плавают в воде" },
          { id: 4, question: "Как называется научный термин для процесса переваривания растительной пищи у капибар?", answer: "ферментация", hint: "Этот же процесс происходит при брожении" }
        ],
        "10": [
          { id: 1, question: "Назовите латинское научное название капибары:", answer: "hydrochoerus hydrochaeris", hint: "Название связано с водой и свиньями" },
          { id: 2, question: "Какая адаптация помогает капибарам избегать хищников в воде?", answer: "ноздри и глаза на верхней части головы", hint: "Это позволяет дышать и видеть, оставаясь почти полностью под водой" },
          { id: 3, question: "Какое биологическое явление объясняет, почему капибары могут мирно сосуществовать с другими видами?", answer: "симбиоз", hint: "Это отношения между разными видами с взаимной выгодой" },
          { id: 4, question: "Опишите механизм терморегуляции у капибар в жаркую погоду:", answer: "погружение в воду", hint: "Они используют водную среду для охлаждения тела" }
        ]
      }
    },
    math: {
      id: "math",
      name: "Математика капибар",
      description: "Решение задач про капибар и их еду",
      teacherId: "maria",
      minGrade: 2,
      availableForClasses: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
      questions: {
        "1": [
          { id: 1, question: "Если у капибары 8 яблок, и она отдала другим 3, сколько яблок осталось?", answer: "5", hint: "Нужно вычесть 3 из 8" },
          { id: 2, question: "Капибара съедает 2 кг травы за день. Сколько кг травы нужно на 3 дня?", answer: "6", hint: "Умножь 2 на 3" },
          { id: 3, question: "В пруду плавало 10 капибар. 4 вышли на берег. Сколько осталось в воде?", answer: "6", hint: "Вычти из всех капибар тех, кто вышел" },
          { id: 4, question: "У капибары есть 12 орехов, которые она хочет разделить поровну между 4 детьми. Сколько орехов получит каждый?", answer: "3", hint: "Нужно разделить 12 на 4" }
        ],
        "5": [
          { id: 1, question: "В стаде 35 капибар, 40% из них - детёныши. Сколько детёнышей в стаде?", answer: "14", hint: "Надо найти 40% от 35" },
          { id: 2, question: "Капибара плывёт по реке со скоростью 5 км/ч в течение 3 часов. Какое расстояние она проплывёт?", answer: "15", hint: "Умножь скорость на время" },
          { id: 3, question: "В первый день капибара съела 3 кг травы, а во второй - на 30% больше. Сколько травы съела капибара во второй день?", answer: "3.9", hint: "Найди 130% от 3 кг" },
          { id: 4, question: "Периметр квадратного вольера для капибар равен 40 метров. Какова площадь вольера?", answer: "100", hint: "Сначала найди длину стороны квадрата, а затем его площадь" }
        ],
        "10": [
          { id: 1, question: "Популяция капибар увеличивается на 12% каждый год. Во сколько раз увеличится численность за 3 года?", answer: "1.4", hint: "Используй формулу сложных процентов (1.12)^3" },
          { id: 2, question: "Капибара движется по параболической траектории, заданной уравнением y = x² - 4x + 3. В какой точке траектория достигает минимума?", answer: "2", hint: "Найди производную и приравняй к нулю" },
          { id: 3, question: "Стадо капибар состоит из 80 особей. Вероятность того, что случайно выбранная капибара - самец, равна 0.35. Какова вероятность, что среди 15 случайно выбранных капибар будет ровно 5 самцов?", answer: "0.23", hint: "Используй биномиальное распределение" },
          { id: 4, question: "Средний вес взрослой капибары составляет 50 кг с стандартным отклонением 5 кг. Если вес распределен нормально, какова вероятность, что случайно выбранная капибара будет весить более 60 кг?", answer: "0.02", hint: "Используй свойства нормального распределения и Z-score" }
        ]
      }
    },
    geography: {
      id: "geography",
      name: "География капибар",
      description: "Изучение мест обитания капибар",
      teacherId: "petr",
      minGrade: 2,
      availableForClasses: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
      questions: {
        "1": [
          { id: 1, question: "Как называется самая большая река Южной Америки, где живут капибары?", answer: "амазонка", hint: "Самая полноводная река в мире" },
          { id: 2, question: "В какой стране живёт самая большая популяция капибар?", answer: "бразилия", hint: "Страна знаменита карнавалами и футболом" },
          { id: 3, question: "Капибары обитают в каких климатических зонах? (тропики, арктика, умеренный)", answer: "тропики", hint: "Зона с очень тёплым климатом" },
          { id: 4, question: "Как называется экосистема с высокими травами, где часто живут капибары?", answer: "саванна", hint: "Похожее название есть у американского города в штате Джорджия" }
        ],
        "5": [
          { id: 1, question: "Назовите три страны Южной Америки, где обитают капибары (через запятую):", answer: "бразилия, колумбия, венесуэла", hint: "Это крупные страны в северной части континента" },
          { id: 2, question: "Какой географический барьер ограничивает распространение капибар на юг Южной Америки?", answer: "анды", hint: "Это горная система" },
          { id: 3, question: "Капибары предпочитают селиться рядом с каким типом природного объекта?", answer: "водоем", hint: "Они полуводные млекопитающие" },
          { id: 4, question: "Какой биом характерен для основных мест обитания капибар?", answer: "влажные тропические леса", hint: "Этот биом отличается высокой влажностью и разнообразием растений" }
        ],
        "10": [
          { id: 1, question: "Какое влияние оказало изменение русла реки Амазонки на генетическое разнообразие популяций капибар? (кратко)", answer: "изоляция популяций", hint: "Когда популяции не могут контактировать, происходит..." },
          { id: 2, question: "Опишите зависимость между сезонными колебаниями уровня воды в реках Пантанала и миграцией капибар:", answer: "миграция к высоким участкам в сезон дождей", hint: "В период наводнений капибары..." },
          { id: 3, question: "Какой географический фактор определяет северную границу ареала капибар?", answer: "температура", hint: "Капибары чувствительны к холодному климату" },
          { id: 4, question: "Какое антропогенное воздействие наиболее негативно влияет на ареал обитания капибар в современной Южной Америке?", answer: "вырубка лесов", hint: "Этот процесс уничтожает естественную среду обитания" }
        ]
      }
    },
    literature: {
      id: "literature",
      name: "Литература",
      description: "Изучение литературных произведений и стихов о капибарах",
      teacherId: "boris",
      minGrade: 2,
      availableForClasses: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
      questions: {
        "2": [
          { id: 1, question: "Кто написал детскую сказку 'Капибара и её друзья'?", answer: "капитошка", hint: "Вымышленный автор детских сказок про животных" },
          { id: 2, question: "Как зовут главного героя сказки 'Приключения на реке'?", answer: "бобби", hint: "Имя капибары-путешественника" },
          { id: 3, question: "Какое дерево помогло капибаре в сказке 'Лесные истории'?", answer: "дуб", hint: "Это крепкое дерево с желудями" },
          { id: 4, question: "Сколько друзей было у капибары в стихотворении 'Весёлая компания'?", answer: "7", hint: "Это счастливое число" }
        ],
        "6": [
          { id: 1, question: "Кто автор поэмы 'Капибары среди лилий'?", answer: "мария лесная", hint: "Вымышленный поэт, писавший о природе" },
          { id: 2, question: "В какой легенде капибара спасла деревню от наводнения?", answer: "легенда о мудрой капибаре", hint: "Легенда о животном, предупредившем людей" },
          { id: 3, question: "Каким литературным приёмом часто описывают капибар в поэзии?", answer: "метафора", hint: "Скрытое сравнение без слов 'как' или 'словно'" },
          { id: 4, question: "Какой жанр представляет произведение 'Дневник капибары'?", answer: "автобиография", hint: "Повествование от первого лица о собственной жизни" }
        ],
        "10": [
          { id: 1, question: "Проанализируйте символическое значение капибары в романе 'Время мудрости': (кратко)", answer: "символ гармонии с природой", hint: "В романе капибара олицетворяет связь между человеком и..." },
          { id: 2, question: "В каком литературном направлении создано большинство произведений о капибарах в XX веке?", answer: "магический реализм", hint: "Направление, смешивающее реальность и фантастику, популярное в Латинской Америке" },
          { id: 3, question: "Какой конфликт лежит в основе драмы 'Капибара и город'?", answer: "природа против цивилизации", hint: "Противостояние естественного мира и технологий" },
          { id: 4, question: "Какую литературную премию получил роман 'Реки памяти' о путешествии капибар?", answer: "золотая капибара", hint: "Вымышленная престижная награда за произведения о природе" }
        ]
      }
    },
    art: {
      id: "art",
      name: "Рисование",
      description: "Изучение основ изобразительного искусства на примере капибар",
      teacherId: "anna",
      minGrade: 2,
      availableForClasses: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      questions: {
        "1": [
          { id: 1, question: "Какой цвет шерсти обычно у капибар?", answer: "коричневый", hint: "Цвет похож на шоколад" },
          { id: 2, question: "Сколько лап у капибары?", answer: "4", hint: "Как у собаки или кошки" },
          { id: 3, question: "Какой формы уши у капибары?", answer: "круглые", hint: "Форма похожа на простую геометрическую фигуру" },
          { id: 4, question: "Капибары живут рядом с чем? (что нужно рисовать рядом с капибарой)", answer: "вода", hint: "Они любят плавать и нырять" }
        ],
        "5": [
          { id: 1, question: "Какая техника рисования лучше подходит для изображения шерсти капибары?", answer: "штриховка", hint: "Техника с использованием множества линий" },
          { id: 2, question: "Какое правило композиции важно при рисовании капибары в движении?", answer: "правило третей", hint: "Деление кадра на три части по горизонтали и вертикали" },
          { id: 3, question: "Какие цвета составляют триаду для создания гармоничного фона рисунка с капибарой?", answer: "зеленый, синий, коричневый", hint: "Цвета природы, воды и самой капибары" },
          { id: 4, question: "Какой приём используется для передачи фактуры мокрой шерсти капибары?", answer: "лессировка", hint: "Нанесение прозрачных слоёв краски" }
        ],
        "9": [
          { id: 1, question: "Какой художественный стиль лучше использовать для подчёркивания социальной природы капибар?", answer: "импрессионизм", hint: "Стиль, передающий впечатления и мимолётные моменты" },
          { id: 2, question: "Какой тип перспективы наиболее эффективен при изображении стада капибар?", answer: "воздушная перспектива", hint: "Передаёт глубину через постепенное снижение чёткости" },
          { id: 3, question: "Какое соотношение золотого сечения определяет идеальные пропорции в рисунке капибары?", answer: "1.618", hint: "Математическая константа, часто используемая в искусстве" },
          { id: 4, question: "Какую символическую функцию выполняет капибара в современном экологическом искусстве?", answer: "символ биоразнообразия", hint: "Представляет важность сохранения разных видов" }
        ]
      }
    },
    pe: {
      id: "pe",
      name: "Физкультура",
      description: "Физические упражнения и спортивные игры капибар",
      teacherId: "vladimir",
      minGrade: 2,
      availableForClasses: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
      questions: {
        "1": [
          { id: 1, question: "Как долго капибара может находиться под водой?", answer: "5 минут", hint: "Немного дольше, чем человек" },
          { id: 2, question: "Какой вид движения предпочитают капибары для перемещения в воде?", answer: "плавание", hint: "Это не бег и не прыжки" },
          { id: 3, question: "Сколько км/ч может развить капибара при беге?", answer: "35", hint: "Быстрее человека, но медленнее гепарда" },
          { id: 4, question: "Какое упражнение полезно для капибар, живущих в зоопарке?", answer: "плавание", hint: "Естественное для них движение" }
        ],
        "5": [
          { id: 1, question: "Какие мышцы наиболее развиты у капибар?", answer: "задние конечности", hint: "Эти мышцы помогают им отталкиваться в воде" },
          { id: 2, question: "Какой тип физической активности необходим молодым капибарам для здорового развития?", answer: "игры с сородичами", hint: "Социальное взаимодействие с элементами физической активности" },
          { id: 3, question: "Какая особенность строения делает капибар хорошими пловцами?", answer: "перепончатые лапы", hint: "Такая же особенность есть у уток" },
          { id: 4, question: "Какой режим активности и отдыха характерен для капибар в природе?", answer: "активность на рассвете и закате", hint: "Они избегают активности в самое жаркое время дня" }
        ],
        "10": [
          { id: 1, question: "Какие биомеханические принципы объясняют эффективность плавания капибар?", answer: "гидродинамическое сопротивление", hint: "Связано с особой формой тела при движении в воде" },
          { id: 2, question: "Какие адаптивные физические особенности развились у капибар для жизни в полуводной среде?", answer: "высокое расположение глаз и ноздрей", hint: "Позволяет наблюдать и дышать, оставаясь в воде" },
          { id: 3, question: "Рассчитайте оптимальный калораж суточного рациона для капибары весом 50 кг с учетом её физической активности:", answer: "около 3000 калорий", hint: "Примерно как у активного взрослого человека" },
          { id: 4, question: "Какая система кардиотренировок моделирует естественные паттерны движения капибар?", answer: "интервальные тренировки", hint: "Чередование периодов высокой и низкой активности" }
        ]
      }
    },
    astronomy: {
      id: "astronomy",
      name: "Астрономия",
      description: "Изучение звёзд, планет и космоса глазами капибар",
      teacherId: "stella",
      minGrade: 2,
      availableForClasses: ["5", "6", "7", "8", "9", "10", "11"],
      questions: {
        "5": [
          { id: 1, question: "Как называется созвездие, в котором древние индейцы видели капибару?", answer: "капибарус", hint: "Вымышленное созвездие, названное в честь животного" },
          { id: 2, question: "Сколько планет в Солнечной системе?", answer: "8", hint: "Плутон с 2006 года не считается планетой" },
          { id: 3, question: "Что изучает наука астрономия?", answer: "космические объекты", hint: "Звёзды, планеты, галактики и другие небесные тела" },
          { id: 4, question: "Какая планета самая большая в Солнечной системе?", answer: "юпитер", hint: "Газовый гигант с большим красным пятном" }
        ],
        "8": [
          { id: 1, question: "Какое явление в древних мифах капибар ассоциировалось с затмением Солнца?", answer: "великая капибара", hint: "Миф о гигантском животном, закрывающем Солнце" },
          { id: 2, question: "Какой тип звезды наше Солнце?", answer: "желтый карлик", hint: "Средняя по размеру звезда определенного цвета" },
          { id: 3, question: "Как называется ближайшая к Солнцу звезда?", answer: "проксима центавра", hint: "Находится в созвездии Центавра" },
          { id: 4, question: "Какое космическое явление можно использовать для измерения больших расстояний во Вселенной?", answer: "сверхновые", hint: "Взрывы звезд, которые имеют определенную яркость" }
        ],
        "11": [
          { id: 1, question: "В чем заключается наблюдательное доказательство расширения Вселенной?", answer: "красное смещение", hint: "Изменение длины волны излучения удаляющихся галактик" },
          { id: 2, question: "Какую фундаментальную силу современная астрофизика не может объединить с квантовой теорией поля?", answer: "гравитация", hint: "Сила, описываемая общей теорией относительности" },
          { id: 3, question: "Какое явление могли бы использовать капибары для межзвездных путешествий согласно современным теориям физики?", answer: "кротовые норы", hint: "Гипотетические туннели в пространстве-времени" },
          { id: 4, question: "Какой параметр определяет, сможет ли экзопланета поддерживать жизнь капибар?", answer: "наличие жидкой воды", hint: "Самый важный фактор для возникновения жизни" }
        ]
      }
    }
  };

  // Обновляем список доступных уроков при смене класса
  useEffect(() => {
    const availableLessonIds = Object.keys(lessons).filter(lessonId => {
      // Проверяем, доступен ли урок для текущего класса
      return lessons[lessonId].availableForClasses.includes(currentClass) &&
             // И есть ли вопросы для этого класса
             lessons[lessonId].questions[currentClass];
    });
    
    setAvailableLessons(availableLessonIds);
    
    // Если текущий урок недоступен, выбираем первый доступный
    if (availableLessonIds.length > 0 && !availableLessonIds.includes(currentLesson)) {
      setCurrentLesson(availableLessonIds[0]);
    }
  }, [currentClass]);

  const handleAnswerChange = (id: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [id]: value }));
  };

  const calculateGrade = (percentage: number): Grade => {
    // В старших классах (10-11) можно получить "кол" (1)
    const currentClassObj = schoolClasses.find(c => c.id === currentClass);
    const isHighClass = currentClassObj && currentClassObj.level >= 10;
    
    if (percentage >= 90) return 5;
    if (percentage >= 70) return 4;
    if (percentage >= 50) return 3;
    if (percentage >= 30) return 2;
    return isHighClass ? 1 : 2; // "кол" только для старших классов
  };

  const checkAnswers = () => {
    let correctAnswers = 0;
    const currentQuestions = lessons[currentLesson].questions[currentClass] || [];
    
    currentQuestions.forEach(q => {
      if (userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase()) {
        correctAnswers++;
      }
    });
    
    const newScore = currentQuestions.length > 0 ? (correctAnswers / currentQuestions.length) * 100 : 0;
    setScore(newScore);
    
    // Добавляем новую оценку
    const currentTeacher = teachers[lessons[currentLesson].teacherId];
    const currentClassName = schoolClasses.find(c => c.id === currentClass)?.name || "";
    
    const newGrade: GradeRecord = {
      lesson: lessons[currentLesson].name,
      score: newScore,
      grade: calculateGrade(newScore),
      date: new Date().toLocaleDateString('ru-RU'),
      teacherName: currentTeacher.name,
      className: currentClassName
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
  
  const changeClass = (classId: string) => {
    if (showResults || Object.keys(userAnswers).length > 0) {
      if (confirm('Вы действительно хотите сменить класс? Текущие ответы будут сброшены.')) {
        resetGame();
        setCurrentClass(classId);
      }
    } else {
      setCurrentClass(classId);
    }
  };

  const toggleHint = (id: number) => {
    setShowHint(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getResultMessage = () => {
    const currentTeacher = teachers[lessons[currentLesson].teacherId];
    const grade = calculateGrade(score);
    
    if (grade === 5) return `${currentTeacher.name}: "Отлично! Ты настоящий знаток капибар!"`;
    if (grade === 4) return `${currentTeacher.name}: "Очень хорошо! Ты многое знаешь о капибарах!"`;
    if (grade === 3) return `${currentTeacher.name}: "Неплохо! Ты на пути к тому, чтобы стать экспертом!"`;
    if (grade === 2) return `${currentTeacher.name}: "Хорошее начало! Попробуй ещё раз!"`;
    return `${currentTeacher.name}: "Кол! Придётся остаться после уроков на дополнительные занятия!"`;
  };

  const getGradeEmoji = (grade: Grade) => {
    switch(grade) {
      case 5: return "🌟";
      case 4: return "✨";
      case 3: return "⭐";
      case 2: return "📚";
      case 1: return "😢";
      default: return "";
    }
  };

  const currentQuestions = lessons[currentLesson]?.questions[currentClass] || [];
  const currentTeacher = teachers[lessons[currentLesson]?.teacherId];
  const currentClassObj = schoolClasses.find(c => c.id === currentClass);
  
  // Определяем категорию класса
  const getClassCategory = (level: number): string => {
    if (level >= 10) return "Старшие классы";
    if (level >= 5) return "Средние классы";
    return "Младшие классы";
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6 border-2 border-amber-200">
        <CardHeader className="bg-amber-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-amber-800">Школа Капибар</CardTitle>
            <Badge variant="outline" className="bg-amber-100 text-amber-800">
              {currentClassObj?.name || "1 класс"}
            </Badge>
          </div>
          <CardDescription className="text-amber-700">
            Проверь свои знания в разных предметах школы капибар!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Выбор класса */}
          <div className="mb-6">
            <h3 className="text-amber-800 font-medium mb-2">Выбери свой класс:</h3>
            <Select value={currentClass} onValueChange={changeClass}>
              <SelectTrigger className="border-amber-200 focus:border-amber-400">
                <SelectValue placeholder="Выбери класс" />
              </SelectTrigger>
              <SelectContent>
                {/* Группируем классы по категориям */}
                <div className="font-semibold text-amber-700 px-2 py-1">Младшие классы</div>
                {schoolClasses.filter(c => c.level <= 4).map(schoolClass => (
                  <SelectItem key={schoolClass.id} value={schoolClass.id}>
                    {schoolClass.name}
                  </SelectItem>
                ))}
                
                <div className="font-semibold text-amber-700 px-2 py-1 mt-2">Средние классы</div>
                {schoolClasses.filter(c => c.level >= 5 && c.level <= 9).map(schoolClass => (
                  <SelectItem key={schoolClass.id} value={schoolClass.id}>
                    {schoolClass.name}
                  </SelectItem>
                ))}
                
                <div className="font-semibold text-amber-700 px-2 py-1 mt-2">Старшие классы</div>
                {schoolClasses.filter(c => c.level >= 10).map(schoolClass => (
                  <SelectItem key={schoolClass.id} value={schoolClass.id}>
                    {schoolClass.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {currentClassObj && (
              <div className="mt-2 text-sm text-amber-700">
                {currentClassObj.description} • {getClassCategory(currentClassObj.level)}
                {currentClassObj.level >= 10 && (
                  <div className="mt-1 text-xs text-red-500 font-medium">
                    В старших классах можно получить оценку "кол" (1)!
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Выбор урока */}
          <Tabs 
            defaultValue={currentLesson}
            onValueChange={changeLesson}
            className="mb-6"
          >
            <TabsList className="bg-amber-100 w-full flex flex-wrap">
              {availableLessons.map(lessonId => (
                <TabsTrigger 
                  key={lessonId} 
                  value={lessonId}
                  className="data-[state=active]:bg-amber-200"
                >
                  {lessons[lessonId].name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {availableLessons.map(lessonId => {
              const lesson = lessons[lessonId];
              const teacher = teachers[lesson.teacherId];
              return (
                <TabsContent key={lessonId} value={lessonId}>
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
              score >= 30 ? 'bg-red-50 border-red-200' :
              'bg-red-100 border-red-300'
            }`}>
              <AlertTitle className={
                score >= 90 ? 'text-green-800' : 
                score >= 70 ? 'text-emerald-800' :
                score >= 50 ? 'text-amber-800' :
                score >= 30 ? 'text-red-800' :
                'text-red-900'
              }>
                Твой результат: {score}% - Оценка: {calculateGrade(score)} {getGradeEmoji(calculateGrade(score))}
              </AlertTitle>
              <AlertDescription className={
                score >= 90 ? 'text-green-700' : 
                score >= 70 ? 'text-emerald-700' :
                score >= 50 ? 'text-amber-700' :
                score >= 30 ? 'text-red-700' :
                'text-red-800'
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

            {currentQuestions.length === 0 && (
              <div className="text-center p-8 border border-dashed border-amber-300 rounded-lg">
                <p className="text-amber-800 mb-2">Для этого класса пока нет вопросов по предмету "{lessons[currentLesson]?.name}"</p>
                <p className="text-amber-600 text-sm">Попробуйте выбрать другой класс или предмет</p>
              </div>
            )}
          </div>
        </CardContent>
        
        <Separator className="bg-amber-100" />
        
        <CardFooter className="pt-4 flex justify-between">
          {!showResults ? (
            <Button 
              onClick={checkAnswers}
              className="bg-amber-500 hover:bg-amber-600 text-white"
              disabled={currentQuestions.length === 0}
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
                    <div className="text-xs text-amber-600">
                      Учитель: {grade.teacherName} • Класс: {grade.className}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-amber-800 mr-2">{grade.score}%</span>
                    <Badge 
                      className={`
                        ${grade.grade === 5 ? 'bg-green-100 text-green-800 border-green-300' : 
                          grade.grade === 4 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 
                          grade.grade === 3 ? 'bg-amber-100 text-amber-800 border-amber-300' : 
                          grade.grade === 2 ? 'bg-red-100 text-red-800 border-red-300' :
                          'bg-red-200 text-red-900 border-red-400'}
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
