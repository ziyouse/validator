// Generated by CoffeeScript 1.9.2
(function() {
  var Validator;

  Validator = {};

  Validator.validators = {};

  Validator.messages = {};

  Validator.messageHandlers = {};

  Validator.cfg = {
    ignore: ':hidden'
  };

  Validator.validate = function(id) {
    var $elem, $form, elem, elements, i, len, pass, type;
    $form = $('#' + id);
    if ($form[0].nodeName.toLowerCase() !== 'form') {
      throw 'should be form';
    }
    elements = $form.data("_" + id + "_");
    if (!elements) {
      elements = $form.find('input, textarea, select').not(':submit, :reset, :image, [disabled]').not(this.cfg.ignore);
      $form.data("_" + id + "_", elements);
    }
    pass = true;
    for (i = 0, len = elements.length; i < len; i++) {
      elem = elements[i];
      type = elem.nodeName.toLowerCase();
      $elem = $(elem);
      if (!this.validateElement($elem, type)) {
        pass = false;
      }
    }
    return pass;
  };

  Validator.validateElement = function(elem, type) {
    var pass;
    if (type === 'textarea') {
      type = 'input';
    }
    pass = Validator[type].call(this, elem);
    return pass;
  };

  Validator.input = function(elem) {
    var pass, ref, rule, val, validator;
    pass = true;
    if (this.checkable(elem)) {
      pass = this.check(elem);
    } else {
      val = elem.val();
      ref = this.validators;
      for (rule in ref) {
        validator = ref[rule];
        if (elem.is('[' + rule + ']')) {
          if (!(pass = validator.call(this, val, elem))) {
            this.tip(rule, elem);
            break;
          }
        }
      }
    }
    return pass;
  };

  Validator.select = function(elem) {
    var pass;
    pass = !!elem.val();
    if (!pass) {
      elem.css('color', 'red');
    }
    elem.one('change', function() {
      return $(this).css('color', '');
    });
    return pass;
  };

  Validator.check = function(elem) {
    var $group, checkedCount, elem0, form, name, pass;
    pass = true;
    name = elem[0].name;
    form = elem[0].form;
    $group = $(form).find("[name=" + name + "]");
    elem0 = $($group[0]);
    if (elem0.is('[required]')) {
      checkedCount = $group.filter(':checked').length;
      pass = checkedCount > 0;
      if (!pass) {
        this.messageHandlers.check.call(this, ' ', elem);
      }
    }
    return pass;
  };

  Validator.tip = function(rule, elem) {
    var message, messageHandler;
    messageHandler = rule in this.messageHandlers ? rule : 'defaults';
    message = rule in this.messages ? rule : 'defaults';
    return this.messageHandlers[messageHandler].call(this, this.messages[message].call(this, elem), elem);
  };

  Validator.isOptional = function(val, elem) {
    var it_is_optional;
    it_is_optional = elem.is('[required]') ? this.validators.required.call(this, val, elem) : val.length;
    return !it_is_optional;
  };

  Validator.checkable = function(elem) {
    return /radio|checkbox/i.test(elem.attr('type'));
  };

  $.extend(Validator.validators, {
    required: function(val, elem) {
      return !!val;
    },
    max: function(val, elem) {
      var max;
      max = elem.attr('max');
      return this.isOptional(val, elem) || val.length <= max;
    },
    min: function(val, elem) {
      var min;
      min = elem.attr('min');
      return this.isOptional(val, elem) || val.length >= min;
    },
    regexp: function(val, elem) {
      var re, reStr;
      reStr = elem.attr('regexp');
      re = new RegExp(reStr);
      return this.isOptional(val, elem) || re.test(val);
    },
    hidden: function(val, elem) {
      return !!val;
    }
  });

  $.extend(Validator.messageHandlers, {
    defaults: function(msg, elem) {
      return elem.css('color', 'red').val(msg).one('focus', function() {
        return $(this).val('').css('color', '');
      });
    },
    hidden: function(msg, elem) {
      return console.log((elem.attr('name')) + " say: i am hidden input but i am required");
    },
    check: function(msg, elem) {
      return console.log((elem.attr('name')) + " say: i am required");
    }
  });

  $.extend(Validator.messages, {
    defaults: function(elem) {
      var msg;
      msg = elem.attr('data-msg');
      return msg != null ? msg : msg = '总感觉哪里不对-_-';
    },
    required: function(elem) {
      var msg;
      msg = elem.attr('data-msg');
      return msg != null ? msg : msg = '必填';
    },
    min: function(elem) {
      var min, msg;
      min = elem.attr('min');
      msg = elem.attr('data-msg');
      return msg != null ? msg : msg = "不能小于" + min + "个字符";
    },
    max: function(elem) {
      var max, msg;
      max = elem.attr('max');
      msg = elem.attr('data-msg');
      return msg != null ? msg : msg = "不能大于" + max + "个字符";
    },
    regexp: function(elem) {
      var msg;
      msg = elem.attr('data-msg');
      return msg != null ? msg : msg = '格式错误';
    }
  });

  this.Validator || (this.Validator = Validator);

  $.fn.validate = function() {
    var id;
    id = this.attr('id');
    return Validator.validate(id);
  };

}).call(this);
