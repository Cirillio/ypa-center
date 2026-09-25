#!/usr/bin/env python3
"""Собирает standalone-макеты из частей _src -> ../checkout-*.html. Запуск: python3 _src/build.py"""
from pathlib import Path
SRC = Path(__file__).parent
OUT = SRC.parent
r = lambda n: (SRC / n).read_text(encoding="utf-8")

TABS = [("checkout-trial.html", "person-simple-run", "Пробное"), ("checkout-subscription.html", "puzzle-piece", "Абонемент"), ("checkout-event.html", "ticket", "Событие")]

def top(h1, icon, active):
    tabs = "".join(
        f'<a href="{h}" {"aria-current=page" if h == active else ""} class="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-base font-bold transition-colors '
        f'{"bg-primary text-white" if h == active else "text-default hover:bg-primary/10 hover:text-primary"}"><i class="ph-bold ph-{i} text-lg"></i>{t}</a>'
        for h, i, t in TABS)
    return f'''<div id="page" class="pt-(--ui-header-height)">
<div class="mx-auto flex w-full max-w-[84rem] flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-6 sm:px-6 lg:px-8">
  <div class="flex items-center gap-3">
    <div class="bg-primary/10 flex aspect-square size-10 shrink-0 items-center justify-center rounded-full"><i class="ph-bold ph-{icon} text-primary text-2xl"></i></div>
    <div class="flex flex-col"><span class="text-secondary text-sm leading-tight font-semibold tracking-wide uppercase">Запись</span><h1 class="text-primary text-2xl leading-tight font-bold">{h1}</h1></div>
  </div>
  <nav aria-label="Тип покупки" class="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1">{tabs}</nav>
</div>
<section class="pb-32 lg:pb-16"><div class="mx-auto grid w-full max-w-[84rem] gap-6 px-4 sm:px-6 lg:grid-cols-7 lg:px-8">
<div class="flex flex-col gap-6 lg:col-span-5">
'''

def mid(summary):
    return f'''</div>
<aside id="summary" class="lg:col-span-2" aria-label="Итого"><div id="summary-box" class="widget flex flex-col gap-5 rounded-lg bg-white p-6 lg:sticky lg:top-[calc(var(--ui-header-height)+1rem)] lg:max-h-[calc(100dvh-var(--ui-header-height)-2rem)] lg:overflow-y-auto">
{summary}
</div></aside>
</div></section>
{r("mbar.html")}
</div>
'''

def page(name, title, h1, icon, body, summary, js):
    html = (r("head.html").replace("%%TITLE%%", title) + r("header.html") + top(h1, icon, name) + r(body) + mid(r(summary)) +
            r("modal.html") + r("devbar.html") + "<script>\n" + r("common.js") + "\n" + r(js) + "\n</script>\n</body>\n</html>\n")
    (OUT / name).write_text(html, encoding="utf-8")
    print("built", name, len(html) // 1024, "KB")

page("checkout-trial.html", "Пробное занятие", "Пробное занятие", "person-simple-run", "trial.body.html", "trial.summary.html", "trial.js")
for n, t, h, i, b, s, j in [("checkout-subscription.html", "Абонемент", "Собрать абонемент", "puzzle-piece", "sub.body.html", "sub.summary.html", "sub.js"),
                            ("checkout-event.html", "Событие", "Запись на событие", "ticket", "event.body.html", "event.summary.html", "event.js")]:
    if all((SRC / f).exists() for f in (b, s, j)):
        page(n, t, h, i, b, s, j)
