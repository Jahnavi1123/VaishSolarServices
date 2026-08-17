/*
 * VAISH Solar Services content layer
 *
 * This script keeps the public pages static and fast while allowing the
 * companion admin portal to replace text, links, images, and inline
 * background images. It intentionally uses paths generated from the DOM, so
 * existing page markup does not need to be individually wired to a CMS.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'vaish-solar-cms-v1';
  var TEXT_PARENT_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,a,li,blockquote,figcaption,button,label,small,td,th,span';
  var SKIPPED_PARENTS = 'script,style,noscript,svg,option,template';

  function pageName() {
    var name = window.location.pathname.split('/').pop();
    return name || 'index.html';
  }

  function elementPath(element) {
    var parts = [];
    var current = element;

    while (current && current !== document.body) {
      var parent = current.parentElement;
      if (!parent) return '';
      var siblings = Array.prototype.filter.call(parent.children, function (sibling) {
        return sibling.tagName === current.tagName;
      });
      var position = siblings.indexOf(current) + 1;
      parts.unshift(current.tagName.toLowerCase() + ':nth-of-type(' + position + ')');
      current = parent;
    }

    return parts.length ? 'body > ' + parts.join(' > ') : 'body';
  }

  function makeKey(type, selector, index) {
    return type + '|' + selector + (typeof index === 'number' ? '|' + index : '');
  }

  function textTargets() {
    var targets = [];
    var parents = document.querySelectorAll(TEXT_PARENT_SELECTOR);

    Array.prototype.forEach.call(parents, function (parent) {
      if (parent.closest('[data-cms-ignore]') || parent.matches(SKIPPED_PARENTS)) return;

      Array.prototype.forEach.call(parent.childNodes, function (node, index) {
        if (node.nodeType !== Node.TEXT_NODE || !node.nodeValue.trim()) return;
        var selector = elementPath(parent);
        if (!selector) return;
        var leading = (node.nodeValue.match(/^\s*/) || [''])[0];
        var trailing = (node.nodeValue.match(/\s*$/) || [''])[0];
        targets.push({
          type: 'text',
          key: makeKey('text', selector, index),
          selector: selector,
          index: index,
          node: node,
          element: parent,
          value: node.nodeValue.slice(leading.length, node.nodeValue.length - trailing.length),
          leading: leading,
          trailing: trailing,
          label: parent.tagName.toLowerCase() + ' text'
        });
      });
    });

    return targets;
  }

  function elementTargets() {
    var targets = [];

    function add(selector, type, buildValue) {
      Array.prototype.forEach.call(document.querySelectorAll(selector), function (element) {
        if (element.closest('[data-cms-ignore]')) return;
        var path = elementPath(element);
        if (!path) return;
        targets.push({
          type: type,
          key: makeKey(type, path),
          selector: path,
          element: element,
          value: buildValue(element),
          label: element.tagName.toLowerCase() + ' ' + type
        });
      });
    }

    add('img', 'image', function (element) {
      return { src: element.getAttribute('src') || '', alt: element.getAttribute('alt') || '' };
    });
    add('[style*="background-image"]', 'background', function (element) {
      return element.style.backgroundImage || '';
    });
    add('a[href]', 'link', function (element) {
      return element.getAttribute('href') || '';
    });
    add('input[placeholder], textarea[placeholder]', 'placeholder', function (element) {
      return element.getAttribute('placeholder') || '';
    });
    add('video[poster]', 'poster', function (element) {
      return element.getAttribute('poster') || '';
    });

    return targets;
  }

  function getTargets() {
    return textTargets().concat(elementTargets());
  }

  function getLocalContent() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : { version: 1, pages: {} };
    } catch (error) {
      return { version: 1, pages: {} };
    }
  }

  function saveLocalContent(content) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }

  function findTarget(entry) {
    if (!entry || !entry.selector) return null;
    var element;
    try {
      element = document.querySelector(entry.selector);
    } catch (error) {
      return null;
    }
    if (!element) return null;

    if (entry.type === 'text') {
      var node = element.childNodes[entry.index];
      if (!node || node.nodeType !== Node.TEXT_NODE) return null;
      return { type: 'text', node: node, element: element };
    }

    return { type: entry.type, element: element };
  }

  function applyEntry(entry) {
    var target = findTarget(entry);
    if (!target) return false;

    if (entry.type === 'text') {
      var currentValue = target.node.nodeValue;
      var leading = typeof entry.leading === 'string' ? entry.leading : (currentValue.match(/^\s*/) || [''])[0];
      var trailing = typeof entry.trailing === 'string' ? entry.trailing : (currentValue.match(/\s*$/) || [''])[0];
      target.node.nodeValue = leading + String(entry.value || '') + trailing;
    } else if (entry.type === 'image') {
      target.element.setAttribute('src', entry.value && entry.value.src ? entry.value.src : '');
      target.element.setAttribute('alt', entry.value && entry.value.alt ? entry.value.alt : '');
    } else if (entry.type === 'background') {
      target.element.style.backgroundImage = String(entry.value || '');
    } else if (entry.type === 'link') {
      target.element.setAttribute('href', String(entry.value || '#'));
    } else if (entry.type === 'placeholder') {
      target.element.setAttribute('placeholder', String(entry.value || ''));
    } else if (entry.type === 'poster') {
      target.element.setAttribute('poster', String(entry.value || ''));
    }
    return true;
  }

  function applyPageContent(content, requestedPage) {
    var currentPage = requestedPage || pageName();
    var pageContent = content && content.pages && content.pages[currentPage];
    if (!pageContent || typeof pageContent !== 'object') return;
    Object.keys(pageContent).forEach(function (key) {
      applyEntry(pageContent[key]);
    });
  }

  function applyChange(target, entry) {
    var completeEntry = Object.assign({
      type: target.type,
      selector: target.selector,
      index: target.index,
      leading: target.leading,
      trailing: target.trailing
    }, entry);
    applyEntry(completeEntry);
    return completeEntry;
  }

  function loadRemoteContent() {
    return window.fetch('/api/site-content', { headers: { Accept: 'application/json' } })
      .then(function (response) {
        if (!response.ok) throw new Error('Content service unavailable');
        return response.json();
      })
      .then(function (content) {
        if (content && typeof content === 'object') {
          applyPageContent(content);
          window.dispatchEvent(new CustomEvent('vaishcms:remote-loaded', { detail: content }));
        }
        return content;
      })
      .catch(function () {
        return null;
      });
  }

  function installServicesDropdowns() {
    var serviceLinks = document.querySelectorAll('.nav-link[href="services.html"]');
    var serviceItems = [
      ['services.html#on-grid', 'On-Grid Solar System'],
      ['services.html#off-grid', 'Off-Grid Solar System'],
      ['services.html#hybrid', 'Hybrid Solar System'],
      ['services.html#solar-led', 'Solar LED Street Light'],
      ['services.html#water-heating', 'Solar Water Heating System'],
      ['services.html#water-pumping', 'Solar Water Pumping System & Solar Aata Chakki']
    ];

    Array.prototype.forEach.call(serviceLinks, function (link) {
      if (link.closest('.services-dropdown')) return;

      var wrapper = document.createElement('div');
      var menu = document.createElement('div');
      wrapper.className = 'services-dropdown';
      menu.className = 'services-dropdown-menu';

      link.classList.add('services-dropdown-trigger');
      link.setAttribute('aria-haspopup', 'true');
      link.insertAdjacentHTML('beforeend', ' <i class="fas fa-chevron-down services-dropdown-caret" aria-hidden="true"></i>');

      serviceItems.forEach(function (item) {
        var menuLink = document.createElement('a');
        menuLink.href = item[0];
        menuLink.textContent = item[1];
        menu.appendChild(menuLink);
      });

      link.parentNode.insertBefore(wrapper, link);
      wrapper.appendChild(link);
      wrapper.appendChild(menu);
    });
  }

  function installAboutDropdowns() {
    var aboutLinks = document.querySelectorAll('.nav-link[href="about.html"]');
    var aboutItems = [
      ['about.html#about', 'About'],
      ['about.html#purpose', 'Purpose'],
      ['about.html#team', 'Team'],
      ['about.html#certificates', 'Certificates']
    ];

    Array.prototype.forEach.call(aboutLinks, function (link) {
      if (link.closest('.about-dropdown')) return;

      var wrapper = document.createElement('div');
      var menu = document.createElement('div');
      wrapper.className = 'about-dropdown';
      menu.className = 'about-dropdown-menu';

      link.classList.add('about-dropdown-trigger');
      link.setAttribute('aria-haspopup', 'true');
      link.insertAdjacentHTML('beforeend', ' <i class="fas fa-chevron-down about-dropdown-caret" aria-hidden="true"></i>');

      aboutItems.forEach(function (item) {
        var menuLink = document.createElement('a');
        menuLink.href = item[0];
        menuLink.textContent = item[1];
        menu.appendChild(menuLink);
      });

      link.parentNode.insertBefore(wrapper, link);
      wrapper.appendChild(link);
      wrapper.appendChild(menu);
    });
  }

  function connectQuoteButtons() {
    Array.prototype.forEach.call(document.querySelectorAll('a'), function (link) {
      if (link.textContent.trim().replace(/\s+/g, ' ') === 'Get a Free Quote') {
        link.setAttribute('href', 'get-a-quote.html');
      }
    });
  }

  function boot() {
    applyPageContent(getLocalContent());
    installServicesDropdowns();
    installAboutDropdowns();
    connectQuoteButtons();
    loadRemoteContent();
  }

  window.VaishCms = {
    storageKey: STORAGE_KEY,
    pageName: pageName,
    getTargets: getTargets,
    getLocalContent: getLocalContent,
    saveLocalContent: saveLocalContent,
    applyPageContent: applyPageContent,
    applyChange: applyChange,
    loadRemoteContent: loadRemoteContent
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
