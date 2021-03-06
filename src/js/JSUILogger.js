// Mini Hi 在调试过程中有些问题, 控制台无法使用,因而我做了这个工具,用来解决这个问题.在其他的类似场景一样好用.

(function (global) {

    // 全局不可变变量
    var name = 'JSUILogger';
    var version = '1.0.0';
    var author = 'leiquan';
    var console = global.console;
    var wraper = document.createElement('div');
    var btn = document.createElement('div');
    var container = document.createElement('div');
    var output = document.createElement('ul');
    var input = document.createElement('input');
    var cmd = []; // 缓存命令,供上下键使用
    var cmdIndex = 0;
    var levelColor = {
        debug: 'blue',
        error: 'red',
        warning: 'yellow',
        log: 'purple',
        info: 'green',
        default: '#555',
        init: '#cf4646',
        input: '#cf4646'
    };
    var showConsole = true;

    // 覆盖原生的 console.log
    (function () {

        console.oldLog = console.log;

        console.log = function () {
            global.JSUILogger.output([].join.call(arguments, ''), levelColor.log, 'log');
            this.oldLog.apply(this, arguments);
        };

        console.debug = function () {
            global.JSUILogger.output([].join.call(arguments, ''), levelColor.debug, 'debug');
            this.oldLog.apply(this, arguments);
        };

        console.error = function () {
            global.JSUILogger.output([].join.call(arguments, ''), levelColor.error, 'error');
            this.oldLog.apply(this, arguments);
        };

        console.info = function () {
            global.JSUILogger.output([].join.call(arguments, ''), levelColor.info, 'info');
            this.oldLog.apply(this, arguments);
        };

        console.debug = function () {
            global.JSUILogger.output([].join.call(arguments, ''), levelColor.debug, 'debug');
            this.oldLog.apply(this, arguments);
        };

        // 这是个特殊的方法,只在welcome 的时候使用,给不一样的类名,防止后续被清空
        console.init = function () {
            global.JSUILogger.output([].join.call(arguments, ''), levelColor.init, 'init');
            this.oldLog.apply(this, arguments);
        };

    })();

    var JSUILogger = function () {
        // 类属性
    }

    JSUILogger.prototype.UI = function () {

        var self = this;

        var initUI = function () {

            wraper.className = 'JSUILogger-wraper';
            btn.className = 'JSUILogger-btn';
            container.className = 'JSUILogger-container';
            output.className = 'JSUILogger-output';
            input.className = 'JSUILogger-input';
            input.placeholder = 'input...';
            input.autofocus = 'autofocus';

            document.body.appendChild(wraper);

            wraper.appendChild(btn);
            wraper.appendChild(container);
            container.appendChild(output);
            container.appendChild(input);

        }

        var initCSS = function () {

            wraper.style.width = '100%';
            wraper.style.height = 'auto';
            wraper.style.position = 'fixed';
            wraper.style.top = '0';
            wraper.style.left = '0';
            wraper.zIndex = '10000';

            btn.style.width = '40px';
            btn.style.height = '63px'
            btn.style.lineHeight = '63px'
            btn.style.color = 'white';
            btn.style.backgroundColor = '#020202';
            btn.zIndex = '9999';

            btn.style.float = 'left';
            btn.style.cursor = 'pointer';
            btn.style.textAlign = 'center';
            btn.innerHTML = '《';
            btn.style.userSelect = 'none';


            container.style.width = '600px';
            container.style.height = 'auto';
            container.style.minHeight = '50px';
            container.style.border = '#e3e3e3 1px solid';
            container.style.marginLeft = '40px';
            container.style.boxSizing = 'border-box';
            container.style.opacity = '0.6';
            container.style.boxShadow = '0px 6px 5px #020202';
            container.zIndex = '9999';

            output.style.width = '100%';
            output.style.height = 'auto';
            output.style.maxHeight = '200px';
            output.style.padding = '0';
            output.style.margin = '0';
            output.style.minHeight = '0';
            output.style.overflowY = 'auto';
            output.style.boxSizing = 'border-box';
            output.zIndex = '9999';

            input.style.width = '100%';
            input.style.height = '35px';
            input.style.boxSizing = 'border-box';
            input.style.border = 'none';
            input.style.outline = 'none';
            input.style.margin = '0';
            input.style.minHeight = '0';
            input.style.paddingLeft = '10px';
            input.style.boxSizing = 'border-box';
            input.style.fontSize = '14px';
            input.zIndex = '9999';

        };

        var initEvent = function () {

            input.addEventListener('keydown', function (e) {

                if (e.which == 13) {
                    var cmdJson = input.value;
                    cmd.push(cmdJson);

                    self.output(cmdJson, levelColor.input);

                    self.input(input.value);
                    cmdIndex = cmd.length - 1;
                } else if (e.which == 38) {

                    if (cmdIndex == 0) {
                        input.value = cmd[0] ? cmd[0] : '';
                    } else {
                        input.value = cmd[cmdIndex] ? cmd[cmdIndex] : '';
                        cmdIndex--;
                    }

                } else if (e.which == 40) {

                    if (cmdIndex == cmd.length - 1) {
                        input.value = cmd[cmdIndex] ? cmd[cmdIndex] : '';
                    } else {

                        if (cmd[cmdIndex]) {
                            input.value = cmd[cmdIndex] ? cmd[cmdIndex] : '';
                            cmdIndex++;
                        } else {
                            input.value = '';
                        }

                    }

                }
            }, false);

            btn.addEventListener('click', function (e) {
                self.close();
            }, false);

        };

        initUI();
        initCSS();
        initEvent();

    };

    JSUILogger.prototype.close = function () {
        if (showConsole) {
            showConsole = false;
            btn.innerHTML = '》';
            container.style.visibility = 'hidden';
        } else {
            showConsole = true;
            btn.innerHTML = '《';
            container.style.visibility = 'visible';
        }
    };

    JSUILogger.prototype.clear = function () {

        // 清空命令缓存
        cmd = [];
        cmdIndex = 0;

        // 清空输出内容
        var exit = false;
        while (output.lastChild && !exit) {

            if (output.lastChild.className !== 'init') { // 防止清空欢迎语
                var oldNode = output.removeChild(output.lastChild);
                oldNode = null;
            } else {
                exit = true;
            }

        }

    };

    JSUILogger.prototype.input = function (value) {

        // 这里首先要对 input 进行初步处理
        input.value = '';
        if (value.charAt(0) == ':') {
            this.optionHandle(value);
        } else {
            try {
                var res = window.eval(value);
                this.output(res);
            } catch (e) {
                console.log(e);
            }
        }
    };

    JSUILogger.prototype.output = function (value, level, className) {

        if (!level) {
            level = levelColor.default;
        }

        var li = document.createElement('li');
        li.innerHTML = '<span style="color:' + level + '">' + value + '</span>';
        li.style.borderBottom = '1px solid #ccc';
        li.style.fontSize = '14px';
        li.style.height = 'auto';
        li.style.minHeight = '25px';
        li.style.lineHeight = '25px';
        li.style.padding = '0px';
        li.style.paddingLeft = '10px';
        li.style.margin = '0';
        li.style.boxSizing = 'border-box';
        li.className = className ? className : '';

        output.appendChild(li);

        li.scrollIntoView();
    };

    // 过滤,将非 filter 全部隐藏,注意,init 的 welcome 不隐藏
    JSUILogger.prototype.filter = function (filter) {

        if (filter == 'log' || filter == 'info' || filter == 'debug' || filter == 'error' || filter == 'warning') {

            var children = output.childNodes;

            for (var i = 0; i < children.length; i++) {

                if (children[i].className !== filter && children[i].className !== 'init') {
                    children[i].style.display = 'none';
                }

            }

        } else if (filter == 'all') {
            var children = output.childNodes;

            for (var j = 0; j < children.length; j++) {
                children[j].style.display = 'block';
            }

        } else {
            alert('filter wrong!');
        }

    }

    // 指令处理
    JSUILogger.prototype.optionHandle = function (opt) {

        var option = opt.substr(1, opt.length);

        var temp = option; // 缓存变量

        if (option == 'clear') {
            this.clear();
        }
        else if (option == 'close') {
            this.close();
        }
        else if (temp.substr(0, 6) == 'filter') {

            var filter = temp.substr(7, temp.length);

            this.filter(filter);

            temp = option; //恢复变量

        } else {
            alert('Operate faild!');
        }

    }

    JSUILogger.prototype.JSONFormater = function (json) {

        var p = [],
            push = function (m) {
                return '\\' + p.push(m) + '\\';
            },
            pop = function (m, i) {
                return p[i - 1]
            },
            tabs = function (count) {
                return new Array(count + 1).join('\t');
            };

        p = [];
        var out = "",
            indent = 0;

        // Extract backslashes and strings
        json = json
            .replace(/\\./g, push)
            .replace(/(".*?"|'.*?')/g, push)
            .replace(/\s+/, '');

        // Indent and insert newlines
        for (var i = 0; i < json.length; i++) {
            var c = json.charAt(i);

            switch (c) {
                case '{':
                case '[':
                    out += c + "\n" + tabs(++indent);
                    break;
                case '}':
                case ']':
                    out += "\n" + tabs(--indent) + c;
                    break;
                case ',':
                    out += ",\n" + tabs(indent);
                    break;
                case ':':
                    out += ": ";
                    break;
                default:
                    out += c;
                    break;
            }
        }

        // Strip whitespace from numeric arrays and put backslashes
        // and strings back in
        out = out
            .replace(/\[[\d,\s]+?\]/g, function (m) {
                return m.replace(/\s/g, '');
            })
            .replace(/\\(\d+)\\/g, pop) // strings
            .replace(/\\(\d+)\\/g, pop); // backslashes in strings

        return out;
    };

    JSUILogger.prototype.version = version;

    JSUILogger.prototype.author = author;

    JSUILogger.prototype.name = name;

    JSUILogger.prototype.start = function () {
        this.UI();
    };

    // 初始化逻辑
    global.JSUILogger = new JSUILogger();

    // 欢迎提示语
    console.init('Welcome to ' + global.JSUILogger.name + ': ' + global.JSUILogger.version);

})(window);