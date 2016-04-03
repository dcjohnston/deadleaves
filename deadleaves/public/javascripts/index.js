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

  function setResult() {
    $('button.progress-button:first-of-type').removeClass('active');
    $('button.progress-button:last-of-type').addClass('active');
    $('div.form-container').addClass('animated slideOutLeft').addClass('hidden');
    $('div.container.result-preview').addClass('animated slideInRight').removeClass('hidden');
  }

  function setInitial() {
    $('button.progress-button:first-of-type').addClass('active');
    $('button.progress-button:last-of-type').removeClass('active');
    $('div.form-container').addClass('animated slideInRight').removeClass('hidden');
    $('div.container.result-preview').addClass('animated slideOutRight hidden');
  }

  $('button.progress-button:first-of-type').click(setInitial);

  $('#app-form').submit(function(ev) {
    var req = new FormData(this);

    $.ajax({
      data: req,
      url: '/api/task',
      type: 'POST',
      contentType: false,
      processData: false,
      success: function(res) {
        $('img#result-preview').attr('src', 'data:image/png;base64,' + res.image);
        $('a#download-result')
          .attr('href', 'data:image/png;base64,' + res.image)
          .attr('download', 'emoji_' + res.name);
        setResult();
      }
    });

    ev.preventDefault();
    ev.stopPropagation();
    return false;
  });

});
