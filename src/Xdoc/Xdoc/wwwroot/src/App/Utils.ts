interface Select2Option {
    id: string;
    text: string;
}

interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
    timepicker();
    select2(arg0: {
        theme: string;
        width: string;
        language: any;
        placeholder: string;
        dropdownAutoWidth: boolean;
        data: Select2Option[];
        templateResult: (state: any) => JQuery<HTMLElement>
    });
    select2(arg0: { width: string; });
    select2(arg0: {
        placeholder: string;
        language: { "noResults": () => string; };
        data: any;
        templateSelection: any;
        templateResult: any;
        escapeMarkup: (markup: any) => any;
    });
    select2(arg0: {
        placeholder: string;
        language: { "noResults": () => string; };
        escapeMarkup: (markup: any) => any;
    });
}

interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
    sortable(arg0: { group: string; vertical: boolean; pullPlaceholder: boolean; onDrop: ($item: any, container: any, _super: any) => void; onDragStart: ($item: any, container: any, _super: any) => void; onDrag: ($item: any, position: any) => void; });
    sortable(arg0: { handle: string });
    sortable(arg0: string);
    selectpicker(arg0: string);
    //select2(arg0: { theme: string; width: string; dropdownAutoWidth: boolean; data: Select2Option[]; templateResult: any; });
    slider(arg0: { range: boolean; min: number; max: number; values: number[]; slide(event: any, ui: any): void; stop(): void; });    //Расширение интерфейса под слайдер

    daterangepicker(arg0: { autoUpdateInput: boolean; locale: { cancelLabel: string; applyLabel: string; daysOfWeek: string[]; monthNames: string[]; firstDay: number; }; });
}
interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
    datepicker(arg0: { format: string; autoclose: boolean; language: string; startDate: string; });
    daterangepicker(arg0: { autoUpdateInput: boolean; locale: { cancelLabel: string; applyLabel: string; daysOfWeek: string[]; monthNames: string[]; firstDay: number; }; });
}

/// <reference path="../../../node_modules/@types/bootstrap/index.d.ts"/>
/// <reference path="../../../node_modules/@types/bootstrap-datepicker/index.d.ts"/>

class Utils {

    public static FillSelect(select: HTMLElement, array: Array<string>, htmlFunc: Function, valueFunc: Function): void {

        for (let i = 0; i < array.length; i++) {
            const opt = document.createElement("option");
            opt.innerHTML = htmlFunc(array[i]);
            opt.value = valueFunc(array[i]);
            select.append(opt);
        }
    }

    public static GetImageLinkByFileId(fileId: number, sizeType: ImageSizeType): string {
        return `/FileCopies/Images/${sizeType.toString()}/${fileId}.jpg`;
    }
}

