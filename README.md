### SkillBridge - сайт по поиску наставников и репетиторов
## https://skillbridge-b7qs.onrender.com
## M3302 - Яковенко Валерий

![DB](https://github.com/user-attachments/assets/15f14811-7140-4681-b005-b8b5f0ce871d)


(users)
Пользователи — это пользователи зарегистрированные в системе. У него могут быть разные роли: ученик/репетитор/админ.
Связь users c users - многие ко многим
Один пользователь может иметь несколько репетиторов (учеников)
Один репетитор может иметь несколько учеников

(tutor_cards)
Карточка репетитора содержит информацию о преподавателе, предметах, которые он ведет, и стоимости его услуг.
Связь tutors_card и users - один к одному
Пока предполагается, что один репетитор имеет одну карточку

(subject_category)
Предмет, который преподаёт репетитор
Связь subject_category и tutor_cards - многие ко многим
Репетитор может преподавать несколько предметов
Один предмет может преподовать несколько репетиторов

(assignments)
Задания создаются репетиторами и назначаются ученикам в рамках обучения.
Связь assigmenst с users - один ко многим
Одно задание принадлежит одному ученику
Ученик может иметь несколько заданий

(reviews)
Отзывы на репетиторов
Связь reviews с users - многие ко многим
Ученик может оставить несколько отзывов
Преподователь может иметь несколько отзывов


