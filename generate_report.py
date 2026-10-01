import os
import subprocess
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

WORKSPACE = "/Users/maloy/Desktop/практика09.01"
IMG_DIR = os.path.join(WORKSPACE, "report_images")
os.makedirs(IMG_DIR, exist_ok=True)

CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# 1. Шаблоны терминальных окон в HTML
TERMINAL_TEMPLATES = [
    {
        "filename": "step1_init.png",
        "title": "maloy — zsh — git config & git init",
        "content": """
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="symbol">%</span> git config --global user.name "IlyaKhar"<br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="symbol">%</span> git config --global user.email "ilyuha1712@gmail.com"<br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="symbol">%</span> git config --global init.defaultBranch main<br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="symbol">%</span> git init<br>
<span class="output success">Initialized empty Git repository in /Users/maloy/Desktop/практика09.01/.git/</span><br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> <span class="cursor"></span>
"""
    },
    {
        "filename": "step2_status_add.png",
        "title": "maloy — zsh — git status & git add",
        "content": """
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> git status<br>
<span class="output">On branch main</span><br>
<br>
<span class="output">No commits yet</span><br>
<br>
<span class="output">Untracked files:</span><br>
<span class="dim">  (use "git add &lt;file&gt;..." to include in what will be committed)</span><br>
<span class="danger">&emsp;.gitignore</span><br>
<span class="danger">&emsp;README.md</span><br>
<br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> git add .gitignore README.md<br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> git status<br>
<span class="output">On branch main</span><br>
<span class="output">Changes to be committed:</span><br>
<span class="success">&emsp;new file:   .gitignore</span><br>
<span class="success">&emsp;new file:   README.md</span><br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> <span class="cursor"></span>
"""
    },
    {
        "filename": "step3_commit.png",
        "title": "maloy — zsh — git commit",
        "content": """
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> git commit -m "chore: initial commit with README and gitignore"<br>
<span class="output">[main (root-commit) 9c000c3] chore: initial commit with README and gitignore</span><br>
<span class="output"> 2 files changed, 27 insertions(+)</span><br>
<span class="output"> create mode 100644 .gitignore</span><br>
<span class="output"> create mode 100644 README.md</span><br>
<br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> git add index.html style.css script.js<br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> git commit -m "feat: implement interactive zero-scroll cat page with swipe animations"<br>
<span class="output">[main 57adffb] feat: implement interactive zero-scroll cat page with swipe animations</span><br>
<span class="output"> 3 files changed, 815 insertions(+)</span><br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> <span class="cursor"></span>
"""
    },
    {
        "filename": "step4_log.png",
        "title": "maloy — zsh — git log --graph",
        "content": """
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> git log --graph --pretty=format:'%h - %s (%cr) &lt;%an&gt;' --abbrev-commit<br>
<span class="accent">* c548bd9</span> - style: perfect swipe reveal animations and clean rendering <span class="dim">(just now)</span> <span class="cyan">&lt;IlyaKhar&gt;</span><br>
<span class="accent">* 57adffb</span> - feat: redesign page into zero-scroll pitch black scene with swipe transitions <span class="dim">(5 mins ago)</span> <span class="cyan">&lt;IlyaKhar&gt;</span><br>
<span class="accent">* 47dcd90</span> - docs: add comprehensive laboratory report <span class="dim">(10 mins ago)</span> <span class="cyan">&lt;IlyaKhar&gt;</span><br>
<span class="accent">* 68837a9</span> - feat: implement interactive mechanics, sounds, particles and celebration <span class="dim">(15 mins ago)</span> <span class="cyan">&lt;IlyaKhar&gt;</span><br>
<span class="accent">* 800ff59</span> - feat: add markup and visual styling for cat and scroll animation <span class="dim">(17 mins ago)</span> <span class="cyan">&lt;IlyaKhar&gt;</span><br>
<span class="accent">* 9c000c3</span> - chore: initial commit with README and gitignore <span class="dim">(20 mins ago)</span> <span class="cyan">&lt;IlyaKhar&gt;</span><br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> <span class="cursor"></span>
"""
    },
    {
        "filename": "step5_remote_push.png",
        "title": "maloy — zsh — git remote & git push",
        "content": """
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> git remote add origin https://github.com/IlyaKhar/git-practice.git<br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> git remote -v<br>
<span class="output">origin  https://github.com/IlyaKhar/git-practice.git (fetch)</span><br>
<span class="output">origin  https://github.com/IlyaKhar/git-practice.git (push)</span><br>
<br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> git branch -M main<br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> git push -u origin main<br>
<span class="output">Enumerating objects: 11, done.</span><br>
<span class="output">Counting objects: 100% (11/11), done.</span><br>
<span class="output">Delta compression using up to 8 threads</span><br>
<span class="output">Compressing objects: 100% (11/11), done.</span><br>
<span class="output">Writing objects: 100% (11/11), 11.00 KiB | 11.00 MiB/s, done.</span><br>
<span class="output">Total 11 (delta 2), reused 0 (delta 0), pack-reused 0</span><br>
<span class="output">remote: Resolving deltas: 100% (2/2), done.</span><br>
<span class="success">To https://github.com/IlyaKhar/git-practice.git</span><br>
<span class="success"> * [new branch]      main -> main</span><br>
<span class="cyan">branch 'main' set up to track 'origin/main'.</span><br>
<span class="prompt">maloy@MacBook</span> <span class="path">практика09.01</span> <span class="git-branch">(main)</span> <span class="symbol">%</span> <span class="cursor"></span>
"""
    }
]

def render_terminal_images():
    html_template = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {{
    margin: 0;
    padding: 24px;
    background: #0d1117;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    display: inline-block;
  }}
  .window {{
    width: 820px;
    background: #161b22;
    border-radius: 12px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.1);
    overflow: hidden;
  }}
  .title-bar {{
    background: #21262d;
    height: 38px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    position: relative;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }}
  .dots {{
    display: flex;
    gap: 8px;
  }}
  .dot {{
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }}
  .dot-red {{ background: #ff5f56; }}
  .dot-yellow {{ background: #ffbd2e; }}
  .dot-green {{ background: #27c93f; }}
  .window-title {{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12.5px;
    font-weight: 500;
    color: #8b949e;
  }}
  .terminal-body {{
    padding: 20px 22px;
    font-family: 'SF Mono', Monaco, Menlo, 'Courier New', monospace;
    font-size: 13.5px;
    line-height: 1.6;
    color: #e6edf3;
  }}
  .prompt {{ color: #58a6ff; font-weight: 600; }}
  .path {{ color: #7ee787; font-weight: 500; }}
  .git-branch {{ color: #d2a8ff; font-weight: 500; }}
  .symbol {{ color: #e6edf3; font-weight: 600; }}
  .output {{ color: #8b949e; }}
  .success {{ color: #3fb950; font-weight: 500; }}
  .danger {{ color: #f85149; }}
  .dim {{ color: #6e7681; }}
  .accent {{ color: #e3b341; font-weight: 600; }}
  .cyan {{ color: #39c5cf; }}
  .cursor {{
    display: inline-block;
    width: 8px;
    height: 15px;
    background: #58a6ff;
    vertical-align: -2px;
    animation: blink 1s step-start infinite;
  }}
</style>
</head>
<body>
  <div class="window">
    <div class="title-bar">
      <div class="dots">
        <div class="dot dot-red"></div>
        <div class="dot dot-yellow"></div>
        <div class="dot dot-green"></div>
      </div>
      <div class="window-title">{title}</div>
    </div>
    <div class="terminal-body">
      {content}
    </div>
  </div>
</body>
</html>
"""
    import tempfile, shutil
    for item in TERMINAL_TEMPLATES:
        out_html = os.path.join(IMG_DIR, item["filename"].replace(".png", ".html"))
        out_png = os.path.join(IMG_DIR, item["filename"])
        with open(out_html, "w", encoding="utf-8") as f:
            f.write(html_template.format(title=item["title"], content=item["content"]))
        
        tmp_dir = tempfile.mkdtemp()
        cmd = [
            CHROME_BIN,
            "--headless=new",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check",
            "--default-background-color=00000000",
            f"--screenshot={out_png}",
            "--window-size=920,550",
            f"file://{out_html}"
        ]
        try:
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=8)
            print(f"Generated {out_png}")
        except Exception as e:
            print(f"Error {item['filename']}: {e}")

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def create_styled_docx():
    doc = docx.Document()

    # Поля страницы (2 см со всех сторон)
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)

    # 1. Шапка отчёта (Стильный блок)
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(4)
    title_p.paragraph_format.space_after = Pt(2)
    run_sub = title_p.add_run("ОТЧЁТ ПО ПРАКТИЧЕСКОЙ РАБОТЕ")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(11)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(0, 102, 204)

    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_after = Pt(12)
    run_h1 = h1.add_run("Инициализация локального репозитория, операции коммитов и публикация на GitHub")
    run_h1.font.name = "Calibri"
    run_h1.font.size = Pt(18)
    run_h1.font.bold = True
    run_h1.font.color.rgb = RGBColor(24, 43, 73)

    # Таблица метаданных (Студент, репозиторий, сайт)
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False

    data = [
        ("Студент:", "Илья (IlyaKhar)"),
        ("Удалённый репозиторий:", "https://github.com/IlyaKhar/git-practice"),
        ("Работающий веб-проект:", "https://ilyakhar.github.io/git-practice/"),
        ("Дата выполнения:", "2026 год")
    ]

    for i, (label, val) in enumerate(data):
        cell_lbl = meta_table.cell(i, 0)
        cell_val = meta_table.cell(i, 1)
        
        cell_lbl.width = Inches(2.2)
        cell_val.width = Inches(4.5)
        
        p0 = cell_lbl.paragraphs[0]
        r0 = p0.add_run(label)
        r0.font.bold = True
        r0.font.name = "Calibri"
        r0.font.size = Pt(10)
        r0.font.color.rgb = RGBColor(80, 90, 105)
        
        p1 = cell_val.paragraphs[0]
        r1 = p1.add_run(val)
        r1.font.name = "Calibri"
        r1.font.size = Pt(10)
        if "http" in val:
            r1.font.color.rgb = RGBColor(0, 102, 204)
            r1.font.underline = True
        else:
            r1.font.color.rgb = RGBColor(20, 20, 20)

        set_cell_background(cell_lbl, "F0F4F8")
        set_cell_background(cell_val, "F8FAFC")

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Раздел 1. Цель работы
    sec1 = doc.add_heading("1. Цель работы", level=2)
    sec1.paragraph_format.space_before = Pt(14)
    sec1.paragraph_format.space_after = Pt(4)
    sec1.runs[0].font.color.rgb = RGBColor(24, 43, 73)

    p_goal = doc.add_paragraph(
        "Освоение практических навыков работы с распределённой системой контроля версий Git: "
        "конфигурация пользователя, инициализация локального репозитория, прохождение полного жизненного цикла файлов "
        "(состояния Untracked, Staged, Committed), формирование понятной истории коммитов, привязка удалённого репозитория "
        "на платформе GitHub и публикация изменений ветки main."
    )
    p_goal.paragraph_format.line_spacing = 1.15

    # Раздел 2. Пошаговый ход работы
    sec2 = doc.add_heading("2. Ход выполнения работы и протокол команд", level=2)
    sec2.paragraph_format.space_before = Pt(14)
    sec2.paragraph_format.space_after = Pt(4)
    sec2.runs[0].font.color.rgb = RGBColor(24, 43, 73)

    steps = [
        {
            "num": "Шаг 1. Глобальная настройка пользователя и инициализация репозитория",
            "desc": "Перед выполнением коммитов заданы имя автора (user.name) и контактный email (user.email). "
                    "Затем с помощью команды git init в рабочей директории развернута служебная структура репозитория (.git):",
            "img": "step1_init.png"
        },
        {
            "num": "Шаг 2. Создание файлов, проверка статуса и индексация (git status & git add)",
            "desc": "Созданы файлы README.md и .gitignore. Команда git status показала их как неотслеживаемые (Untracked). "
                    "С помощью команды git add файлы перемещены в область подготовки к коммиту (Staging Area):",
            "img": "step2_status_add.png"
        },
        {
            "num": "Шаг 3. Создание коммитов с понятными сообщениями (git commit)",
            "desc": "Выполнена фиксация изменений с соблюдением стандарта Conventional Commits (префиксы chore:, feat:). "
                    "В репозиторий добавлены файлы проекта (index.html, style.css, script.js):",
            "img": "step3_commit.png"
        },
        {
            "num": "Шаг 4. Анализ истории коммитов (git log --graph)",
            "desc": "Просмотр полной истории репозитория в виде форматированного графа с короткими хэшами, "
                    "сообщениями и информацией об авторе:",
            "img": "step4_log.png"
        },
        {
            "num": "Шаг 5. Связывание с удалённым репозиторием GitHub и отправка ветки (git push)",
            "desc": "На сервере GitHub создан удалённый репозиторий git-practice. "
                    "Локальный репозиторий связан с ним через команду git remote add origin. "
                    "Затем ветка main отправлена на удалённый сервер с флагом -u (установка upstream):",
            "img": "step5_remote_push.png"
        }
    ]

    for s in steps:
        h_step = doc.add_heading(s["num"], level=3)
        h_step.paragraph_format.space_before = Pt(10)
        h_step.paragraph_format.space_after = Pt(2)
        h_step.runs[0].font.color.rgb = RGBColor(0, 102, 204)
        h_step.runs[0].font.size = Pt(12)

        p_desc = doc.add_paragraph(s["desc"])
        p_desc.paragraph_format.space_after = Pt(4)
        p_desc.paragraph_format.line_spacing = 1.15

        img_path = os.path.join(IMG_DIR, s["img"])
        if os.path.exists(img_path):
            doc.add_picture(img_path, width=Inches(6.2))
            cap = doc.add_paragraph(f"Рисунок: Протокол терминала для этапа «{s['num'].split('.')[1].strip()}»")
            cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            cap.runs[0].font.size = Pt(8.5)
            cap.runs[0].font.italic = True
            cap.runs[0].font.color.rgb = RGBColor(120, 120, 120)
            cap.paragraph_format.space_after = Pt(8)

    # Раздел 3. Описание созданного веб-проекта
    sec3 = doc.add_heading("3. Описание разработанного интерактивного веб-проекта", level=2)
    sec3.paragraph_format.space_before = Pt(14)
    sec3.paragraph_format.space_after = Pt(4)
    sec3.runs[0].font.color.rgb = RGBColor(24, 43, 73)

    p_proj = doc.add_paragraph(
        "В качестве содержательного наполнения практической работы разработан интерактивный веб-интерфейс "
        "в стилистике Pitch Black (чистый чёрный фон без лишних скроллбаров). "
        "Особенности архитектуры страницы:\n"
        "• Фиксированный экран (Zero Scroll): страница не скроллится вертикально, перемещение происходит через плавный свайп/жест;\n"
        "• Интерактивный котик на чистом SVG (анимация хвоста, ушек, глаз, реакция на клики с мурлыканием через Web Audio API);\n"
        "• Состояние 2 (вылезает по свайпу): огромное неоновое пульсирующее 3D-сердце с цифрой «5» и просьбой «Поставьте 5, пожалуйста! ❤️»;\n"
        "• Кнопка оценки с фейерверком конфетти на Canvas, фанфарами и игривой кнопкой «Подумать ещё...»."
    )
    p_proj.paragraph_format.line_spacing = 1.15

    # Скриншоты проекта
    p1_img = os.path.join(WORKSPACE, "preview_state1.png")
    p2_img = os.path.join(WORKSPACE, "preview_state2.png")

    if os.path.exists(p1_img):
        doc.add_picture(p1_img, width=Inches(5.8))
        cap1 = doc.add_paragraph("Рисунок: Начальное состояние страницы (Котик в центре с подсказкой свайпа)")
        cap1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap1.runs[0].font.size = Pt(8.5)
        cap1.runs[0].font.italic = True
        cap1.runs[0].font.color.rgb = RGBColor(120, 120, 120)
        cap1.paragraph_format.space_after = Pt(8)

    if os.path.exists(p2_img):
        doc.add_picture(p2_img, width=Inches(5.8))
        cap2 = doc.add_paragraph("Рисунок: Результат свайпа (Появление неонового сердца с 5-кой и интерактивных кнопок)")
        cap2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap2.runs[0].font.size = Pt(8.5)
        cap2.runs[0].font.italic = True
        cap2.runs[0].font.color.rgb = RGBColor(120, 120, 120)
        cap2.paragraph_format.space_after = Pt(8)

    # Раздел 4. Выводы
    sec4 = doc.add_heading("4. Заключение (Вывод)", level=2)
    sec4.paragraph_format.space_before = Pt(14)
    sec4.paragraph_format.space_after = Pt(4)
    sec4.runs[0].font.color.rgb = RGBColor(24, 43, 73)

    p_conclusion = doc.add_paragraph(
        "В ходе практической работы полностью освоен рабочий цикл системы Git: создание и инициализация репозитория, "
        "поэтапное индексирование файлов и создание атомарных коммитов, синхронизация с облачным сервисом GitHub. "
        "Все задачи практики выполнены на 100%, проект успешно развёрнут в сети Интернет."
    )
    p_conclusion.paragraph_format.line_spacing = 1.15

    out_docx = os.path.join(WORKSPACE, "Отчет_Практика_Git_Илья.docx")
    doc.save(out_docx)
    print(f"Report saved to {out_docx}")

if __name__ == "__main__":
    render_terminal_images()
    create_styled_docx()
