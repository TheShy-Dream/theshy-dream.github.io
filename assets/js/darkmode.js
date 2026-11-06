(function () {
    const storageKey = 'theme';
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    function savedTheme() {
        try { return localStorage.getItem(storageKey); } catch (error) { return null; }
    }

    function applyTheme(theme, remember) {
        const isDark = theme === 'dark';
        document.body.classList.toggle('dark', isDark);
        document.querySelectorAll('.dark-mode-toggle').forEach(function (toggle) {
            toggle.checked = isDark;
        });
        if (remember) {
            try { localStorage.setItem(storageKey, theme); } catch (error) { /* storage may be disabled */ }
        }
    }

    function toggleDarkMode() {
        applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark', true);
    }

    window.toggleDarkMode = toggleDarkMode;

    document.addEventListener('DOMContentLoaded', function () {
        applyTheme(savedTheme() || (media.matches ? 'dark' : 'light'), false);
        document.querySelectorAll('.dark-mode-toggle').forEach(function (toggle) {
            toggle.addEventListener('change', function () {
                applyTheme(toggle.checked ? 'dark' : 'light', true);
            });
        });
    });

    if (media.addEventListener) {
        media.addEventListener('change', function (event) {
            if (!savedTheme()) applyTheme(event.matches ? 'dark' : 'light', false);
        });
    }
}());
