$(function() {
  $('input.emoji-picker').emojiPicker({
    height: '300px',
    width: '300px'
  });

  $('input#intensity').change(function(ev) {
    var v = $('input#intensity').val();
    $('output#intensity-val').val(v);
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
        $('img#result-preview').attr('src', 'data:image/png;base64,' + res);
        $('a#download-result').attr('href', 'data:image/png;base64,' + res);
        // var reader = new FileReader();
        // var blob = new Blob(res.body);
        // reader.onload = function() {
        //   $('img#result-preview')[0].src = reader.result;
        // }
        // reader.readAsBinaryString(res);
      }
    });

    ev.preventDefault();
    ev.stopPropagation();
    return false;
  });
});
