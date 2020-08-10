//= require jsoneditor/jsoneditor.js
//= require jsoneditor/asset/jsonlint/jsonlint.js

;(function(window, $) {
    $(function() {
        $('#comments').css('display', 'none')
        $('div.jsoneditor-wrap').each(function(i,wrap){
            var fieldset = $(wrap).parents('li:eq(0)');
            var container = $(wrap)[0];
            var textarea = $($(wrap).find('textarea'));
            var editor;
            var options = {
                modes: ['tree'],
                mode: 'tree',
                change: function(ev){
                    try {
                        var text = JSON.stringify(editor.get());
                        textarea.text(text);
                        $(fieldset).toggleClass('error',false);
                        textarea.text(JSON.stringify(editor.get()));

                    } catch (e) {
                        editor.options.error(e);
                    }
                },
                error: function(e){
                    $(fieldset).toggleClass('error',true);
                }
            };

            if ((textarea.val() == 'null')) {
                let value = 'null';
                if (textarea[0].id == 'instrument_content')
                    value = "{\"description\":[{\"text\":\"\"}],\"marking_criteria\":[{\"criteria\":\"\"}] }";
                if (textarea[0].id == 'level_content')
                    value = "{\"overview_list\":[{\"overview\":\"\"}]}";
                textarea.text(value);
            }
            else {
                textarea.text(JSON.parse(textarea.val()))

                if (textarea[0].id == 'instrument_content') {
                    if (!textarea.val().includes("marking_criteria")) {

                        var pos = textarea.val().lastIndexOf('}');

                        var str =  textarea.val().substring(0,pos) + ",\"marking_criteria\":[{\"criteria\":\"\"}] }" + textarea.val().substring(pos+1)

                        textarea.text(str);
                    }


                    if (!textarea.val().includes("description")) {

                        var pos = textarea.val().lastIndexOf('}');

                        var str =  textarea.val().substring(0,pos) + ",\"description\":[{\"text\":\"\"}] }" + textarea.val().substring(pos+1)

                        textarea.text(str);
                    }
                }
            }

            console.log(textarea.val());
            editor = new JSONEditor(container, options, JSON.parse(textarea.val()));
            editor.expandAll()
        });
    });
})(window, jQuery);


