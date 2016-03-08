$(function(){
  $('input.emoji-picker').emojiPicker({
    height: '300px',
    width: '300px'
  });

  $('#image').change(function(ev){
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
      success: function (res) {
        console.log(res);
      }
    });

    ev.preventDefault();
    ev.stopPropagation();
    return false;
  });
});
