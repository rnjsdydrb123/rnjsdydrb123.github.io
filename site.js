// Language menu, and click-to-enlarge for gallery pictures.
// Without JavaScript the menu still opens and the links open the full image.
(function () {
  var menu = document.querySelector('details.lang');
  if (menu) {
    document.addEventListener('click', function (e) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') menu.open = false;
    });
  }

  var links = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]'));
  var box = document.querySelector('dialog.lightbox');
  if (!links.length || !box || typeof box.showModal !== 'function') return;

  var img = box.querySelector('img');
  var cap = box.querySelector('figcaption');
  var index = 0;

  function show(i) {
    index = (i + links.length) % links.length;
    var link = links[index];
    var label = link.parentNode.querySelector('.cap');
    img.src = link.getAttribute('href');
    img.alt = link.querySelector('img').alt;
    cap.textContent = '';
    if (!label) return;
    var title = document.createElement('b');
    title.textContent = label.firstChild.textContent;
    cap.appendChild(title);
    var small = label.querySelector('small');
    if (small) cap.appendChild(document.createTextNode(' · ' + small.textContent));
  }

  links.forEach(function (link, i) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
      box.showModal();
    });
  });

  box.querySelector('.close').addEventListener('click', function () { box.close(); });
  box.querySelector('.prev').addEventListener('click', function () { show(index - 1); });
  box.querySelector('.next').addEventListener('click', function () { show(index + 1); });

  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.tagName === 'FIGURE') box.close();
  });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  box.addEventListener('close', function () { img.removeAttribute('src'); });

  var startX = null;
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
    startX = null;
  });
})();
