(function () {
    var scholarId = 'et0_rK4AAAAJ';
    var sources = [
        'https://raw.githubusercontent.com/TheShy-Dream/theshy-dream.github.io/google-scholar-stats/google-scholar.json',
        'https://cdn.jsdelivr.net/gh/TheShy-Dream/theshy-dream.github.io@google-scholar-stats/google-scholar.json'
    ];

    function normalizeTitle(value) {
        return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
    }

    function fetchCitationData(index) {
        return fetch(sources[index], { cache: 'no-cache' }).then(function (response) {
            if (!response.ok) throw new Error('Citation data unavailable');
            return response.json();
        }).catch(function (error) {
            if (index + 1 < sources.length) return fetchCitationData(index + 1);
            throw error;
        });
    }

    function renderTotal(data) {
        document.querySelectorAll('[data-scholar-total]').forEach(function (element) {
            element.textContent = String(data.citedby || 0);
            element.hidden = false;
            element.setAttribute('aria-label', 'Total citations: ' + element.textContent);
        });
    }

    function renderPublications(data) {
        if (!/\/publications\/$/.test(window.location.pathname)) return;

        var citations = new Map((data.publications || []).map(function (publication) {
            return [normalizeTitle(publication.title || ''), publication];
        }));

        document.querySelectorAll('.post > ol > li').forEach(function (item) {
            var strong = item.querySelectorAll('strong');
            if (strong.length < 2) return;
            var publication = citations.get(normalizeTitle(strong[1].textContent));
            if (!publication) return;

            var link = document.createElement('a');
            link.className = 'publication-citations';
            link.href = publication.scholar_url || ('https://scholar.google.com/citations?user=' + scholarId);
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Citations: ' + publication.citations;
            link.setAttribute('aria-label', strong[1].textContent + ', ' + link.textContent);
            strong[1].insertAdjacentElement('afterend', link);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (!window.fetch) return;
        fetchCitationData(0).then(function (data) {
            renderTotal(data);
            renderPublications(data);
        }).catch(function () {
            // Citation data is an enhancement; the site remains complete without it.
        });
    });
}());
