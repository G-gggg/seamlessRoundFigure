class Carousel {
    constructor() {
        this.doms = {
            carousel: document.querySelector('.carousel'),
            indicators: document.querySelectorAll('.indicator span'),
            arrowRight: document.querySelector('.carousel-arrow-right'),
            arrowLeft: document.querySelector('.carousel-arrow-left'),
            container: document.querySelector('.container'),
        };
        this.curIndex = 0;
        this.count = this.doms.indicators.length;
        this.autoPlayTimer = null;

        // 绑定事件处理函数
        this.doms.arrowLeft.addEventListener('click', () => this.leftNext());
        this.doms.arrowRight.addEventListener('click', () => this.rightNext());
        this.doms.container.addEventListener('mouseenter', () => this.endAutoPlay());
        this.doms.container.addEventListener('mouseleave', () => this.startAutoPlay());

        this.doms.indicators.forEach((item, i) => {
            item.addEventListener('click', () => this.moveTo(i));
        });

        // 获取轮播图数据
        this.getData();
    }

    // 获取轮播图数据
    getData() {
        ajax({
            url: 'https://sspai.com/api/v1/recommend/page/get?limit=5&offset=0&type=home_main',
            onsuccess: (data) => this.createCarousel(data),
            onerror: (error) => console.error('Error fetching data:', error),
        });
    }

    // 创建轮播图
    createCarousel(data) {
        data.data.forEach((item, index) => {
            const img = document.createElement('img');
            img.src = 'https://cdn.sspai.com/' + item.image;
            img.alt = item.title;
            this.doms.carousel.appendChild(img);
        });
        this.init();
        this.startAutoPlay();
    }

    // 初始化轮播图
    init() {
        // 克隆第一张和最后一张
        const first = this.doms.carousel.firstElementChild.cloneNode(true);
        const last = this.doms.carousel.lastElementChild.cloneNode(true);
        // 添加到最后和最前面
        this.doms.carousel.appendChild(first);
        this.doms.carousel.insertBefore(last, this.doms.carousel.firstElementChild);
        // 设置最后一张复制图为绝对定位
        last.style.position = 'absolute';
        last.style.transform = 'translateX(-100%)';
    }

    // 左右箭头点击事件
    leftNext() {
        if (this.curIndex === 0) {
            this.doms.carousel.style.transform = `translateX(-${this.count}00%)`; // 移动到最后一张复制图
            this.doms.carousel.style.transition = 'none';
            this.doms.carousel.clientHeight; // 强制重绘
            this.moveTo(this.count - 1);
        } else {
            this.moveTo(this.curIndex - 1);
        }
    }

    rightNext() {
        if (this.curIndex === this.count - 1) {
            this.doms.carousel.style.transform = 'translateX(100%)';
            this.doms.carousel.style.transition = 'none';
            this.doms.carousel.clientHeight; // 强制重绘
            this.moveTo(0);
        } else {
            this.moveTo(this.curIndex + 1);
        }
    }

    // 移动轮播图到第几个板块
    moveTo(index) {
        this.doms.carousel.style.transform = `translateX(${-index}00%)`;
        this.doms.carousel.style.transition = '.5s';
        // 去除当前选中的指示器
        const active = document.querySelector('.indicator span.active');
        active.classList.remove('active');
        // 重新设置要选中的指示器
        this.doms.indicators[index].classList.add('active');
        this.curIndex = index;
    }

    // 自动轮播
    startAutoPlay() {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = setInterval(() => this.rightNext(), 3000);
        // 左箭头从左面滑出
        this.doms.arrowLeft.style.transform = 'translateX(0)';
        this.doms.arrowLeft.style.transition = 'transform .5s';
        this.doms.arrowLeft.clientHeight; // 强制重绘
        this.doms.arrowLeft.style.transform = 'translateX(-100%)';
        // 右箭头从右面滑出
        this.doms.arrowRight.style.transform = 'translateX(0)';
        this.doms.arrowRight.style.transition = 'transform .5s';
        this.doms.arrowRight.clientHeight; // 强制重绘
        this.doms.arrowRight.style.transform = 'translateX(100%)';

        this.doms.arrowLeft.style.transition = '.5s';
        this.doms.arrowLeft.clientHeight; // 强制重绘
        this.doms.arrowLeft.style.opacity = '0';

        this.doms.arrowRight.style.transition = '.5s';
        this.doms.arrowRight.clientHeight; // 强制重绘
        this.doms.arrowRight.style.opacity = '0';
    }

    // 停止自动轮播
    endAutoPlay() {
        clearInterval(this.autoPlayTimer);
        // 左箭头从左面滑出
        this.doms.arrowLeft.style.display = 'flex';
        this.doms.arrowLeft.style.transform = 'translateX(-100%)';
        this.doms.arrowLeft.style.transition = 'transform .5s';
        this.doms.arrowLeft.clientHeight; // 强制重绘
        this.doms.arrowLeft.style.transform = 'translateX(0)';
        // 右箭头从右面滑出
        this.doms.arrowRight.style.display = 'flex';
        this.doms.arrowRight.style.transform = 'translateX(100%)';
        this.doms.arrowRight.style.transition = 'transform .5s';
        this.doms.arrowRight.clientHeight; // 强制重绘
        this.doms.arrowRight.style.transform = 'translateX(0)';

        this.doms.arrowRight.style.opacity = '1';
        this.doms.arrowLeft.style.opacity = '1';
    }
}

// ajax请求
function ajax({
    url,
    method = 'GET',
    params = {},
    data = {},
    onsuccess = () => { },
    onerror = () => { },
} = {}) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        const response = JSON.parse(xhr.response);
        onsuccess(response);
    };
    xhr.onerror = onerror;
    url = new URL(url);
    for (const key in params) {
        url.searchParams.append(key, params[key]);
    }
    xhr.open(method, url.href);
    if (method.toUpperCase() !== 'GET') {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf8');
    }
    xhr.send(JSON.stringify(data));
}

const carousel = new Carousel(); 