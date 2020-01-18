class TimePickerUtils {

    static SetTimePicker(elementId: string): void {
        $(`#${elementId}`).timepicker()
    }

    static GetTimeValueInMinutes(elementId: string): number {
        var elem = document.getElementById(elementId);

        if (elem == null) {
            alert(`Элемент с идентификатором '${elementId}' не найден на странице`);
            return;
        }

        let value = (elem as HTMLInputElement).value;

        if (value == '12:00 AM') {
            return 0;
        }

        let initBits = value.split(' ');

        const timeBits = initBits[0].split(':').map(x => Number(x));

        let result = timeBits[0] * 60 + timeBits[1];

        return initBits[1] == 'PM' ? result + 12 * 60 : result;
    }
}