(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var article = document.querySelector('.post');
        if (!article) return;

        document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
            link.rel = 'noopener noreferrer';
        });

        var topButton = document.createElement('button');
        topButton.className = 'back-to-top';
        topButton.type = 'button';
        topButton.setAttribute('aria-label', 'Back to top');
        topButton.textContent = '↑';
        document.body.appendChild(topButton);
        topButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', function () {
            topButton.classList.toggle('is-visible', window.scrollY > 600);
        }, { passive: true });
    });
}());
