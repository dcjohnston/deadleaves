$(function() {
  $('input.emoji-picker').emojiPicker({
    height: '300px',
    width: '300px'
  });

  $('input#intensity').change(function(ev) {
    var v = $('input#intensity').val();
    $('output#intensity-val').val(v);
    $('#input#intensity').parent().addClass('has-success');
  });

  $('input#intensity').trigger('change');

  $('#image').change(function(ev) {
    var target = this.files[0];
    var thumbnail = $('#selected-image')[0];

    var reader = new FileReader();
    reader.onload = function() {
      thumbnail.src = reader.result;
    };
    reader.readAsDataURL(target);
    $(this).parent().addClass('has-success');
  });

  $('#app-form').submit(function(ev) {
    var req = new FormData(this);

    $.ajax({
      data: req,
      url: '/api/task',
      type: 'POST',
      contentType: false,
      processData: false,
      success: function(res) {
        $('div.form-container').addClass('animated slideOutLeft').addClass('hidden');
        $('div.container.result-preview').addClass('animated slideInRight').removeClass('hidden');
        $('img#result-preview').attr('src', 'data:image/png;base64,' + res.image);
        $('a#download-result')
          .attr('href', 'data:image/png;base64,' + res.image)
          .attr('download', 'emoji_' + res.name);
      }
    });

    ev.preventDefault();
    ev.stopPropagation();
    return false;
  });

});
