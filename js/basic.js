// Configuration
const PAGE_OFFSET = 1;
let currentSurah = null;
let allSuwar = [];
let allReciters = [];

async function fetchData() {
	try {
		const recitersRes = await fetch('https://mp3quran.net/api/v3/reciters?language=ar');
		const recitersData = await recitersRes.json();
		allReciters = recitersData.reciters;

		if (typeof SURAH_MAP !== 'undefined') {
			console.log("Using local SURAH_MAP");
			allSuwar = SURAH_MAP.map(s => ({
				id: s.id,
				name: s.name,
				start_page: s.page,
				makkia: s.type === "Meccan" ? 1 : 0
			}));
		} else {
			const suwarRes = await fetch('https://mp3quran.net/api/v3/suwar?language=ar');
			const suwarData = await suwarRes.json();
			allSuwar = suwarData.suwar;
		}

		return true;
	} catch (error) {
		console.error("Error fetching data:", error);
		return false;
	}
}

async function loadApp() {
	// Show loading state if needed
	$('#suwar-list').html('<p style="padding: 20px; text-align: center; opacity: 0.5;">جاري تحميل البيانات...</p>');

	const dataLoaded = await fetchData();
	if (!dataLoaded) {
		$('#suwar-list').html('<p style="padding: 20px; text-align: center; color: #ef4444;">فشل تحميل البيانات. يرجى التحقق من الاتصال.</p>');
		return;
	}

	var pagesHtml = '<div style="background-image:url(data/cover.fbk)"></div>';
	for (var i = 1; i <= 677; i++) {
		var pageNum = ('000' + i).slice(-3);
		pagesHtml += '<div style="background-image:url(data/Quran_Page_' + pageNum + '.fbk)"></div>';
	}
	$('.flipbook').html(pagesHtml);

	$('.flipbook').turn({
		width: 1100,
		height: 720,
		elevation: 50,
		gradients: true,
		autoCenter: true,
		when: {
			turned: function (e, page) {
				$('#page-tooltip').text('صفحة ' + page);
				$('#page-number-left').text(page);
				$('#mushaf-slider').val(page);
				localStorage.setItem('lastReadPage', page);
			}
		}
	});

	populateReciters();
	renderSuwarList(allSuwar);
	setupEventListeners();

	// Restore last read page
	const lastPage = localStorage.getItem('lastReadPage');
	if (lastPage) {
		$('.flipbook').turn('page', parseInt(lastPage));
	}
}

function populateReciters() {
	const $select = $('#reciter-select');
	$select.empty();

	// Sort or filter reciters if needed. Here we just take them all.
	allReciters.forEach(reciter => {
		// Only add if they have at least one moshaf (most do)
		if (reciter.moshaf && reciter.moshaf.length > 0) {
			const $opt = $('<option></option>')
				.val(reciter.id)
				.text(reciter.name)
				.data('moshaf', reciter.moshaf[0]); // Default to first moshaf
			$select.append($opt);
		}
	});

	initCustomSelect();
}

function initCustomSelect() {
	const $select = $('#reciter-select');
	const $container = $('.reciter-box');
	$container.find('.custom-select').remove();

	const $customSelect = $('<div class="custom-select"></div>');
	const $selected = $('<div class="select-selected"></div>');
	const $items = $('<div class="select-items select-hide"></div>');

	// Add search input inside dropdown
	const $searchContainer = $('<div class="select-search-container"></div>');
	const $searchInput = $('<input type="text" class="select-search" placeholder="بحث عن قارئ...">');
	$searchContainer.append($searchInput);
	$items.append($searchContainer);

	const $optionsList = $('<div class="select-options-list"></div>');
	$items.append($optionsList);

	$selected.text($select.find('option:selected').text() || 'اختر القارئ');
	$customSelect.append($selected).append($items);
	$container.append($customSelect);

	$select.find('option').each(function () {
		const $opt = $('<div class="select-item"></div>');
		$opt.text($(this).text());
		if ($(this).is(':selected')) $opt.addClass('same-as-selected');

		$opt.on('click', function () {
			const idx = allReciters.findIndex(r => r.name === $(this).text());
			if (idx !== -1) {
				$select.prop('selectedIndex', idx).trigger('change');
				$selected.text($(this).text());
				$items.find('.same-as-selected').removeClass('same-as-selected');
				$(this).addClass('same-as-selected');
				$items.addClass('select-hide');
				$selected.removeClass('select-arrow-active');
			}
		});
		$optionsList.append($opt);
	});

	// Search logic for reciters
	$searchInput.on('input', function (e) {
		e.stopPropagation();
		const query = $(this).val().toLowerCase();
		$optionsList.find('.select-item').each(function () {
			const text = $(this).text().toLowerCase();
			$(this).toggle(text.includes(query));
		});
	});

	$searchInput.on('click', (e) => e.stopPropagation());

	$selected.on('click', function (e) {
		e.stopPropagation();
		closeAllSelect(this);
		$items.toggleClass('select-hide');
		$(this).toggleClass('select-arrow-active');
		if (!$items.hasClass('select-hide')) {
			$searchInput.focus();
		}
	});

	$(document).on('click', closeAllSelect);

	function closeAllSelect(elm) {
		if (elm !== $selected[0]) {
			$items.addClass('select-hide');
			$selected.removeClass('select-arrow-active');
		}
	}
}

function renderSuwarList(suwar) {
	const suwarList = document.getElementById('suwar-list');
	if (!suwarList) return;

	suwarList.innerHTML = '';
	suwar.forEach(surah => {
		const surahDiv = document.createElement('div');
		surahDiv.classList.add('surah-item');
		surahDiv.setAttribute('data-id', surah.id);
		if (currentSurah && currentSurah.id === surah.id) surahDiv.classList.add('active');

		const typeIcon = surah.makkia === 1 ? "🕋" : "🕌";

		surahDiv.innerHTML = `
            <div class="surah-number">${surah.id}</div>
            <div class="surah-info">
                <span class="surah-name">${surah.name}</span>
                <span class="surah-meta">صفحة ${surah.start_page}</span>
            </div>
            <div class="surah-type" title="${surah.makkia === 1 ? 'مكية' : 'مدنية'}">${typeIcon}</div>
        `;

		surahDiv.onclick = () => {
			$('.surah-item').removeClass('active');
			$(surahDiv).addClass('active');
			surahDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
			jumpToSurah(surah);
			playSurah(surah, false);
		};

		suwarList.appendChild(surahDiv);
	});
}

function jumpToSurah(surah) {
	const targetPage = surah.start_page + PAGE_OFFSET;
	$('.flipbook').turn('page', targetPage);
}

function setupEventListeners() {
	$('#surah-search').off('input').on('input', function () {
		const query = $(this).val().toLowerCase();
		const filtered = allSuwar.filter(s =>
			s.name.includes(query) || s.id.toString() === query
		);
		renderSuwarList(filtered);
	});

	$('#prev-page').off('click').on('click', () => $('.flipbook').turn('previous'));
	$('#next-page').off('click').on('click', () => $('.flipbook').turn('next'));

	$(window).unbind('keydown').bind('keydown', function (e) {
		if (e.keyCode === 37) $('.flipbook').turn('previous');
		else if (e.keyCode === 39) $('.flipbook').turn('next');
	});

	$('#mushaf-slider').off('input').on('input', function () {
		$('.flipbook').turn('page', this.value);
	});

	$('#reciter-select').off('change').on('change', function () {
		const text = $('#reciter-select option:selected').text();
		$('#player-reciter-name').text(text);
		if (currentSurah) {
			const wasPlaying = !audio.paused;
			playSurah(currentSurah, wasPlaying);
		}
	});

	const audio = document.getElementById('audio-player');

	$('#player-play-pause').off('click').on('click', function () {
		if (audio.paused) audio.play().catch(() => { });
		else audio.pause();
	});

	$(audio).off('play pause timeupdate loadedmetadata');

	$(audio).on('play', () => $('#player-play-pause').text('⏸'));
	$(audio).on('pause', () => $('#player-play-pause').text('▶'));

	$(audio).on('timeupdate', function () {
		const progress = (audio.currentTime / audio.duration) * 100;
		$('#player-progress').val(progress || 0);
		$('.progress-fill').css('width', (progress || 0) + '%');
		$('#current-time').text(formatTime(audio.currentTime));
	});

	$(audio).on('loadedmetadata', function () {
		$('#duration').text(formatTime(audio.duration));
	});

	$('#player-progress').off('input').on('input', function () {
		const time = (this.value / 100) * audio.duration;
		audio.currentTime = time;
	});

	$('#volume-slider').off('input').on('input', function () {
		audio.volume = this.value;
		if (this.value == 0) {
			$('#mute-btn').text('🔇');
		} else {
			$('#mute-btn').text('🔊');
			audio.muted = false;
		}
	});

	$('#mute-btn').off('click').on('click', function () {
		audio.muted = !audio.muted;
		if (audio.muted) {
			$(this).text('🔇');
			$('#volume-slider').val(0);
		} else {
			$(this).text('🔊');
			$('#volume-slider').val(audio.volume || 1);
		}
	});

	$('#player-next').off('click').on('click', () => {
		if (currentSurah && currentSurah.id < 114) {
			const next = allSuwar.find(s => s.id === currentSurah.id + 1);
			if (next) {
				const wasPlaying = !audio.paused;
				jumpToSurah(next);
				playSurah(next, wasPlaying);
			}
		}
	});

	$('#player-prev').off('click').on('click', () => {
		if (currentSurah && currentSurah.id > 1) {
			const prev = allSuwar.find(s => s.id === currentSurah.id - 1);
			if (prev) {
				const wasPlaying = !audio.paused;
				jumpToSurah(prev);
				playSurah(prev, wasPlaying);
			}
		}
	});
}

function formatTime(seconds) {
	if (isNaN(seconds)) return '00:00';
	const min = Math.floor(seconds / 60);
	const sec = Math.floor(seconds % 60);
	return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
}

function playSurah(surah, autoplay = true) {
	currentSurah = surah;
	const audioPlayer = document.getElementById('audio-player');
	const $selectedOpt = $('#reciter-select option:selected');
	const moshaf = $selectedOpt.data('moshaf');

	if (!moshaf) return;

	const formattedSurahId = String(surah.id).padStart(3, '0');
	// server URL in V3 usually ends with a slash.
	const baseUrl = moshaf.server.endsWith('/') ? moshaf.server : moshaf.server + '/';
	const audioUrl = `${baseUrl}${formattedSurahId}.mp3`;

	audioPlayer.src = audioUrl;
	$('#current-surah-name').text(`سورة ${surah.name}`);
	$('#player-reciter-name').text($selectedOpt.text());

	if (autoplay) {
		audioPlayer.play().catch(e => console.error("Error playing audio:", e));
	}

	$('.surah-item').removeClass('active');
	const $activeItem = $(`.surah-item[data-id="${surah.id}"]`);
	if ($activeItem.length) {
		$activeItem.addClass('active');
		$activeItem[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
}

function addPage(page, book) {
	var element = $('<div />', {});
	if (book.turn('addPage', element, page)) {
		element.html('<div class="gradient"></div><div class="loader"></div>');
		loadPage(page, element);
	}
}

function loadPage(page, pageElement) {
	var img = $('<img />');
	img.mousedown(function (e) { e.preventDefault(); });
	img.load(function () {
		$(this).css({ width: '100%', height: '100%' });
		$(this).appendTo(pageElement);
		pageElement.find('.loader').remove();
	});
	img.attr('src', 'data/Quran_Page_' + ('000' + page).slice(-3) + '.fbk');
}

yepnope({
	test: Modernizr.csstransforms,
	yep: ['lib/turn.js'],
	nope: ['lib/turn.html4.min.js'],
	complete: loadApp
});
