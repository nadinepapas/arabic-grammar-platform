// Complete Lebanese Curriculum Content Database
const database = {
    users: [
        {
            id: 1,
            username: 'ahmad',
            password: 'ahmad123',
            name: 'أحمد محمد',
            email: 'ahmad@example.com',
            level: 1,
            progress: 0,
            active: true,
            role: 'student',
            createdAt: new Date('2024-01-15')
        },
        {
            id: 2,
            username: 'fatima',
            password: 'fatima123',
            name: 'فاطمة علي',
            email: 'fatima@example.com',
            level: 2,
            progress: 0,
            active: true,
            role: 'student',
            createdAt: new Date('2024-01-20')
        },
        {
            id: 3,
            username: 'sara',
            password: 'sara123',
            name: 'سارة خالد',
            email: 'sara@example.com',
            level: 3,
            progress: 0,
            active: true,
            role: 'student',
            createdAt: new Date('2024-01-25')
        },
        {
            id: 4,
            username: 'admin',
            password: 'admin123',
            name: 'المدير العام',
            email: 'admin@school.com',
            level: null,
            progress: null,
            active: true,
            role: 'admin',
            createdAt: new Date('2024-01-01')
        }
    ],
    
    levels: [
        {
            id: 1,
            name: 'الصف الأول والثاني',
            description: 'المفاهيم الأساسية والبسيطة',
            difficulty: 'easy',
            totalChapters: 8,
            icon: '🎯'
        },
        {
            id: 2,
            name: 'الصف الثالث',
            description: 'بداية تعلم القواعد بشكل رسمي',
            difficulty: 'medium',
            totalChapters: 12,
            icon: '⭐'
        },
        {
            id: 3,
            name: 'الصف الرابع - السادس',
            description: 'القواعد المتقدمة والإعراب',
            difficulty: 'hard',
            totalChapters: 20,
            icon: '🏆'
        }
    ],
    
    chapters: [
        {
            id: 1,
            levelId: 1,
            title: 'تركيب الجملة',
            lessonContent: `
                <h3>ما هي الجملة؟</h3>
                <p>الجملة هي كلام مفيد يُفهم منه معنى تام.</p>
                <div class="example-box">
                    <strong>أمثلة:</strong><br>
                    ✓ القطة تلعب.<br>
                    ✓ محمد يدرس.<br>
                    ✓ الشمس ساطعة.
                </div>
                <h3>أجزاء الجملة:</h3>
                <ul>
                    <li><strong>المبتدأ:</strong> من نتحدث عنه</li>
                    <li><strong>الخبر:</strong> ما نقوله عن المبتدأ</li>
                </ul>
            `,
            exercises: [
                {
                    question: 'أي من هذه الجمل صحيحة؟',
                    options: ['الولد يلعب', 'يلعب الولد في', 'في الحديقة', 'الولد والكرة'],
                    correct: 0
                },
                {
                    question: 'ما هو المبتدأ في جملة: "الطائر يطير"؟',
                    options: ['يطير', 'الطائر', 'الطائر يطير', 'لا شيء'],
                    correct: 1
                },
                {
                    question: 'ما هو الخبر في جملة: "السماء صافية"؟',
                    options: ['السماء', 'صافية', 'السماء صافية', 'لا يوجد'],
                    correct: 1
                }
            ],
            enabled: true
        },
        {
            id: 2,
            levelId: 1,
            title: 'المذكر والمؤنث',
            lessonContent: `
                <h3>المذكر والمؤنث</h3>
                <p>الأسماء في اللغة العربية نوعان: مذكر ومؤنث</p>
                <div class="example-box">
                    <strong>المذكر:</strong> ولد، أب، معلم<br>
                    <strong>المؤنث:</strong> بنت، أم، معلمة
                </div>
                <h3>علامات التأنيث:</h3>
                <ul>
                    <li>التاء المربوطة (ة): معلمة، شجرة</li>
                    <li>الألف المقصورة (ى): سلمى، ليلى</li>
                    <li>الألف الممدودة (اء): صحراء، سماء</li>
                </ul>
            `,
            exercises: [
                {
                    question: 'أي من الكلمات التالية مؤنثة؟',
                    options: ['كتاب', 'قلم', 'مدرسة', 'باب'],
                    correct: 2
                },
                {
                    question: 'ما هي علامة التأنيث في كلمة "فاطمة"؟',
                    options: ['الألف الممدودة', 'التاء المربوطة', 'الألف المقصورة', 'لا توجد'],
                    correct: 1
                }
            ],
            enabled: true
        },
        {
            id: 3,
            levelId: 2,
            title: 'أنواع الجمل',
            lessonContent: `
                <h3>الجملة الاسمية والفعلية</h3>
                <div class="example-box">
                    <strong>الجملة الاسمية:</strong> تبدأ باسم<br>
                    • الطالب مجتهد<br><br>
                    <strong>الجملة الفعلية:</strong> تبدأ بفعل<br>
                    • يدرس الطالب
                </div>
            `,
            exercises: [
                {
                    question: 'ما نوع الجملة: "يلعب الأطفال"؟',
                    options: ['جملة اسمية', 'جملة فعلية', 'ليست جملة', 'لا أعرف'],
                    correct: 1
                },
                {
                    question: 'ما نوع الجملة: "الشمس مشرقة"؟',
                    options: ['جملة فعلية', 'جملة اسمية', 'ليست جملة', 'لا أعرف'],
                    correct: 1
                }
            ],
            enabled: true
        },
        {
            id: 4,
            levelId: 2,
            title: 'المفرد والمثنى والجمع',
            lessonContent: `
                <h3>العدد في اللغة العربية</h3>
                <div class="example-box">
                    <strong>المفرد:</strong> كتاب، معلم<br>
                    <strong>المثنى:</strong> كتابان، معلمان<br>
                    <strong>الجمع:</strong> كتب، معلمون
                </div>
            `,
            exercises: [
                {
                    question: 'ما هو مثنى كلمة "طالب"؟',
                    options: ['طلاب', 'طالبان', 'طالبين', 'طالبون'],
                    correct: 1
                }
            ],
            enabled: true
        },
        {
            id: 5,
            levelId: 3,
            title: 'مقدمة في الإعراب',
            lessonContent: `
                <h3>ما هو الإعراب؟</h3>
                <p>الإعراب هو تغيير آخر الكلمة حسب موقعها في الجملة.</p>
                <div class="example-box">
                    • جاء <u>الطالبُ</u> → مرفوع بالضمة<br>
                    • رأيت <u>الطالبَ</u> → منصوب بالفتحة<br>
                    • سلّمت على <u>الطالبِ</u> → مجرور بالكسرة
                </div>
            `,
            exercises: [
                {
                    question: 'ما إعراب "المعلم" في: "جاء المعلم"؟',
                    options: ['منصوب', 'مرفوع', 'مجرور', 'مبني'],
                    correct: 1
                }
            ],
            enabled: true
        },
        {
            id: 6,
            levelId: 3,
            title: 'أنواع الفعل',
            lessonContent: `
                <h3>الفعل الماضي والمضارع والأمر</h3>
                <div class="example-box">
                    <strong>الماضي:</strong> كتبَ، لعبَ<br>
                    <strong>المضارع:</strong> يكتبُ، يلعبُ<br>
                    <strong>الأمر:</strong> اكتبْ، العبْ
                </div>
            `,
            exercises: [
                {
                    question: 'ما نوع الفعل في: "سافر أحمد"؟',
                    options: ['فعل مضارع', 'فعل ماضٍ', 'فعل أمر', 'ليس فعلاً'],
                    correct: 1
                }
            ],
            enabled: true
        }
    ],
    
    userProgress: [],
    activities: [],
    settings: {
        platformName: 'مغامرة القواعد',
        adminEmail: 'admin@arabicgrammar.com',
        maxAttempts: 3,
        passThreshold: 70,
        autoRegistration: false
    }
};

module.exports = database;
