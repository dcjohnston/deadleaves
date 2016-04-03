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

  // $('#image').change(function(ev) {
  //   var target = this.files[0];
  //   var thumbnail = $('#selected-image')[0];
  //
  //   var reader = new FileReader();
  //   reader.onload = function() {
  //     thumbnail.src = reader.result;
  //   };
  //   reader.readAsDataURL(target);
  //   $(this).parent().addClass('has-success');
  // });

  function setResult() {
    $('button.progress-button:first-of-type').removeClass('active');
    $('button.progress-button:last-of-type').addClass('active');
    $('div.slick-container').slick('slickGoTo', 1);
  }

  function setInitial() {
    $('button.progress-button:first-of-type').addClass('active');
    $('button.progress-button:last-of-type').removeClass('active');
    $('div.slick-container').slick('slickGoTo', 0);
  }

  $('button.progress-button:first-of-type').click(setInitial);

  $('#app-form').submit(function(ev) {
    var req = $(this).serializeArray().reduce(function (data, field) {
      data[field.name] = field.value;
      return data;
    }, {});
    $.post({
      data: req,
      url: '/api/task',
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

  $('div.slick-container').slick({
    draggable: false,
    arrows: false,
  });

});
