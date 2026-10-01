# Отчёт по практической работе
## Тема: «Инициализация локального репозитория, операции индексации, коммитов и синхронизация с удалённым репозиторием GitHub»

**Выполнил:** Студент Илья (GitHub: [IlyaKhar](https://github.com/IlyaKhar))  
**Ссылка на удалённый репозиторий:** [https://github.com/IlyaKhar/git-practice](https://github.com/IlyaKhar/git-practice)  
**Ссылка на работающий проект (GitHub Pages):** [https://ilyakhar.github.io/git-practice/](https://ilyakhar.github.io/git-practice/)  

---

## 1. Цель работы
1. Освоить базовые команды распределённой системы контроля версий Git.
2. Изучить жизненный цикл файлов в Git: неотслеживаемые (Untracked), подготовленные к коммиту/индексированные (Staged) и зафиксированные (Committed).
3. Научиться формировать понятную и атомарную историю коммитов.
4. Настроить интеграцию локального репозитория с облачным хостингом GitHub через протокол HTTPS.
5. Разработать демонстрационный интерактивный веб-проект (страница с тёмной темой, анимированным котиком, скролл-эффектом и интерактивным сердцем с просьбой отличной оценки).

---

## 2. Последовательность выполнения работы (Ход работы)

### Шаг 1. Глобальная конфигурация пользователя Git
Перед началом работы необходимо идентифицировать автора коммитов (имя и контактный email), а также задать стандартную ветку:
```bash
git config --global user.name "IlyaKhar"
git config --global user.email "ilyuha1712@gmail.com"
git config --global init.defaultBranch main
git config --global credential.helper osxkeychain
```
*Результат:* Параметры записаны в глобальный файл конфигурации `~/.gitconfig`.

---

### Шаг 2. Инициализация локального репозитория
Переход в рабочую директорию проекта и выполнение инициализации:
```bash
git init
```
**Вывод терминала:**
```text
Initialized empty Git repository in /Users/maloy/Desktop/практика09.01/.git/
```
*Результат:* Создана скрытая служебная папка `.git`, в которой хранятся база объектов, дерево изменений и конфигурация локального репозитория.

---

### Шаг 3. Добавление файлов описания и исключений
Созданы файлы `README.md` (документация проекта) и `.gitignore` (список файлов и директорий, исключаемых из версионирования).

Проверка статуса:
```bash
git status
```
**Вывод терминала:**
```text
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.gitignore
	README.md

nothing added to commit but untracked files present (use "git add" to track)
```

---

### Шаг 4. Индексация и создание первого коммита (Initial commit)
Файлы перемещаются в область подготовки (Staging Area), после чего фиксируются в репозитории:
```bash
git add .gitignore README.md
git commit -m "chore: initial commit with README and gitignore"
```
**Вывод терминала:**
```text
[main (root-commit) 9c000c3] chore: initial commit with README and gitignore
 2 files changed, 27 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 README.md
```

---

### Шаг 5. Разработка веб-страницы и второй коммит
Создана разметка страницы `index.html` и стили оформления `style.css` (тёмный неоновый фон, анимированный SVG-котик, блоки скролла).

Проверка статуса и добавление:
```bash
git status
git add index.html style.css
git commit -m "feat: add markup and visual styling for cat and scroll animation"
```
**Вывод терминала:**
```text
[main 800ff59] feat: add markup and visual styling for cat and scroll animation
 2 files changed, 790 insertions(+)
 create mode 100644 index.html
 create mode 100644 style.css
```

---

### Шаг 6. Добавление скриптов взаимодействия и третий коммит
Написан файл `script.js` с логикой:
- Реакция котика на клик (мурлыкание, появление мыслей в облачке);
- Синтез звуков через браузерный Web Audio API без сторонних библиотек;
- Запуск фейерверка конфетти и сердечек через Canvas;
- Интерактивная кнопка оценки «Поставить 5».

Индексация и коммит:
```bash
git add script.js
git commit -m "feat: implement interactive mechanics, sounds, particles and celebration"
```
**Вывод терминала:**
```text
[main 68837a9] feat: implement interactive mechanics, sounds, particles and celebration
 1 file changed, 248 insertions(+)
 create mode 100644 script.js
```

---

### Шаг 7. Просмотр истории коммитов
Для верификации структуры и последовательности версий вызвана команда просмотра дерева:
```bash
git log --graph --pretty=format:'%h - %s (%cr) <%an>' --abbrev-commit
```
**Вывод терминала:**
```text
* 68837a9 - feat: implement interactive mechanics, sounds, particles and celebration (just now) <IlyaKhar>
* 800ff59 - feat: add markup and visual styling for cat and scroll animation (just now) <IlyaKhar>
* 9c000c3 - chore: initial commit with README and gitignore (1 minute ago) <IlyaKhar>
```

---

### Шаг 8. Подключение удалённого репозитория GitHub и отправка изменений
Создан удалённый репозиторий `git-practice` на аккаунте `IlyaKhar`.  
Связывание локального репозитория с удалённым и публикация ветки `main`:
```bash
git remote add origin https://github.com/IlyaKhar/git-practice.git
git branch -M main
git push -u origin main
```
**Вывод терминала:**
```text
Enumerating objects: 11, done.
Counting objects: 100% (11/11), done.
Delta compression using up to 8 threads
Compressing objects: 100% (11/11), done.
Writing objects: 100% (11/11), 11.00 KiB | 11.00 MiB/s, done.
Total 11 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (2/2), done.
To https://github.com/IlyaKhar/git-practice.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

---

### Шаг 9. Развёртывание проекта (GitHub Pages)
Для обеспечения интерактивного доступа к проекту без необходимости скачивания исходного кода включена публикация через сервис **GitHub Pages**:
- URL веб-приложения: **[https://ilyakhar.github.io/git-practice/](https://ilyakhar.github.io/git-practice/)**

---

## 3. Заключение
В ходе выполнения практической работы были полностью достигнуты поставленные цели:
1. Успешно инициализирован локальный Git-репозиторий;
2. На практике отработан полный цикл работы: добавление, исключение ненужных файлов, индексирование (`staging`), формирование понятных атомарных коммитов в соответствии с Convention Commits (`chore`, `feat`);
3. Настроена связь локального репозитория с удалённым репозиторием на платформе GitHub;
4. Все изменения успешно синхронизированы с веткой `main` на удалённом сервере;
5. Создан интерактивный веб-проект и опубликован в открытый доступ с помощью GitHub Pages.
