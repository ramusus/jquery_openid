/*
OpenID Plugin
http://code.google.com/p/openid-realselector/

Martin Conte Mac Donell <Reflejo@gmail.com>
*/

(function($) {
  $.fn.openid = function(opt) {
    var gprovider;

    var defaults = {
      txt: {
        label: 'Enter your {provider} {username}',
        username: 'username',
        title: 'Select your openID provider',
        sign: 'Sign-In'
      },
      /*
       Default providers with url. "big" variable means that icon
       will be big.
      */
      providers: [
        {
          name: 'Facebook',
          href: $.django.urls.get_absolute('netauth-begin', 'facebook') + '?next={next}',
          submit: false,
          label: null,
          big: true
        },
        {
          name: 'Vkontakte',
          onclick: vk_login,
          submit: false,
          label: null,
          big: true
        },
        {
          name: 'Twitter',
          href: $.django.urls.get_absolute('netauth-begin', 'twitter') + '?next={next}',
          submit: false,
          label: null,
          big: true
        },
        {
          name: 'Yandex',
          href: $.django.urls.get_absolute('netauth-begin', 'yandex') + '?next={next}',
          submit: false,
          label: null,
          big: true
        },
        {
          name: 'Google',
          url: 'https://www.google.com/accounts/o8/id',
          label: null,
          big: true
        },
        {
          name: 'Yahoo',
          url: 'http://yahoo.com/',
          label: null,
          big: true
        },
        {
          name: 'AOL',
          username_txt: 'screenname',
          url: 'http://openid.aol.com/{username}',
          big: true
        },
        {
          name: 'OpenID',
          username_txt: 'url',
          big: true
        },
        {
          name: 'MyOpenID',
          url: 'http://{username}.myopenid.com/'
        },
        {
          name: 'Flickr',
          url: 'http://flickr.com/{username}/'
        },
        {
          name: 'Technorati',
          url: 'http://technorati.com/people/technorati/{username}/'
        },
        {
          name: 'Wordpress',
          url: 'http://{username}.wordpress.com/'
        },
        {
          name: 'Blogger',
          url: 'http://{username}.blogspot.com/'
        },
        {
          name: 'Verisign',
          url: 'http://{username}.pip.verisignlabs.com/'
        },
        {
          name: 'Vidoop',
          url: 'http://{username}.myvidoop.com/'
        },
        {
          name: 'ClaimID',
          url: 'http://claimid.com/{username}'
        },
        {
          name: 'LiveJournal',
          url: 'http://{username}.livejournal.com'
        },
        {
          name: 'MySpace',
          url: 'http://www.myspace.com/{username}'
        }
      ],
      cookie_expires: 6 * 30, // in days.
      cookie_path: '/',
      img_path: '/img/',
      inputareaManual: false,
      inputareaContainer: false,
      buttonsContainer: false,
      inputName: 'url',
      withUrls: false
    };

    var INPUTID = (opt.inputareaManual && opt.inputareaManual.inputAccount) ? $(opt.inputareaManual.inputAccount).attr('id') : 'openid_username';
    var containerSelector = opt.inputareaContainer ? opt.inputareaContainer : '#openid_inputarea';
    var inputarea = $(containerSelector).length ? $(containerSelector): $('<div id="openid_inputarea" />');

    var getBox = function(provider, idx, box_size, href, url) {
      var a = $('<a title="' + provider + '" href="' + href + '" id="btn_' + idx +
                '" class="openid_' + box_size + '_btn ' + provider + '"' + (settings.withUrls ? 'rel="' + url + '"' : '') + ' />');
      return a.click(signIn);
    };

    var setCookie = function(value) {
      var date = new Date();
      date.setTime(date.getTime() + (settings.cookie_expires * 24 * 60 * 60 * 1000));
      document.cookie = "openid_prov=" + value + "; expires=" + date.toGMTString() +
                        "; path=" + settings.cookie_path;
    };

    var readCookie = function() {
        var prov = null;
        $.each(document.cookie.split(';'), function(i, c) {
            var pos = c.indexOf("openid_prov=");
            if (pos != -1) {
                prov = $.trim(c.slice(pos + 12));
                return;
            }
        });
        return prov;
    };

    var signIn = function(obj, tidx) {
      var idx = $(tidx || this).attr('id').replace('btn_', '');
      if (!(gprovider = settings.providers[idx]))
        return;

      // Hightlight
      if (highlight = $('#openid_highlight'))
            highlight.replaceWith($('#openid_highlight a')[0]);

      $('#btn_' + idx).wrap('<div id="openid_highlight" />');
      setCookie(idx);

      // if defined 'href' and 'submit' parameter is false, just go by link
      var submit = true;
      if(gprovider.href && gprovider.submit === false) {
            inputarea.fadeOut();
            return true;
      }

      // if defined onlick parameter and it's callable, just call it
      if(gprovider.onclick && typeof gprovider.onclick === 'function') {
            inputarea.fadeOut();
            gprovider.onclick();
            return false;
      }

      // prompt user for input?
      showInputBox();
      if (gprovider.label !== null)
        return false;

        if(!settings.inputareaContainer) {
            inputarea.text(settings.txt.title);
        } else {
            inputarea.hide();
        }
        if (!tidx && submit) {
            inputarea.fadeOut();
            form.submit();
        }

        return false;
    };

    var showInputBox = function() {
      var lbl = (gprovider.label || settings.txt.label).replace(
        '{username}', (gprovider.username_txt !== undefined) ? gprovider.username_txt: settings.txt.username
      ).replace('{provider}', gprovider.name);

      if(settings.inputareaManual) {
        inputarea.show();
        $(settings.inputareaManual.label).html(lbl);
      } else {
          inputarea.empty().show().append('<span class="oidlabel">' + lbl + '</span><input id="' + INPUTID + '" type="text" ' +
            ' name="username_txt" class="Verisign"/><input type="submit" value="' + settings.txt.sign + '"/>');
      }

      $('#' + INPUTID).focus();
    };

    var submit = function(){
      var prov = (gprovider.url) ? gprovider.url.replace('{username}', $('#' + INPUTID).val()) : $('#' + INPUTID).val();
      $(inputUrl).val(prov);
    };

    var settings = $.extend(defaults, opt || {});
    var btns = $('#openid_btns').length ? $('#openid_btns'): $('<div id="openid_btns" />');

    var form = this;
    form.css({'background-image': 'none'});
    form.append(settings.buttonsContainer ? '' : btns).submit(submit);

    // Add box for each provider
    var addbr = true;
    $.each(settings.providers, function(i, val) {
        if (!val.big && addbr) {
            btns.append('<br />');
            addbr = false;
        }
        var href = val.href ? val.href.replace('{next}', $('input:hidden[name="next"]', form).val()) : '';
        btns.append(getBox(val.name, i, (val.big) ? 'large': 'small', href, (val.url ? val.url : '')));
    });

    if(!settings.inputareaContainer)
        btns.append(inputarea);

    if(settings.inputName) {
        var jInputUrl = $('input[name="' + settings.inputName + '"]');
        var inputUrl = jInputUrl.length ? jInputUrl.hide() : form.append($('<input type="hidden" name="' + settings.inputName + '" />'));
    }

    if (idx = readCookie()) {
        // select openid container by cookie
        signIn(null, '#btn_' + idx);
    } else if(!settings.inputareaContainer) {
        inputarea.text(settings.txt.title).show();
    }

    return this;
  };
})(jQuery);
