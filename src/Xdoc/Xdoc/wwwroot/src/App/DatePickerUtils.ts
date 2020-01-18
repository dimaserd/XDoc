interface DatePickerModel {
    DatePickerId: string;
    BackElementId: string;
}

class DatePickerUtils {

    static ActiveDatePickers: Array<DatePickerModel> = [];

    static InitDictionary(): void {
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
    }

    public static SetDatePicker(datePickerId: string, elementIdToUpdate: string, dateValue: string | Date = null): void {

        var datePickerElement = document.getElementById(datePickerId);

        if (datePickerElement == null) {
            alert(`Utils.SetDatePicker Элемент с идентификатором ${datePickerId} не найден на странице`);
        }

        var toUpdateElement = document.getElementById(elementIdToUpdate);

        if (toUpdateElement == null) {
            alert(`Utils.SetDatePicker Элемент с идентификатором ${elementIdToUpdate} не найден на странице`);
        }

        let selector = `#${datePickerId}`;

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
        $(selector).on("change", e => {

            let comingValue = (e.target as HTMLInputElement).value;

            let dateValue = new Date(DatePickerUtils.DDMMYYYYToMMDDDDYYYYString(comingValue));

            if (isNaN(dateValue.getTime())) {
                dateValue = null;
            }

            const valueToSet = dateValue == null ? CrocoAppCore.Application.FormDataHelper.NullValue
                //Убираем добавленные таймзоны а затем отсекаем время
                : new Date(dateValue.getTime() - (dateValue.getTimezoneOffset() * 60000)).toISOString().split("T")[0];

            console.log("Utils.DatePickerValueChanged", dateValue, valueToSet);

            //Устанавливаем дату обрезая время
            (document.getElementById(elementIdToUpdate) as HTMLInputElement).value = valueToSet;
        });

        //Вкидываю событие об изменении чтобы фейковый элемент подхватил данные с дэйтпикера
        const event = new Event("change");
        var element = document.getElementById(datePickerId);
        element.dispatchEvent(event);

        
        if (dateValue !== undefined) {
            DatePickerUtils.SetDateToDatePicker(datePickerId, dateValue);
        }
    }

    static SetDateToDatePicker(datePickerId: string, dateValue: string | Date) {
        let selector = `#${datePickerId}`;

        $(selector).datepicker("setDate", dateValue);
    }

    static DDMMYYYYToMMDDDDYYYYString(s: string): string {
        var bits = s.split("/");

        return `${bits[1]}/${bits[0]}/${bits[2]}`;
    }

    public static GetDateFromDatePicker(inputId: string): Date {
        let elem = DatePickerUtils.ActiveDatePickers.find(x => x.DatePickerId === inputId);

        if (elem == null) {
            alert(`DatePicker с идентификатором ${inputId} не инициалиирован на странице`);
        }

        return new Date((document.getElementById(elem.BackElementId) as HTMLInputElement).value);
    }
}

DatePickerUtils.InitDictionary();