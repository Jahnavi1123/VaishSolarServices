(() => {
  const showLoader = () => {
    let loader = document.getElementById('pageLoader');

    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'pageLoader';
      loader.setAttribute('aria-hidden', 'false');
      loader.innerHTML = '<div class="loader-inner"><img src="Assests/logo.jpeg" alt="VAISH Solar Services logo"><div class="text-sm text-slate-600">Loading...</div></div>';
      document.body.insertAdjacentElement('afterbegin', loader);
    }

    document.body.classList.add('preloading');

    const hideLoader = () => {
      loader.classList.add('hidden');
      window.setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
        document.body.classList.remove('preloading');
      }, 500);
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader, { once: true });
    }
  };

  if (document.body) {
    showLoader();
  } else {
    document.addEventListener('DOMContentLoaded', showLoader, { once: true });
  }
})();
