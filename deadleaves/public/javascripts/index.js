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
      console.log(reader);
      thumbnail.src = reader.result;
    };
    console.log(target);
    reader.readAsDataURL(target);

  });
});
// http://stackoverflow.com/questions/14069421/show-an-image-preview-before-upload
