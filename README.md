[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд Практическая работа №14

  В проектной работе реализован сервер на локальной машине, который создает и побключается к noSQL
базе данных   mestodb. В проекте описана логика обработки запросов пользователя и карточек.
Обработка ошибок осуществляется при помощи инструментов библиотеки mongoose а также библиотек joi и
celebrate.

## Инструменты и технологии

- Node.js
- mongoDB
- express.js
- mongoose

## Директории
`/routes` — папка с файлами роутера 
`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки 

  
Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта
`git clone git@github.com:Ekaterina149/express-mesto-gha.git` — клонировать проект из удаленного репозитория
`npm i` — установка зависимостей
`npm run dev` — запустить сервер в режиме разработчика с hot-reload (в браузере ввести ссылку http://localhost:3000/,
 где 3000 - рабочий порт)



`mongod` — запускает mongoDB
`npm install mongoose` — установка mongoose
`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

## Ссылка на репозиторий

[Проект можно посмотреть тут](https://github.com/Ekaterina149/express-mesto-gha)

