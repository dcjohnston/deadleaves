$(function() {

  $('div.slick-container').slick({
    draggable: false,
    arrows: false,
    mobileFirst: true,
    swipe: false,
    touchMove: false,
  });

  $('input.emoji-picker').emojiPicker({
    button: false,
  });

  $('input.emoji-picker').click(function(){
    $(this).emojiPicker('toggle');
  });

  $('input[type="color"]').spectrum({
    replacerClassName: 'form-control',
    change: function (color) {
      $('input[type="color"]').val(color);
    },
    clickoutFiresChange: true,
    preferredFormat: 'hex',
    showButtons: false
  });

  $('select#size')[0].add(new Option(screen.width + ' x ' + screen.height + ' (Screen Dimensions)',
    screen.width + 'x' + screen.height, true, true));

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
    $('button.progress-button').first().removeClass('active');
    $('button.progress-button').last().addClass('active');
    $('div.slick-container').slick('slickGoTo', 1);
  }

  function setInitial() {
    $('button.progress-button').first().addClass('active');
    $('button.progress-button').last().removeClass('active');
    $('div.slick-container').slick('slickGoTo', 0);
  }

  $('button.progress-button.first').click(setInitial);

  $('#app-form').submit(function(ev) {
    // $('button[type="submit"]').addAttr('disabled');
    var req = $(this).serializeArray().reduce(function(data, field) {
      data[field.name] = field.value;
      return data;
    }, {});
    req['intensity'] = .55 - req['intensity'];
    $('button[type="submit"]').prop('disabled', true);
    $('button[type="submit"]').isLoading({
      'position': "right", // right | inside | overlay
      'text': "Generating SVG ...", // Text to display next to the loader
      'class': "icon-refresh", // loader CSS class
      'tpl': '<div class="isloading-wrapper %wrapper%">%text%<span class="glyphicon glyphicon-repeat normal-right-spinner"></span></div>',
    });
    $.post({
      data: req,
      url: '/api/generate',
      success: function(res) {
        $('button[type="submit"]').isLoading('hide');
        $('button[type="submit"]').isLoading({
          'position': "right", // right | inside | overlay
          'text': "Rasterizing ...", // Text to display next to the loader
          'class': "icon-refresh", // loader CSS class
          'tpl': '<div class="isloading-wrapper %wrapper%">%text%<span class="glyphicon glyphicon-repeat normal-right-spinner"></span></div>',
        })
        $('button[type="submit"]').prop('disabled', true);
        var updateWaitMessage = setTimeout(function () {
          $('button[type="submit"]').isLoading('hide');
          $('button[type="submit"]').isLoading({
            'position': "right", // right | inside | overlay
            'text': "Working hard  ...", // Text to display next to the loader
            'class': "icon-refresh", // loader CSS class
            'tpl': '<div class="isloading-wrapper %wrapper%">%text%<span class="glyphicon glyphicon-repeat normal-right-spinner"></span></div>',
          });
          $('button[type="submit"]').prop('disabled', true);
          updateWaitMessage = setTimeout(function () {
            $('button[type="submit"]').isLoading('hide');
            $('button[type="submit"]').isLoading({
              'position': "right", // right | inside | overlay
              'text': "Please allow up to 30 seconds", // Text to display next to the loader
              'class': "icon-refresh", // loader CSS class
              'tpl': '<div class="isloading-wrapper %wrapper%">%text%<span class="glyphicon glyphicon-repeat normal-right-spinner"></span></div>',
            });
            $('button[type="submit"]').prop('disabled', true);
          }, 5000);
        }, 5000);
        $.post({
          url: '/api/rasterize',
          data: {
            target: res.target,
            width: res.width,
            height: res.height,
          },
          success: function(res) {
            $('button[type="submit"]').prop('disabled', false);
            $('img#result-preview').attr('src', res.encodedUri);
            $('a#download-result')
              .attr('href', res.encodedUri)
              .attr('download', 'emoji_' + res.name);
            setResult();
            $('button[type="submit"]').isLoading('hide');
            clearTimeout(updateWaitMessage);
          }
        })
      }
    });

    ev.preventDefault();
    ev.stopPropagation();
    return false;
  });

});
