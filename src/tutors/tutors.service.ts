import { Injectable } from '@nestjs/common';
import { Tutor } from './TutorModel';

@Injectable()
export class TutorsService {
    private tutors: Tutor[] = [
        {
            id: 1,
            name: 'Анна Петрова',
            subject: 'Математика',
            description: 'Опытный преподаватель',
            price: 900,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 2,
            name: 'Алина Беренцева',
            subject: 'Физика',
            description:
                'Кандидат физико-математических наук. Индивидуальный подход к каждому ученику.',
            price: 2100,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 3,
            name: 'Елена Смирнова',
            subject: 'Английский язык',
            description:
                'Сертифицированный преподаватель IELTS и TOEFL. Разговорный английский.',
            price: 1800,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 4,
            name: 'Михаил Козлов',
            subject: 'Химия',
            description:
                'Преподаватель высшей категории. Подготовка к олимпиадам и экзаменам.',
            price: 1700,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },

        {
            id: 5,
            name: 'Михаил Козлов',
            subject: 'Химия',
            description:
                'Преподаватель высшей категории. Подготовка к олимпиадам и экзаменам.',
            price: 1700,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 6,
            name: 'Михаил Козлов',
            subject: 'Химия',
            description:
                'Преподаватель высшей категории. Подготовка к олимпиадам и экзаменам.',
            price: 1700,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 7,
            name: 'Михаил Козлов',
            subject: 'Химия',
            description:
                'Преподаватель высшей категории. Подготовка к олимпиадам и экзаменам.',
            price: 1700,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 8,
            name: 'Михаил Козлов',
            subject: 'Химия',
            description:
                'Преподаватель высшей категории. Подготовка к олимпиадам и экзаменам.',
            price: 1700,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
    ];

    getAllTutors(): Tutor[] {
        return this.tutors;
    }
}
