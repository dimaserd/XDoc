interface IFormDraw {
    RenderTextBox(typeDescription: CrocoTypeDescription, wrap: boolean): string;
    RenderTextArea(typeDescription: CrocoTypeDescription, wrap: boolean): string;
    RenderDropDownList(typeDescription: CrocoTypeDescription, selectList: SelectListItem[], wrap: boolean): string;
    RenderMultipleDropDownList(typeDescription: CrocoTypeDescription, selectList: SelectListItem[], wrap: boolean): string;
    RenderHidden(typeDescription: CrocoTypeDescription, wrap: boolean): string;
    RenderDatePicker(typeDescription: CrocoTypeDescription, wrap: boolean): string;

    BeforeFormDrawing(): void;
    AfterFormDrawing(): void;
}