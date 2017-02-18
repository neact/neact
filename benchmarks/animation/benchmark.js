// Change N to change the number of drawn circles.

var N = 200;

(function() {

    var createVNode = Neact.createElement;
    var container = document.getElementById('grid');

    var counter;
    var boxViewProps = { className: 'box-view' };

    function createBoxes(count) {
        var boxes = [];
        for (var i = 0; i < N; i++) {
            var style = 'top:' + Math.sin(count / 10) * 10 + 'px;' +
                'left:' + Math.cos(count / 10) * 10 + 'px;' +
                'background-color:' + 'rgb(0, 0,' + count % 255 + ');';

            boxes.push(createVNode('div', boxViewProps, createVNode('div', { className: 'box', style: style }, count % 100)));

        }
        return boxes;
    }

    var infernoAnimate = function() {
        Neact.render(
            createVNode('div', null, createBoxes(counter++)),
            container
        );
    };

    var infernoInit = function() {
        counter = -1;
        infernoAnimate();
    };

    window.runInferno = function() {
        var grid = document.getElementById('grid');
        infernoInit();
        setTimeout(function() {
            startClock();
            benchmarkLoop(infernoAnimate);
        }, 300);
    };

})();

runInferno();

window.timeout = null;
window.totalTime = null;
window.loopCount = null;
window.startDate = null;
window.reset = function() {
    $('#grid').empty();
    $('#timing').html('&nbsp;');
    clearTimeout(timeout);
};
window.startClock = function() {
    loopCount = 0;
    totalTime = 0;
    startDate = Date.now();
}

window.benchmarkLoop = function(fn) {
    totalTime += Date.now() - startDate;
    startDate = Date.now();
    fn();
    loopCount++;
    if (loopCount % 20 === 0) {
        $('#timing').text('Performed ' + loopCount + ' iterations in ' + totalTime + ' ms (average ' + (totalTime / loopCount).toFixed(2) + ' ms per loop).');
    }
    timeout = _.defer(benchmarkLoop, fn);
};