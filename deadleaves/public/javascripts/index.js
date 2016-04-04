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
        window.setTimeout(function () {
          $('object#result-preview').attr('data', '/preview/' + res.preview);
        }, 500);
        $('a#download-result')
          .attr('href', '/preview/' + res.preview)
          .attr('download', 'emoji_' + res.preview);
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
