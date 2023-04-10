let doms = {
    carousel: document.querySelector('.carousel'),
    indicators: document.querySelectorAll('.indicator span'),
    arrowRight: document.querySelector('.carousel-arrow-right'),
    arrowLeft: document.querySelector('.carousel-arrow-left'),
    container: document.querySelector('.container'),
}
let curIndex = 0; // 当前显示的是第几个板块
let count = doms.indicators.length; // 一共有几个板块
let autoPlayTimer = null; // 自动轮播定时器

doms.arrowLeft.onclick = leftNext;
doms.arrowRight.onclick = rightNext;

// 鼠标移入移出事件
doms.container.addEventListener("mouseenter", endAutoPlay);
doms.container.addEventListener("mouseleave", startAutoPlay);

// 给每个指示器添加点击事件
doms.indicators.forEach(function(item, i){
    item.onclick = function(){
        moveTo(i);
    };
});

// 获取轮播图数据
ajax({
    url: "https://sspai.com/api/v1/recommend/page/get?limit=5&offset=0&type=home_main",
    onsuccess: createCarousel,
    onerror: function (error) {
        console.error("Error fetching data:", error);
    },
});

// 创建轮播图
function createCarousel(data) {
    data.data.forEach(function (item, index) {
        var img = document.createElement("img");
        img.src = "https://cdn.sspai.com/" + item.image;
        img.alt = item.title;
        doms.carousel.appendChild(img);
    });
    init();
}

// 自动轮播
function startAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(nextClick, 3000);
    // 左箭头从左面滑出
    doms.arrowLeft.style.transform = "translateX(0)";
    doms.arrowLeft.style.transition = "transform .5s";
    doms.arrowLeft.clientHeight; // 强制重绘
    doms.arrowLeft.style.transform = "translateX(-100%)";
    // 右箭头从右面滑出
    doms.arrowRight.style.transform = "translateX(0)";
    doms.arrowRight.style.transition = "transform .5s";
    doms.arrowRight.clientHeight; // 强制重绘
    doms.arrowRight.style.transform = "translateX(100%)";

    doms.arrowLeft.style.transition = ".5s";
    doms.arrowLeft.clientHeight; // 强制重绘
    doms.arrowLeft.style.opacity = "0";

    doms.arrowRight.style.transition = ".5s";
    doms.arrowRight.clientHeight; // 强制重绘
    doms.arrowRight.style.opacity = "0";

}

// 停止自动轮播
function endAutoPlay() {
    clearInterval(autoPlayTimer);
    // 左箭头从左面滑出
    doms.arrowLeft.style.display = "flex";
    doms.arrowLeft.style.transform = "translateX(-100%)";
    doms.arrowLeft.style.transition = "transform .5s";
    doms.arrowLeft.clientHeight; // 强制重绘
    doms.arrowLeft.style.transform = "translateX(0)";
    // 右箭头从右面滑出
    doms.arrowRight.style.display = "flex";
    doms.arrowRight.style.transform = "translateX(100%)";
    doms.arrowRight.style.transition = "transform .5s";
    doms.arrowRight.clientHeight; // 强制重绘
    doms.arrowRight.style.transform = "translateX(0)";

    doms.arrowRight.style.opacity = "1";
    doms.arrowLeft.style.opacity = "1";
}

// 下一张
function nextClick() {
    rightNext();
}

startAutoPlay();

// 移动轮播图到第几个板块
function moveTo(index){
    doms.carousel.style.transform = `translateX(${-index}00%)`;
    doms.carousel.style.transition = '.5s';
    // 去除当前选中的指示器
    let active = document.querySelector('.indicator span.active');
    active.classList.remove('active');
    // 重新设置要选中的指示器
    doms.indicators[index].classList.add('active');
    curIndex = index;
}

// 初始化轮播图
function init(){
    // 克隆第一张和最后一张
    let first = doms.carousel.firstElementChild.cloneNode(true);
    let last = doms.carousel.lastElementChild.cloneNode(true);
    // 添加到最后和最前面
    doms.carousel.appendChild(first);     
    doms.carousel.insertBefore(last, doms.carousel.firstElementChild);
    // 设置最后一张复制图为绝对定位
    last.style.position = 'absolute';
    last.style.transform = 'translateX(-100%)';
}

// init();

// 左右箭头点击事件
function leftNext(){
    if(curIndex === 0){
        doms.carousel.style.transform = `translateX(-${count}00%)`; // 移动到最后一张复制图
        doms.carousel.style.transition = 'none';
        doms.carousel.clientHeight; // 强制重绘
        moveTo(count - 1);
    }else{
        moveTo(curIndex - 1);
    }
}

function rightNext(){
    if(curIndex === count - 1){
        doms.carousel.style.transform = 'translateX(100%)';
        doms.carousel.style.transition = 'none';
        doms.carousel.clientHeight; // 强制重绘
        moveTo(0);
    }else{
        moveTo(curIndex + 1);
    }
}

// ajax请求
function ajax({
    url,
    method = "GET",
    params = {},
    data = {},
    onsuccess = () => { },
    onerror = () => { }
} = {}) {
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        let response = JSON.parse(xhr.response);
        onsuccess(response)
    };
    xhr.onerror = onerror
    url = new URL(url)
    for (const key in params) {
        url.searchParams.append(key, params[key])
    }
    xhr.open(method, url.href);
    if (method.toUpperCase() !== 'GET') {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf8')
    }
    xhr.send(JSON.stringify(data));
}