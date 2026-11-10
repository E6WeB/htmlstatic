/**
 * StaticStack Local Appreciation / Like Script (likes.js)
 * 100% local replacement for external iine.mini.js + Supabase.
 * Persists likes via /api/tool-like (PostgreSQL + local JSON cache).
 */
(function () {
  'use strict';

  var STORAGE_PREFIX = 'staticstack_liked_';

  function updateSessionCaches(slug, newCount, delta) {
    try {
      var rawMap = sessionStorage.getItem('staticstack_tool_likes_map');
      if (rawMap) {
        var map = JSON.parse(rawMap);
        map[slug] = newCount;
        sessionStorage.setItem('staticstack_tool_likes_map', JSON.stringify(map));
      }
      var rawTotal = sessionStorage.getItem('staticstack_total_likes');
      if (rawTotal !== null && delta) {
        var total = (parseInt(rawTotal, 10) || 0) + delta;
        sessionStorage.setItem('staticstack_total_likes', String(Math.max(0, total)));
      }
    } catch (e) {}
  }

  function fetchToolLike(slug, hit) {
    var qs = 'slug=' + encodeURIComponent(slug) + '&hit=' + (hit ? '1' : '0');
    var endpoints = [
      '/api/tool-like?' + qs,
      '/community/api?action=tool-like&' + qs
    ];

    function tryEndpoint(idx) {
      if (idx >= endpoints.length) {
        return fetch('/asset/json/tool-likes-cache.json')
          .then(function (r) { return r.ok ? r.json() : {}; })
          .then(function (map) {
            return { slug: slug, likes: Number(map && map[slug]) || 0 };
          });
      }
      return fetch(endpoints[idx], {
        method: hit ? 'POST' : 'GET',
        headers: { 'Accept': 'application/json' }
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).catch(function () {
        return tryEndpoint(idx + 1);
      });
    }

    return tryEndpoint(0);
  }

  function initButton(btn) {
    var slug = btn.getAttribute('data-slug');
    if (!slug) return;

    var counterEl = btn.querySelector('.counter');
    var storageKey = STORAGE_PREFIX + slug;
    var isLiked = false;

    try {
      isLiked = localStorage.getItem(storageKey) === '1';
    } catch (e) {}

    if (isLiked) {
      btn.classList.add('clicked');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.setAttribute('aria-pressed', 'false');
    }

    // Fetch current live count from local server
    fetchToolLike(slug, false)
      .then(function (data) {
        if (data && typeof data.likes === 'number' && counterEl) {
          var currentShown = parseInt(counterEl.textContent, 10) || 0;
          var nextVal = Math.max(data.likes, isLiked ? Math.max(1, currentShown) : 0);
          counterEl.textContent = nextVal.toLocaleString();
          updateSessionCaches(slug, nextVal, 0);
        }
      })
      .catch(function () {});

    btn.addEventListener('click', function () {
      if (isLiked || btn.classList.contains('clicked')) {
        return;
      }
      isLiked = true;
      btn.classList.add('clicked');
      btn.setAttribute('aria-pressed', 'true');

      try {
        localStorage.setItem(storageKey, '1');
      } catch (e) {}

      var currentCount = counterEl ? (parseInt(counterEl.textContent.replace(/,/g, ''), 10) || 0) : 0;
      var optimisticCount = currentCount + 1;
      if (counterEl) {
        counterEl.textContent = optimisticCount.toLocaleString();
      }
      updateSessionCaches(slug, optimisticCount, 1);

      fetchToolLike(slug, true)
        .then(function (data) {
          if (data && typeof data.likes === 'number' && counterEl) {
            var finalCount = Math.max(optimisticCount, data.likes);
            counterEl.textContent = finalCount.toLocaleString();
            updateSessionCaches(slug, finalCount, 0);
          }
        })
        .catch(function () {});
    });
  }

  function initAllLikes() {
    var buttons = document.querySelectorAll('.iine-button[data-slug]');
    for (var i = 0; i < buttons.length; i++) {
      initButton(buttons[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllLikes);
  } else {
    initAllLikes();
  }
})();

