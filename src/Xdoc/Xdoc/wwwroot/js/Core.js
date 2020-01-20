var CookieWorker = /** @class */ (function () {
    function CookieWorker() {
    }
    CookieWorker.prototype.setCookie = function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };
    CookieWorker.prototype.getCookie = function (name) {
        var nameEq = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ")
                c = c.substring(1, c.length);
            if (c.indexOf(nameEq) === 0)
                return c.substring(nameEq.length, c.length);
        }
        return null;
    };
    CookieWorker.prototype.eraseCookie = function (name) {
        document.cookie = name + "=; Max-Age=-99999999;";
    };
    return CookieWorker;
}());

var FormDataHelper = /** @class */ (function () {
    function FormDataHelper() {
        /*
        * Константа для обозначения null значений и вычленения их из строки
        * */
        this.NullValue = "VALUE_NULL";
        /*
        * Константа для имени аттрибута содержащего тип данных
        * */
        this.DataTypeAttributeName = "data-type";
    }
    FormDataHelper.prototype.FillDataByPrefix = function (object, prefix) {
        for (var index in object) {
            var valueOfProp = object[index];
            if (valueOfProp === null || valueOfProp === undefined) {
                continue;
            }
            var name_1 = prefix + index;
            var element = document.getElementsByName(name_1)[0];
            if (element === null || element === undefined) {
                continue;
            }
            if (Array.isArray(valueOfProp)) {
                if (element.type !== "select-multiple") {
                    alert("An attempt to set an array to HTMLInputElement which is not a select with multiple attribute");
                }
                var select = element;
                var _loop_1 = function (i) {
                    var opt = select.options[i];
                    var value = valueOfProp.filter(function (x) { return opt.value === x; }).length > 0;
                    opt.selected = value;
                };
                for (var i = 0; i < select.options.length; i++) {
                    _loop_1(i);
                }
                var event_1 = new Event("change");
                element.dispatchEvent(event_1);
                continue;
            }
            if (element.type === "checkbox") {
                element.checked = valueOfProp;
            }
            else if (element.type === "radio") {
                document.querySelector("input[name=" + name_1 + "][value=" + valueOfProp + "]").checked = true;
            }
            else {
                element.value = valueOfProp;
            }
            //Выбрасываю событие об изменении значения
            var event_2 = new Event("change");
            element.dispatchEvent(event_2);
        }
    };
    FormDataHelper.prototype.CollectDataByPrefix = function (object, prefix) {
        for (var index in object) {
            if (object.hasOwnProperty(index)) {
                var name_2 = prefix + index;
                var element = document.getElementsByName(name_2)[0];
                if (element == null) {
                    alert("\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043F\u043E \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u043E\u043C\u0443 \u0438\u043C\u0435\u043D\u0438 " + name_2);
                    return;
                }
                var rawValue = this.GetRawValueFromElement(element);
                object[index] = this.ValueMapper(rawValue, element.getAttribute(this.DataTypeAttributeName));
            }
        }
    };
    FormDataHelper.prototype.GetRawValueFromElement = function (htmlElement) {
        if (htmlElement.type === "select-multiple") {
            return Array.apply(null, htmlElement.options)
                .filter(function (option) { return option.selected; })
                .map(function (option) { return option.value; });
        }
        if (htmlElement.type === "radio") {
            var flag = document.querySelector("input[name=\"" + name + "\"]:checked") != null;
            if (flag) {
                var elem = document.querySelector("input[name=\"" + name + "\"]:checked");
                console.log("FormDataHelper.Radio", elem);
                return elem.value;
            }
            return null;
        }
        //Чекбоксы нужно проверять отдельно потому что у них свойство не value а почему-то checked
        return htmlElement.type === "checkbox" ? htmlElement.checked : htmlElement.value;
    };
    /**
     * Собрать данные с сопоставлением типов
     * @param modelPrefix префикс модели
     * @param typeDescription описание типа
     */
    FormDataHelper.prototype.CollectDataByPrefixWithTypeMatching = function (modelPrefix, typeDescription) {
        this.CheckData(typeDescription);
        var initData = this.BuildObject(typeDescription);
        this.CollectDataByPrefix(initData, modelPrefix);
        for (var i = 0; i < typeDescription.Properties.length; i++) {
            var prop = typeDescription.Properties[i];
            var initValue = this.GetInitValue(initData[prop.PropertyDescription.PropertyName]);
            initData[prop.PropertyDescription.PropertyName] = this.ValueMapper(initValue, prop.TypeName);
        }
        return initData;
    };
    FormDataHelper.prototype.ValueMapper = function (rawValue, dataType) {
        console.log("FormDataHelper.ValueMapper", rawValue, dataType);
        if (rawValue === this.NullValue) {
            return null;
        }
        switch (dataType) {
            case CSharpType.DateTime.toString():
                return new Date(rawValue);
            case CSharpType.Decimal.toString():
                return (rawValue !== null) ? Number((rawValue).replace(/,/g, '.')) : null;
            case CSharpType.Boolean.toString():
                return (rawValue !== null) ? rawValue.toLowerCase() === "true" : null;
        }
        return rawValue;
    };
    FormDataHelper.prototype.GetInitValue = function (propValue) {
        var strValue = propValue;
        return strValue === this.NullValue ? null : strValue;
    };
    FormDataHelper.prototype.CheckData = function (typeDescription) {
        if (!typeDescription.IsClass) {
            var mes = "Тип не являющийся классом не поддерживается";
            alert(mes);
            throw Error(mes);
        }
    };
    FormDataHelper.prototype.BuildObject = function (typeDescription) {
        var data = {};
        for (var i = 0; i < typeDescription.Properties.length; i++) {
            var prop = typeDescription.Properties[i];
            data[prop.PropertyDescription.PropertyName] = "";
        }
        return data;
    };
    return FormDataHelper;
}());

var CrocoJsApplication = /** @class */ (function () {
    function CrocoJsApplication() {
    }
    return CrocoJsApplication;
}());






var FormDataUtils = /** @class */ (function () {
    function FormDataUtils() {
    }
    FormDataUtils.prototype.GetStartUrlNoParams = function (startUrl) {
        if (startUrl === void 0) { startUrl = null; }
        startUrl = startUrl == null ? window.location.href : startUrl;
        if (!startUrl.includes('?')) {
            return startUrl;
        }
        return startUrl.split('?')[0];
    };
    /*
     * Получить объект, который будет содержать все поля
     * */
    FormDataUtils.prototype.GetUrlParamsObject = function (startUrl) {
        if (startUrl === void 0) { startUrl = null; }
        startUrl = startUrl == null ? window.location.href : startUrl;
        var url = unescape(startUrl);
        var obj = {};
        if (!url.includes('?')) {
            return obj;
        }
        var paramsUrl = url.split('?')[1].split('&');
        for (var i = 0; i < paramsUrl.length; i++) {
            var para = paramsUrl[i];
            if (!para.includes('=')) {
                continue;
            }
            var bits = paramsUrl[i].split('=');
            obj[bits[0]] = bits[1];
        }
        return obj;
    };
    FormDataUtils.prototype.ProccessStringPropertiesAsDateTime = function (obj, propNames) {
        var _this = this;
        if (Array.isArray(obj)) {
            return obj.map(function (x) { return _this.ProccessStringPropertiesAsDateTime(x, propNames); });
        }
        for (var i in obj) {
            var oldValue = obj[i];
            if (Array.isArray(oldValue)) {
                obj[i] = oldValue.map(function (x) { return _this.ProccessStringPropertiesAsDateTime(x, propNames); });
                continue;
            }
            if (oldValue instanceof Object && oldValue.constructor === Object) {
                obj[i] = this.ProccessStringPropertiesAsDateTime(oldValue, propNames);
                continue;
            }
            if (propNames.findIndex(function (t) { return t === i; }) > -1 && obj[i] != null) {
                obj[i] = new Date(oldValue);
            }
        }
        return obj;
    };
    FormDataUtils.prototype.ProccessAllDateTimePropertiesAsString = function (obj) {
        for (var i in obj) {
            if (Object.prototype.toString.call(obj[i]) === '[object Date]') {
                obj[i] = obj[i].toISOString();
            }
        }
        return obj;
    };
    return FormDataUtils;
}());

var CSharpType;
(function (CSharpType) {
    CSharpType[CSharpType["String"] = "String"] = "String";
    CSharpType[CSharpType["Int"] = "Int"] = "Int";
    CSharpType[CSharpType["Decimal"] = "Decimal"] = "Decimal";
    CSharpType[CSharpType["Boolean"] = "Boolean"] = "Boolean";
    CSharpType[CSharpType["DateTime"] = "DateTime"] = "DateTime";
})(CSharpType || (CSharpType = {}));
var DatePickerUtils = /** @class */ (function () {
    function DatePickerUtils() {
    }
    DatePickerUtils.InitDictionary = function () {
        $.fn.datepicker['dates']['ru'] = {
            days: ['понедельник', 'воскресенье', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
            daysShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
            daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
                'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            today: "Today"
        };
    };
    DatePickerUtils.SetDatePicker = function (datePickerId, elementIdToUpdate, dateValue) {
        if (dateValue === void 0) { dateValue = null; }
        var datePickerElement = document.getElementById(datePickerId);
        if (datePickerElement == null) {
            alert("Utils.SetDatePicker \u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0441 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u043E\u043C " + datePickerId + " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435");
        }
        var toUpdateElement = document.getElementById(elementIdToUpdate);
        if (toUpdateElement == null) {
            alert("Utils.SetDatePicker \u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0441 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u043E\u043C " + elementIdToUpdate + " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435");
        }
        var selector = "#" + datePickerId;
        $(selector).datepicker({
            format: "dd/mm/yyyy",
            autoclose: true,
            language: "ru",
            zIndexOffset: 1000
        });
        DatePickerUtils.ActiveDatePickers.push({
            BackElementId: elementIdToUpdate,
            DatePickerId: datePickerId
        });
        //Ставлю обработчик на изменение основного элемента
        $(selector).on("change", function (e) {
            var comingValue = e.target.value;
            var dateValue = new Date(DatePickerUtils.DDMMYYYYToMMDDDDYYYYString(comingValue));
            if (isNaN(dateValue.getTime())) {
                dateValue = null;
            }
            var valueToSet = dateValue == null ? CrocoAppCore.Application.FormDataHelper.NullValue
                //Убираем добавленные таймзоны а затем отсекаем время
                : new Date(dateValue.getTime() - (dateValue.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
            console.log("Utils.DatePickerValueChanged", dateValue, valueToSet);
            //Устанавливаем дату обрезая время
            document.getElementById(elementIdToUpdate).value = valueToSet;
        });
        //Вкидываю событие об изменении чтобы фейковый элемент подхватил данные с дэйтпикера
        var event = new Event("change");
        var element = document.getElementById(datePickerId);
        element.dispatchEvent(event);
        if (dateValue !== undefined) {
            DatePickerUtils.SetDateToDatePicker(datePickerId, dateValue);
        }
    };
    DatePickerUtils.SetDateToDatePicker = function (datePickerId, dateValue) {
        var selector = "#" + datePickerId;
        $(selector).datepicker("setDate", dateValue);
    };
    DatePickerUtils.DDMMYYYYToMMDDDDYYYYString = function (s) {
        var bits = s.split("/");
        return bits[1] + "/" + bits[0] + "/" + bits[2];
    };
    DatePickerUtils.GetDateFromDatePicker = function (inputId) {
        var elem = DatePickerUtils.ActiveDatePickers.find(function (x) { return x.DatePickerId === inputId; });
        if (elem == null) {
            alert("DatePicker \u0441 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u043E\u043C " + inputId + " \u043D\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0438\u0440\u043E\u0432\u0430\u043D \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435");
        }
        return new Date(document.getElementById(elem.BackElementId).value);
    };
    DatePickerUtils.ActiveDatePickers = [];
    return DatePickerUtils;
}());
DatePickerUtils.InitDictionary();

var ImageSizeType;
(function (ImageSizeType) {
    ImageSizeType[ImageSizeType["Icon"] = "Icon"] = "Icon";
    ImageSizeType[ImageSizeType["Medium"] = "Medium"] = "Medium";
    ImageSizeType[ImageSizeType["Small"] = "Small"] = "Small";
    ImageSizeType[ImageSizeType["Original"] = "Original"] = "Original";
})(ImageSizeType || (ImageSizeType = {}));

var TimePickerUtils = /** @class */ (function () {
    function TimePickerUtils() {
    }
    TimePickerUtils.SetTimePicker = function (elementId) {
        $("#" + elementId).timepicker();
    };
    TimePickerUtils.GetTimeValueInMinutes = function (elementId) {
        var elem = document.getElementById(elementId);
        if (elem == null) {
            alert("\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0441 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u043E\u043C '" + elementId + "' \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435");
            return;
        }
        var value = elem.value;
        if (value == '12:00 AM') {
            return 0;
        }
        var initBits = value.split(' ');
        var timeBits = initBits[0].split(':').map(function (x) { return Number(x); });
        var result = timeBits[0] * 60 + timeBits[1];
        return initBits[1] == 'PM' ? result + 12 * 60 : result;
    };
    return TimePickerUtils;
}());

/// <reference path="../../../node_modules/@types/bootstrap/index.d.ts"/>
/// <reference path="../../../node_modules/@types/bootstrap-datepicker/index.d.ts"/>
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.FillSelect = function (select, array, htmlFunc, valueFunc) {
        for (var i = 0; i < array.length; i++) {
            var opt = document.createElement("option");
            opt.innerHTML = htmlFunc(array[i]);
            opt.value = valueFunc(array[i]);
            select.append(opt);
        }
    };
    Utils.GetImageLinkByFileId = function (fileId, sizeType) {
        return "/FileCopies/Images/" + sizeType.toString() + "/" + fileId + ".jpg";
    };
    return Utils;
}());
var UserInterfaceType;
(function (UserInterfaceType) {
    UserInterfaceType[UserInterfaceType["CustomInput"] = "CustomInput"] = "CustomInput";
    UserInterfaceType[UserInterfaceType["TextBox"] = "TextBox"] = "TextBox";
    UserInterfaceType[UserInterfaceType["TextArea"] = "TextArea"] = "TextArea";
    UserInterfaceType[UserInterfaceType["DropDownList"] = "DropDownList"] = "DropDownList";
    UserInterfaceType[UserInterfaceType["Hidden"] = "Hidden"] = "Hidden";
    UserInterfaceType[UserInterfaceType["DatePicker"] = "DatePicker"] = "DatePicker";
    UserInterfaceType[UserInterfaceType["MultipleDropDownList"] = "MultipleDropDownList"] = "MultipleDropDownList";
})(UserInterfaceType || (UserInterfaceType = {}));









var FormDrawFactory = /** @class */ (function () {
    function FormDrawFactory(opts) {
        this._defaultImplementation = opts.DefaultImplementation;
        this._implementations = opts.Implementations;
    }
    FormDrawFactory.prototype.GetImplementation = function (buildModel, key) {
        var func = this._implementations.get(key);
        if (func == null) {
            return this._defaultImplementation(buildModel);
        }
        return func(buildModel);
    };
    return FormDrawFactory;
}());

var FormDrawHelper = /** @class */ (function () {
    function FormDrawHelper() {
    }
    FormDrawHelper.GetPropertyValueName = function (propertyName, modelPrefix) {
        return "" + modelPrefix + propertyName;
    };
    FormDrawHelper.GetOuterFormElement = function (propertyName, modelPrefix) {
        return document.querySelector("[" + FormDrawHelper.FormPropertyName + "=\"" + propertyName + "\"][" + FormDrawHelper.FormModelPrefix + "=\"" + modelPrefix + "\"]");
    };
    FormDrawHelper.GetOuterFormAttributes = function (propertyName, modelPrefix) {
        return FormDrawHelper.FormPropertyName + "=\"" + propertyName + "\" " + FormDrawHelper.FormModelPrefix + "=\"" + modelPrefix + "\"";
    };
    FormDrawHelper.GetInputTypeHidden = function (propName, value, otherProps) {
        if (otherProps === void 0) { otherProps = null; }
        var t = otherProps != null ? otherProps : new Map();
        t.set("value", value);
        t.set("name", propName);
        return HtmlDrawHelper.RenderInput("hidden", t);
    };
    FormDrawHelper.FormPropertyName = "form-property-name";
    FormDrawHelper.FormModelPrefix = "form-model-prefix";
    return FormDrawHelper;
}());

var HtmlDrawHelper = /** @class */ (function () {
    function HtmlDrawHelper() {
    }
    HtmlDrawHelper.RenderInput = function (type, attrs) {
        var attrString = HtmlDrawHelper.RenderAttributesString(attrs);
        return "<input type=" + type + " " + attrString + "/>";
    };
    HtmlDrawHelper.RenderAttributesString = function (attrs) {
        var result = "";
        if (attrs == null) {
            return result;
        }
        //Итерация по ключам в map
        for (var _i = 0, _a = Array.from(attrs.keys()); _i < _a.length; _i++) {
            var key = _a[_i];
            var res = attrs.get(key);
            if (res == null || res === "") {
                result += " " + key;
            }
            else {
                result += " " + key + "=\"" + res + "\"";
            }
        }
        return result;
    };
    HtmlDrawHelper.RenderSelect = function (className, propName, selectList, attrs) {
        var attrStr = HtmlDrawHelper.RenderAttributesString(attrs);
        var select = "<select" + attrStr + " class=\"" + className + "\" name=\"" + propName + "\">";
        for (var i = 0; i < selectList.length; i++) {
            var item = selectList[i];
            var selected = item.Selected ? " selected=\"selected\"" : '';
            select += "<option" + selected + " value=\"" + item.Value + "\">" + item.Text + "</option>";
        }
        select += "</select>";
        return select;
    };
    return HtmlDrawHelper;
}());

var HtmlSelectDrawHelper = /** @class */ (function () {
    function HtmlSelectDrawHelper(nullValue) {
        this.NullValue = nullValue;
    }
    HtmlSelectDrawHelper.prototype.ProccessSelectValues = function (typeDescription, rawValue, selectList) {
        var _this = this;
        selectList.forEach(function (x) {
            if (x.Value == null) {
                x.Value = _this.NullValue;
            }
        });
        if (rawValue != null) {
            selectList.forEach(function (x) { return x.Selected = false; });
            //Заплатка для выпадающего списка 
            //TODO Вылечить это
            var item = typeDescription.TypeName == CSharpType.Boolean.toString() ?
                selectList.find(function (x) { return x.Value.toLowerCase() == rawValue.toLowerCase(); }) :
                selectList.find(function (x) { return x.Value == rawValue; });
            if (item != null) {
                item.Selected = true;
            }
        }
    };
    return HtmlSelectDrawHelper;
}());

var ValueProviderHelper = /** @class */ (function () {
    function ValueProviderHelper() {
    }
    ValueProviderHelper.GetStringValueFromValueProvider = function (prop, valueProvider) {
        var value = ValueProviderHelper.GetRawValueFromValueProvider(prop, valueProvider);
        return value == null ? "" : value;
    };
    ValueProviderHelper.GetRawValueFromValueProvider = function (prop, valueProvider) {
        if (valueProvider == null) {
            return null;
        }
        if (!prop.IsEnumerable) {
            var value = valueProvider.Singles.find(function (x) { return x.PropertyName == prop.PropertyDescription.PropertyName; });
            return (value == null) ? null : value.Value;
        }
        return "";
    };
    return ValueProviderHelper;
}());

var CrocoTypeDescriptionOverrider = /** @class */ (function () {
    function CrocoTypeDescriptionOverrider() {
    }
    CrocoTypeDescriptionOverrider.FindUserInterfacePropBlockByPropertyName = function (model, propertyName) {
        var prop = model.Blocks.find(function (x) { return x.PropertyName === propertyName; });
        if (prop == null) {
            alert("\u0421\u0432\u043E\u0439\u0441\u0442\u0432\u043E '" + propertyName + "' \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0432 \u043C\u043E\u0434\u0435\u043B\u0438 \u043E\u0431\u043E\u0431\u0449\u0435\u043D\u043D\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u043B\u0435\u044C\u0441\u043A\u043E\u0433\u043E \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430");
            return;
        }
        return prop;
    };
    CrocoTypeDescriptionOverrider.SetUserInterfaceTypeForProperty = function (model, propertyName, interfaceType) {
        var prop = CrocoTypeDescriptionOverrider.FindUserInterfacePropBlockByPropertyName(model, propertyName);
        prop.InterfaceType = interfaceType;
    };
    CrocoTypeDescriptionOverrider.RemoveProperty = function (model, propertyName) {
        model.Blocks = model.Blocks.filter(function (x) { return x.PropertyName !== propertyName; });
    };
    /**
     * Установить текстовый лейбл для имени свойста
     * @param model модель для свойства которой нужно установить лейбл
     * @param propertyName  название свойства
     * @param labelText текст лейбла для заданного свойства
     */
    CrocoTypeDescriptionOverrider.SetLabelText = function (model, propertyName, labelText) {
        CrocoTypeDescriptionOverrider.FindUserInterfacePropBlockByPropertyName(model, propertyName).LabelText = labelText;
    };
    /**
     * Установить для свойства модели тип пользовательского интрефейса скрытый инпут
     * @param model модель для которой нужно поменять тип интерфейса для свойства
     * @param propertyName имя свойства
     */
    CrocoTypeDescriptionOverrider.SetHidden = function (model, propertyName) {
        CrocoTypeDescriptionOverrider.SetUserInterfaceTypeForProperty(model, propertyName, UserInterfaceType.Hidden);
    };
    /**
     *  Установить для свойства модели тип пользовательского интерфейса textarea (большой текстовый инпут)
     * @param model  модель для которой нужно поменять тип интерфейса для свойства
     * @param propertyName имя свойства
     */
    CrocoTypeDescriptionOverrider.SetTextArea = function (model, propertyName) {
        CrocoTypeDescriptionOverrider.SetUserInterfaceTypeForProperty(model, propertyName, UserInterfaceType.TextArea);
    };
    /**
     *  Установить для свойства модели тип пользовательского интерфейса выпадающий список
     * @param model  модель для которой нужно поменять тип интерфейса для свойства
     * @param propertyName имя свойства
     * @param selectList  данные для построения выпадающего списка
     */
    CrocoTypeDescriptionOverrider.SetDropDownList = function (model, propertyName, selectList) {
        var prop = CrocoTypeDescriptionOverrider.FindUserInterfacePropBlockByPropertyName(model, propertyName);
        prop.InterfaceType = UserInterfaceType.DropDownList;
        prop.SelectList = selectList;
    };
    return CrocoTypeDescriptionOverrider;
}());

var FormTypeAfterDrawnDrawer = /** @class */ (function () {
    function FormTypeAfterDrawnDrawer() {
    }
    FormTypeAfterDrawnDrawer.SetInnerHtmlForProperty = function (propertyName, modelPrefix, innerHtml) {
        var elem = FormDrawHelper.GetOuterFormElement(propertyName, modelPrefix);
        console.log("SetInnerHtmlForProperty elem", elem);
        elem.innerHTML = innerHtml;
    };
    return FormTypeAfterDrawnDrawer;
}());

var FormTypeDrawer = /** @class */ (function () {
    function FormTypeDrawer(formDrawer, typeDescription) {
        this._formDrawer = formDrawer;
        this._typeDescription = typeDescription;
    }
    FormTypeDrawer.prototype.BeforeFormDrawing = function () {
        this._formDrawer.BeforeFormDrawing();
    };
    FormTypeDrawer.prototype.AfterFormDrawing = function () {
        this._formDrawer.AfterFormDrawing();
    };
    FormTypeDrawer.prototype.TextBoxFor = function (propertyName, wrap) {
        var prop = PropertyFormTypeSearcher.FindPropByName(this._typeDescription, propertyName);
        return this._formDrawer.RenderTextBox(prop, wrap);
    };
    FormTypeDrawer.prototype.DatePickerFor = function (propertyName, wrap) {
        var prop = PropertyFormTypeSearcher.FindPropByName(this._typeDescription, propertyName);
        return this._formDrawer.RenderDatePicker(prop, wrap);
    };
    FormTypeDrawer.prototype.TextAreaFor = function (propertyName, wrap) {
        var prop = PropertyFormTypeSearcher.FindPropByName(this._typeDescription, propertyName);
        return this._formDrawer.RenderTextArea(prop, wrap);
    };
    FormTypeDrawer.prototype.DropDownFor = function (propertyName, selectList, wrap) {
        var prop = PropertyFormTypeSearcher.FindPropByName(this._typeDescription, propertyName);
        return this._formDrawer.RenderDropDownList(prop, selectList, wrap);
    };
    FormTypeDrawer.prototype.MultipleDropDownFor = function (propertyName, selectList, wrap) {
        var prop = PropertyFormTypeSearcher.FindPropByName(this._typeDescription, propertyName);
        return this._formDrawer.RenderMultipleDropDownList(prop, selectList, wrap);
    };
    FormTypeDrawer.prototype.HiddenFor = function (propertyName, wrap) {
        var prop = PropertyFormTypeSearcher.FindPropByName(this._typeDescription, propertyName);
        return this._formDrawer.RenderHidden(prop, wrap);
    };
    return FormTypeDrawer;
}());

var FormTypeDrawerModelBuilder = /** @class */ (function () {
    function FormTypeDrawerModelBuilder(model) {
        this._model = model;
    }
    FormTypeDrawerModelBuilder.prototype.SetMultipleDropDownListFor = function (propertyName, selectListItems) {
        var block = this.GetPropertyBlockByName(propertyName);
        block.InterfaceType = UserInterfaceType.MultipleDropDownList;
        block.SelectList = selectListItems;
        this.ResetBlock(block);
        return this;
    };
    FormTypeDrawerModelBuilder.prototype.SetDropDownListFor = function (propertyName, selectListItems) {
        var block = this.GetPropertyBlockByName(propertyName);
        block.InterfaceType = UserInterfaceType.DropDownList;
        block.SelectList = selectListItems;
        this.ResetBlock(block);
        return this;
    };
    FormTypeDrawerModelBuilder.prototype.SetTextAreaFor = function (propertyName) {
        var block = this.GetPropertyBlockByName(propertyName);
        if (block.InterfaceType != UserInterfaceType.TextBox) {
            throw new Error("\u0422\u043E\u043B\u044C\u043A\u043E \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u0441 \u0442\u0438\u043F\u043E\u043C " + UserInterfaceType.TextBox + " \u043C\u043E\u0436\u043D\u043E \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u044C \u043D\u0430 " + UserInterfaceType.TextArea);
        }
        block.InterfaceType = UserInterfaceType.TextArea;
        this.ResetBlock(block);
        return this;
    };
    FormTypeDrawerModelBuilder.prototype.SetHiddenFor = function (propertyName) {
        var block = this.GetPropertyBlockByName(propertyName);
        block.InterfaceType = UserInterfaceType.Hidden;
        this.ResetBlock(block);
        return this;
    };
    FormTypeDrawerModelBuilder.prototype.ResetBlock = function (block) {
        var index = this._model.Blocks.findIndex(function (x) { return x.PropertyName == block.PropertyName; });
        this._model.Blocks[index] = block;
    };
    FormTypeDrawerModelBuilder.prototype.GetPropertyBlockByName = function (propertyName) {
        var block = this._model.Blocks.find(function (x) { return x.PropertyName == propertyName; });
        if (block == null) {
            throw new Error("\u0411\u043B\u043E\u043A \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043F\u043E \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u043E\u043C\u0443 \u0438\u043C\u0435\u043D\u0438 " + propertyName);
        }
        return block;
    };
    return FormTypeDrawerModelBuilder;
}());

var GenericForm = /** @class */ (function () {
    function GenericForm(opts) {
        this._genericInterfaces = [];
        if (opts.FormDrawFactory == null) {
            GenericForm.ThrowError("Фабрика реализаций отрисовки обобщенных форм == null. Проверьте заполнение свойства opts.FormDrawFactory");
        }
        this._formDrawFactory = opts.FormDrawFactory;
    }
    GenericForm.UnWrapModel = function (model, drawer) {
        var html = "";
        for (var i = 0; i < model.Blocks.length; i++) {
            var block = model.Blocks[i];
            switch (block.InterfaceType) {
                case UserInterfaceType.TextBox:
                    html += drawer.TextBoxFor(block.PropertyName, true);
                    break;
                case UserInterfaceType.TextArea:
                    html += drawer.TextAreaFor(block.PropertyName, true);
                    break;
                case UserInterfaceType.DropDownList:
                    html += drawer.DropDownFor(block.PropertyName, block.SelectList, true);
                    break;
                case UserInterfaceType.Hidden:
                    html += drawer.HiddenFor(block.PropertyName, true);
                    break;
                case UserInterfaceType.DatePicker:
                    html += drawer.DatePickerFor(block.PropertyName, true);
                    break;
                case UserInterfaceType.MultipleDropDownList:
                    html += drawer.MultipleDropDownFor(block.PropertyName, block.SelectList, true);
                    break;
                default:
                    console.log("Данный блок не реализован", block);
                    throw new Error("Не реализовано");
            }
        }
        return html;
    };
    GenericForm.ThrowError = function (mes) {
        alert(mes);
        throw Error(mes);
    };
    /*
     * Отрисовать все формы, которые имеются на экране
     * */
    GenericForm.prototype.DrawForms = function () {
        var elems = document.getElementsByClassName("generic-user-interface");
        for (var i = 0; i < elems.length; i++) {
            this.FindFormAndSave(elems[i]);
        }
        for (var i = 0; i < this._genericInterfaces.length; i++) {
            this.DrawForm(this._genericInterfaces[i]);
        }
    };
    GenericForm.prototype.FindFormAndSave = function (elem) {
        var id = elem.getAttribute("data-id");
        var buildModel = window[id];
        if (buildModel == null) {
            return;
        }
        if (elem.id == null) {
            console.log(elem);
            GenericForm.ThrowError("\u041D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u0438\u043C\u0435\u044E\u0442\u0441\u044F \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u0441 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C\u0438 \u0434\u043B\u044F \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043E\u0431\u043E\u0431\u0449\u0435\u043D\u043D\u043E\u0433\u043E \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430, \u043D\u043E \u0443 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u043D\u0435\u0442 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430");
        }
        this._genericInterfaces.push({
            ElementId: elem.id,
            FormDrawKey: "",
            FormModel: buildModel
        });
        window[id] = null;
    };
    GenericForm.prototype.DrawForm = function (renderModel) {
        var drawImpl = this._formDrawFactory.GetImplementation(renderModel.FormModel, renderModel.FormDrawKey);
        var drawer = new FormTypeDrawer(drawImpl, renderModel.FormModel.TypeDescription);
        drawer.BeforeFormDrawing();
        var elem = document.getElementById(renderModel.ElementId);
        if (elem == null) {
            GenericForm.ThrowError("\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0441 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u043E\u043C " + renderModel.ElementId + " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435");
        }
        elem.innerHTML = GenericForm.UnWrapModel(renderModel.FormModel, drawer);
        drawer.AfterFormDrawing();
    };
    return GenericForm;
}());

var PropertyFormTypeSearcher = /** @class */ (function () {
    function PropertyFormTypeSearcher() {
    }
    PropertyFormTypeSearcher.FindPropByNameInOneDimension = function (type, propName) {
        return type.Properties.find(function (x) { return x.PropertyDescription.PropertyName === propName; });
    };
    PropertyFormTypeSearcher.FindPropByName = function (type, propName) {
        if (propName.includes(".")) {
            var indexOfFirstDot = propName.indexOf(".");
            var fBit = propName.slice(0, indexOfFirstDot);
            var anotherBit = propName.slice(indexOfFirstDot + 1, propName.length);
            var innerProp = PropertyFormTypeSearcher.FindPropByNameInOneDimension(type, fBit);
            return PropertyFormTypeSearcher.FindPropByName(innerProp, anotherBit);
        }
        var prop = PropertyFormTypeSearcher.FindPropByNameInOneDimension(type, propName);
        if (prop == null) {
            throw new Error("\u0421\u0432\u043E\u0439\u0441\u0442\u0432\u043E " + propName + " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E");
        }
        return prop;
    };
    return PropertyFormTypeSearcher;
}());

var ValueProviderBuilder = /** @class */ (function () {
    function ValueProviderBuilder() {
    }
    /**
     * Создать провайдера значений из объекта JavaScript
     * @param obj объект из которого нужно создать провайдер значений
     */
    ValueProviderBuilder.CreateFromObject = function (obj) {
        obj = CrocoAppCore.Application.FormDataUtils.ProccessAllDateTimePropertiesAsString(obj);
        var res = {
            Arrays: [],
            Singles: []
        };
        for (var index in obj) {
            var valueOfProp = obj[index];
            if (Array.isArray(valueOfProp)) {
                //TODO Добавить поддержку массивов
                continue;
            }
            if (valueOfProp !== undefined) {
                res.Singles.push({
                    PropertyName: index,
                    Value: valueOfProp
                });
            }
        }
        return res;
    };
    return ValueProviderBuilder;
}());
var AjaxLoader = /** @class */ (function () {
    function AjaxLoader() {
    }
    AjaxLoader.prototype.InitAjaxLoads = function () {
        var elems = document.getElementsByClassName("ajax-load-html");
        for (var i = 0; i < elems.length; i++) {
            this.LoadInnerHtmlToElement(elems[i], null);
        }
    };
    AjaxLoader.prototype.LoadInnerHtmlToElement = function (element, onSuccessFunc) {
        var link = $(element).data('ajax-link');
        var method = $(element).data('ajax-method');
        var data = $(element).data('request-data');
        var onSuccessScript = $(element).data('on-finish-script');
        if (method == null) {
            method = "GET";
        }
        $.ajax({
            type: method,
            url: link,
            cache: false,
            data: data,
            success: function (response) {
                $(element).html(response);
                $(element).removeClass("ajax-load-html");
                if (onSuccessScript) {
                    eval(onSuccessScript);
                }
                if (onSuccessFunc) {
                    onSuccessFunc();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("There is an execption while executing request " + link);
                console.log(xhr);
            }
        });
    };
    return AjaxLoader;
}());

var FormDrawImplementation = /** @class */ (function () {
    function FormDrawImplementation(model) {
        this._datePickerPropNames = [];
        this._selectClass = 'form-draw-select';
        this._model = model;
        this._htmlDrawHelper = new HtmlSelectDrawHelper(CrocoAppCore.Application.FormDataHelper.NullValue);
    }
    FormDrawImplementation.prototype.BeforeFormDrawing = function () {
        //TODO Init calendar or some scripts
    };
    FormDrawImplementation.prototype.AfterFormDrawing = function () {
        //Красивые селекты
        $("." + this._selectClass).selectpicker('refresh');
        //Иницилизация календарей
        for (var i = 0; i < this._datePickerPropNames.length; i++) {
            var datePickerPropName = this._datePickerPropNames[i];
            FormDrawImplementation.InitCalendarForPrefixedProperty(this._model.Prefix, datePickerPropName);
        }
    };
    FormDrawImplementation.prototype.GetPropertyName = function (propName) {
        return FormDrawHelper.GetPropertyValueName(propName, this._model.Prefix);
    };
    FormDrawImplementation.prototype.GetPropertyBlock = function (propertyName) {
        return this._model.Blocks.find(function (x) { return x.PropertyName === propertyName; });
    };
    FormDrawImplementation.GetElementIdForFakeCalendar = function (modelPrefix, propName) {
        var result = modelPrefix + "_" + propName + "FakeCalendar";
        //в айдишниках не поддерживаются точки поэтому их все заменяю на нижние подчеркивания
        return result.replace(new RegExp(/\./, 'g'), '_');
    };
    FormDrawImplementation.GetElementIdForRealCalendarBackProperty = function (modelPrefix, propName) {
        var result = modelPrefix + "_" + propName + "RealCalendar";
        //в айдишниках не поддерживаются точки поэтому их все заменяю на нижние подчеркивания
        return result.replace(new RegExp(/\./, 'g'), '_');
    };
    FormDrawImplementation.InitCalendarForPrefixedProperty = function (modelPrefix, propName) {
        var calandarElementId = FormDrawImplementation.GetElementIdForFakeCalendar(modelPrefix, propName);
        var backPropElementId = FormDrawImplementation.GetElementIdForRealCalendarBackProperty(modelPrefix, propName);
        DatePickerUtils.SetDatePicker(calandarElementId, backPropElementId);
    };
    FormDrawImplementation.prototype.GetPropValue = function (typeDescription) {
        return ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);
    };
    FormDrawImplementation.prototype.RenderDatePicker = function (typeDescription, wrap) {
        var propName = typeDescription.PropertyDescription.PropertyName;
        var renderPropName = this.GetPropertyName(propName);
        this._datePickerPropNames.push(propName);
        var id = FormDrawImplementation.GetElementIdForFakeCalendar(this._model.Prefix, propName);
        var hiddenProps = new Map()
            .set("id", FormDrawImplementation.GetElementIdForRealCalendarBackProperty(this._model.Prefix, propName))
            .set(CrocoAppCore.Application.FormDataHelper.DataTypeAttributeName, CSharpType.String.toString());
        return this.RenderTextBoxInner(typeDescription, wrap, id, renderPropName + "Fake")
            + FormDrawHelper.GetInputTypeHidden(renderPropName, "", hiddenProps);
    };
    FormDrawImplementation.prototype.RenderHidden = function (typeDescription, wrap) {
        var value = this.GetPropValue(typeDescription);
        var html = FormDrawHelper.GetInputTypeHidden(FormDrawHelper.GetPropertyValueName(typeDescription.PropertyDescription.PropertyName, this._model.Prefix), value, null);
        return html;
    };
    FormDrawImplementation.prototype.RenderTextBox = function (typeDescription, wrap) {
        return this.RenderTextBoxInner(typeDescription, wrap, null, this.GetPropertyName(typeDescription.PropertyDescription.PropertyName));
    };
    FormDrawImplementation.prototype.RenderTextBoxInner = function (typeDescription, wrap, id, propName) {
        var _a, _b;
        var value = ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);
        var idAttr = id == null ? "" : " id=\"" + id + "\"";
        var propBlock = this.GetPropertyBlock(typeDescription.PropertyDescription.PropertyName);
        var cSharpType = ((_a = propBlock.TextBoxData) === null || _a === void 0 ? void 0 : _a.IsInteger) ? CSharpType.Int : CSharpType.String;
        var dataTypeAttr = CrocoAppCore.Application.FormDataHelper.DataTypeAttributeName + "=" + cSharpType.toString();
        var typeAndStep = ((_b = propBlock.TextBoxData) === null || _b === void 0 ? void 0 : _b.IsInteger) ? "type=\"number\" step=\"" + propBlock.TextBoxData.IntStep + "\"" : "type=\"text\"";
        var html = "<label for=\"" + typeDescription.PropertyDescription.PropertyName + "\">" + propBlock.LabelText + "</label>\n                <input" + idAttr + " autocomplete=\"off\" class=\"form-control m-input\" name=\"" + propName + "\" " + dataTypeAttr + " " + typeAndStep + " value=\"" + value + "\" />";
        if (!wrap) {
            return html;
        }
        return this.WrapInForm(typeDescription, html);
    };
    FormDrawImplementation.prototype.RenderTextArea = function (typeDescription, wrap) {
        var value = ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);
        var styles = "style=\"margin-top: 0px; margin-bottom: 0px; height: 79px;\"";
        var propBlock = this.GetPropertyBlock(typeDescription.PropertyDescription.PropertyName);
        var html = "<label for=\"" + typeDescription.PropertyDescription.PropertyName + "\">" + propBlock.LabelText + "</label>\n            <textarea autocomplete=\"off\" class=\"form-control m-input\" name=\"" + this.GetPropertyName(typeDescription.PropertyDescription.PropertyName) + "\" rows=\"3\" " + styles + ">" + value + "</textarea>";
        if (!wrap) {
            return html;
        }
        return this.WrapInForm(typeDescription, html);
    };
    FormDrawImplementation.prototype.RenderGenericDropList = function (typeDescription, selectList, isMultiple, wrap) {
        var rawValue = ValueProviderHelper.GetRawValueFromValueProvider(typeDescription, this._model.ValueProvider);
        this._htmlDrawHelper.ProccessSelectValues(typeDescription, rawValue, selectList);
        var _class = this._selectClass + " form-control m-input m-bootstrap-select m_selectpicker";
        var dict = isMultiple ? new Map().set("multiple", "") : null;
        var select = HtmlDrawHelper.RenderSelect(_class, this.GetPropertyName(typeDescription.PropertyDescription.PropertyName), selectList, dict);
        var propBlock = this.GetPropertyBlock(typeDescription.PropertyDescription.PropertyName);
        var html = "<label for=\"" + typeDescription.PropertyDescription.PropertyName + "\">" + propBlock.LabelText + "</label>" + select;
        if (!wrap) {
            return html;
        }
        return this.WrapInForm(typeDescription, html);
    };
    FormDrawImplementation.prototype.WrapInForm = function (prop, html) {
        return "<div class=\"form-group m-form__group\" " + FormDrawHelper.GetOuterFormAttributes(prop.PropertyDescription.PropertyName, this._model.Prefix) + ">\n                    " + html + "\n                </div>";
    };
    FormDrawImplementation.prototype.RenderDropDownList = function (typeDescription, selectList, wrap) {
        return this.RenderGenericDropList(typeDescription, selectList, false, wrap);
    };
    FormDrawImplementation.prototype.RenderMultipleDropDownList = function (typeDescription, selectList, wrap) {
        return this.RenderGenericDropList(typeDescription, selectList, true, wrap);
    };
    return FormDrawImplementation;
}());

var GenericInterfaceAppHelper = /** @class */ (function () {
    function GenericInterfaceAppHelper() {
        this.FormHelper = new GenericForm({ FormDrawFactory: CrocoAppCore.GetFormDrawFactory() });
    }
    /**
     * Получить модель для построения обобщенного пользовательского интерфейса
     * @param typeName Полное или сокращенное название класса C#
     * @param modelPrefix Префикс для построения модели
     * @param callBack Функция, которая вызовется когда модель будет получена с сервера
     */
    GenericInterfaceAppHelper.prototype.GetUserInterfaceModel = function (typeName, modelPrefix, callBack) {
        var data = { typeName: typeName, modelPrefix: modelPrefix };
        CrocoAppCore.Application.Requester.Post("/Api/Documentation/GenericInterface", data, function (x) {
            if (x == null) {
                alert("\u041E\u0431\u043E\u0431\u0449\u0435\u043D\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441 \u0441 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C '" + typeName + "' \u043D\u0435 \u043F\u0440\u0438\u0448\u0451\u043B \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430");
                return;
            }
            callBack(x);
        }, function () {
            var mes = "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u0438\u0441\u043A\u0435 \u043E\u0431\u043E\u0431\u0449\u0435\u043D\u043D\u043E\u0433\u043E \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430 \u043F\u043E \u0442\u0438\u043F\u0443 " + typeName;
            alert(mes);
            CrocoAppCore.Application.Logger.LogAction(mes, "", "GenericInterfaceAppHelper.GetUserInterfaceModel.ErrorOnRequest", JSON.stringify(data));
        });
    };
    /**
     * Получить модель для построения обобщенного пользовательского интерфейса
     * @param enumTypeName Полное или сокращенное название перечисления в C#
     * @param callBack Функция, которая вызовется когда модель будет получена с сервера
     */
    GenericInterfaceAppHelper.prototype.GetEnumModel = function (enumTypeName, callBack) {
        var data = { typeName: enumTypeName };
        CrocoAppCore.Application.Requester.Post("/Api/Documentation/EnumType", data, function (x) {
            if (x == null) {
                alert("\u041F\u0435\u0440\u0435\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u0435 \u0441 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C '" + enumTypeName + "' \u043D\u0435 \u043F\u0440\u0438\u0448\u043B\u043E \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430");
                return;
            }
            callBack(x);
        }, function () {
            var mes = "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u0438\u0441\u043A\u0435 \u043F\u0435\u0440\u0435\u0447\u0435\u0438\u0441\u043B\u0435\u043D\u0438\u044F \u0441 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C " + enumTypeName;
            alert(mes);
            CrocoAppCore.Application.Logger.LogAction(mes, "", "GenericInterfaceAppHelper.GetEnumModel.ErrorOnRequest", JSON.stringify(data));
        });
    };
    return GenericInterfaceAppHelper;
}());

var Logger_Resx = /** @class */ (function () {
    function Logger_Resx() {
        this.LoggingAttempFailed = "Произошла ошибка в логгировании ошибки, срочно обратитесь к разработчикам приложения";
        this.ErrorOnApiRequest = "Ошибка запроса к апи";
        this.ActionLogged = "Action logged";
        this.ExceptionLogged = "Исключение залоггировано";
        this.ErrorOccuredOnLoggingException = "Произошла ошибка в логгировании ошибки, срочно обратитесь к разработчикам приложения";
    }
    return Logger_Resx;
}());
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.LogException = function (exceptionText, exceptionDescription, link) {
        var data = {
            ExceptionDate: new Date().toISOString(),
            Description: exceptionDescription,
            Message: exceptionText,
            Uri: link !== null ? link : location.href
        };
        CrocoAppCore.Application.Requester.Post("/Api/Log/Exception", data, function (x) { return console.log(Logger.Resources.ExceptionLogged, x); }, function () { return alert(Logger.Resources.ErrorOccuredOnLoggingException); });
    };
    Logger.prototype.LogAction = function (message, description, eventId, parametersJson) {
        var data = {
            LogDate: new Date().toISOString(),
            EventId: eventId,
            ParametersJson: parametersJson,
            Uri: window.location.href,
            Description: description,
            Message: message
        };
        CrocoAppCore.Application.Requester.Post("/Api/Log/Action", data, function (x) { return console.log(Logger.Resources.ActionLogged, x); }, function () { return alert(Logger.Resources.LoggingAttempFailed); });
    };
    Logger.Resources = new Logger_Resx();
    return Logger;
}());

var ModalWorker = /** @class */ (function () {
    function ModalWorker() {
    }
    /** Показать модальное окно по идентификатору. */
    ModalWorker.prototype.ShowModal = function (modalId) {
        if (modalId === "" || modalId == null || modalId == undefined) {
            modalId = ModalWorker.LoadingModal;
        }
        $("#" + modalId).modal('show');
    };
    ModalWorker.prototype.ShowLoadingModal = function () {
        this.ShowModal(ModalWorker.LoadingModal);
    };
    ModalWorker.prototype.HideModals = function () {
        $('.modal').modal('hide');
        $(".modal-backdrop.fade").remove();
        $('.modal').on('shown.bs.modal', function () {
        });
    };
    ModalWorker.prototype.HideModal = function (modalId) {
        $("#" + modalId).modal('hide');
    };
    /**
     * идентификатор модального окна с загрузочной анимацией
     */
    ModalWorker.LoadingModal = "loadingModal";
    return ModalWorker;
}());

var MyCrocoJsApplication = /** @class */ (function () {
    function MyCrocoJsApplication() {
        this.CookieWorker = new CookieWorker();
        this.FormDataUtils = new FormDataUtils();
        this.FormDataHelper = new FormDataHelper();
        this.Logger = new Logger();
        this.Requester = new Requester();
        this.ModalWorker = new ModalWorker();
    }
    return MyCrocoJsApplication;
}());

var Requester_Resx = /** @class */ (function () {
    function Requester_Resx() {
        this.YouPassedAnEmtpyArrayOfObjects = "Вы подали пустой объект в запрос";
        this.ErrorOccuredWeKnowAboutIt = "Произошла ошибка! Мы уже знаем о ней, и скоро с ней разберемся!";
        this.FilesNotSelected = "Файлы не выбраны";
    }
    return Requester_Resx;
}());
var Requester = /** @class */ (function () {
    function Requester() {
    }
    Requester.prototype.DeleteCompletedRequest = function (link) {
        Requester.GoingRequests = Requester.GoingRequests.filter(function (x) { return x !== link; });
    };
    Requester.prototype.SendPostRequestWithAnimation = function (link, data, onSuccessFunc, onErrorFunc) {
        this.SendAjaxPostInner(link, data, onSuccessFunc, onErrorFunc, true);
    };
    Requester.prototype.UploadFilesToServer = function (inputId, link, onSuccessFunc, onErrorFunc) {
        var _this = this;
        var file_data = $("#" + inputId).prop("files");
        var form_data = new FormData();
        if (file_data.length === 0) {
            CrocoAppCore.ToastrWorker.ShowError(Requester.Resources.FilesNotSelected);
            if (onErrorFunc) {
                onErrorFunc();
            }
            return;
        }
        for (var i = 0; i < file_data.length; i++) {
            form_data.append("Files", file_data[i]);
        }
        $.ajax({
            url: link,
            type: "POST",
            data: form_data,
            async: true,
            cache: false,
            dataType: "json",
            contentType: false,
            processData: false,
            success: (function (response) {
                _this.DeleteCompletedRequest(link);
                if (onSuccessFunc) {
                    onSuccessFunc(response);
                }
            }).bind(this),
            error: (function (jqXHR, textStatus, errorThrown) {
                //Логгирую ошибку
                CrocoAppCore.Application.Logger.LogException(textStatus.toString(), "ErrorOnApiRequest", link);
                _this.DeleteCompletedRequest(link);
                CrocoAppCore.Application.ModalWorker.HideModals();
                CrocoAppCore.ToastrWorker.ShowError(Requester.Resources.ErrorOccuredWeKnowAboutIt);
                //Вызываю внешнюю функцию-обработчик
                if (onErrorFunc) {
                    onErrorFunc(jqXHR, textStatus, errorThrown);
                }
            }).bind(this)
        });
    };
    Requester.OnSuccessAnimationHandler = function (data) {
        CrocoAppCore.Application.ModalWorker.HideModals();
        CrocoAppCore.ToastrWorker.HandleBaseApiResponse(data);
    };
    Requester.OnErrorAnimationHandler = function () {
        CrocoAppCore.Application.ModalWorker.HideModals();
        CrocoAppCore.ToastrWorker.ShowError(Requester.Resources.ErrorOccuredWeKnowAboutIt);
    };
    Requester.prototype.Get = function (link, data, onSuccessFunc, onErrorFunc) {
        var _this = this;
        var params = {
            type: "GET",
            data: data,
            url: link,
            async: true,
            cache: false,
            success: (function (response) {
                _this.DeleteCompletedRequest(link);
                if (onSuccessFunc) {
                    onSuccessFunc(response);
                }
            }).bind(this),
            error: (function (jqXHR, textStatus, errorThrown) {
                //Логгирую ошибку
                CrocoAppCore.Application.Logger.LogException(textStatus.toString(), "Error on Api Request", link);
                _this.DeleteCompletedRequest(link);
                //Вызываю внешнюю функцию-обработчик
                if (onErrorFunc) {
                    onErrorFunc(jqXHR, textStatus, errorThrown);
                }
            }).bind(this)
        };
        $.ajax(params);
    };
    Requester.prototype.SendAjaxPostInner = function (link, data, onSuccessFunc, onErrorFunc, animations) {
        var _this = this;
        if (data == null) {
            alert(Requester.Resources.YouPassedAnEmtpyArrayOfObjects);
            return;
        }
        CrocoAppCore.Application.FormDataUtils.ProccessAllDateTimePropertiesAsString(data);
        var params = {};
        params.type = "POST";
        params.data = data;
        params.url = link;
        params.async = true;
        params.cache = false;
        params.success = (function (response) {
            _this.DeleteCompletedRequest(link);
            if (animations) {
                Requester.OnSuccessAnimationHandler(response);
            }
            if (onSuccessFunc) {
                onSuccessFunc(response);
            }
        }).bind(this);
        params.error = (function (jqXHR, textStatus, errorThrown) {
            //Логгирую ошибку
            CrocoAppCore.Application.Logger.LogException(textStatus.toString(), "Error on Api Request", link);
            _this.DeleteCompletedRequest(link);
            if (animations) {
                Requester.OnErrorAnimationHandler();
            }
            //Вызываю внешнюю функцию-обработчик
            if (onErrorFunc) {
                onErrorFunc(jqXHR, textStatus, errorThrown);
            }
        }).bind(this);
        var isArray = data.constructor === Array;
        if (isArray) {
            params.contentType = "application/json; charset=utf-8";
            params.dataType = "json";
            params.data = JSON.stringify(data);
        }
        Requester.GoingRequests.push(link);
        $.ajax(params);
    };
    Requester.prototype.Post = function (link, data, onSuccessFunc, onErrorFunc) {
        this.SendAjaxPostInner(link, data, onSuccessFunc, onErrorFunc, false);
    };
    Requester.Resources = new Requester_Resx();
    Requester.GoingRequests = new Array();
    return Requester;
}());

var TabFormDrawImplementation = /** @class */ (function () {
    function TabFormDrawImplementation(model) {
        this._datePickerPropNames = [];
        this._selectClass = 'form-draw-select';
        this._model = model;
        this._drawHelper = new HtmlSelectDrawHelper(CrocoAppCore.Application.FormDataHelper.NullValue);
    }
    TabFormDrawImplementation.prototype.BeforeFormDrawing = function () {
        //TODO Init calendar or some scripts
    };
    TabFormDrawImplementation.prototype.AfterFormDrawing = function () {
        //Красивые селекты
        $("." + this._selectClass).selectpicker('refresh');
        //Иницилизация календарей
        for (var i = 0; i < this._datePickerPropNames.length; i++) {
            var datePickerPropName = this._datePickerPropNames[i];
            FormDrawImplementation.InitCalendarForPrefixedProperty(this._model.Prefix, datePickerPropName);
        }
    };
    TabFormDrawImplementation.prototype.RenderTextBox = function (typeDescription) {
        var value = ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);
        return "<div class=\"form-group m-form__group row\">\n                    <label class=\"col-xl-3 col-lg-3 col-form-label\">\n                        " + typeDescription.PropertyDescription.PropertyDisplayName + ":\n                    </label>\n                    <div class=\"col-xl-9 col-lg-9\">\n                        <div class=\"input-group\">\n                            <input type=\"text\" name=\"" + this.GetPropertyValueName(typeDescription.PropertyDescription.PropertyName) + "\" class=\"form-control m-input\" placeholder=\"\" value=\"" + value + "\">\n                        </div>\n                    </div>\n                </div>";
    };
    TabFormDrawImplementation.prototype.RenderTextArea = function (typeDescription) {
        var value = ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);
        return "<div class=\"form-group m-form__group row\">\n                    <label class=\"col-xl-3 col-lg-3 col-form-label\">" + typeDescription.PropertyDescription.PropertyDisplayName + "</label>\n                    <div class=\"col-xl-9 col-lg-9\">\n                        <textarea class=\"form-control m-input\" name=\"" + this.GetPropertyValueName(typeDescription.PropertyDescription.PropertyName) + "\" rows=\"3\">" + value + "</textarea>\n                    </div>\n                </div>";
    };
    TabFormDrawImplementation.prototype.RenderGenericDropList = function (typeDescription, selectList, isMultiple) {
        var rawValue = ValueProviderHelper.GetRawValueFromValueProvider(typeDescription, this._model.ValueProvider);
        this._drawHelper.ProccessSelectValues(typeDescription, rawValue, selectList);
        var _class = this._selectClass + " form-control m-input m-bootstrap-select m_selectpicker";
        var dict = isMultiple ? new Map().set("multiple", "") : null;
        var select = HtmlDrawHelper.RenderSelect(_class, this.GetPropertyValueName(typeDescription.PropertyDescription.PropertyName), selectList, dict);
        return "<div class=\"form-group m-form__group row\">\n                    <label class=\"col-xl-3 col-lg-3 col-form-label\">" + typeDescription.PropertyDescription.PropertyDisplayName + ":</label>\n                    <div class=\"col-xl-9 col-lg-9\">\n                        " + select + "\n                    </div>\n                </div>";
    };
    TabFormDrawImplementation.prototype.RenderDropDownList = function (typeDescription, selectList) {
        return this.RenderGenericDropList(typeDescription, selectList, false);
    };
    TabFormDrawImplementation.prototype.RenderMultipleDropDownList = function (typeDescription, selectList) {
        return this.RenderGenericDropList(typeDescription, selectList, true);
    };
    TabFormDrawImplementation.prototype.RenderHidden = function (typeDescription) {
        var value = ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);
        return "<input type=\"hidden\" name=\"" + this.GetPropertyValueName(typeDescription.PropertyDescription.PropertyName) + "\" value=\"" + value + "\">";
    };
    TabFormDrawImplementation.prototype.RenderDatePicker = function (typeDescription) {
        this._datePickerPropNames.push(typeDescription.PropertyDescription.PropertyName);
        return this.RenderTextBox(typeDescription);
    };
    TabFormDrawImplementation.prototype.GetPropertyValueName = function (propName) {
        return "" + this._model.Prefix + propName;
    };
    return TabFormDrawImplementation;
}());

var ToastrWorker = /** @class */ (function () {
    function ToastrWorker() {
    }
    ToastrWorker.prototype.ShowError = function (text) {
        var data = {
            IsSucceeded: false,
            Message: text
        };
        this.HandleBaseApiResponse(data);
    };
    ToastrWorker.prototype.ShowSuccess = function (text) {
        var data = {
            IsSucceeded: true,
            Message: text
        };
        this.HandleBaseApiResponse(data);
    };
    ToastrWorker.prototype.HandleBaseApiResponse = function (data) {
        if (data.IsSucceeded === undefined || data.Message === undefined) {
            alert("Произошла ошибка. Объект не является типом BaseApiResponse");
            return;
        }
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        if (data.IsSucceeded) {
            toastr.success(data.Message);
        }
        else {
            toastr.error(data.Message);
        }
    };
    return ToastrWorker;
}());
var CrocoAppCore = /** @class */ (function () {
    function CrocoAppCore() {
    }
    CrocoAppCore.GetFormDrawFactory = function () {
        return new FormDrawFactory({
            DefaultImplementation: function (x) { return new FormDrawImplementation(x); },
            Implementations: new Map()
                .set("Default", function (x) { return new FormDrawImplementation(x); })
                .set("Tab", function (x) { return new TabFormDrawImplementation(x); })
        });
    };
    CrocoAppCore.InitFields = function () {
        CrocoAppCore.Application = new MyCrocoJsApplication();
        CrocoAppCore.AjaxLoader = new AjaxLoader();
        CrocoAppCore.ToastrWorker = new ToastrWorker();
        CrocoAppCore.GenericInterfaceHelper = new GenericInterfaceAppHelper();
        CrocoAppCore.AjaxLoader.InitAjaxLoads();
    };
    return CrocoAppCore;
}());
CrocoAppCore.InitFields();