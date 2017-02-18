(function() {
    "use strict";
    var elem = document.getElementById('app');

    perfMonitor.startFPSMonitor();
    perfMonitor.startMemMonitor();
    perfMonitor.initProfiler('view update');

    var createElement = Neact.createVNode;
    var tableProps = {
        className: 'table table-striped latest-data'
    };
    var dbName = {
        className: 'dbname'
    };
    var dbQueryCount = {
        className: 'query-count'
    };
    var foo = {
        className: 'foo'
    };
    var popoverLeft = {
        className: 'popover left'
    };
    var popoverContent = {
        className: 'popover-content'
    };

    function renderBenchmark(dbs) {
        var length = dbs.length;
        var databases = new Array(length);

        for (var i = 0; i < length; i++) {
            var db = dbs[i];
            var lastSample = db.lastSample;
            var children = new Array(7);

            children[0] = createElement('td', dbName, db.dbname);
            children[1] = createElement('td', dbQueryCount, createElement('span', {
                className: lastSample.countClassName
            }, lastSample.nbQueries));

            for (var i2 = 0; i2 < 5; i2++) {
                var query = lastSample.topFiveQueries[i2];

                children[i2 + 2] = createElement('td', {
                    className: query.elapsedClassName
                }, [
                    createElement('div', foo, (query.formatElapsed)),
                    createElement('div', popoverLeft, [
                        createElement('div', popoverContent, (query.query)),
                        createElement('div', { className: 'arrow' })
                    ])
                ]);
                databases[i] = createElement('tr', null, children);
            }
        }

        Neact.render(
            createElement('table', tableProps, createElement('tbody', null, databases)),
            elem);
    }

    function render() {
        var dbs = ENV.generateData(false).toArray();
        perfMonitor.startProfile('view update');
        renderBenchmark(dbs);
        perfMonitor.endProfile('view update');
        setTimeout(render, ENV.timeout);
    }
    render();
})();