(function() {
	function camelCase(str) {
		return str.split(/[^\w]+/).map((part, index) => {
				return index > 0 ?
					part.substr(0,1).toUpperCase() + part.substr(1).toLowerCase() :
					part.toLowerCase()
			}).join('');
	}

	const config = {
		prefix: 'i-',
		src: '/images/i.dist.svg'
	};

	document.querySelectorAll('head meta[name^="ba-icon-"]')
		.forEach((meta) => {
			var name = meta.getAttribute('name'),
				val = meta.getAttribute('content');

			name = name.replace(/^ba-icon-/, '');
			name = camelCase(name);

			config[camelCase(name)] = val;
		});

	config = Object.freeze(config);

	const _svg = new WeakMap(),
		_use = new WeakMap(),
		_shadow = new WeakMap(),

		IS_MS = (
			window.navigator.userAgent.indexOf(' Trident/') >= 0 ||
			window.navigator.userAgent.indexOf(' Edge/') >= 0
		);

	class HTMLBaIconElement extends HTMLDivElement {
		get ref() {
			return _use.get(this).getAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href');
		}

		set ref(ref) {
			if (typeof ref !== 'string') {
				return;
			}

			ref = ref.replace(/^#/, '');
			ref = '#' + config.prefix + ref.replace(new RegExp(`^${config.prefix}`), '');

			if (!IS_MS) {
				ref = config.src + ref;
			}

			_use.get(this).setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', ref);
		}

		get size() {
			return this.getAttribute('size');
		}

		set size(val) {
			if (typeof val !== 'string') {
				val = '32';
			}

			val = val.toLowerCase();

			if (!isNaN(val)) {
				val = [val,val];
			} else if (val.match(/^\d+x\d+$/)) {
				val = val.split('x');
			} else {
				val = [val];
			}

			var [width, height] = val,
				svg = _svg.get(this);

			height = height || width;

			if (isNaN(width)) {
				svg.removeAttribute('width');
				svg.removeAttribute('height');
			} else {
				svg.setAttribute('width', width);
				svg.setAttribute('height', height);
			}

			this.setAttribute('size', val.join('x'));
		}

		get primaryColor() {
			return this.getAttribute('primary-color');
		}

		set primaryColor(val) {
			this.setAttribute('primary-color', val);
		}

		get secondaryColor() {
			return this.getAttribute('secondary-color');
		}

		set secondaryColor(val) {
			this.setAttribute('secondary-color', val);
		}

		createdCallback() {
			var shadow = this.createShadowRoot(),
				svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
				use = document.createElementNS('http://www.w3.org/2000/svg', 'use');

			_shadow.set(this, shadow);
			_svg.set(this, svg);
			_use.set(this, use);

			svg.appendChild(use);
			shadow.appendChild(svg);

			this.ref = this.getAttribute('ref');
			this.size = this.getAttribute('size');
		}

		attributeChangedCallback(name, currentValue, newValue) {
			if (currentValue === newValue) {
				return;
			}

			var key = camelCase(name);

			this[key] = newValue;
		}
	}

	document.registerElement('ba-icon', HTMLBaIconElement);
})();
