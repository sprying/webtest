$(function () {
    var photoUrlPrefix = './imgs/photos/',
        photoArr = ['p1.jpg', 'p2.jpg', 'p3.jpg', 'p4.jpg', 'p5.jpg',
                    'p6.jpg', 'p7.jpg', 'p8.jpg', 'p9.jpg', 'p10.jpg', 'p11.jpg'
        ],
        questionArr = [{ question: '世界上最遥远的距离，是我在浏览器，而你却在服务器，甚至更难到达的数据库。', answer: '开发' },
                       { question: '世界上最委屈的莫过于，我费尽千辛万苦为你的孩子赋予生命力后，你却还是怀疑我的审美水准，嫌我把它打扮的不够漂亮。', answer: '视觉' },
                       { question: '世界上最无奈的莫过于，明明给了你想要的，而你却说，“这样的我不想要了，我想要那样的”。', answer: 'PD' },
                       { question: '世界上最欢乐的莫过于，是大功告成后，你带我们出去happy直到high翻天。', answer: 'PM' }
        ];

    var spaceEventIndex = 0,
        answer = '',
        questionLen = questionArr.length,
        doStuff = function (spaceEventIndex) {
            switch (spaceEventIndex) {
                case 0:
                    $('#J-cover').hide();
                    showPhotos();
                    break;
                case 1:
                    $('#J-textWrapper').fadeIn();
                    break;
                case 2:
                    answer = showQuestion();
                    break;
                case 3:
                    showAnswer(answer);
                    break;
                case 10:
                    hideAll();
                    break;
                case 11:
                    showRocket();
                    break;
                case 12:
                    showOurWords();
                    break;
                case 13:
                    showOurPhoto();
            }
        };
    $(window).keypress(function (e) {
        if (e.keyCode == 32) {
            if (spaceEventIndex < 4) {
                doStuff(spaceEventIndex);
            } else if (spaceEventIndex < 2 + (questionLen * 2)) {
                if (spaceEventIndex % 2 == 0) {
                    showPhotos();
                    answer = showQuestion();
                } else {
                    showAnswer(answer);
                }
            } else {
                doStuff(spaceEventIndex);
            }
            spaceEventIndex++;
        }
    });
    
        

    //随机照片
    var showPhotos = (function () {
        var $photosWrapper = $('#J-photosWrapper'),
            $photoBlock = $photosWrapper.find('div');
        return function () {
            $photoBlock.hide();
            $photoBlock.each(function () {
                var $self = $(this),
                    len = photoArr.length,
                    index = Math.floor(Math.random() * len),
                    photoName = photoArr.splice(index, 1)[0];
                $self.css('backgroundImage', 'url(' + photoUrlPrefix + photoName + ')');
            });
            $photoBlock.fadeIn();
        }
    })();
    
    
    //显示问题
    var showQuestion = (function(){
        var $questionWrapper = $('#J-questionWrapper'),
            $answerCloud = $('#J-shakingCloud');
        return function(){
            var len = questionArr.length,
                quetionIndex = Math.floor(Math.random() * len);
                questionObj = questionArr.splice(quetionIndex, 1)[0],
            questionText = questionObj.question,
            textLen = questionText.length,
            answer = questionObj.answer,
            questionHTML = '';
            $questionWrapper.html('');
            $answerCloud.css('top','-450px')
            for (var i = 0, em; em = questionText[i++];) {
                questionHTML += '<em style="display:none">' + em + '</em>';
            }
            $questionWrapper.append('<p>' + questionHTML + '</p>');
            var $ems = $questionWrapper.find('em'),
                emAllIndex = $ems.length - 1,
                emIndex = 0,
                showEm = function () {
                    $ems.eq(emIndex++).slideDown();
                    (emIndex > emAllIndex) && clearInterval(showEm);
                }
            setInterval(showEm, 50);
            return answer;
        }
    })();
    //显示答案
    var showAnswer = (function () {
        var $answerCloud = $('#J-shakingCloud');
        return function (answer) {
            $answerCloud.find('span').text(answer);
            $answerCloud.animate({
                top: 250
            });
        }
    })();
   
    //隐藏所有，准备引出我们组
    var hideAll = function () {
        $('#J-photosWrapper,#J-textWrapper,#J-shakingCloud').hide();
        $('#J-kidding').fadeIn();
    }
    //火箭队登场
    var showRocket = function () {
        $('#J-rocket').animate({
            top: 190
        });
    }
    //ourwords
    var showOurWords = function () {
        $('#J-kidding,#J-rocket').hide();
        var $ours = $('#J-ours'),
            $ourWords = $('#J-ourWords'),
            $p = $ourWords.find('p'),
            allIndex = $p.length - 1,
            index = 0,
            showLine = function () {
                $p.eq(index++).fadeIn();
                (index > allIndex) && clearInterval(showLine);
            }
        $ours.show();
        $ourWords.show();
        setInterval(showLine, 1000);
    };
    var showOurPhoto = function () {
        $('#J-ourWords').hide();
        $('#J-photoForAll').fadeIn('slow');
    }
});